// import { EditIcon } from '@chakra-ui/icons'

import {
  Button,
  ButtonGroup,
  FocusLock,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';

import React, { useState } from 'react';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import { editDoctor } from '../../Config/api';

function EditDoctor(props) {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = React.useRef(null);

  // eslint-disable-next-line react/prop-types
  const { doctor } = props;

  const [name, setName] = useState(doctor.doctor_name);
  const [spec, setSpec] = useState(doctor.specialist);
  const [qual, setQual] = useState(doctor.qualification);

  const id = doctor.doctor_id;

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(editDoctor(id), {
        doctor_name: name,
        specialist: spec,
        qualification: qual,
      });
      onClose();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={firstFieldRef}
      onOpen={onOpen}
      onClose={onClose}
      placement="right"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Button
          _hover={{ background: '#0350a4', color: 'white' }}
          outline="1px solid rgba(179,179,179)"
          color="rgba(67,67,67)"
          position="absolute"
          top="95%"
          left="40%"
          padding="1rem"
        >
          <EditIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent p={5}>
        <FocusLock returnFocus persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />

          <FormControl>
            <FormLabel>Doctor Name</FormLabel>
            <Input
              placeholder="Doctor Name"
              name="doctor_name"
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Specialist</FormLabel>
            <Input
              placeholder="Specialist"
              name="specialist"
              onChange={(e) => setSpec(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Qualification</FormLabel>
            <Input
              placeholder="Qualification"
              name="qualification"
              onChange={(e) => setQual(e.target.value)}
            />
          </FormControl>
          <ButtonGroup paddingTop={4}>
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
          </ButtonGroup>
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
}

export default EditDoctor;
