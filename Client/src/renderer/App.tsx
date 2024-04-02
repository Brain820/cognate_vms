import {
  MemoryRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { Box, ThemeProvider, theme, useColorMode, useColorModeValue } from '@chakra-ui/react';
import './Styles/main.scss';
import Home from './Home/Pages/Home';
// import Sidebar from './Home/Components/Sidebar';
// import Header from './Home/Components/Header';
import Register from './User/Pages/Register';
import Login from './User/Pages/Login';
import PatientsList from './Patients/Pages/PatientsList';
import SurgeryDetails from './Surgery/Pages/SurgeryDetails';
import Profile from './User/Pages/Profile';
import Doctor from './Doctors/Pages/Doctor';
import PatientDetail from './Patients/Pages/PatientDetail';
import ErrorPage from './Home/Pages/ErrorPage';
import Settings from './User/Pages/Settings';
import RequireAuth from './User/Components/RequireAuth';
import Recording from './Surgery/Pages/Recording';
import Vedios from './Surgery/Pages/Vedios';
import ImageViewer from './Surgery/Gallery/ImageViewer';
import { CompanyProvider } from './Company/CompanyContext';
import Receipt from './Company/Receipt';
import ForgotPassword from './User/Pages/ForgotPassword';
import { ColorModeProvider, CSSReset } from '@chakra-ui/react';

// function Layout() {
//   return (
//     <>
//       <Header />
//       <div className="te">
//         <Sidebar />
//         <Outlet />
//       </div>
//     </>
//   );
// }

export default function App() {
  return (
    <CompanyProvider>
      <Box className="app">
        <Router>
          <Routes>
            {/* <Route path="/" element={<Layout />}> */}
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Home />} />
              <Route path="/patients" element={<PatientsList />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/patients/:id/:id" element={<SurgeryDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/doctor" element={<Doctor />} />
              {/* <Route path="/receipt/:patientData" element={<Receipt />} /> */}
            </Route>
            {/* </Route> */}
            <Route path="/receipt/:patientData" element={<Receipt />} />
            <Route path="/recording/:surgeryId" element={<Recording />} />
            <Route path="/vedios/:videoId" element={<Vedios />} />
            <Route path="/images/:imageId" element={<ImageViewer />} />
            <Route path="/forgot" element={<ForgotPassword />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </Box>
    </CompanyProvider>
  );
}
