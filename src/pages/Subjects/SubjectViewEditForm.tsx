


import React, { useEffect, useState } from 'react';
import { TSubject } from 'types/subject';
import subjectApi from 'apis/subject';
import { Grid, Card, Box, Typography, Stack, styled } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFEditor, RHFTextField } from 'components/hook-form';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from 'components/Page';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AutoCompleteField } from 'components/form';
import { useParams, useNavigate } from 'react-router';


//currently unused
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useQuery } from 'react-query';
//import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { fData } from 'utils/formatNumber';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from 'config';

// interface ViewEditSubjectFormProps {
//   subjectId: string;
// }



// const ViewEditSubjectForm: React.FC<ViewEditSubjectFormProps> = ({ subjectId }) => {
//   const [subject, setSubject] = useState<TSubject | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
const ViewEditSubjectForm: React.FC = () => {
  const [subject, setSubject] = useState<TSubject | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [isView, setIsView] = useState(false);

  const methods = useForm<TSubject>({
    defaultValues: {
      id: '',
      title: '',
      description: '',
      courseId: '',
      insDate: '',
      updDate: '',
      delFlg: false,
    },
  });

  const { handleSubmit, setValue } = methods;

  //test
  const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  }));


  // useEffect(() => {
  //   const fetchSubject = async () => {
  //     // Ensure 'id' is a string before making the API call
  //     if (typeof id === 'string') {
  //       try {
  //         setLoading(true);
  //         const response = await subjectApi.getSubjectById(id); // Now id is guaranteed to be a string
  //         setSubject(response.data);

  //       } catch (error) {
  //         console.error('Error fetching subject:', error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   };
  //   fetchSubject();
  // }, [id]);

  useEffect(() => {
    const fetchSubject = async () => {
      setLoading(true);
      setError(null);
      if (typeof id === 'string') {
        try {
          const response = await subjectApi.getSubjectById(id);
          setSubject(response.data);
          const data = response.data;
          setValue('id', data.id);
          setValue('title', data.title);
          setValue('description', data.description);
          setValue('courseId', data.courseId);
          setValue('insDate', data.insDate);
          setValue('updDate', data.updDate);
          setValue('delFlg', data.delFlg);
        } catch (err) {
          setError('Failed to fetch subject data');
        }
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id, setValue]);

  const onSubmit = async (data: TSubject) => {
    setLoading(true);
    setError(null);
    try {
      await subjectApi.update(data.id, data);
      alert('Subject updated successfully');
    } catch (err) {
      setError('Failed to update subject');
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!subject) {
    return <div>No subject found</div>;
  }

  return (
    <>
      <FormProvider {...methods} methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Page
          title={'Môn học'}
          isTable
          content={
            <HeaderBreadcrumbs
              heading=""
              // links={[
              //   { name: `Dashboard`, href: '/' },
              //   { name: `Subjects`, href: '/subjects' },
              //   { name: `${subject?.title}` },
              // ]}
              links={[
                { name: `${translate('dashboard')}`, href: PATH_DASHBOARD.root },
                {
                  name: `Môn học`,
                  href: PATH_DASHBOARD.subjects.root,
                },
                { name: isView ? `Chi tiết` : `Cập nhật môn học` },
              ]}
            />
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ py: 10, px: 3 }}>
                <Box sx={{ mb: 5 }}>
                  <Typography
                    variant="h5"
                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                  >
                    Subject Details
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 3,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <RHFTextField name="title" label="Title" />
                  {/* <RHFTextField name="description" label="Description" /> */}
                  <RHFTextField
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    sx={{ gridColumn: 'span 2' }}
                  />
                  {/* <div>
                    <LabelStyle>Description</LabelStyle>
                    <RHFEditor simple name="description" 
                    sx={{ gridColumn: 'span 2' }}
                    />
                  </div> */}
                  {/* <RHFTextField name="courseId" label="Course ID" />
                  <RHFTextField name="insDate" label="Insert Date" />
                  <RHFTextField name="updDate" label="Update Date" />
                  <RHFTextField name="delFlg" label="Delete Flag" type="checkbox" /> */}
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={loading}
                    onClick={handleSubmit(onSubmit)}
                  >
                    {'Save Changes'}
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Page>
      </FormProvider>
    </>
  );
};

export default ViewEditSubjectForm;
