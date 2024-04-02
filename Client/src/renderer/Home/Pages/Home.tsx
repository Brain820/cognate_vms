import { Box, Heading } from '@chakra-ui/react';
import CCTV from '../Components/CCTV';

function Home() {
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
        width="75vw"
        justifyContent="center"
        gap="1rem"
        borderRadius="2rem"
      >
        <CCTV />
      </Box>
    </Box>
  );
}

export default Home;
