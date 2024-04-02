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
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddSurgery from '../../Surgery/Components/AddSurgery';
import EditPatient from '../Components/EditPatient';
import { PatientDetails, singlePatient } from '../../Config/api';

const PatientDetailBox = ({ label, value }) => (
  <Box display="flex" gap="1rem" width="100%">
    <Text fontWeight="bold" width="40%">{label} :</Text>
    <Text color="#003975" width="65%">{value}</Text>
  </Box>
);

function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState([]);
  const [surgery, setSurgery] = useState([]);
  const textColor = useColorModeValue('colors.light.primaryText', 'colors.dark.primaryText');
  const accessToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const getSurgery = async () => {
    try {
      const sgry = await axios.get(PatientDetails(id), { headers });
      setSurgery(sgry.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSurgery();
  }, []);
  const getPatient = async () => {
    try {
      const { data } = await axios.get(singlePatient(id), { headers });
      setPatient(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPatient();
  }, []);

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
      color={textColor}
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
        margin="0rem auto"
        fontSize="1.2rem"
        width="50rem"
      >
        <Box height="100%" width="60rem" >
          <PatientDetailBox label="First Name" value={patient.first_name} />
          <PatientDetailBox label="Last Name" value={patient.last_name} />
          <PatientDetailBox label="Date Of Birth" value={patient.date_of_birth} />
          <PatientDetailBox
            label="Age"
            value={`${calculateAge(patient.date_of_birth)}`}
          />
        </Box>
        <Box height="100%" width="70rem" >
          <PatientDetailBox label="Gender" value={patient.gender} />
          <PatientDetailBox label="Mobile" value={patient.mobile_number} />
          <PatientDetailBox label="Address" value={patient.address}/>
          <PatientDetailBox
            label="Patient Id"
            value={patient.hospital_patient_id}
          />
        </Box>
      </Box>
      <EditPatient Patient={patient} getPatient={getPatient} />

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
          <AddSurgery pat={patient.patient_id} getSurgery={getSurgery} />
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
