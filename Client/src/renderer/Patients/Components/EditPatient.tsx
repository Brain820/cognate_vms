// import { EditIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { editPatient } from '../../Config/api';
import useAuth from '../../User/Components/useAuth';

function EditPatient(props) {
  const toast = useToast();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const { Patient } = props;

  const [patientId, setPatientId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [Gender, setGender] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [Address, setAddress] = useState('');
  const id = Patient.patient_id;

  useEffect(() => {
    setFirstName(Patient.first_name || '');
    setLastName(Patient.last_name || '');
    setDob(Patient.date_of_birth || '');
    setGender(Patient.gender || '');
    setMobileNumber(Patient.mobile_number || '');
    setAddress(Patient.address || '');
    setPatientId(Patient.hospital_patient_id || '');
  }, [Patient.address, Patient.date_of_birth, Patient.first_name, Patient.gender, Patient.hospital_patient_id, Patient.last_name, Patient.mobile_number]);

  const { auth } = useAuth();
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      const updatedPatient = {
        hospital_patient_id: patientId,
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dob,
        gender: Gender,
        mobile_number: mobileNumber,
        address: Address,
      };
      await axios.put(editPatient(id), updatedPatient, { headers });
      toast({
        title: 'Patient Data Has Been Updated',
        status: 'success',
        isClosable: true,
      });
      onClose();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      <Button
        borderRadius="2rem"
        background="rgba(0, 57, 117, 1)"
        _hover={{ background: '#0350a4' }}
        color="white"
        onClick={onOpen}
        width="30%"
        alignSelf="center"
        padding="1rem"
      >
        Edit Patient
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody pb={6}>

            <FormControl mt={4}>
              <FormLabel>Patient Id</FormLabel>
              <Input
                placeholder="Hospital Id"
                name="hospital_patient_id"
                onChange={(e) => setPatientId(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>First Name</FormLabel>
              <Input
                placeholder="First Name"
                name="first_name"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                placeholder="Last Name"
                name="last_name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Date Of Birth</FormLabel>
              <Input
                placeholder="Date Of Birth"
                name="date_of_birth"
                type="date"
                onChange={(e) => setDob(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <Select
                placeholder="Select Gender"
                name="gender"
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                placeholder="Mobile Number"
                name="mobile_number"
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Address</FormLabel>
              <Textarea
                placeholder="Address"
                name="address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="2rem"
          >
            <Button
              mr={3}
              background="rgba(0, 57, 117, 1)"
              color="white"
              _hover={{ background: '#0350a4' }}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              onClick={onClose}
              background="red"
              color="white"
              _hover={{ background: '#cd0303' }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EditPatient;
