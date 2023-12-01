import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="3rem"
    >
      <Heading>An Unexpected error has occured</Heading>
      <Text>
        Please go to the home page and try again later{' '}
        <Button
          color="white"
          background="red.400"
          _hover={{ background: 'red.200' }}
        >
          <Link to="/">Home</Link>{' '}
        </Button>
      </Text>
    </Box>
  );
}

export default ErrorPage;
