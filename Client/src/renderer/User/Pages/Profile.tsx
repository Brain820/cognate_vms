import {
  Heading,
  Text,
  WrapItem,
  Avatar,
  Input,
  Box,
  Button,
  useToast,
} from '@chakra-ui/react';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../Components/useAuth';
import { updateUserData } from '../../Config/api';

function Profile() {
  const toast = useToast();
  const [profile, setProfile] = useState({});
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [mobile, setMobile] = useState('');
  const { auth,setAuth } = useAuth();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };
        const { data } = await axios.get(
          'http://localhost:8000/api/user/profile/',
          { headers },
        );
        setProfile(data);
      } catch (err) {
        console.log(err);
      }
    };
    getProfile();
  }, [auth?.access_token]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      const updatedUser = {
        name: userName,
        email: userEmail,
        id: userId,
        phone_number: mobile,
      };
      await axios.put(updateUserData(profile.id), updatedUser, {
        headers,
      });
      // Update the profile by merging the existing profile with the updatedUser
      setProfile((prevProfile) => ({
        ...prevProfile,
        ...updatedUser,
      }));
      toast({
        title: 'Updated',
        description: 'Your Profile has been Updated Successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  console.log(profile);

  return (
    <Box className="profile">
      <Heading textAlign="center" fontSize="3rem" color="red">
        User Profile
      </Heading>
      <Box className="profile-container">
        <WrapItem
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="60vh"
        >
          <Avatar
            width="15rem"
            height="15rem"
            name={profile.name}
            objectFit="cover"
            position="relative"
            size="2xl"
          />
          <Button
            position="absolute"
            top="30rem"
            background="transparent"
            _hover={{ background: 'transparent' }}
          >
            <EditIcon />
          </Button>
        </WrapItem>
        <Box className="profile-data">
          <Box className="profile-data-container">
            <Text alignSelf="flex-start">Name</Text>
            <Input
              placeholder={profile.name}
              name="name"
              onChange={(e) => setUserName(e.target.value)}
            />
            <Text alignSelf="flex-start">Email</Text>
            <Input
              placeholder={profile.email}
              name="email"
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <Text alignSelf="flex-start">User Id</Text>
            <Input
              placeholder={profile.id}
              name="user_id"
              onChange={(e) => setUserId(e.target.value)}
            />
            <Text alignSelf="flex-start">Phone Number</Text>
            <Input
              placeholder={profile.phone_number}
              name="phone_number"
              onChange={(e) => setMobile(e.target.value)}
            />
          </Box>
          <Button
            background="rgba(0, 57, 117, 1)"
            color="white"
            display="block"
            width="50%"
            borderRadius="1rem"
            fontSize="1.5rem"
            _hover={{
              background: '#0350a4',
            }}
            onClick={handleEdit}
          >
            UPDATE
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Profile;
