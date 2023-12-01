// CompanyContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { companyDetails } from '../Config/api';

const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState({});

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(companyDetails(1), { headers });
        const { data } = response;
        setCompany(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCompany();
  }, []);

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
