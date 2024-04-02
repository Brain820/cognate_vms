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
import logo from '../../Images/logo.png';
import { loginUser } from '../../Config/api';
import useAuth from '../Components/useAuth';

function ForgotPassword() {
  const toast = useToast();
  const navigate = useNavigate();

  const { setAuth, auth } = useAuth();

  const [inputs, setInputs] = useState({
    user_id_or_email: '',
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [errMsg, setErrMsg] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(loginUser(), inputs);
      console.log('logged in');
      const accessToken = data?.access_token;
      const refreshToken = data?.refresh_token;
      setAuth({
        ...inputs,
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      localStorage.setItem('token', accessToken);
      toast({
        title: 'You Have Been Logged In',
        status: 'success',
        isClosable: true,
      });
      navigate('/');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        toast({
          title: 'Username/Email Or Password Is Missing',
          status: 'error',
          isClosable: true,
        });
        setErrMsg('Missing UserName or Password');
      } else if (err.response?.status === 401) {
        toast({
          title: 'You Have Entered Wrong Credentials',
          status: 'warning',
          isClosable: true,
        });
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
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
          <Image src={logo} alt="Logo" className="logo" />
          <Heading className="heading">Reset Password</Heading>
          <VStack spacing="2rem" color="black">
            <FormControl isRequired>
              <FormLabel>Enter Your Email </FormLabel>
              <Input
                placeholder="Enter Your UserId"
                id="user_id_or_email"
                name="user_id_or_email"
                onChange={handleChange}
              />
            </FormControl>

            <Button
              colorScheme="rgba(0, 57, 117, 1);"
              width="100%"
              style={{ marginTop: 15 }}
              onClick={handleAdd}
            >
              Reset
            </Button>
            <Button>
              <Link to="/login">Back To Login</Link>
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
