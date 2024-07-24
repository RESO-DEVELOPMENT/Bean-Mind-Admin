/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { Icon } from '@iconify/react';
// material
import {
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Tab,
  Tooltip,
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
import courseApi from 'apis/course';
import { PATH_DASHBOARD } from 'routes/paths';
import { TCourse } from 'types/course';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Iconify from 'components/Iconify';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import LoadingAsyncButton from 'components/LoadingAsyncButton';
import { TabContext, TabList } from '@mui/lab';
import { type } from 'os';
import axios from 'axios';
import request, { axiosInstance } from 'utils/axios';

const STATUS_OPTIONS = ['Tất cả', 'Đã duyệt', 'Chờ duyệt', 'Đã huỷ'];

enum STATUS {
  Draft = 1, //Mentor tạo khóa học nháp
  Pending = 2, //Mentor đã submit khóa học, chờ duyệt
  Waiting = 3, //Khóa học đã được duyệt chờ đủ mentee
  CancelNotEnough = 4, //Khóa học kết thúc do không đủ thành viên
  Start = 5,
  End = 6,
}

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

const CourseListPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [currentItem, setCurrentItem] = useState<TCourse | null>(null);
  const ref = useRef<{ reload: Function; formControl: UseFormReturn<any> }>();

  const { data: allData } = useQuery(
    'courses',
    () => courseApi.getCourses({ page: 1, size: 100 }),
    {
      select: (res) => res.data.data,
    }
  );
  const result = groupBy(allData, (data: any) => data.status);
  console.log('data', allData);
  console.log('result', result);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    ref.current?.formControl.setValue(
      'status',
      newValue === '2'
        ? STATUS.Pending
        : newValue === '3'
          ? STATUS.Waiting
          : newValue === '4'
            ? STATUS.Start
            : newValue === '5'
              ? STATUS.End
              : newValue === '6'
                ? STATUS.CancelNotEnough
                : ''
    );
    setActiveTab(newValue);
    ref.current?.formControl.setValue('tabindex', newValue);
  };

  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();

  const { data, isLoading } = useQuery(
    ['courses', currentItem],
    () => courseApi.getCourseById(String(currentItem)),
    {
      select: (res) => res.data,
    }
  );

  const schema = yup.object().shape({
    name: yup.string().required('Vui lòng nhập tên khoá học'),
  });
  const courseForm = useForm<TCourse>({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    defaultValues: { ...data },
  });

  const { handleSubmit, control, reset } = courseForm;

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const deleteSubjectHandler = () =>
    courseApi
      .delete(currentItem?.id!)
      .then(() => setCurrentItem(null))
      .then(() => ref.current?.reload)
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

  const updateCourseHandler = (course: TCourse) =>
    courseApi
      .update(course.id, course!)
      .then(() => ref.current?.reload)
      .then(() =>
        enqueueSnackbar(`Cập nhât thành công`, {
          variant: 'success',
        })
      )
      .catch((err: any) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error',
        });
      });


  // title: string;
  // description: string;
  // startDate: Date;
  // endDate: Date;
  // curriculumId: string;
  // insDate: Date;
  // updDate: Date;
  // delFlg: boolean;
  //với comlumns là những thuộc tính trên hãy viết lại cho phù hợp  với dữ liệu trả về từ api
  // const columns = [
  //   {
  //     title: 'STT',
  //     dataIndex: 'id',
  //     hideInSearch: true,
  //   },
  //   {
  //     title: 'Chủ đề',
  //     dataIndex: 'title',
  //   },
  //   {
  //     title: 'Mô tả',
  //     dataIndex: 'description',
  //   },
  //   {
  //     title: 'Ngày bắt đầu',
  //     dataIndex: 'startDate',
  //   },
  //   {
  //     title: 'Ngày kết thúc',
  //     dataIndex: 'end',
  //   },
  //   {
  //     title: translate('common.table.isAvailable'),
  //     dataIndex: 'status',
  //     render: (status: any) => (
  //       <Label
  //         color={
  //           status === 2
  //             ? 'warning'
  //             : status === 3
  //             ? 'info'
  //             : status === 5
  //             ? 'secondary'
  //             : status === 6
  //             ? 'success'
  //             : 'default'
  //         }
  //       >
  //         {status === 2
  //           ? 'Chờ duyệt'
  //           : status === 5
  //           ? translate('common.available')
  //           : status === 3
  //           ? 'Chờ đủ mentee'
  //           : status === 6
  //           ? 'Đã hoàn thành'
  //           : 'Đã huỷ'}
  //       </Label>
  //     ),
  //     hideInSearch: true,
  //   },
  //   {
  //     title: 'Môn học',
  //     dataIndex: 'subject.name',
  //     hideInSearch: true,
  //   },
  //   {
  //     title: 'Giảng viên',
  //     dataIndex: 'mentor.fullName',
  //     hideInSearch: true,
  //   },
  //   {
  //     title: 'Số lượng tham gia',
  //     dataIndex: 'currentNumberMentee',
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true,
    },
    {
      title: 'Chủ đề',
      dataIndex: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
    },
    {
      title: translate('common.table.isAvailable'),
      dataIndex: 'status',
      render: (status: any) => (
        <Label
          color={
            status === 2
              ? 'warning'
              : status === 3
                ? 'info'
                : status === 5
                  ? 'secondary'
                  : status === 6
                    ? 'success'
                    : 'default'
          }
        >
          {status === 2
            ? 'Chờ duyệt'
            : status === 5
              ? translate('common.available')
              : status === 3
                ? 'Chờ đủ mentee'
                : status === 6
                  ? 'Đã hoàn thành'
                  : 'Đã huỷ'}
        </Label>
      ),
      hideInSearch: true,
    },
    {
      title: 'Môn học',
      dataIndex: 'subject.name',
      hideInSearch: true,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'mentor.fullName',
      hideInSearch: true,
    },
    {
      title: 'Số lượng tham gia',
      dataIndex: 'currentNumberMentee',
      render: (quantity: any) => <Label color={'default'}>{quantity}</Label>,
      hideInSearch: true,
    },
    {
      title: 'Học viên tối thiểu',
      dataIndex: 'minQuantity',
      render: (quantity: any) => <Label color={'default'}>{quantity}</Label>,
      hideInSearch: true,
    },
    {
      title: 'Học viên tối đa',
      dataIndex: 'maxQuantity',
      render: (quantity: any) => <Label color={'default'}>{quantity}</Label>,
      hideInSearch: true,
    },
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
    //   dataIndex: 'createdAt',
    //   valueType: 'date',
    //   hideInTable: true,
    // },
    // {
    //   title: 'Giờ',
    //   dataIndex: 'createdAt',
    //   valueType: 'time',
    //   hideInTable: true,
    // },
    // {
    //   title: 'Ngày bắt đầu',
    //   dataIndex: 'startDate',
    //   valueType: 'datetime',
    //   hideInSearch: true,
    // },
    // {
    //   title: 'Ngày kết thúc',
    //   dataIndex: 'finishDate',
    //   valueType: 'datetime',
    //   hideInSearch: true,
    // },
    // {
    //   title: 'Ngày cập nhật',
    //   dataIndex: 'updateDate',
    //   valueType: 'datetime',
    //   hideInSearch: true,
    // },
    // {
    //   title: 'Ngày tạo',
    //   dataIndex: 'createDate',
    //   valueType: 'datetime',
    //   hideInSearch: true,
    // },
  ];

  // Data Fetching with Loading and Error Handling
  const { data: coursesData, isLoading: coursesLoading } = useQuery(
    'courses',
    courseApi.getCourses
  );


  return (
    <Page
      title={`Khoá học`}
      isTable
      content={
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
            {
              name: `Khoá học`,
              href: PATH_DASHBOARD.courses.root,
            },
            { name: `${translate('list')}` },
          ]}
        />
      }
      actions={() => [
        /*<Button
          key="create-subject"
          onClick={() => {
            navigate(PATH_DASHBOARD.courses.new);
          }}
          variant="contained"
          startIcon={<Icon icon={plusFill} />}
        >
          {translate('pages.subjects.addBtn')}
        </Button>,*/
        <DeleteConfirmDialog
          key={''}
          open={Boolean(currentItem)}
          onClose={() => setCurrentItem(null)}
          onDelete={deleteSubjectHandler}
          title={
            <>
              {translate('common.confirmDeleteTitle')} <strong>{currentItem?.title}</strong>
            </>
          }
        />
      ]}
    >
      <Card>
        
        {/* <TabContext value={activeTab}> */}
          

          <Grid container spacing={2} sx={{ padding: 2 }}> {/* Add padding to the grid */}
          {coursesData?.data.items.map((course: TCourse) => ( 
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card
                sx={{
                  border: '1px solid #D9D9D9',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardActionArea 
                  sx={{ height: '100%' }} 
                  onClick={() => navigate(`${PATH_DASHBOARD.courses.root}/${course.id}/view`)}
                >
                    <Box
                      sx={{
                        backgroundImage: 'linear-gradient(to bottom, #e0e0e0, #ffffff)',
                        padding: 2,
                        borderBottom: '1px solid #ddd',
                        textAlign: 'center',
                        flexGrow: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Segoe UI',
                          fontWeight: 'bold',
                        }}
                      >
                        {course.title}
                      </Typography>
                    </Box>

                    <Box sx={{ padding: 2, flexGrow: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'sans-serif' }}>
                        {course.description}
                      </Typography>

                      {/* Display other relevant course details here */}
                      <Typography variant="body2">
                        {/* Mentor: {course.mentor?.fullName} */}
                      </Typography>
                      {/* ... add more course details as needed ... */}

                      {/* Add buttons/actions for each course here */}
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent card click from triggering
                          navigate(`${PATH_DASHBOARD.courses.root}/${course.id}`);
                          setIsUpdate(true);
                        }}
                      >
                        <Icon icon={eyeFill} width={20} height={20} />
                      </IconButton>
                      {/* Add other action buttons similarly */}
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

        
        {/* </TabContext> */}
      </Card>
    </Page>
  );
};

export default CourseListPage;
