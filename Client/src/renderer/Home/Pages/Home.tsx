import { useEffect, useState } from 'react';
import { Box, Button, Heading, Input, Text } from '@chakra-ui/react';
import axios from 'axios';
import CCTV from '../Components/CCTV';
import { AllDoctors, ListOfPatients } from '../../Config/api';
// import useAuth from '../../User/Components/useAuth';

function Home() {
  const [link, setLink] = useState('');
  const [doctor, setDoctor] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(AllDoctors(), { headers });
        const { data } = response;
        setDoctor(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [patients, setPatients] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(ListOfPatients(), { headers });
        const { data } = response;
        setPatients(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem('token'), patients]);

  return (
    <Box
      className="dashboard"
      display="flex"
      alignItems="center"
      justifyContent="top"
      flexDirection="column"
      width="100%"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box width="40%" background="red" height="0.2rem" />
        <Heading fontSize="3rem" color="red">
          Dashboard
        </Heading>
        <Box width="40%" background="red" height="0.2rem" />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        width="80vw"
        justifyContent="center"
        gap="1rem"
        height="30rem"
      >
        <CCTV />
        {/* <Box className="data">
          <Box
            className="data-box"
            display="flex"
            justifyContent="center"
            height="12rem"
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            textAlign="center"
            background="#003975"
          >
            <Text fontSize="3rem" color="white">
              {doctor.length}+ DOCTORS
            </Text>
          </Box>

          <Box
            className="data"
            display="flex"
            alignItems="center"
            p={10}
            pl={2}
            pr={2}
            height="12rem"
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            background="#003975"
            width="auto"
          >
            <Input
              placeholder="Paste The CCTV Link"
              color="white"
              onChange={(e) => setLink(e.target.value)}
            />
            <Button onClick={() => setLink(link)}>Paste Here</Button>
          </Box>

          <Box
            className="data-box"
            // display="flex"
            // justifyContent="center"
            height="12rem"
            bg="white"
            borderRadius="lg"
            // borderWidth="1px"
            textAlign="center"
            background="#003975"
          >
            <Text fontSize="3rem" color="white">
              {patients.length}+ PATIENTS
            </Text>
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
}

export default Home;
