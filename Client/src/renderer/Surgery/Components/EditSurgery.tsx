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
  Textarea,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { editSurgery } from '../../Config/api';
import useAuth from '../../User/Components/useAuth';

function EditSurgery(props) {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const { Surgery } = props;
  const [surgeonName, setSurgeonName] = useState('');
  const [surgeryType, setSurgeryType] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  // const [additional, setAdditional] = useState('');
  // const [anesth, setAnesth] = useState('');
  // const [history, setHistory] = useState('');
  // const [patientId, setPatientId] = useState('');
  const id = Surgery.surgery_id;

  const [updateData, setUpdateData] = useState({
    surgeon_name: surgeonName || Surgery.surgery_name,
    surgery_type: surgeryType || Surgery.surgery_type,
    body_part: bodyPart || Surgery.body_part,
    additional_surgeon: 'NA',
    anesthesiologist: 'NA',
    surgery_history_details: 'NA',
  });

  const handleChange = (e) => {
    setUpdateData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { auth } = useAuth();
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = auth?.access_token;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      await axios.put(
        editSurgery(id),
        {
          ...updateData,
          patient: Surgery.patient,
        },
        { headers },
      );
      onClose();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Button
        background="rgba(0, 57, 117, 1)"
        _hover={{ background: '#0350a4' }}
        color="white"
        onClick={onOpen}
        alignSelf="center"
      >
        Edit Surgery
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel>Surgeon Name</FormLabel>
              <Input
                placeholder="Surgeon Name"
                name="surgeon_name"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Surgery Type</FormLabel>
              <Input
                placeholder="Surgery Type"
                name="surgery_type"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Body Part</FormLabel>
              <Input
                placeholder="Body Part"
                name="body_part"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Additional Surgeon</FormLabel>
              <Input
                placeholder="Additional Surgeon"
                name="additional_surgeon"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Anesthesiologist</FormLabel>
              <Input
                placeholder="Anesthesiologist"
                name="anesthesiologist"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Surgery History Details</FormLabel>
              <Textarea
                placeholder="Surgery History Details"
                name="surgery_history_details"
                onChange={handleChange}
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

export default EditSurgery;
