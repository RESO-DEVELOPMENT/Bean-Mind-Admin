/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import * as yup from 'yup';
// material
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import Page from 'components/Page';
import ResoTable from 'components/ResoTable/ResoTable';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback, useRef, useState } from 'react';
// components
import majorApi from 'apis/major';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { TMajor } from 'types/major';
import { RHFTextField, RHFUploadAvatar } from 'components/hook-form';
import LoadingAsyncButton from 'components/LoadingAsyncButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from 'config';
import { useQuery } from 'react-query';

function groupBy(list: any, keyGetter: any) {
  const map = new Map();
  list?.forEach((item: any) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

const MajorListPage = () => {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const { translate } = useLocales();
  const [formModal, setFormModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [currentItem, setCurrentItem] = useState<TMajor | null>(null);
  const refxerence = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    // subjects: yup
    //   .array()
    //   .min(1, 'Vui lòng có ít nhất một sản phẩm')
    //   .of(
    //     yup.object().shape({
    //       position: yup.string().required('Vui lòng chọn giá trị'),
    //     })
    //   ),
  });

  const methods = useForm<any>({
    defaultValues: {
      name: '',
      imageUrl: '',
    },
    resolver: yupResolver(schema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const onSubmit = async (major: any) => {
    try {
      await majorApi
        .add(major!)
        .then(() =>
          enqueueSnackbar(`Thêm thành công`, {
            variant: 'success',
          })
        )
        .then(() => navigate(PATH_DASHBOARD.majors.list))
        .catch((err: any) => {
          const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
          enqueueSnackbar(errMsg, {
            variant: 'error',
          });
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const storageRef = ref(storage, `/files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
            setValue('imageUrl', url);
          });
        }
      );
    },
    [setValue]
  );

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
    },
    // {
    //   title: 'Hình ảnh',
    //   dataIndex: 'imageUrl',
    //   hideInSearch: true,
    //   render: (src: any, { title }: any) => (
    //     <Avatar
    //       alt={title}
    //       src={src}
    //       variant={'rounded'}
    //       style={{ width: '54px', height: '54px' }}
    //     />
    //   ),
    // },
    {
      title: 'Chương Trình Học',
      dataIndex: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    }
  ];

  // Data Fetching (Assuming similar structure to previous examples)
  const { data: majorsData, isLoading, error } = useQuery(
    'curriculums',
    majorApi.getMajors 
  );
  if (isLoading) {
    return <CircularProgress />; 
  }

  if (error) {
    return <Typography color="error">Error loading majors!</Typography>;
  }

  return (
    <Page
      title={`Chương trình học`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Chương trình học`,
              href: PATH_DASHBOARD.majors.root,
            },
            { name: `${translate('list')}` },
          ]}
        />
      }
      actions={() => [
        <Button
          key="create-subject"
          onClick={() => {
            setFormModal(true);
          }}
          variant="contained"
          startIcon={<Icon icon={plusFill} />}
        >
          {`Tạo chương trình học`}
        </Button>,
      ]}
    >
      <Dialog fullWidth maxWidth="sm" open={formModal} onClose={() => setFormModal(false)}>
        <FormProvider {...methods}>
          <DialogTitle>{'Tạo chương trình học'}</DialogTitle>
          <DialogContent dividers>
            <RHFTextField name="name" label="Tên chuyên ngành" />
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="imageUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormModal(false)} variant="outlined" color="inherit">
              {'Hủy'}
            </Button>
            <LoadingAsyncButton variant="contained" onClick={handleSubmit(onSubmit)}>
              {'Tạo'}
            </LoadingAsyncButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {majorsData?.data.items.map((major: TMajor) => (
          <Grid item xs={12} key={major.id} > {/* Each major is a full-width row */}
            <Card 
              sx={{ 
                display: 'flex', 
                border: '1px solid #D9D9D9',
                backgroundColor: '#FFFFFF',
              }}
            >
              <CardActionArea 
                sx={{ 
                  display: 'flex', 
                  height: '100%', 
                  padding: 2, 
                  flexDirection: { xs: 'column', sm: 'row' } // Stack vertically on small screens
                }}
                onClick={() => navigate(`${PATH_DASHBOARD.majors.root}/${major.id}`)}
              >
                <Box sx={{ flexShrink: 0, width: { xs: '100%', sm: 200 } }}>
                  <Avatar
                    alt={major.title}
                    src={major.imageUrl} // Assuming your major object has an imageUrl
                    variant="rounded"
                    sx={{ width: '100%', height: 'auto' }} // Responsive image
                  />
                </Box>

                <Box sx={{ padding: 2, flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'Segoe UI', fontWeight: 'bold' }}>
                    {major.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'sans-serif' }}>
                    {major.description}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Page>
  );
};

export default MajorListPage;
