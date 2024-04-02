// import { Box, Button, Image, useColorMode, useColorModeValue } from '@chakra-ui/react';
// import { useCompany } from '../../Company/CompanyContext';

// function Header() {
//   const { company } = useCompany();
//   // const { colorMode, toggleColorMode } = useColorMode()
//   // const bg = useColorModeValue('red.500', 'red.200')
//   // const color = useColorModeValue('white', 'gray.800')

//   return (
//     <Box className="header">
//     {/* <Box className="header" bg={bg} color={color}> */}
//       <Image
//         src={'file://' + `${company.logo}`}
//         alt={company.company_name ? company.company_name : 'Hospital'}
//       />
//       {/* <Button onClick={toggleColorMode} >Toggle</Button> */}
//     </Box>
//   );
// }

// export default Header;
import { Box, Button, Image, useColorMode, useColorModeValue } from '@chakra-ui/react';
// import { useCompany } from '../../Company/CompanyContext';
import { useEffect, useState } from 'react';
import { companyDetails } from '../../Config/api';
import axios from 'axios';

function Header() {
  // const { company } = useCompany();
  // const { colorMode, toggleColorMode } = useColorMode()
  // const bg = useColorModeValue('red.500', 'red.200')
 // const color = useColorModeValue('white', 'gray.800')
//  const detail = localStorage.getItem('company')
 const [company, setCompany] = useState({});

 const fetchCompany = async () => {
  try {
    const accessToken = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.get(companyDetails(1), { headers });
    const { data } = response;
    localStorage.setItem('company',JSON.stringify(response.data))
    setCompany(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
useEffect(() => {
  fetchCompany()
},[])

  return (
    <Box className="header">
    {/* <Box className="header" bg={bg} color={color}> */}
      <Image
        src={'file://' + `${company.logo}`}
        alt={company.company_name ? company.company_name : 'Hospital'}
      />
      {/* <Button onClick={toggleColorMode} >Toggle</Button> */}
    </Box>
  );
}

export default Header;