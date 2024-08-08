/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
  Box,
  CardActionArea,
} from '@mui/material';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import InputField from 'components/form/InputField';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import subjectApi from 'apis/subject';
import { PATH_DASHBOARD } from 'routes/paths';
import { TSubject } from 'types/subject';
import SubjectForm from './components/SubjectForm';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { useQuery } from 'react-query';
import courseApi from 'apis/course';
import { TCourse } from 'types/course';

const SubjectListPage = () => {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [currentDeleteItem, setCurrentDeleteItem] = useState<TSubject | null>(null);
  const [currentUpdateItem, setCurrentUpdateItem] = useState<TSubject | null>(null);
  const [formModal, setFormModal] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);
  const { id } = useParams();

  // Subjects Data
  const { data: subjectsData, isLoading: subjectsLoading } = useQuery(
    'subjects',
    subjectApi.getSubjects
  );

  // Courses Data
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const { data: coursesData, isLoading: coursesLoading } = useQuery(
    'courses',
    courseApi.getCourses
  );

  const courseOptions = coursesData?.data.items.map((course: TCourse) => ({
    label: course.title,
    value: course.id,
  })) || [];

  const handleCourseChange = (event: any, newValue: any | null) => {
    setSelectedCourseId(newValue ? newValue.value : null);
  };

  // Delete Subject
  const deleteSubjectHandler = async () => {
    try {
      await subjectApi.delete(currentDeleteItem?.id!);
      enqueueSnackbar(`Xóa thành công`, { variant: 'success' });
    } catch (err: any) {
      const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
      enqueueSnackbar(errMsg, { variant: 'error' });
    } finally {
      setCurrentDeleteItem(null);
    }
  };

  // Add Subject 
  const addSubjectHandler = async (subjectData: any) => {
    try {
      const newSubject = {
        title: subjectData.name,
        description: subjectData.description,
        subjectCode: subjectData.subjectCode,
        ...(selectedCourseId && { courseId: selectedCourseId }),
      };

      await subjectApi.add(newSubject, newSubject.courseId);
      enqueueSnackbar(`Tạo thành công`, { variant: 'success' });
    } catch (err: any) {
      const errMsg = get(
        err.response,
        ['data', 'message'],
        `Có lỗi xảy ra. Vui lòng thử lại`
      );
      enqueueSnackbar(errMsg, { variant: 'error' });
    }
  };

  // Update Subject
  const updateSubjectHandler = async (subject: any) => {
    const updatedSubject: Partial<TSubject> = {
      title: subject.name,
      description: subject.description,
      subjectCode: subject.subjectCode,
      courseId: selectedCourseId,
    };
    try {
      await subjectApi.update(
        currentUpdateItem!.id,
        updatedSubject,
        selectedCourseId ? selectedCourseId : undefined
      );
      enqueueSnackbar(`Cập nhật thành công`, { variant: 'success' });
    } catch (err: any) {
      const errMsg = get(
        err.response,
        ['data', 'message'],
        `Có lỗi xảy ra. Vui lòng thử lại`
      );
      enqueueSnackbar(errMsg, { variant: 'error' });
    }
  };

  // Filtering states and functions
  const [filteredSubjects, setFilteredSubjects] = useState<TSubject[]>([]);
  //const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(null); // For Autocomplete

  // Get query parameters from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCourseCode = queryParams.get('courseCode');

  // Apply initial filter (if courseCode is provided in the URL)
  useEffect(() => {
    if (initialCourseCode && coursesData && subjectsData) {
      const course = coursesData?.data.items.find(
        (c: { courseCode: string; }) => c.courseCode.toLowerCase() === initialCourseCode.toLowerCase()
      );

      if (course) {
        setSelectedCourseId(course.id);
        // No need to call applyFilter here, the next useEffect will handle it
      }
    }
  }, [initialCourseCode, coursesData, subjectsData]); 

  // Handle course code filter change from Autocomplete
  const handleCourseCodeChange = (event: any, newValue: string | null) => {
    setSelectedCourseCode(newValue);

    if (newValue && coursesData) {
      const course = coursesData?.data.items.find(
        (c: { courseCode: string; }) => c.courseCode.toLowerCase() === newValue.toLowerCase()
      );

      if (course) {
        setSelectedCourseId(course.id); 
      } else {
        setSelectedCourseId(null); // Reset if no matching course
      }
    } else {
      setSelectedCourseId(null); // Reset if no course code selected
    }
  };

  // Filter function (filtering by courseId)
  const applyFilter = (courseId: string | null) => {
    if (courseId) {
      setFilteredSubjects(
        subjectsData?.data.items.filter((subject: { courseId: string; }) => subject.courseId === courseId) || []
      );
    } else {
      setFilteredSubjects(subjectsData?.data.items || []);
    }
  };

  // Update filteredSubjects whenever subjectsData OR selectedCourseId changes
  useEffect(() => {
    if (subjectsData) {
      applyFilter(selectedCourseId); 
    }
  }, [subjectsData, selectedCourseId]); 

  // Handle loading state of subjectsData
  if (subjectsLoading) { 
    return <CircularProgress />; 
  }

  return (
    <Page
      title={`${translate('pages.subjects.listTitle')}`}
      isTable // Consider removing this if you are not using a table
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
      {/* Subject Form Modal */}
      <SubjectForm
        open={formModal}
        subject_id={currentUpdateItem ? currentUpdateItem.id : undefined}
        onAdd={addSubjectHandler}
        onEdit={updateSubjectHandler}
        onClose={() => setFormModal(false)}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {coursesLoading && <CircularProgress />}
            {coursesData && (
              <Autocomplete
                options={courseOptions}
                onChange={handleCourseChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    name="courseId"
                    label="Select Course"
                    variant="outlined"
                  />
                )}
              />
            )}

            {selectedCourseId && <p>Selected Course ID: {selectedCourseId}</p>}

            <InputField
              fullWidth
              required
              name="name"
              label="Tên môn học"
              defaultValue={currentUpdateItem?.title || ''}
            />
            <InputField
              fullWidth
              required
              name="description"
              label="Chi tiết môn học"
              defaultValue={currentUpdateItem?.description || ''}
            />
            <InputField
              fullWidth
              required
              name="subjectCode"
              label="Mã môn học"
              defaultValue={currentUpdateItem?.subjectCode || ''}
            />
          </Grid>
        </Grid>
      </SubjectForm>

      {/* Delete Confirmation Dialog */}
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

      {/* Subject List Display */}
      <Stack spacing={2} sx={{ padding: 2 }}>
        {/* Autocomplete for filtering by Subject Code */}
        <Autocomplete
          id="course-code-filter"
          options={coursesData?.data.items.map((course: { courseCode: any; }) => course.courseCode) || []}
          value={selectedCourseCode}
          onChange={handleCourseCodeChange}
          renderInput={(params) => (
            <TextField {...params} label="Filter by Course Code" variant="outlined" />
          )}
          sx={{ width: '50%' }}
        />


      {/* Subject Cards Display */}
      <Grid container spacing={2}> 
      {filteredSubjects.map((subject: TSubject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
          <Card
            sx={{
              border: '1px solid #D9D9D9', // Border styling
              backgroundColor: '#FFFFFF', // Background color 
              borderRadius: 2, // Add rounded corners (adjust value as needed) 
              overflow: 'hidden', // Ensure rounded corners work properly
              display: 'flex', // Enable flexbox for the card
              flexDirection: 'column', // Stack title and content vertically
            }}
          >
            <CardActionArea sx={{ height: '100%' }}> {/* Making the card clickable (optional) */}
              <Box
                sx={{
                  backgroundImage: 'url(/assets/bg_blue_gradient.jpg)', // Set background image
                  backgroundSize: 'cover', // Cover the box with the image
                  padding: 2,
                  borderBottom: '1px solid #ddd',
                  textAlign: 'center', // Center text within the title box
                  height: { xs: 100, sm: 150, md: 200 }, // Adjust heights responsively.
                  flexGrow: 2, // Title section can only take up 2/3 of the space
                  display: 'flex', // Enable flexbox for the title box
                  alignItems: 'center', // Center vertically
                  justifyContent: 'center', // Center horizontally
                  color: '#FFFFFF', // Ensure text is visible on the gradient background
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Segoe UI',
                    fontWeight: 'bold',
                  }}
                >
                  {subject.title}
                </Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontFamily: 'sans-serif' }} // Sans-serif for description
                >
                  {subject.subjectCode} <br />
                  {subject.description}
                </Typography>

                  {/* Your icons and text for students, videos, duration */}
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      </Stack>
    </Page>
  );
};

export default SubjectListPage;