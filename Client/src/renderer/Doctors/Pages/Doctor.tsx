import {
  Box,
  ButtonGroup,
  Heading,
  Input,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import axios from 'axios';
import AddDoctor from '../Components/AddDoctor';
import doctorImg from '../../Images/doctor.png';
import EditDoctor from '../Components/EditDoctor';
import { AllDoctors } from '../../Config/api';

const boxStyle = {
  padding: '1rem',
  borderRadius: '1rem',
  width: '15rem',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '0.5rem',
  position: 'relative',
};

function Doctor() {
  const [doctor, setDoctor] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(AllDoctors());
        const { data } = response;
        setDoctor(data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  });

  return (
    <div className="doctor">
      <Box className="header-btns">
        <Input
          type="text"
          placeholder="Search doctor by doctor’s name, ID"
          border="1px solid #949494"
          width="70%"
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddDoctor />
      </Box>

      <SimpleGrid
        templateColumns="repeat(4, 1fr)"
        padding="2rem"
        gridGap="4rem"
      >
        {doctor
          .filter((singleDoctor) => {
            return search.toLowerCase() === ''
              ? singleDoctor
              : singleDoctor.doctor_name.toLowerCase().includes(search);
          })
          .map((singleDoctor) => {
            return (
              <Box
                sx={boxStyle}
                boxShadow="0px 1px 4px 0px rgba(0, 0, 0, 0.25)"
                key={singleDoctor.doctor_id}
                outline="1px solid rgba(0, 57, 117, 1)"
              >
                <ButtonGroup
                  display="flex"
                  justifyContent="space-between"
                  position="absolute"
                  width="100%"
                  top={0}
                  left={0}
                />
                <img src={doctorImg} alt="" />
                <Heading size="md">
                  {singleDoctor.doctor_name
                    .split(' ')
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase(),
                    )
                    .join(' ')}
                </Heading>

                <Text size="md">{singleDoctor.specialist}</Text>
                <Text size="md">{singleDoctor.qualification}</Text>
                <EditDoctor doctor={singleDoctor} />
              </Box>
            );
          })}
      </SimpleGrid>
    </div>
  );
}

export default Doctor;
