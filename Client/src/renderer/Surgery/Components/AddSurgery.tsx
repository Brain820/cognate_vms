/* eslint-disable react/prop-types */
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
  useToast,
  FormLabel,
} from '@chakra-ui/react';

import axios from 'axios';

import { useEffect, useState } from 'react';
import { addSurgery } from '../../Config/api';

function AddSurgery(props) {
  const { pat, getSurgery } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputs, setInputs] = useState({
    surgeon_name: '',
    surgery_type: '',
    body_part: '',
    additional_surgeon: '',
    anesthesiologist: '',
    surgery_history_details: '',
    surgery_date: '',
    operation_theatre_number: 0,
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const toast = useToast();
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      await axios.post(
        addSurgery(pat),
        { ...inputs, patient: pat },
        { headers },
      );
      toast({
        title: 'Surgery Has Been Created Successfully!',
        status: 'success',
        isClosable: true,
        duration: 3000,
        position: 'top',
      });
      getSurgery();
      onClose();
    } catch (err) {
      toast({
        title: 'There Might Be Some Error, Please check & Try Again',
        status: 'error',
        isClosable: true,
        duration: 3000,
        position: 'top',
      });
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
        + New Surgery
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Surgery</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Surgeon Name</FormLabel>
              <Input
                placeholder="Dr.Harpreet Singh"
                name="surgeon_name"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Surgery Type</FormLabel>
              <Input
                // placeholder=""
                name="surgery_type"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Body Part</FormLabel>
              <Input
                placeholder="Knee/Shoulder/Elbow etc"
                name="body_part"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <Input
                placeholder="Additional Surgeon"
                name="additional_surgeon"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <Input
                placeholder="Anesthesiologist"
                name="anesthesiologist"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel pl={2}>Surgery Date</FormLabel>
              <Input
                placeholder="Surgery Date"
                name="surgery_date"
                type="date"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <Input
                placeholder="Operation Theatre Number"
                name="operation_theatre_number"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <Textarea
                placeholder="Surgical History Details"
                name="surgery_history_details"
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

export default AddSurgery;
