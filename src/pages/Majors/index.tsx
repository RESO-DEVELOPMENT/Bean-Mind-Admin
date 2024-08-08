/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
import * as yup from 'yup';
// material
import {
  Autocomplete,
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
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import Page from 'components/Page';
import ResoTable from 'components/ResoTable/ResoTable';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';

// function groupBy(list: any, keyGetter: any) {
//   const map = new Map();
//   list?.forEach((item: any) => {
//     const key = keyGetter(item);
//     const collection = map.get(key);
//     if (!collection) {
//       map.set(key, [item]);
//     } else {
//       collection.push(item);
//     }
//   });
//   return map;
// }

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
      imageUrl: '/assets/bg_blue_gradient.jpg', //Path to the image
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

  // State for the menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  // State to track if a menu item was clicked
  const [menuItemClicked, setMenuItemClicked] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [majorIdToDelete, setMajorIdToDelete] = useState<number | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Stop propagation right away
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuItemClicked(false); // Reset flag when menu closes
  };

  // Placeholder functions for menu actions - update these!
  const handleView = () => {
    setMenuItemClicked(true); // Set flag when a menu item is clicked
    console.log('View clicked!');
    handleCloseMenu();
  };

  const handleEdit = () => {
    console.log('Edit clicked!');
    handleCloseMenu();
  };

  const handleDelete = () => {
    console.log('Delete clicked!');
    handleCloseMenu();
  };

  // Data Fetching (Assuming similar structure to previous examples)
  const { data: majorsData, isLoading, error } = useQuery(
    'curriculums',
    majorApi.getMajors
  );

  const [filteredMajors, setFilteredMajors] = useState<TMajor[]>(majorsData?.data.items || []);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const handleTitleChange = (event: any, newValue: string | null) => {
    setSelectedTitle(newValue);

    if (newValue) {
      // Filter majors based on the selected title
      setFilteredMajors(
        majorsData?.data.items.filter((major: { title: string; }) => major.title.toLowerCase().includes(newValue.toLowerCase())) || []
      );
    } else {
      // If no title selected, show all majors
      setFilteredMajors(majorsData?.data.items || []);
    }
  };


  // Initialize filteredMajors AFTER data is loaded
  useEffect(() => {
    if (majorsData) {
      setFilteredMajors(majorsData?.data.items || []);
    }
  }, [majorsData]); // Run effect when majorsData changes

  // Handle loading state
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
      <Card>
        <Stack spacing={2} sx={{ padding: 2 }}> {/* Add padding to the Stack */}
          {/* Autocomplete for filtering majors */}
          <Autocomplete
            id="major-title-filter"
            options={majorsData?.data.items.map((major: { title: any; }) => major.title) || []} // Get unique major titles
            value={selectedTitle}
            onChange={handleTitleChange}
            renderInput={(params) => (
              <TextField {...params} label="Filter by Major Title" variant="outlined" />
            )}
            sx={{ width: '50%' }} // Adjust width as needed
          />
          <Grid container spacing={2} sx={{ padding: 2 }}>
            {filteredMajors.map((major: TMajor) => (
              <Grid item xs={12} key={major.id} >
                <Card
                  sx={{
                    display: 'flex',
                    border: '1px solid #D9D9D9',
                    backgroundColor: '#FFFFFF',
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  {/* More Options Menu */}
                  <IconButton
                    onClick={handleOpenMenu}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 1
                    }}
                  >
                    <Icon icon={moreVerticalFill} width={20} height={20} />
                  </IconButton>
                  <Menu
                    id="options-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    MenuListProps={{
                      'aria-labelledby': 'options-button',
                    }}
                  >
                    <MenuItem onClick={handleView}>View</MenuItem>
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>

                  <CardActionArea
                    onClick={() => {
                      // Only navigate if a menu item WAS NOT clicked
                      if (!menuItemClicked) {
                        navigate(`${PATH_DASHBOARD.courses.root}?curriculumId=${major.id}`)
                      }
                    }}
                    sx={{
                      display: 'flex',
                      height: '100%',
                      padding: 2,
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Image Box */}
                    <Box sx={{ flexShrink: 0, width: { xs: '100%', sm: 200 } }}>
                      <Avatar
                        alt={major.title}
                        src={major.imageUrl || '/assets/bg_blue_gradient.jpg'}  // Fallback to the image if no URL
                        variant="rounded"
                        sx={{ width: '100%', height: 'auto' }}
                      />
                    </Box>

                    {/* Content Box */}
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
        </Stack>
      </Card>
    </Page>
  );
};

export default MajorListPage;
