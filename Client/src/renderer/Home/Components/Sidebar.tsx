import { NavLink, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

import AppsIcon from '@mui/icons-material/Apps';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

const links = [
  {
    key: 1,
    name: 'Dashboard',
    path: '/',
    icon: <AppsIcon style={{ fontSize: '1.75rem' }} />,
  },
  {
    key: 2,
    name: 'Patients',
    path: '/patients',
    icon: <AccessibilityIcon style={{ fontSize: '1.75rem' }} />,
  },
  // {
  //   key: 3,
  //   name: 'Doctor',
  //   path: '/doctor',
  //   icon: <LocalHospitalIcon style={{ fontSize: '1.75rem' }} />,
  // },
  {
    key: 4,
    name: 'Profile',
    path: '/profile',
    icon: <PersonIcon style={{ fontSize: '1.75rem' }} />,
  },
  {
    key: 5,
    name: 'Logout',
    path: '/login',
    icon: <LogoutIcon style={{ fontSize: '1.75rem' }} />,
  },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    console.log('Logged out');
    navigate('/login');
  };
  return (
    <Box className="sidebar">
      <Box className="sidebar-top">
        {links.map((link) => {
          return (
            <NavLink
              to={link.path}
              className="sidebar-link"
              activeclassname="active"
              key={link.key}
              onClick={link.name === 'Logout' ? handleLogout : undefined}
            >
              {link.icon}
              <span className="tooltiptext">{link.name}</span>
            </NavLink>
          );
        })}
      </Box>
      <NavLink to="/settings" className="sidebar-link" activeclassname="active">
        <SettingsIcon style={{ fontSize: '1.75rem' }} />
        <span className="tooltiptext">Settings</span>
      </NavLink>
    </Box>
  );
}

export default Sidebar;
