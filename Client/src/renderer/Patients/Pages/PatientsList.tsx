import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Box,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { net } from 'electron';
import AddPatient from '../Components/AddPatient';
import { ListOfPatients } from '../../Config/api';
import useAuth from '../../User/Components/useAuth';

function PatientsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState(
    JSON.parse(localStorage.getItem('patients')) || [],
  );
  const { auth } = useAuth();

  useEffect(() => {
    // fetchData();
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);
  const fetchData = async () => {
    try {
      // const accessToken = auth?.access_token;
      const accessToken = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(ListOfPatients(), { headers });
      const { data } = response;
      setPatients(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchData();
  return (
    <Box className="patients">
      <Box className="header-btns">
        <Input
          placeholder="Search Patients Here"
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddPatient />
      </Box>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr background="#003975">
              <Th color="#FFFFFF">Patient ID</Th>
              <Th color="#FFFFFF">First Name</Th>
              <Th color="#FFFFFF">Last Name</Th>
              <Th color="#FFFFFF">Date Of Birth</Th>
              <Th color="#FFFFFF">Gender</Th>
              {/* <Th color="#FFFFFF">Age</Th> */}
              <Th color="#FFFFFF">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {patients
              .filter((patient) => {
                return search.toLowerCase() === ''
                  ? patient
                  : patient.first_name.toLowerCase().includes(search) ||
                      patient.last_name.toLowerCase().includes(search);
              })
              .map((patient) => {
                return (
                  <Tr key={patient.patient_id}>
                    <Td>{patient.hospital_patient_id}</Td>
                    <Td>{patient.first_name}</Td>
                    <Td>{patient.last_name}</Td>
                    <Td>{patient.date_of_birth}</Td>
                    <Td>{patient.gender}</Td>
                    {/* <Td>{patient.age}</Td> */}
                    <Td>
                      <Button
                        size="sm"
                        background="#003975"
                        _hover={{ background: '#0350a4' }}
                        onClick={() => navigate(`${patient.patient_id}`)}
                        color="white"
                      >
                        <OpenInNewIcon />
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PatientsList;
