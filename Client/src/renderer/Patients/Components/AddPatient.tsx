/* eslint-disable camelcase */
import {
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  Input,
  Textarea,
  Select,
  useToast,
  FormLabel,
} from '@chakra-ui/react';

import axios from 'axios';

import { useState } from 'react';
import { addPatient } from '../../Config/api';
import useAuth from '../../User/Components/useAuth';

function AddPatient() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputs, setInputs] = useState({
    hospital_patient_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    mobile_number: '',
    address: '',
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const toast = useToast();
  const { auth } = useAuth();
  const handleAdd = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      await axios.post(addPatient(), inputs, { headers });
      toast({
        title: 'Patient Has Been Added',
        status: 'success',
        isClosable: true,
      });
      onClose();
    } catch (err) {
      console.log(err);
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
      >
        + Add Patient
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Patient</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <Input
                placeholder="Hospital Patient Id"
                name="hospital_patient_id"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                placeholder="First Name"
                name="first_name"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <Input
                placeholder="Last Name"
                name="last_name"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel pl={2}>Date of Birth</FormLabel>
              <Input
                placeholder="Date of Birth"
                name="date_of_birth"
                onChange={handleChange}
                type="date"
              />
            </FormControl>

            <FormControl mt={4}>
              <Select
                placeholder="Select Gender"
                name="gender"
                onChange={handleChange}
                value={inputs.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <Input
                placeholder="Mobile Number"
                name="mobile_number"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <Textarea
                placeholder="Address"
                name="address"
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              background="rgba(0, 57, 117, 1)"
              color="white"
              _hover={{ background: '#0350a4' }}
              onClick={handleAdd}
            >
              Add
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

export default AddPatient;
