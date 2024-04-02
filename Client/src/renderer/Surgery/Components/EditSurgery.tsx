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
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { editSurgery } from '../../Config/api';

function EditSurgery(props) {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const { Surgery, getSurgery } = props;
  const id = Surgery.surgery_id;

  const [surgeonName, setSurgeonName] = useState('');
  const [surgeryType, setSurgeryType] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [additionalSurgeon, setAdditionalSurgeon] = useState('');
  const [anesthesiologist, setAnesthesiologist] = useState('');
  const [surgeryHistoryDetails, setSurgeryHistoryDetails] = useState('');
  const [surgeryDate, setSurgeryDate] = useState('');
  const [surgeryOperationTheatre, setSurgeryOperationTheatre] = useState('');


  useEffect(() => {
    setSurgeonName(Surgery.surgeon_name || '');
    setSurgeryType(Surgery.surgery_type || '');
    setBodyPart(Surgery.body_part || '');
    setAdditionalSurgeon(Surgery.additional_surgeon || 'NA');
    setAnesthesiologist(Surgery.anesthesiologist || 'NA');
    setSurgeryHistoryDetails(Surgery.surgery_history_details || 'NA');
    setSurgeryDate(Surgery.surgery_date);
    setSurgeryOperationTheatre(Surgery.operation_theatre_number)
  }, [
    Surgery.additional_surgeon,
    Surgery.anesthesiologist,
    Surgery.body_part,
    Surgery.surgery_history_details,
    Surgery.surgery_type,
    Surgery.surgeon_name,
    Surgery.surgery_date,
    Surgery.operation_theatre_number,
  ]);

  const toast = useToast()
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      const updatedSurgery = {
        surgeon_name: surgeonName,
        surgery_type: surgeryType,
        body_part: bodyPart,
        additional_surgeon: additionalSurgeon,
        anesthesiologist: anesthesiologist,
        surgery_history_details: surgeryHistoryDetails,
        surgery_date: surgeryDate,
        operation_theatre_number: surgeryOperationTheatre,
      };
      await axios.put(
        editSurgery(id),
        {
          ...updatedSurgery,
          patient: Surgery.patient,
        },
        { headers },
      );
      toast({
        title: 'Surgery Has Been Updated Successfully!',
        status: 'success',
        isClosable: true,
        position: 'top',
        duration: 3000,
      });
      getSurgery();
      onClose();
    } catch (err) {
      toast({
        title: 'There might be some error, Please Check and try again',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 3000,
      })
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
            <FormControl mt={4} isRequired>
              <FormLabel>Surgeon Name</FormLabel>
              <Input
                placeholder="Surgeon Name"
                name="surgeon_name"
                value={surgeonName}
                onChange={(e) => setSurgeonName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Surgery Type</FormLabel>
              <Input
                placeholder="Surgery Type"
                name="surgery_type"
                value={surgeryType}
                onChange={(e) => setSurgeryType(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Body Part</FormLabel>
              <Input
                placeholder="Body Part"
                name="body_part"
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Additional Surgeon</FormLabel>
              <Input
                placeholder="Additional Surgeon"
                name="additional_surgeon"
                value={additionalSurgeon}
                onChange={(e) => setAdditionalSurgeon(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Anesthesiologist</FormLabel>
              <Input
                placeholder="Anesthesiologist"
                name="anesthesiologist"
                value={anesthesiologist}
                onChange={(e) => setAnesthesiologist(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Surgery History Details</FormLabel>
              <Textarea
                placeholder="Surgery History Details"
                name="surgery_history_details"
                value={surgeryHistoryDetails}
                onChange={(e) => setSurgeryHistoryDetails(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Surgery Date</FormLabel>
              <Input
                placeholder="Surgery Date"
                name="surgery_date"
                value={surgeryDate}
                type="date"
                onChange={(e) => setSurgeryDate(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Operation Theatre Number</FormLabel>
              <Input
                placeholder="OT Number"
                name="operation_theatre_number"
                value={surgeryOperationTheatre}
                type="number"
                onChange={(e) => setSurgeryOperationTheatre(e.target.value)}
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
              Save
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
