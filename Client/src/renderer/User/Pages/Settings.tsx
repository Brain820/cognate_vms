import {
  FormControl,
  Input,
  Textarea,
  Select,
  useToast,
  FormLabel,
  Box,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { addCompany, companyDetails, editCompanyDetails } from '../../Config/api';
import { WDRStatusApi_VMS, frameRateApi_VMS,OSDSettApi_VMS } from '../../Config/cameraApi';
function Settings() {

  const toast = useToast();

  const [company, setCompany] = useState({})
  const accessToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const getCompany = async () => {
    try {
      const { data } = await axios.get(companyDetails(), { headers });
      setCompany(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCompany();
  }, []);

  const [logo, setLogo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [softwareName, setSoftwareName] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [pin, setPin] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [videoStreaming, setVideoStreaming] = useState('');
  const [aboutHospital, setAboutHospital] = useState('');
  const [watermarkedLogo, setWatermarkedLogo] = useState('');
  const [storagePath, setStoragePath] = useState('');
  const [cameraIp, setCameraIp] = useState('');
  const [cameraType, setCameraType] = useState('');
  const [cameraFrameRate, setCameraFrameRate] = useState(0);
  const [cameraWdrStatus, setCameraWdrStatus] = useState('');
  const [cameraZoomSpeed, setCameraZoomSpeed] = useState(0);
 
 


  useEffect(() => {
    setLogo(company.logo ? company.logo : '/home/rakesh/Documents/29Feb/vms/Client/assets/logo.png');
    setCompanyName(company.company_name ? company.company_name : 'Cognate')
    setSoftwareName(company.software_name ? company.software_name : "VMS")
    setAddress(company.company_address ? company.company_address : "Delhi")
    setState(company.state ? company.state : "Delhi")
    setDistrict(company.district ? company.district : "OKhla")
    setPin(company.pin ? company.pin : "803119")

    setCompanyEmail(company.company_email ? company.company_email : "cognet@gmail.com")
    setCompanyPhone(company.company_mobile_no ? company.company_mobile_no : "9876543210")
    setVideoStreaming(company.video_streaming ? company.video_streaming : "rtsp://admin:123456@192.168.1.188:554/stream1")
    setAboutHospital(company.about_hospital ? company.about_hospital : "Hospital")
    setWatermarkedLogo(company.watermarked_logo ? company.watermarked_logo : "/home/rakesh/Documents/29Feb/vms/Client/assets/logo.png")
    setStoragePath(company.storage_path ? company.storage_path : "/home/rakesh/Documents/29Feb/data")
    
    setUser(company.user ? company.user : "admin")
    setPassword(company.password ? company.password : "123456")
    setCameraIp(company.camera_ip ? company.camera_ip : "192.168.1.188")
    setCameraFrameRate(company.camera_framerate ? company.camera_framerate : 15)
    setCameraWdrStatus(company.camera_wdr_status ? company.camera_wdr_status : "off")
    setCameraZoomSpeed(company.camera_zoom_speed ? company.camera_zoom_speed : 5)
    setCameraType(company.camera_type ? company.camera_type : "Digest Auth Camera")
  }, [
    company.logo,
    company.company_name,
    company.software_name,
    company.company_address,
    company.state,
    company.district,
    company.pin,
    company.user,
    company.password,
    company.company_email,
    company.company_mobile_no,
    company.video_streaming,
    company.about_hospital,
    company.watermarked_logo,
    company.storage_path,
    company.camera_ip,
    company.camera_type,
    company.camera_framerate,
    company.camera_wdr_status,
    company.camera_zoom_speed,
  ])

  const handleEdit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const updatedCompany = {
        logo: logo ? logo : '/home/rakesh/Documents/29Feb/vms/Client/assets/logo.png',
        company_name: companyName ? companyName : 'Cognate',
        software_name: softwareName ? softwareName : "VMS",
        company_address: address ? address : "Delhi",
        state: state ? state : "Delhi",
        district: district ? district : "OKhla",
        pin: pin ? pin : "803119",
        user: user ? user : "admin",
        password: password ? password : "123456",
        company_email: companyEmail ? companyEmail : "cognet@gmail.com",
        company_mobile_no: companyPhone ? companyPhone : "9876543210",
        video_streaming: videoStreaming ? videoStreaming : "rtsp://admin:123456@192.168.1.188:554/stream1",
        about_hospital: aboutHospital ? aboutHospital : "Hospital",
        watermarked_logo: watermarkedLogo ? watermarkedLogo : "/home/rakesh/Documents/29Feb/vms/Client/assets/logo.png",
        storage_path: storagePath ? storagePath : "/home/rakesh/Documents/29Feb/data",
        camera_ip: cameraIp ? cameraIp : "192.168.1.188",
        camera_type: cameraType ? cameraType : 'Digest Auth Camera',
        camera_framerate : cameraFrameRate ? cameraFrameRate : 15 ,
        camera_wdr_status : cameraWdrStatus ? cameraWdrStatus:"off" ,
        camera_zoom_speed :cameraZoomSpeed ? cameraZoomSpeed :5 
      };
      await axios.put(editCompanyDetails(company.id), updatedCompany, {
        headers,
      });
      setCompany((prev) => ({
        ...prev,
        ...updatedCompany
      }));

      frameRateApi_VMS(cameraIp,user,password,cameraFrameRate);
      WDRStatusApi_VMS(cameraIp,user,password,cameraWdrStatus);
      OSDSettApi_VMS(cameraIp,user,password);
      toast({
        title: 'Updated',
        description: 'Your Company has been Updated Successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
    catch (err) {
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

  const handleAdd = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await axios.post(addCompany(), {
        logo: logo,
        company_name: companyName,
        software_name: softwareName,
        company_address: address,
        state: state,
        district: district,
        pin: pin,
        user: user,
        password: password,
        company_email: companyEmail,
        company_mobile_no: companyPhone,
        video_streaming: videoStreaming,
        about_hospital: aboutHospital,
        watermarked_logo: watermarkedLogo,
        storage_path: storagePath,
        camera_ip: cameraIp,
        camera_type: cameraType,
        camera_framerate : cameraFrameRate,
        camera_wdr_status: cameraWdrStatus,
        camera_zoom_speed: cameraZoomSpeed
      }, { headers });
      getCompany();
      toast({
        title: 'Company Has Been Added',
        status: 'success',
        isClosable: true,
        duration: 3000,
        position: 'top',
      });
    } catch (err) {
      toast({
        title: 'There Might Be Some Error, Please check & Try Again',
        status: 'error',
        isClosable: true,
        duration: 3000,
        position: 'top',
      });
      console.log(err);
    }
  };
  
  const [limit, setLimit] = useState(0);
  return (
    <Box className='settings'>
      <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gridGap={40}>
        <Box>
          {/* Company Logo */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Company Logo</FormLabel>
            <Input
              placeholder="Logo Address"
              name="logo"
              color="black"
              background="white"
              focusBorderColor="white"
              value={logo}
              // onChange={handleChange}
              onChange={(e) => {
                setLogo(e.target.value)
              }}
            />
          </FormControl>

          {/* Company Name */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Company Name</FormLabel>
            <Input
              placeholder="Cognate India"
              name="company_name"
              color="black"
              background="white"
              focusBorderColor="white"
              value={companyName}
              // onChange={handleChange}
              onChange={(e) => {
                setCompanyName(e.target.value)
              }}
            />
          </FormControl>

          {/* Software Name */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Software Name</FormLabel>
            <Input
              placeholder="VMS"
              name="software_name"
              color="black"
              background="white"
              focusBorderColor="white"
              value={softwareName}
              // onChange={handleChange}
              onChange={(e) => {
                setSoftwareName(e.target.value)
              }}
            />
          </FormControl>
          {/* Email */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Company Email</FormLabel>
            <Input
              placeholder="company@gmail.com"
              name="company_email"
              type='email'
              color="black"
              background="white"
              focusBorderColor="white"
              value={companyEmail}
              // onChange={handleChange}
              onChange={(e) => {
                setCompanyEmail(e.target.value)
              }}
            />
            </FormControl>

        </Box>
        <Box>
          {/* Company Address */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Company Address</FormLabel>
            <Textarea
              placeholder="New Delhi"
              name="company_address"
              color="black"
              background="white"
              focusBorderColor="white"
              value={address}
              // onChange={handleChange}
              onChange={(e) => {
                setAddress(e.target.value)
              }}
            />
          </FormControl>

          {/* State */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>State</FormLabel>
            <Input
              placeholder="West Bengal"
              name="state"
              color="black"
              background="white"
              focusBorderColor="white"
              value={state}
              // onChange={handleChange}
              onChange={(e) => {
                setState(e.target.value)
              }}
            />
          </FormControl>

          {/* District */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>District</FormLabel>
            <Input
              placeholder="Howrah"
              name="district"
              color="black"
              background="white"
              focusBorderColor="white"
              value={district}
              // onChange={handleChange}
              onChange={(e) => {
                setDistrict(e.target.value)
              }}
            />
          </FormControl>
          {/* PinCode */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Pin</FormLabel>
            <Input
              placeholder="989898"
              name="pin"
              color="black"
              background="white"
              focusBorderColor="white"
              value={pin}
              // onChange={handleChange}
              onChange={(e) => {
                setPin(e.target.value)
              }}
            />
          </FormControl>

          
        </Box>
        <Box>
                

          {/* About Hospital */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>About Hospital</FormLabel>
            <Textarea
              placeholder="New Delhi"
              name="company_address"
              color="black"
              background="white"
              focusBorderColor="white"
              value={aboutHospital}
              // onChange={handleChange}
              onChange={(e) => {
                setAboutHospital(e.target.value)
              }}
            />
          </FormControl>

          {/* Watermarked Logo */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Watermark Logo Address</FormLabel>
            <Input
              placeholder="Watermark"
              name="watermarked_logo"
              color="black"
              background="white"
              focusBorderColor="white"
              value={watermarkedLogo}
              // onChange={handleChange}
              onChange={(e) => {
                setWatermarkedLogo(e.target.value)
              }}
            />
          </FormControl>

          {/* Storage Path */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Storage Path</FormLabel>
            <Input
              placeholder="Storage Address"
              name="storage_path"
              color="black"
              background="white"
              focusBorderColor="white"
              value={storagePath}
              // onChange={handleChange}
              onChange={(e) => {
                setStoragePath(e.target.value)
              }}
            />
          </FormControl>

          {/* Mobile Number */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Company Phone</FormLabel>
            <Input
              placeholder="9999999999"
              name="company_mobile_no"
              type='tel'
              color="black"
              background="white"
              focusBorderColor="white"
              value={companyPhone}
              // onChange={handleChange}
              onChange={(e) => {
                setCompanyPhone(e.target.value)
              }}
            />
          </FormControl>

          
        </Box>
        
      </Box>
      <Box fontSize='5px'>
        <FormLabel >Camera Configrations</FormLabel>
      </Box>
      <Box display="grid" gridTemplateColumns={{ base: "2fr", md: "1fr 1fr" }} gridGap={60}>
          <Box>
          {/* Camera ip */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Camera IP</FormLabel>
            <Input
              placeholder="00.00.00.00"
              name="camera_ip"
              color="black"
              background="white"
              focusBorderColor="white"
              value={cameraIp}
              // onChange={handleChange}
              onChange={(e) => {
                setCameraIp(e.target.value)
              }}
            />
          </FormControl>
          

          {/* User */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}> Camera Username</FormLabel>
            <Input
              placeholder="Admin"
              name="user"
              color="black"
              background="white"
              focusBorderColor="white"
              value={user}
              // onChange={handleChange}
              onChange={(e) => {
                setUser(e.target.value)
              }}
            />
          </FormControl>

          {/* Password */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Camera Password</FormLabel>
            <Input
              placeholder="******"
              name="password"
              color="black"
              background="white"
              focusBorderColor="white"
              value={password}
              // onChange={handleChange}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
            />
          </FormControl>
      

          {/* FrameRate */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Frame Rate</FormLabel>
            <Input
              placeholder="9999999999"
              name="company_mobile_no"
              type='tel'
              color="black"
              background="white"
              focusBorderColor="white"
              value={cameraFrameRate}
              // onChange={handleChange}
              onChange={(e) => {
                const newLimit = e.target.value === '' ? 0 :  Math.max(
                  Math.min(parseInt(e.target.value,10),30),
                  0
                )
                // setLimit(newLimit)
                // setCameraFrameRate(e.target.value)
                setCameraFrameRate(newLimit)
              }}
            />
          </FormControl>

          </Box>

          <Box>
            {/* Camera Type */}
            <FormControl mt={4} isRequired>
              <FormLabel pl={2}>Camera Type</FormLabel>
              <Select
                name="camera_type"
                color="black"
                background="white"
                focusBorderColor="white"
                value={cameraType}
                // onChange={handleChange}
                onChange={(e) => {
                  setCameraType(e.target.value)
                }}
              >
                <option value="Digest Auth Camera">Digest Auth Camera</option>
                <option value="Basic Auth Camera">Basic Auth Camera</option>
              </Select>
            </FormControl>

          {/* Video Streaming */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Streaming Link</FormLabel>
            <Input
              placeholder="rtsp://00.00.00.00:0000/...."
              name="video_streaming"
              color="black"
              background="white"
              focusBorderColor="white"
              value={videoStreaming}
              // onChange={handleChange}
              onChange={(e) => {
                setVideoStreaming(e.target.value)
              }}
            />
          </FormControl>

          {/* Camera Zoom Speed */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>Zoom speed</FormLabel>
            <Input
              placeholder="Zoom speed"
              name="camera_zoom_speed"
              type='number'
              color="black"
              background="white"
              focusBorderColor="white"
              value={cameraZoomSpeed}
              // onChange={handleChange}
              onChange={(e) => {
                const newLimit = e.target.value === '' ? 0 :  Math.max(
                  Math.min(parseInt(e.target.value,10),60),
                  0
                )
                // setLimit(newLimit)
                // setCameraFrameRate(e.target.value)
                setCameraZoomSpeed(newLimit)
              }}
            />
          </FormControl>

          {/* cameraWdrStatus */}
          <FormControl mt={4} isRequired>
            <FormLabel pl={2}>camera WDR Status</FormLabel>
            <Select
                name="camera_type"
                color="black"
                background="white"
                focusBorderColor="white"
                value={cameraWdrStatus}
                // onChange={handleChange}
                onChange={(e) => {
                  setCameraWdrStatus(e.target.value)
                }}
              >
                <option value = "off"  >Off </option>
                <option value =  "on"  >On  </option>
              </Select>
          </FormControl>
          </Box>
        
      </Box>
      
      <ButtonGroup gap="4rem">
        <Button
          mt={4}
          background="rgba(0, 57, 117, 1)"
          color="#0350a4"
          backgroundColor="white"
          display="inline-block"
          onClick={company.id ? handleEdit : handleAdd}
        >
          {company.id ? 'Save' : 'Add'}
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default Settings;
