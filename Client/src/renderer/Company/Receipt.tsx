/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import { Box, Button, Heading, Image, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompany } from './CompanyContext';
import {
  getImageListBySurgery,
  singlePatient,
  surgeryDetails,
} from '../Config/api';

function Receipt() {
  const { patientData } = useParams();
  const [surgery, setSurgery] = useState([]);
  const navigate = useNavigate();
  const data =
    patientData && patientData.includes(',')
      ? patientData.split(',')
      : [patientData];
  const [surgeryId, patientId] = data;
  const accessToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  useEffect(() => {
    const getSurgery = async () => {
      try {
        const { data } = await axios.get(surgeryDetails(surgeryId), {
          headers,
        });
        setSurgery(data);
        // setsurgeryId(data.surgery_id);
      } catch (err) {
        console.log(err);
      }
    };
    getSurgery();
  }, [surgeryId]);
  const [snaps, setSnaps] = useState([]);
  useEffect(() => {
    const getSnaps = async () => {
      try {
        if (surgeryId) {
          const response = await axios.get(getImageListBySurgery(surgeryId), {
            headers,
          });

          if (response.data) {
            setSnaps(response.data);
          } else {
            console.log('API response does not contain data.');
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getSnaps();
  }, [headers, surgeryId, snaps]);
  const [patient, setPatient] = useState([]);
  useEffect(() => {
    const getPatient = async () => {
      try {
        const { data } = await axios.get(singlePatient(patientId), { headers });
        setPatient(data);
      } catch (err) {
        console.log(err);
      }
    };
    getPatient();
  }, [patient, patientId]);
  const { company } = useCompany();
  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }
    return age;
  };
  const handleSaveAsPdf = () => {
    const content = document.getElementById('pdf-content');
    const pdfOptions = {
      margin: 10,
      filename: 'receipt.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(content).set(pdfOptions).outputPdf();
  };
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const getComments = async (imageId) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/patients/get-comment-on-surgery-image/${imageId}/`,
          {
            headers,
          },
        );
        if (response.data) {
          setComments((prevComments) => ({
            ...prevComments,
            [imageId]: response.data,
          }));
        } else {
          console.log('API response does not contain data.');
        }
      } catch (err) {
        console.log(err);
      }
    };
    snaps.forEach((snap) => {
      if (!comments[snap.image_id]) {
        getComments(snap.image_id);
      }
    });
  }, [snaps, comments]);
  return (
    <Box>
      <Box
        maxWidth="1190px"
        width="1190px"
        margin="0 auto"
        border="1px solid grey"
      >
        <Box id="pdf-content">
          <Box
            maxWidth="100vw"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="2px solid red"
            paddingBottom="0.5rem"
            paddingTop="4rem"
          >
            <Box
              width="15%"
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <img
                src={company.logo ? company.logo : 'Logo'}
                alt={company.company_name}
              />
            </Box>

            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="space-between"
              flexDirection="column"
              width="60%"
              height="100%"
              paddingLeft="1rem"
            >
              <Box display="flex" gap="1rem">
                <Text
                  fontSize="2rem"
                  fontWeight="bold"
                  color="black"
                  textTransform="uppercase"
                >
                  {company.company_name ? company.company_name : 'Company Name'}
                </Text>
                {/* <Heading color="red">PATHOLOGY LAB</Heading> */}
              </Box>
              <Box>
                <Text>Accurate | Caring | Instant</Text>
              </Box>
              <Box>
                <Text>
                  {company.company_address
                    ? company.company_address
                    : 'Company Address Here'}
                </Text>
              </Box>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              paddingLeft="2rem"
              alignItems="flex-start"
              width="25%"
            >
              <Box display="flex" gap="1rem">
                <CallIcon style={{ color: 'red' }} />
                <Text fontWeight="semibold">
                  {company.company_mobile_no
                    ? company.company_mobile_no
                    : 'Mobile Number'}
                </Text>
              </Box>
              <Box display="flex" gap="1rem">
                <EmailIcon style={{ color: 'red' }} />
                <Text fontWeight="semibold">
                  {company.company_email
                    ? company.company_email
                    : 'Company Email'}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box padding="4rem 8rem" position="relative">
            <Box
              position="absolute"
              top="3.5%"
              left="44%"
              transform="translate(-10%, -10%) rotate(-45deg)"
              zIndex="1"
              width="auto"
              height="20rem"
              opacity={0.2}
            >
              {/* Watermark Image */}
              <Image
                src={company.watermarked_logo}
                alt="Watermark"
                width="50%"
                height="50%"
              />
            </Box>
            <Box>
              <Heading
                textDecoration="underline"
                textTransform="uppercase"
                fontSize="2rem"
                textAlign="center"
                marginBottom="1rem"
              >
                Patient Details
              </Heading>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="1rem"
                height="10rem"
                gap="1rem"
                background="lavenderblush"
                marginBottom="1rem"
              >
                <Box
                  width="auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  alignSelf="center"
                  flexDirection="column"
                  height="100%"
                  gap="0.5rem"
                >
                  <Text fontWeight="medium" alignSelf="flex-start">
                    First Name :
                  </Text>
                  <Text fontWeight="medium" alignSelf="flex-start">
                    Last Name :
                  </Text>
                  <Text fontWeight="medium" alignSelf="flex-start">
                    Date of Birth :
                  </Text>
                  <Text fontWeight="medium" alignSelf="flex-start">
                    Gender :
                  </Text>
                </Box>

                <Box
                  width="25%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  alignSelf="center"
                  flexDirection="column"
                  height="100%"
                  gap="0.5rem"
                >
                  <Text alignSelf="flex-start">{patient.first_name}</Text>
                  <Text alignSelf="flex-start">{patient.last_name}</Text>
                  <Text alignSelf="flex-start">{patient.date_of_birth}</Text>
                  <Text alignSelf="flex-start">{patient.gender}</Text>
                </Box>

                <Box
                  width="auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  alignSelf="center"
                  flexDirection="column"
                  height="100%"
                  gap="0.5rem"
                >
                  <Text fontWeight="semibold" alignSelf="flex-start">
                    Admitted Date :
                  </Text>
                  <Text fontWeight="semibold" alignSelf="flex-start">
                    Age :
                  </Text>
                  <Text fontWeight="semibold" alignSelf="flex-start">
                    Mobile Number :
                  </Text>
                  <Text fontWeight="semibold" alignSelf="flex-start">
                    Address :
                  </Text>
                </Box>

                <Box
                  width="25%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  alignSelf="center"
                  flexDirection="column"
                  height="100%"
                  gap="0.5rem"
                >
                  <Text alignSelf="flex-start">2022-09-09</Text>
                  <Text alignSelf="flex-start">{`${calculateAge(
                    patient.date_of_birth,
                  )}`}</Text>
                  <Text alignSelf="flex-start">{patient.mobile_number}</Text>
                  <Text alignSelf="flex-start">{patient.address}</Text>
                </Box>
              </Box>
            </Box>
            <Box>
              <Heading
                textDecoration="underline"
                textTransform="uppercase"
                fontSize="2rem"
                textAlign="center"
                marginBottom="1rem"
                marginTop="6rem"
              >
                Surgery Details
              </Heading>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="1rem"
                height="10rem"
                gap="1rem"
                background="lavenderblush"
                marginBottom="1rem"
              >
                <Box
                  width="auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  alignSelf="center"
                  flexDirection="column"
                  height="100%"
                  gap="0.5rem"
                >
                  <Text fontWeight="medium" alignSelf="flex-start">
                    Surgeon Name :
                  </Text>
                  <Text fontWeight="medium" alignSelf="flex-start">
                    Surgery Type :
                  </Text>
                  <Text fontWeight="medium" alignSelf="flex-start">
                    Body Part :
                  </Text>
                </Box>

                <Box
                  width="25%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  alignSelf="center"
                  flexDirection="column"
                  height="100%"
                  gap="0.5rem"
                >
                  <Text alignSelf="flex-start">{surgery.surgeon_name}</Text>
                  <Text alignSelf="flex-start">{surgery.surgery_type}</Text>
                  <Text alignSelf="flex-start">{surgery.body_part}</Text>
                </Box>

                <Box
                  width="auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  alignSelf="center"
                  flexDirection="column"
                  height="100%"
                  gap="0.5rem"
                >
                  <Text fontWeight="medium" alignSelf="flex-start">
                    Additional Surgeon :
                  </Text>
                  <Text fontWeight="medium" alignSelf="flex-start">
                    Anesthesiologist :
                  </Text>
                  <Text fontWeight="medium" alignSelf="flex-start">
                    Surgery History Details :
                  </Text>
                </Box>

                <Box
                  width="25%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  alignSelf="center"
                  flexDirection="column"
                  height="100%"
                  gap="0.5rem"
                >
                  <Text alignSelf="flex-start">
                    {surgery.additional_surgeon}
                  </Text>
                  <Text alignSelf="flex-start">{surgery.anesthesiologist}</Text>
                  <Text alignSelf="flex-start">
                    {surgery.surgery_history_details}
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box>
              <Heading
                textDecoration="underline"
                textTransform="uppercase"
                fontSize="2rem"
                textAlign="center"
                marginBottom="1rem"
                marginTop="6rem"
              >
                Surgery Details
              </Heading>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap="16px"
              >
                {snaps.map((item, i) => (
                  <Box
                    key={i}
                    position="relative"
                    overflow="hidden"
                    borderRadius="8px"
                    // height="15rem"
                    height="auto"
                    display="flex"
                    // alignItems="center"
                    justifyContent="space-between"
                    // gap="2rem"
                    width="100%"
                    background="transparent"
                    border="1px solid black"
                  >
                    <Box minWidth="50%" maxWidth="50%" height="100%">
                      <Image
                        src={item.image_file}
                        alt=""
                        width="100%"
                        height="100%"
                        minHeight="10rem"
                        objectFit="fill"
                        borderTopRightRadius="0"
                        borderBottomRightRadius="0"
                        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
                      />
                    </Box>
                    <Box
                      minWidth="50%"
                      maxWidth="50%"
                      height="auto"
                      background="lavenderblush"
                      padding="0.5rem"
                    >
                      {comments[item.image_id] &&
                      comments[item.image_id].length ? (
                        comments[item.image_id].map((comment, index) => (
                          <Box key={index}>
                            <Box fontWeight="bold">{comment.headline}</Box>
                            <Box>{comment.comment_text}</Box>
                          </Box>
                        ))
                      ) : (
                        <Box color="red" fontSize="2rem" />
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderTop="2px solid red"
            height="4rem"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap="0.5rem"
              padding="1rem"
            >
              <Text>Generated On : </Text>
              <Text>{formattedDate}</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="4rem"
      >
        <Button
          size="sm"
          background="#003975"
          _hover={{ background: '#0350a4' }}
          onClick={handleSaveAsPdf}
          color="white"
        >
          Print
        </Button>
        <Button
          size="sm"
          background="#003975"
          _hover={{ background: '#0350a4' }}
          onClick={() => navigate(-1)}
          color="white"
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

export default Receipt;
