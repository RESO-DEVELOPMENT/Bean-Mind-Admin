import { memo } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Container, AppBar } from '@mui/material';
// config
import { HEADER } from '../../../config';
// components
import { NavSectionHorizontal } from '../../../components/nav-section';
//
import navConfig from './NavConfig';
import { NavSectionProps } from 'components/nav-section/type';
import { useUserRole } from 'contexts/UserRoleContext';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar)(({ theme }) => ({
  transition: theme.transitions.create('top', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  width: '100%',
  position: 'fixed',
  zIndex: theme.zIndex.appBar,
  padding: theme.spacing(1, 0),
  boxShadow: theme.customShadows.z8,
  top: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------
type navConfig = NavSectionProps['navConfig'];
function filterNavConfig(navConfig: navConfig, role : string) {


  const roleAllowed: { [key: string]: string[] } = {
    'general': ['SysAdmin', 'SysSchool','Teacher','Student','Parent'],
    'management': ['SysAdmin', 'SysSchool','Teacher'],
    'setting': ['SysAdmin', 'SysSchool'],
  }
  return navConfig.map((group) => {
    const items = group.items;
    const subheader = group.subheader;
    group.items = items.filter((item) => {
      return roleAllowed[subheader].includes(role);
    });
    if (group.items.length === 0) group.subheader = '';
    return { ...group, items };
  });
}
function NavbarHorizontal() {
  const { role } = useUserRole();
  const filteredNavConfig = filterNavConfig(navConfig, role);
  return (
    <RootStyle>
      <Container maxWidth={false}>
        <NavSectionHorizontal navConfig={filteredNavConfig} />
      </Container>
    </RootStyle>
  );
}

export default memo(NavbarHorizontal);
