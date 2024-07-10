/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
// material
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import { InputField, SelectField } from 'components/form';
import Label from 'components/Label';
import Page from 'components/Page';
import ResoTable from 'components/ResoTable/ResoTable';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
// components
import { useNavigate } from 'react-router-dom';
import subjectApi from 'apis/subject';
import { PATH_DASHBOARD } from 'routes/paths';
import { TSubject } from 'types/subject';
import SubjectForm from './components/SubjectForm';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import LoadingAsyncButton from 'components/LoadingAsyncButton';

import moment from 'moment';

const SubjectListPage = () => {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [currentDeleteItem, setCurrentDeleteItem] = useState<TSubject | null>(null);
  const [currentUpdateItem, setCurrentUpdateItem] = useState<TSubject | null>(null);
  const [formModal, setFormModal] = useState(false);
  const tableRef = useRef<any>();

  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();
  console.log(id);

  const deleteSubjectHandler = async () => {
    await subjectApi
      .delete(currentDeleteItem?.id!)
      .then(() => setCurrentDeleteItem(null))
      .then(tableRef.current?.reload)
      .then(() =>
        enqueueSnackbar(`Xóa thành công`, {
          variant: 'success',
        })
      )
      .catch((err: any) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error',
        });
      });
  };

  const addSubjectHandler = async (subject: TSubject) => {
    await subjectApi
      .add(subject!)
      .then(tableRef.current?.reload)
      .then(() =>
        enqueueSnackbar(`Tạo thành công`, {
          variant: 'success',
        })
      )
      .catch((err: any) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error',
        });
      });
  };

  // const updateSubjectHandler = async (subject: any) => {
  //   const updateSubject = currentUpdateItem;
  //   updateSubject!.title = subject.name;
  //   console.log('Subject', updateSubject);
  //   await subjectApi
  //     .update(updateSubject!)
  //     .then(tableRef.current?.reload)
  //     .then(() =>
  //       enqueueSnackbar(`Cập nhật thành công`, {
  //         variant: 'success',
  //       })
  //     )
  //     .catch((err: any) => {
  //       const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
  //       enqueueSnackbar(errMsg, {
  //         variant: 'error',
  //       });
  //     });
  // };

  const updateSubjectHandler = async (subject: any) => {
    const updatedSubject: Partial<TSubject> = {
      title: subject.title,
      description: subject.description,
      subjectCode: subject.subjectCode,
      // Include other fields you want to update
    };
    await subjectApi
      .update(currentUpdateItem!.id, updatedSubject) // Pass the ID and updated data
      .then(tableRef.current?.reload)
      .then(() =>
        enqueueSnackbar(`Cập nhật thành công`, {
          variant: 'success',
        })
      )
      .catch((err: any) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error',
        });
      });
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'title',
    },
    {
      title: 'Mã môn học',
      dataIndex: 'subjectCode',
    },
    {
      title: 'Chi tiết',
      dataIndex: 'description',
    },
    // {
    //   title: 'Ngày tạo',
    //   dataIndex: 'insDate',
    //   render: (value: Date | null) => {
    //     return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null;
    //   },
    // },
    // {
    //   title: 'Ngày cập nhật',
    //   dataIndex: 'updDate',
    //   render: (value: Date | null) => {
    //     return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null;
    //   },
    // },
    // {
    //   title: 'Xác thực',
    //   dataIndex: 'isVerified',
    //   hideInSearch: true,
    //   render: (isVeri: any) => (
    //     <Iconify
    //       icon={isVeri ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
    //       sx={{
    //         width: 20,
    //         height: 20,
    //         color: 'success.main',
    //         ...(!isVeri && { color: 'warning.main' }),
    //       }}
    //     />
    //   ),
    // },
    // {
    //   title: 'Ngày',
    //   // dataIndex: 'createdAt',
    //   valueType: 'date',
    //   hideInTable: true,
    // },
    // {
    //   title: 'Giờ',
    //   // dataIndex: 'createdAt',
    //   valueType: 'time',
    //   hideInTable: true,
    // },
    // {
    //   title: 'Ngày update',
    //   dataIndex: 'updatedDate',
    //   valueType: 'datetime',
    //   hideInSearch: true
    // },
    // {
    //   title: 'Ngày phát hành',
    //   dataIndex: 'publishedDate',
    //   valueType: 'datetime',
    //   hideInSearch: true
    // },
    // {
    //   title: translate('common.table.isAvailable'),
    //   dataIndex: 'isAvailable',
    //   render: (isAvai: any) => (
    //     <Label color={isAvai ? 'success' : 'default'}>
    //       {isAvai ? translate('common.available') : translate('common.notAvailable')}
    //     </Label>
    //   ),
    //   renderFormItem: () => (
    //     <SelectField
    //       fullWidth
    //       sx={{ minWidth: '150px' }}
    //       options={[
    //         {
    //           label: translate('common.all'),
    //           value: '',
    //         },
    //         {
    //           label: translate('common.available'),
    //           value: 'true',
    //         },
    //         {
    //           label: translate('common.unAvailable'),
    //           value: 'false',
    //         },
    //       ]}
    //       name="is-available"
    //       size="small"
    //       label={translate('common.table.isAvailable')}
    //     />
    //   ),
    // },
  ];

  return (
    <Page
      title={`${translate('pages.subjects.listTitle')}`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `${translate('pages.subjects.listTitle')}`,
              href: PATH_DASHBOARD.subjects.root,
            },
            { name: `${translate('list')}` },
          ]}
        />
      }
      actions={() => [
        <Button
          key="create-subject"
          onClick={() => {
            navigate(PATH_DASHBOARD.subjects.new);
            setFormModal(true);
            setCurrentUpdateItem(null);
          }}
          variant="contained"
          startIcon={<Icon icon={plusFill} />}
        >
          {translate('pages.subjects.addBtn')}
        </Button>,
      ]}
    >
      <SubjectForm
        open={formModal}
        //subject_id={currentUpdateItem?.id}
        subject_id={currentUpdateItem ? currentUpdateItem.id : undefined}
        onAdd={addSubjectHandler}
        onEdit={updateSubjectHandler}
        onClose={() => setFormModal(false)}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <InputField fullWidth required name="title" label="Tên môn học"
              defaultValue={currentUpdateItem?.title || ''} />
            <InputField fullWidth required name="description" label="Chi tiết môn học"
              defaultValue={currentUpdateItem?.description || ''} />
            <InputField fullWidth required name="subjectCode" label="Mã môn học"
              defaultValue={currentUpdateItem?.subjectCode || ''} />
          </Grid>
        </Grid>
      </SubjectForm>
      <DeleteConfirmDialog
        key={''}
        open={Boolean(currentDeleteItem)}
        onClose={() => setCurrentDeleteItem(null)}
        onDelete={deleteSubjectHandler}
        title={
          <>
            {translate('common.confirmDeleteTitle')} <strong>{currentDeleteItem?.title}</strong>
          </>
        }
      />
      <Card>
        <Stack spacing={2}>
          <ResoTable
            rowKey="id"
            ref={tableRef}
            onEdit={(subject: TSubject) => {
              navigate(`${PATH_DASHBOARD.subjects.root}/${subject.id}`);
              setIsUpdate(true);
              setFormModal(true);
              setCurrentUpdateItem(subject);
            }}
            getData={subjectApi.getSubjects}
            onDelete={setCurrentDeleteItem}
            columns={columns}
          />
        </Stack>
      </Card>

      {/* <Dialog
        open={isUpdate}
        fullWidth
        onClose={() => setIsUpdate(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Cập nhật môn học</DialogTitle>
        <DialogContent dividers>
          <FormProvider {...subjectForm}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <InputField fullWidth required name="name" label="Tên môn học" />
              </Grid>
            </Grid>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsUpdate(false)} variant="outlined" color="inherit">
            {translate('common.cancel')}
          </Button>
          <LoadingAsyncButton
            variant="contained"
            onClick={async () => {
              try {
                await handleSubmit(
                  (data: any) => subjectApi.update(data),
                  (e: any) => {
                    throw e;
                  }
                )();
                enqueueSnackbar(`Cập nhật môn học thành công`, {
                  variant: 'success',
                });
                setIsUpdate(false);
                reset(data);
                tableRef.current?.reload();
                return true;
              } catch (error) {
                enqueueSnackbar('Có lỗi', { variant: 'error' });
                return false;
              }
            }}
          >
            {translate('common.save')}
          </LoadingAsyncButton>
        </DialogActions>
      </Dialog> */}
    </Page>
  );
};

export default SubjectListPage;
