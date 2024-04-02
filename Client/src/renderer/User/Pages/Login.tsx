import { useState } from 'react';
import {
  Container,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Heading,
  Text,
  useToast,
  Image,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loginUser } from '../../Config/api';
// import logo from '../../../../assets/logo.png'
import logo from '../../Images/logo.png';

function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    user_id_or_email: '',
    password: '',
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(loginUser(), inputs);
      const accessToken = data?.access_token;
      localStorage.setItem('token', accessToken);
      toast({
        title: 'You Have Been Logged In',
        status: 'success',
        isClosable: true,
        duration: 3000,
        position: 'top',
      });
      navigate('/');
    } catch (err) {
      if(err.response?.status === 400) {
        toast({
          title: 'Username/Email Or Password Is Missing',
          status: 'warning',
          isClosable: true,
          duration: 2000,
          position: 'bottom', 
        });
      } else if (err.response?.status === 401) {
        toast({
          title: 'You Have Entered Wrong Credentials',
          status: 'error',
          isClosable: true,
          duration: 2000,
          position: 'bottom',
        });
      } else {
        toast({
          title: 'Login Failed',
          status: 'error',
          isClosable: true,
          duration: 2000,
          position: 'bottom',
        });
      }
    }
  };

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <Box
      className="login"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container minWidth="xl">
        <Box
          display="flex"
          justifyContent="center"
          p={10}
          bg="white"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
          textAlign="center"
          flexDirection="column"
        >
          <Image
            src={logo}
            fontSize="2rem"
            className="logo"
          />
          <Heading className="heading">Log In</Heading>
          <VStack spacing="2rem" color="black">
            <FormControl isRequired>
              <FormLabel>UserId</FormLabel>
              <Input
                placeholder="Enter Your UserId"
                id="user_id_or_email"
                name="user_id_or_email"
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={show ? 'text' : 'password'}
                  placeholder="Enter Your Password"
                  name="password"
                  onChange={handleChange}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {/* <Link to="/forgot">Forgot Password</Link> */}
            </FormControl>

            <Button
              colorScheme="rgba(0, 57, 117, 1);"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={handleAdd}
            >
              <Link to="/" style={{ color: 'white' }}>
                Login
              </Link>
            </Button>
            {/* <Text>
              Don't Have An Account?{' '}
              <Link to="/register" style={{ color: 'rgba(0, 57, 117, 1)' }}>
                Create One
              </Link>
            </Text> */}
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
