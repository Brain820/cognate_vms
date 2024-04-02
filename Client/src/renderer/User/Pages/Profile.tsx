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
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getUser, updateUserData } from '../../Config/api';

function Profile() {
  const toast = useToast();
  const [profile, setProfile] = useState({});
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [mobile, setMobile] = useState('');
  // const { auth, setAuth } = useAuth();

  const accessToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  useEffect(() => {
    setUserName(profile.name || '');
    setUserEmail(profile.email || '');
    setUserId(profile.id || '');
    setMobile(profile.phone_number || '');
  },[profile.name, profile.email, profile.id, profile.phone_number]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get(getUser(), { headers });
        setProfile(data);
      } catch (err) {
        console.log(err);
      }
    };
    getProfile();
  }, []);

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
        position: 'top',
      });
    } catch (err) {
      toast({
        title: 'An error Occured',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
      console.error(err);
    }
  };

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
        </WrapItem>
        <Box className="profile-data">
          <Box className="profile-data-container">
            <Text alignSelf="flex-start">Name</Text>
            <Input
              name="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Text alignSelf="flex-start">Email</Text>
            <Input
              name="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <Text alignSelf="flex-start">User Id</Text>
            <Input
              name="user_id"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Text alignSelf="flex-start">Phone Number</Text>
            <Input
              name="phone_number"
              value={mobile}
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
