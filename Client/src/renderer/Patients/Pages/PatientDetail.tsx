import {
  Box,
  Button,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddSurgery from '../../Surgery/Components/AddSurgery';
import EditPatient from '../Components/EditPatient';
import { PatientDetails, singlePatient } from '../../Config/api';
import useAuth from '../../User/Components/useAuth';

function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState([]);
  const [surgery, setSurgery] = useState([]);

  useEffect(() => {
    const getSurgery = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };
        const sgry = await axios.get(PatientDetails(id), { headers });
        setSurgery(sgry.data);
      } catch (error) {
        console.log(error);
      }
    };
    getSurgery();
  }, [id, surgery]);
  const { auth } = useAuth();
  useEffect(() => {
    const getPatient = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };
        const { data } = await axios.get(singlePatient(id), { headers });
        setPatient(data);
      } catch (err) {
        console.log(err);
      }
    };
    getPatient();
  }, [auth?.access_token, id, patient]);

  const navigate = useNavigate();
  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }
    return age;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="2rem"
      className="patient-detail"
    >
      <span className="back">
        <Button
          size="sm"
          background="#003975"
          _hover={{ background: '#0350a4' }}
          onClick={() => navigate(-1)}
          color="white"
        >
          Go Back
        </Button>
      </span>
      <Heading color="red" textAlign="center" fontSize="3rem">
        Patient Details
      </Heading>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        fontSize="1.2rem"
      >
        <Box height="100%">
          <Box display="flex" gap="1rem">
            <Text fontWeight="bold">First Name :</Text>
            <Text color="#003975">{patient.first_name}</Text>
          </Box>
          <Box display="flex" gap="1rem">
            <Text fontWeight="bold">Last Name :</Text>
            <Text color="#003975">{patient.last_name}</Text>
          </Box>
          <Box display="flex" gap="1rem">
            <Text fontWeight="bold">Date Of Birth :</Text>
            <Text color="#003975">{patient.date_of_birth}</Text>
          </Box>
          <Box display="flex" gap="1rem">
            <Text fontWeight="bold">Age :</Text>
            <Text color="#003975">
              {`${calculateAge(patient.date_of_birth)}`}
            </Text>
          </Box>
        </Box>
        <Box height="100%">
          <Box display="flex" gap="1rem">
            <Text fontWeight="bold">Gender : </Text>
            <Text color="#003975">{patient.gender}</Text>
          </Box>
          <Box display="flex" gap="1rem">
            <Text fontWeight="bold">Mobile :</Text>
            <Text color="#003975">{patient.mobile_number}</Text>
          </Box>
          <Box display="flex" gap="1rem">
            <Text fontWeight="bold">Address : </Text>
            <Text color="#003975">{patient.address}</Text>
          </Box>
          <Box display="flex" gap="1rem">
            <Text fontWeight="bold">Patient Id</Text>
            <Text color="#003975">{patient.hospital_patient_id}</Text>
          </Box>
        </Box>
      </Box>
      <EditPatient Patient={patient} />

      <Box className="surgery-list">
        <Heading color="red" textAlign="center" fontSize="3rem">
          Surgery List
        </Heading>
        <Box
          className="header-btns"
          display="flex"
          alignItems="flex-end"
          justifyContent="flex-end"
          width="100%"
          alignSelf="center"
        >
          <AddSurgery pat={patient.patient_id} />
        </Box>
        <TableContainer width="100%" alignSelf="center">
          <Table variant="striped">
            <Thead>
              <Tr background="#003975">
                <Th color="#FFFFFF">ID</Th>
                <Th color="#FFFFFF">Surgeon Name</Th>
                <Th color="#FFFFFF">Additional Surgeon</Th>
                <Th color="#FFFFFF">Anesthesiologist</Th>
                <Th color="#FFFFFF">Body Part</Th>
                <Th color="#FFFFFF">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {surgery.map((item) => {
                return (
                  <Tr key={item.surgery_id}>
                    <Td>{item.surgery_id}</Td>
                    <Td style={{ textTransform: 'capitalize' }}>
                      {item.surgeon_name}
                    </Td>
                    <Td style={{ textTransform: 'capitalize' }}>
                      {item.additional_surgeon}
                    </Td>
                    <Td style={{ textTransform: 'capitalize' }}>
                      {item.anesthesiologist}
                    </Td>
                    <Td style={{ textTransform: 'capitalize' }}>
                      {item.body_part}
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        background="#003975"
                        _hover={{ background: '#0350a4' }}
                        onClick={() =>
                          navigate(`${[item.surgery_id, patient.patient_id]}`)
                        }
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
    </Box>
  );
}

export default PatientDetail;
