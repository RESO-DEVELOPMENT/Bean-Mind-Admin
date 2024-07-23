import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useRef, useState, ChangeEvent } from 'react';
import * as yup from 'yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { TCourse } from 'types/course';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { PATH_DASHBOARD } from 'routes/paths';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  Autocomplete,
  Button,
  Card,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  styled,
  TextField,
  Typography,
  Divider,
  FormControl,
  InputLabel,
} from '@mui/material';
import { isBefore } from 'date-fns';
import {
  RHFTextField,
  FormProvider,
  RHFEditor,
  RHFUploadMultiFile,
  RHFSwitch,
  RHFRadioGroup,
  RHFSelect,
  RHFUploadSingleFile,
} from 'components/hook-form';
import { LoadingButton, MobileDateTimePicker, DateTimePicker } from '@mui/lab';
import ModalSubjectForm from './components/ModalSubjectForm';
import useLocales from 'hooks/useLocales';
import { useQuery } from 'react-query';
import subjectApi from 'apis/subject';
import teacherApi from 'apis/mentor';
import { AutoCompleteField, SelectField } from 'components/form';
import request from 'utils/axios';
import Page from 'components/Page';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import courseApi from 'apis/course';
import { get } from 'lodash';
import { CalendarStyle, CalendarToolbar } from 'sections/@dashboard/calendar';
import FullCalendar, { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/react';
import useResponsive from 'hooks/useResponsive';
// import { CalendarView } from '@types/calendar';
import {
  closeModal,
  openModal,
  selectEvent,
  selectRange,
  updateEvent,
} from 'redux/slices/calendar';
import { useDispatch, useSelector } from 'redux/store';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

type Props = {
  isEdit: boolean;
};

function CourseNewEditForm({ isEdit }: Props) {
  const navigate = useNavigate();

  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  const [isView, setIsView] = useState(false);

  const { id } = useParams();
  const { pathname } = useLocation();
  const viewCourse = pathname.includes('view');
  const isDesktop = useResponsive('up', 'sm');
  const [date, setDate] = useState(new Date());
  const calendarRef = useRef<FullCalendar>(null);
  const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');
  const dispatch = useDispatch();
  const { events, isOpenModal, selectedRange } = useSelector((state) => state.calendar);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg: DateSelectArg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(selectRange(arg.start, arg.end));
  };

  const handleSelectEvent = (arg: EventClickArg) => {
    dispatch(selectEvent(arg.event.id));
  };

  const handleResizeEvent = async ({ event }: EventResizeDoneArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = async ({ event }: EventDropArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEvent = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  useEffect(() => {
    if (viewCourse) {
      setIsView(true);
    } else {
      setIsView(false);
    }
  }, [viewCourse, setIsView]);

  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    minQuantity: yup.number().required('Min quantity is required.'),
    maxQuantity: yup
      .number()
      .required('Max quantity is required.')
      .when('minQuantity', (minQuantity, maxQuantity): any => {
        if (Number(maxQuantity) < Number(minQuantity)) {
          return yup.string().required('Max must be larger than Min');
        }
      }),
    // description: yup.string().required('Description is required'),
    // images: yup.array().min(1, 'Images is required'),
    // price: yup.number().moreThan(0, 'Price should not be $0.00'),
  });

  // Hook để lấy dữ liệu khóa học
  const { data: course, isLoading: isCourseLoading } = useQuery(
    ['course', id],
    () => courseApi.getCourseById(String(id)),
    {
      select: (res) => res.data,
    }
  );

  // Hook để lấy dữ liệu môn học chỉ khi có course.id
  const { data: subjects, isLoading: isSubjectLoading } = useQuery(
    ['subjectForCourse', course?.id], // Thêm khóa học ID vào dependency array
    () => courseApi.getSubjectByCourseId(course?.id!).then((res) => res.data.items),
    {
      enabled: !!course?.id,
    }
  );

  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedMentor, setSelectedMentor] = useState<string>('');

  // Hook để lấy dữ liệu giảng viên
  const { data: mentors, isLoading: isMentorsLoading } = useQuery(
    ['mentorForCourse', selectedSubject],
    () => teacherApi.getTeacherBySubjectId(selectedSubject).then((response) => response.data.items),
    {
      enabled: !!selectedSubject, // Chỉ chạy query khi selectedSubject có giá trị
    }
  );

  const handleMentorChange = (event: SelectChangeEvent<string>) => {
    setSelectedMentor(event.target.value);
  };

  useEffect(() => {
    // Thực hiện hành động khi subjects đã được cập nhật, nếu cần
    if (subjects && subjects.length > 0) {
      // Ví dụ: thiết lập subject mặc định hoặc thực hiện các hành động khác
    }
  }, [subjects]);

  useEffect(() => {
    // Thực hiện khi selectedSubject thay đổi
    if (selectedSubject) {
      // Tự động gọi API để lấy mentors nếu selectedSubject có giá trị
    }
  }, [selectedSubject]);

  console.log('course', course);
  console.log('subjects', subjects);
  console.log('mentors', mentors);
  console.log('???', selectedMentor);

  const [courseTitle, setCourseTitle] = useState<string>('');

  useEffect(() => {
    if (course) {
      setCourseTitle(course.title);
    }
  }, [course]);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCourseTitle(e.target.value);
  };

  const methods = useForm<TCourse>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...course,
    },
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const isDateError = isBefore(new Date(values.endDate), new Date(values.startDate));
  const products = watch('name');
  const setProducts = (products: any) => {
    setValue('name', products);
  };

  const handleSubjectChange = (event: SelectChangeEvent<string>) => {
    setSelectedSubject(event.target.value);
  };

  const courseTypes = [
    {
      id: 1,
      name: 'Ngắn hạn',
    },
    {
      id: 2,
      name: 'Dài hạn',
    },
  ];
  const courseTypeOptions = courseTypes?.map((c: any) => ({ label: c.name, value: c.id }));
  const getCourseType = (option: any) => {
    if (!option) return option;
    if (!option.value) return courseTypeOptions?.find((opt: any) => opt.value === option);
    return option;
  };

  useEffect(() => {
    if (course) {
      methods.reset(course as TCourse);
    }
  }, [course, methods]);

  const onSubmit = async (course: TCourse) => {
    try {
      await courseApi
        .update(course.id, course!)
        .then(() =>
          enqueueSnackbar(`Cập nhât thành công`, {
            variant: 'success',
          })
        )
        .then(() => navigate(PATH_DASHBOARD.courses.list))
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

      if (file) {
        setValue(
          'imageUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('imageUrl', []);
  };

  const handleRemove = (file: File | string) => {
    const filteredItems = values.imageUrl?.filter((_file) => _file !== file);
    setValue('imageUrl', filteredItems);
  };

  return (
    <>
      <FormProvider {...methods} methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                { name: isView ? `Chi tiết` : `Cập nhật khoá học` },
              ]}
            />
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {course && (
                    <TextField
                      required
                      label="Tên khóa học"
                      value={courseTitle}
                      onChange={handleTitleChange}
                      variant="outlined"
                    />
                  )}
                  {subjects && (
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Môn học</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        label="Môn học"
                      >
                        {subjects.map((subject: any) => (
                          <MenuItem key={subject.id} value={subject.id}>
                            {subject.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {mentors ? (
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Giảng viên</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedMentor}
                        label="Giảng viên"
                        onChange={handleMentorChange}
                      >
                        {mentors.map((teacher: any) => (
                          <MenuItem key={teacher.teacherId} value={teacher.teacherId}>
                            {teacher.teacherId}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Giảng viên</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Giảng viên"
                      ></Select>
                    </FormControl>
                  )}

                  <div>
                    <LabelStyle>Description</LabelStyle>
                    <RHFEditor simple name="description" />
                  </div>

                  <div>
                    <LabelStyle>Images</LabelStyle>
                    <RHFUploadSingleFile
                      name="imageUrl"
                      accept="image/*"
                      maxSize={3145728}
                      onDrop={handleDrop}
                      disabled={isView}
                    />
                  </div>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <RHFTextField name="location" label="Địa chỉ" sx={{ pb: 3 }} disabled={isView} />

                  <RHFTextField name="slug" label="Slug" sx={{ pb: 3 }} disabled={isView} />

                  <Grid xs={12} display="flex">
                    <Grid xs={12}>
                      <AutoCompleteField
                        disabled={isView}
                        options={Array.from({ length: 100 }, (_, index) => index + 1)}
                        name="minQuantity"
                        size="large"
                        type="text"
                        label="Số học viên tối thiểu"
                        fullWidth
                      />
                    </Grid>

                    <Divider variant="middle" />

                    <Grid xs={12}>
                      <AutoCompleteField
                        disabled={isView}
                        options={Array.from({ length: 100 }, (_, index) => index + 1)}
                        name="maxQuantity"
                        size="large"
                        type="text"
                        label="Số học viên tối đa"
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Stack spacing={3} mt={2}>
                    <Grid xs={12}>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            {...field}
                            label="Ngày bắt đầu"
                            inputFormat="dd/MM/yyyy hh:mm a"
                            renderInput={(params) => <TextField {...params} fullWidth />}
                            disabled={isView}
                          />
                        )}
                      />
                    </Grid>

                    <Grid xs={12}>
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            {...field}
                            label="Ngày kết thúc"
                            inputFormat="dd/MM/yyyy hh:mm a"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                error={!!isDateError}
                                helperText={
                                  isDateError && 'Ngày kết thúc phải lớn hơn ngày bắt đầu'
                                }
                              />
                            )}
                            disabled={isView}
                          />
                        )}
                      />
                    </Grid>

                    <RHFTextField
                      size="medium"
                      type="number"
                      name="price"
                      label="Giá"
                      onChange={(event) => setValue(`price`, Number(event.target.value))}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      disabled={isView}
                    />
                  </Stack>
                </Card>
                {values.status !== 2 ? (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                  >
                    Lưu thay đổi
                  </LoadingButton>
                ) : (
                  <Grid item xs={12} display={'flex'} justifyContent={'center'}>
                    <LoadingButton
                      type="submit"
                      variant="outlined"
                      size="large"
                      loading={isSubmitting}
                      onClick={() => setValue('status', 4)}
                    >
                      Từ chối
                    </LoadingButton>
                    <Divider variant="middle" />
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      size="large"
                      loading={isSubmitting}
                      onClick={() => setValue('status', 3)}
                    >
                      Duyệt
                    </LoadingButton>
                  </Grid>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Card>
            <CalendarStyle>
              <CalendarToolbar
                date={date}
                // view={view}
                onNextDate={handleClickDateNext}
                onPrevDate={handleClickDatePrev}
                onToday={handleClickToday}
                onChangeView={() => console.log('')}
                view={'dayGridMonth'}
              />
              <FullCalendar
                weekends
                editable
                droppable
                selectable
                events={events}
                ref={calendarRef}
                rerenderDelay={10}
                initialDate={date}
                initialView={view}
                dayMaxEventRows={3}
                eventDisplay="block"
                headerToolbar={false}
                allDayMaintainDuration
                eventResizableFromStart
                select={handleSelectRange}
                eventDrop={handleDropEvent}
                eventClick={handleSelectEvent}
                eventResize={handleResizeEvent}
                height={isDesktop ? 720 : 'auto'}
                plugins={[
                  listPlugin,
                  dayGridPlugin,
                  timelinePlugin,
                  timeGridPlugin,
                  interactionPlugin,
                ]}
              />
            </CalendarStyle>
          </Card>
        </Page>
      </FormProvider>
    </>
  );
}

export default CourseNewEditForm;
