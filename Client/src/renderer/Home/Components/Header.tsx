import { Box, Image } from '@chakra-ui/react';
import { useCompany } from '../../Company/CompanyContext';

function Header() {
  const { company } = useCompany();
  return (
    <Box className="header">
      <Image
        src={company.logo}
        alt={company.company_name ? company.company_name : 'Hospital'}
      />
    </Box>
  );
}

export default Header;
