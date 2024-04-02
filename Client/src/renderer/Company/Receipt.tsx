/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import { Box, Button, Center, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { useCompany } from './CompanyContext';
import VideoThumbnail from 'react-video-thumbnail'
import {
  getCommentOnSurgeryImage,
  getCommentOnSurgeryVedio,
  getImageListBySurgery,
  getVedioListBySurgery,
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
      } catch (err) {
        console.log(err);
      }
    };
    getSurgery();
  }, []);
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
  }, []);
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
  }, []);
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



  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const [vedios, setVedios] = useState([]);
  useEffect(() => {
    const getVedios = async () => {
      try {
        if (surgeryId) {
          const response = await axios.get(getVedioListBySurgery(surgeryId), {
            headers,
          });
          if (response.data) {
            setVedios(response.data);
          } else {
            console.log('API response does not contain data.');
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getVedios();
  }, []);
  const [comments, setComments] = useState({});
  const [vedioComments, setVedioComments] = useState({});

  useEffect(() => {
    const getSnapsComments = async (mediaId) => {
      try {
        const snapsComments = await axios.get(
          getCommentOnSurgeryImage(mediaId),
          {
            headers,
          },
        );
        if (snapsComments.data) {
          setComments((prevComments) => ({
            ...prevComments,
            [mediaId]: snapsComments.data,
          }));
        } else {
          console.log('API response does not contain data.');
        }
      } catch (err) {
        console.log(err);
      }
    };
    const getVedioComments = async (mediaId) => {
      try {
        const vediosComments = await axios.get(
          getCommentOnSurgeryVedio(mediaId),
          {
            headers,
          },
        );
        if (vediosComments.data) {
          setVedioComments((prevComments) => ({
            ...prevComments,
            [mediaId]: vediosComments.data,
          }));
        } else {
          console.log('API response does not contain data.');
        }
      } catch (err) {
        console.log(err);
      }
    };
    vedios.forEach((vedio) => {
      getVedioComments(vedio.video_id);
    });
    snaps.forEach((snap) => {
      getSnapsComments(snap.image_id);
    });
  }, [vedios, snaps]);
  const canvasRef = useRef(null);
  const handleSaveAsPdf = () => {
    const content = document.getElementById('pdf-content');
    const pdfOptions = {
      margin: 10,
      filename: 'receipt.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 1,
        dpi: 192,
        letterRendering: true,
        useCORS: true,
        width: content.offsetWidth,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      html2pdf: {
        pagebreak: { mode: 'css' },
        jsPDF: { format: 'a4' },
      },
    };

    html2pdf().from(content).set(pdfOptions).save();
  };

  const companyData = localStorage.getItem('company');
  let logo = JSON.parse(companyData);
  logo = logo.logo;

  return (
    <Box>
      <Box
        maxWidth="1180px"
        width="1180px"
        margin="0 auto"
        border="1px solid grey"
        id="pdf-content"
      >
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          borderBottom="2px solid red"
          padding="2rem 1rem"
        >
          <Box
            width="15%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              src={logo ? 'file://' + `${logo}` : 'Logo'}
              // src={company.logo ? 'file://' + `${company.logo}` : 'Logo'}
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
            <Box display="flex" gap="1rem" width="100%">
              <Text
                fontSize="2rem"
                fontWeight="bold"
                color="black"
                textTransform="uppercase"
              >
                {company.company_name ? company.company_name : 'Company Name'}
              </Text>
            </Box>
            <Box width="100%">
              <Text>
                {company.company_address
                  ? company.company_address + ", " + company.district + ", " + company.state + ", " + company.pin
                  : 'Company Address Here'}
              </Text>
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
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
            top="50%"
            left="35%"
            transform="translate(-10%, -10%) rotate(-45deg)"
            zIndex="1"
            width="auto"
            height="20rem"
            opacity={0.2}
          >
            {/* Watermark Image */}
            <Image
              src={'file://' + `${company.watermarked_logo}`}
              alt="Watermark"
              width="100%"
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
            <Center background="lavenderblush">
              <Flex
                direction={{ base: 'column', md: 'row' }}
                alignItems="center"
                justifyContent="center"
                wrap="wrap"
              >
                {[
                  { label: 'First Name', value: patient.first_name },
                  { label: 'Last Name', value: patient.last_name },
                  { label: 'Date of Birth', value: patient.date_of_birth },
                  { label: 'Gender', value: patient.gender },
                  { label: 'Age', value: `${calculateAge(patient.date_of_birth)}` },
                  { label: 'Mobile Number', value: patient.mobile_number },
                  { label: 'Address', value: patient.address },
                  { label: 'Patient Id', value: patient.hospital_patient_id },
                ].map((item, index) => (
                  <Box
                    key={index}
                    width={{ base: '100%', md: '50%' }}
                    display="flex"
                    gap="1rem"
                    padding="0.5rem"
                  >
                    <Text fontWeight="semibold">{item.label}:</Text>
                    <Text>{item.value}</Text>
                  </Box>
                ))}
              </Flex>
            </Center>

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
            <Center background="lavenderblush">
              <Flex
                direction={{ base: 'column', md: 'row' }}
                alignItems="center"
                justifyContent="center"
                wrap="wrap"
              >
                {[
                  { label: 'Surgery Date', value: surgery.surgery_date },
                  { label: 'Surgeon Name', value: surgery.surgeon_name },
                  { label: 'Surgery Type', value: surgery.surgery_type },
                  { label: 'Body Part', value: surgery.body_part },
                  { label: 'Additional Surgeon', value: surgery.additional_surgeon },
                  { label: 'Anesthesiologist', value: surgery.anesthesiologist },
                  { label: 'Surgery History Details', value: surgery.surgery_history_details },
                  { label: 'Operation Theatre Number', value: surgery.operation_theatre_number },
                ].map((item, index) => (
                  <Box
                    key={index}
                    width={{ base: '100%', md: '50%' }}
                    display="flex"
                    gap="1rem"
                    padding="0.5rem"
                  >
                    <Text fontWeight="semibold">{item.label}:</Text>
                    <Text>{item.value}</Text>
                  </Box>
                ))}
              </Flex>
            </Center>
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
                  height="auto"
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                  background="transparent"
                  border="1px solid black"
                  className="large-component"
                  style={{
                    pageBreakInside: 'avoid',
                    pageBreakAfter: 'auto',
                    pageBreakBefore: 'auto',
                  }}
                >
                  <Box minWidth="50%" maxWidth="50%" height="100%">
                    <Image
                      src={'file://' + `${item.image_file}`}
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
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap="16px"
              marginTop="1rem"
            >
              {vedios.map((vedio, i) => (
                <Box
                  key={i}
                  position="relative"
                  overflow="hidden"
                  borderRadius="8px"
                  height="auto"
                  display="flex"
                  justifyContent="space-between"
                  width="100%"
                  background="transparent"
                  border="1px solid black"
                  className="large-component"
                >
                  <Box minWidth="50%" maxWidth="50%" height="100%">
                    {/* <video
                      src={'file://' + `${vedio.video_file}`}
                      alt="Vedio not available"
                      style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '10rem',
                        objectFit: 'fill',
                        borderTopRightRadius: '0',
                        borderBottomRightRadius: '0',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    /> */}
                    <VideoThumbnail
                      videoUrl={'file://' + `${vedio.video_file}`}
                      width={2000}
                      height={1500}
                    />
                  </Box>
                  <Box
                    minWidth="50%"
                    maxWidth="50%"
                    height="auto"
                    background="lavenderblush"
                    padding="0.5rem"
                  >
                    {vedioComments[vedio.video_id] &&
                      vedioComments[vedio.video_id].length ? (
                      vedioComments[vedio.video_id].map((comment, index) => (
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
