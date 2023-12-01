/* eslint-disable react/no-unescaped-entities */
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
} from '@chakra-ui/react';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../Images/logo.png';
import { registerUser } from '../../Config/api';

function Login() {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    user_id: '',
    phone_number: '',
    password: '',
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(registerUser(), inputs);
      navigate('/login');
    } catch (err) {
      setError(err);
      console.log(err.response.data);
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
      <Container maxW="xl">
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          p={8}
          bg="white"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
          textAlign="center"
        >
          <img src={logo} alt="Logo" className="logo" />
          <Heading fontWeight="extrabold" className="heading">
            Register
          </Heading>
          <VStack color="black">
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter Your Name"
                onChange={handleChange}
                id="name"
                name="name"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email Id</FormLabel>
              <Input
                placeholder="Enter Your Email"
                onChange={handleChange}
                id="email"
                name="email"
              />
            </FormControl>
            <FormControl id="userid" isRequired>
              <FormLabel>UserId</FormLabel>
              <Input
                placeholder="Enter Your UserId"
                onChange={handleChange}
                id="userid"
                name="user_id"
              />
            </FormControl>
            <FormControl id="phonenumber" isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                placeholder="Enter Your Phone Number"
                onChange={handleChange}
                id="phonenumber"
                name="phone_number"
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={show ? 'text' : 'password'}
                  placeholder="Enter Your Password"
                  onChange={handleChange}
                  id="password"
                  name="password"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Link to="www.google.com">Forgot Password</Link>
            </FormControl>

            <Button
              colorScheme="rgba(0, 57, 117, 1);"
              width="100%"
              onClick={handleSubmit}
            >
              <Link to="/" style={{ color: 'white' }}>
                Register
              </Link>
            </Button>
            {err && <p>{err}</p>}
            <Text>
              Already Have An Account?{' '}
              <Link to="/register" style={{ color: 'rgba(0, 57, 117, 1)' }}>
                Create One
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
