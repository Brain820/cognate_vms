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
  FormLabel,
  Input,
} from '@chakra-ui/react';

import axios from 'axios';

import { useState } from 'react';
import { addDoctor } from '../../Config/api';

function AddDoctor() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputs, setInputs] = useState({
    doctor_name: '',
    profile_pic: null,
    specialist: '',
    qualification: '',
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(addDoctor(), inputs);
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
        + Add Doctor
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Doctor</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Doctor Name</FormLabel>
              <Input
                placeholder="Doctor Name"
                name="doctor_name"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Specialist</FormLabel>
              <Input
                placeholder="Specialist"
                name="specialist"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Qualification</FormLabel>
              <Input
                placeholder="Qualification"
                name="qualification"
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

export default AddDoctor;
