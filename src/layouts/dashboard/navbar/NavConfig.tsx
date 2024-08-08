// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import SvgIconStyle from '../../../components/SvgIconStyle';
import { Badge } from '@mui/material';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  menuItem: getIcon('ic_menu_item'),
  menuBook: getIcon('ic_menu_book'),
  libraryBook: getIcon('ic_library_books'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      {
        title: 'Khóa học',
        path: PATH_DASHBOARD.courses.list,
        icon: ICONS.libraryBook,
      }
    ],
  },

  {
    subheader: 'management',
    items: [
      // COURSE
      
      // {
      //   title: 'Chứng chỉ',
      //   path: PATH_DASHBOARD.certificates.list,
      //   icon: ICONS.invoice,
      // },
      // MENTOR
      {
        title: 'Giảng Viên',
        path: PATH_DASHBOARD.mentors.list,
        icon: ICONS.user,
      },
      // USER
      {
        title: 'Học Sinh',
        path: PATH_DASHBOARD.users.list,
        icon: ICONS.user,
      },
    ],
  },
  {
    subheader: 'setting',
    items: [
      // MAJOR
      {
        title: 'Chươnng Trình Học',
        path: PATH_DASHBOARD.majors.list,
        icon: ICONS.menuBook,
      },
      // SUBJECT
      {
        title: 'Môn Học',
        path: PATH_DASHBOARD.subjects.list,
        icon: ICONS.menuItem,
      },
      // ADMIN
      {
        title: 'admin',
        path: PATH_DASHBOARD.admins.list,
        icon: ICONS.user,
      },
    ],
  },

  
];

export default navConfig;
