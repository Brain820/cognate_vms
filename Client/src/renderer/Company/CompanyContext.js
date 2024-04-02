// CompanyContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { companyDetails } from '../Config/api';
import { WDRStatusApi_VMS, frameRateApi_VMS , OSDSettApi_VMS} from '../Config/cameraApi';

const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState({});

  const fetchCompany = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(companyDetails(), { headers });
      const { data } = response;
      setCompany(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {

    fetchCompany();
  }, []);
  useEffect(() => {
    frameRateApi_VMS(company.camera_ip,company.user,company.password,company.camera_framerate)
    WDRStatusApi_VMS(company.camera_ip,company.user,company.password,company.camera_wdr_status)
    OSDSettApi_VMS(company.camera_ip,company.user,company.password)
  }, [company]);

  return (
    <CompanyContext.Provider value={{ company }}>
      {children}
    </CompanyContext.Provider>
  );
}

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
