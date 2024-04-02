// // /* eslint-disable jsx-a11y/media-has-caption */
// // /* eslint-disable jsx-a11y/no-static-element-interactions */
// // /* eslint-disable jsx-a11y/click-events-have-key-events */
// // import { Box, Button, Heading, Text } from '@chakra-ui/react';
// // import axios from 'axios';
// // import { useEffect, useState } from 'react';
// // import { useNavigate, useParams } from 'react-router-dom';

// // //      MEDIA CONTROLLERS IMPORT
// // import {
// //   getImageListBySurgery,
// //   getVedioListBySurgery,
// //   surgeryDetails,
// // } from '../../Config/api';
// // import EditSurgery from '../Components/EditSurgery';
// // import Snapshots from '../Gallery/Snapshots';
// // import MultiView from '../Gallery/MultiView';
// // import useAuth from '../../User/Components/useAuth';

// // function SurgeryDetails() {
// //   const { auth } = useAuth();
// //   const [vedios, setVedios] = useState([]);
// //   const [multi, setMulti] = useState(false);
// //   const { id } = useParams();
// //   const data = id && id.includes(',') ? id.split(',') : [id];
// //   const [surgeryId, patientId] = data;
// //   const [surgery, setSurgery] = useState([]);
// //   const [sid, setSid] = useState(null);
// //   const accessToken = localStorage.getItem('token');
// //   const headers = {
// //     'Content-Type': 'application/json',
// //     Authorization: `Bearer ${accessToken}`,
// //   };
// //   const getSurgery = async () => {
// //     try {
// //       const { data } = await axios.get(surgeryDetails(surgeryId), {
// //         headers,
// //       });
// //       setSurgery(data);
// //       setSid(data.surgery_id);
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };
// //   useEffect(() => {
// //     getSurgery();
// //   }, []);

// //   // snaps start
// //   const [snaps, setSnaps] = useState([]);
// //   const getSnaps = async () => {
// //     try {
// //       if (sid) {
// //         const response = await axios.get(getImageListBySurgery(sid), {
// //           headers,
// //         });

// //         if (response.data) {
// //           setSnaps(response.data);
// //         } else {
// //           console.log('API response does not contain data.');
// //         }
// //       }
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };
// //   useEffect(() => {
// //     getSnaps();
// //   }, [sid]);
// //   // snaps end

// //   // vedios start
// //   const getVedios = async () => {
// //     try {
// //       if (sid) {
// //         const response = await axios.get(getVedioListBySurgery(sid), {
// //           headers,
// //         });

// //         if (response.data) {
// //           setVedios(response.data);
// //         } else {
// //           console.log('API response does not contain data.');
// //         }
// //       }
// //     } catch (err) {
// //       console.log(err);
// //     }
// //   };
// //   useEffect(() => {
// //     getVedios();
// //   }, [sid]);
// //   // vedios end

// //   const dataRight = [
// //     { label: 'Surgeon Name', value: surgery.surgeon_name },
// //     { label: 'Surgery Type', value: surgery.surgery_type },
// //     {
// //       label: 'Body Part',
// //       value: surgery.body_part,
// //     },
// //     {
// //       label: 'Date',
// //       value: surgery.surgery_date,
// //     },
// //   ];
// //   const dataLeft = [
// //     { label: 'Additional Surgeon', value: surgery.additional_surgeon },
// //     { label: 'Anesthesiologist', value: surgery.anesthesiologist },
// //     {
// //       label: 'Surgical History Details',
// //       value: surgery.surgery_history_details,
// //     },
// //     {
// //       label: 'Operation Theatre Number',
// //       value: surgery.operation_theatre_number,
// //     },
// //   ];

// //   const navigate = useNavigate();
// //   const handleStart = () => {
// //     navigate(`/recording/${[sid, patientId]}`);
// //   };
// //   const vedioName = (vedioPath) => {
// //     return vedioPath.split('/').pop().replace('.mp4', '');
// //   }
// //   return (
// //     <Box className="surgery-details">
// //       {/*  GO BACK BUTTON START */}
// //       <span className="back">
// //         <Button
// //           size="sm"
// //           background="#003975"
// //           _hover={{ background: '#0350a4' }}
// //           onClick={() => navigate(-1)}
// //           color="white"
// //         >
// //           Go Back
// //         </Button>
// //       </span>
// //       {/*  GO BACK BUTTON END */}
// //       {/* SURGERY DETAILS START */}
// //       <Heading textAlign="center" fontSize="3rem" color="red">
// //         Surgery Details
// //       </Heading>
// //       <Box
// //         display="flex"
// //         alignItems="center"
// //         justifyContent="space-around"
// //         fontSize="1.2rem"
// //       >
// //         <Box height="100%">
// //           {dataRight.map((item, i) => (
// //             <Box key={i} style={{ display: 'flex', gap: '1rem' }}>
// //               <Text fontWeight="bold">{item.label} :</Text>
// //               <Text color="#003975">{item.value}</Text>
// //             </Box>
// //           ))}
// //         </Box>
// //         <Box height="100%">
// //           {dataLeft.map((item, i) => (
// //             <Box key={i} style={{ display: 'flex', gap: '1rem' }}>
// //               <Text fontWeight="bold">{item.label} :</Text>
// //               <Text color="#003975">{item.value}</Text>
// //             </Box>
// //           ))}
// //         </Box>
// //       </Box>
// //       {/* SURGERY DETAILS END */}

// //       {/* START RECORDING AND EDIT SURGERY BUTTON START */}
// //       <Box
// //         display="flex"
// //         alignItems="center"
// //         justifyContent="space-around"
// //         width="50%"
// //         alignSelf="center"
// //       >
// //         <EditSurgery Surgery={surgery} getSurgery={getSurgery} />

// //         <Button
// //           color="white"
// //           background="#D81924"
// //           _hover={{ background: 'red' }}
// //           width="20%"
// //           alignSelf="center"
// //           onClick={() => navigate(`/receipt/${[surgeryId, patientId]}`)}
// //           id="recordButton"
// //         >
// //           Generate Report
// //         </Button>
// //         <Button
// //           color="white"
// //           background="#D81924"
// //           _hover={{ background: 'red' }}
// //           width="20%"
// //           alignSelf="center"
// //           onClick={handleStart}
// //           id="recordButton"
// //         >
// //           Start Recording
// //         </Button>
// //       </Box>
// //       {/* START RECORDING AND EDIT SURGERY END */}

// //       {/* GALLERY START */}
// //       <Heading textAlign="center" fontSize="3rem" color="red">
// //         Recordings
// //       </Heading>
// //       <Box className="container">
// //         <Box className="video">
// //           <Heading>Video:</Heading>
// //           {/*   RECORDING VEDIOS START */}
// //           <Box className="media-container">
// //             {vedios.map((vedio, i) => (
// //               <Box key={i}>
// //                 <Box
// //                   className="media"
// //                   onClick={() =>
// //                     navigate(
// //                       `/vedios/${vedio.video_id}?video_file=file:${vedio.video_file}&surgery_id=${sid}&patient_id=${patientId}`
// //                     )
// //                   }
// //                   position="relative"

// //                 >
// //                   <video src={'file://' + `${vedio.video_file}`} />
// //                   <Text background="red" borderTopLeftRadius="0.5rem" width="2rem" textAlign="center" fontSize="1.5rem" color="white" position="absolute" top="0">{vedio.video_id}</Text>
// //                   {/* {console.log(vedio)} */}
// //                 </Box>
// //                 <Text width="100%" borderBottomLeftRadius="0.5rem" borderBottomRightRadius="0.5rem" background="#0350a4" color="white" textAlign="center" className="vedio-name" fontSize="1.5rem">{vedioName(vedio.video_file)}</Text>
// //               </Box>
// //             ))}
// //           </Box>
// //           {/*   RECORDING VEDIOS END */}
// //         </Box>

// //         {/* SCREENSHOTS  START */}
// //         <Snapshots snaps={snaps} setMulti={setMulti} />
// //         {/* SCREENSHOTS END */}

// //         {/* MULTIVIEW START */}
// //         <MultiView
// //           multi={multi}
// //           setMulti={setMulti}
// //           snaps={snaps}
// //           patientId={patientId}
// //           surgeryId={surgeryId}
// //           getSnaps={getSnaps}
// //         />
// //         {/* MULTIVIEW END */}
// //       </Box>
// //       {/* GALLERY END */}
// //     </Box>
// //   );
// // }

// // export default SurgeryDetails;


// /* eslint-disable jsx-a11y/media-has-caption */
// /* eslint-disable jsx-a11y/no-static-element-interactions */
// /* eslint-disable jsx-a11y/click-events-have-key-events */
// import { Box, Button, Heading, Text } from '@chakra-ui/react';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';

// //      MEDIA CONTROLLERS IMPORT
// import {
//   getImageListBySurgery,
//   getVedioListBySurgery,
//   surgeryDetails,
// } from '../../Config/api';
// import EditSurgery from '../Components/EditSurgery';
// import Snapshots from '../Gallery/Snapshots';
// import MultiView from '../Gallery/MultiView';
// import useAuth from '../../User/Components/useAuth';

// function SurgeryDetails() {
//   const { auth } = useAuth();
//   const [vedios, setVedios] = useState([]);
//   const [multi, setMulti] = useState(false);
//   const { id } = useParams();
//   const data = id && id.includes(',') ? id.split(',') : [id];
//   const [surgeryId, patientId] = data;
//   const [surgery, setSurgery] = useState([]);
//   const [sid, setSid] = useState(null);
//   const accessToken = localStorage.getItem('token');
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${accessToken}`,
//   };
//   const getSurgery = async () => {
//     try {
//       const { data } = await axios.get(surgeryDetails(surgeryId), {
//         headers,
//       });
//       setSurgery(data);
//       setSid(data.surgery_id);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   useEffect(() => {
//     getSurgery();
//   }, []);

//   // snaps start
//   const [snaps, setSnaps] = useState([]);
//   const getSnaps = async () => {
//     try {
//       if (sid) {
//         const response = await axios.get(getImageListBySurgery(sid), {
//           headers,
//         });

//         if (response.data) {
//           setSnaps(response.data);
//         } else {
//           console.log('API response does not contain data.');
//         }
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   useEffect(() => {
//     getSnaps();
//   }, [sid]);
//   // snaps end

//   // vedios start
//   const getVedios = async () => {
//     try {
//       if (sid) {
//         const response = await axios.get(getVedioListBySurgery(sid), {
//           headers,
//         });

//         if (response.data) {
//           setVedios(response.data);
//         } else {
//           console.log('API response does not contain data.');
//         }
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   useEffect(() => {
//     getVedios();
//   }, [sid]);
//   // vedios end

//   const dataRight = [
//     { label: 'Surgeon Name', value: surgery.surgeon_name },
//     { label: 'Surgery Type', value: surgery.surgery_type },
//     {
//       label: 'Body Part',
//       value: surgery.body_part,
//     },
//     {
//       label: 'Date',
//       value: surgery.surgery_date,
//     },
//   ];
//   const dataLeft = [
//     { label: 'Additional Surgeon', value: surgery.additional_surgeon },
//     { label: 'Anesthesiologist', value: surgery.anesthesiologist },
//     {
//       label: 'Surgical History Details',
//       value: surgery.surgery_history_details,
//     },
//     {
//       label: 'Operation Theatre Number',
//       value: surgery.operation_theatre_number,
//     },
//   ];

//   const navigate = useNavigate();
//   const handleStart = () => {
//     navigate(`/recording/${[sid, patientId]}`);
//   };
//   const vedioName = (vedioPath) => {
//     return vedioPath.split('/').pop().replace('.webm', '');
//   }
//   return (
//     <Box className="surgery-details">
//       {/*  GO BACK BUTTON START */}
//       <span className="back">
//         <Button
//           size="sm"
//           background="#003975"
//           _hover={{ background: '#0350a4' }}
//           onClick={() => navigate(-1)}
//           color="white"
//         >
//           Go Back
//         </Button>
//       </span>
//       {/*  GO BACK BUTTON END */}
//       {/* SURGERY DETAILS START */}
//       <Heading textAlign="center" fontSize="3rem" color="red">
//         Surgery Details
//       </Heading>
//       <Box
//         display="flex"
//         alignItems="center"
//         justifyContent="space-around"
//         fontSize="1.2rem"
//       >
//         <Box height="100%">
//           {dataRight.map((item, i) => (
//             <Box key={i} style={{ display: 'flex', gap: '1rem' }}>
//               <Text fontWeight="bold">{item.label} :</Text>
//               <Text color="#003975">{item.value}</Text>
//             </Box>
//           ))}
//         </Box>
//         <Box height="100%">
//           {dataLeft.map((item, i) => (
//             <Box key={i} style={{ display: 'flex', gap: '1rem' }}>
//               <Text fontWeight="bold">{item.label} :</Text>
//               <Text color="#003975">{item.value}</Text>
//             </Box>
//           ))}
//         </Box>
//       </Box>
//       {/* SURGERY DETAILS END */}

//       {/* START RECORDING AND EDIT SURGERY BUTTON START */}
//       <Box
//         display="flex"
//         alignItems="center"
//         justifyContent="space-around"
//         width="50%"
//         alignSelf="center"
//       >
//         <EditSurgery Surgery={surgery} getSurgery={getSurgery} />

//         <Button
//           color="white"
//           background="#D81924"
//           _hover={{ background: 'red' }}
//           width="20%"
//           alignSelf="center"
//           onClick={() => navigate(`/receipt/${[surgeryId, patientId]}`)}
//           id="recordButton"
//         >
//           Generate Report
//         </Button>
//         <Button
//           color="white"
//           background="#D81924"
//           _hover={{ background: 'red' }}
//           width="20%"
//           alignSelf="center"
//           onClick={handleStart}
//           id="recordButton"
//         >
//           Start Recording
//         </Button>
//       </Box>
//       {/* START RECORDING AND EDIT SURGERY END */}

//       {/* GALLERY START */}
//       <Heading textAlign="center" fontSize="3rem" color="red">
//         Recordings
//       </Heading>
//       <Box className="container">
//         <Box className="video">
//           <Heading>Video:</Heading>
//           {/*   RECORDING VEDIOS START */}
//           <Box className="media-container">
//             {vedios.map((vedio, i) => (
//               <Box key={i}>
//                 <Box
//                   className="media"
//                   onClick={() =>
//                     navigate(
//                       `/vedios/${vedio.video_id}?video_file=file:${vedio.video_file}&surgery_id=${sid}&patient_id=${patientId}`
//                     )
//                   }
//                   position="relative"
//                 >
//                   <video src={'file://' + `${vedio.video_file}`} />
//                   {/* <Text background="red" borderTopLeftRadius="0.5rem" width="auto" padding="0rem 0.4rem" textAlign="center" fontSize="1.5rem" color="white" position="absolute" top="0">{vedio.video_id}</Text> */}
//                   {/* {console.log(vedio)} */}
//                 </Box>
//                 <Text width="100%" borderBottomLeftRadius="0.5rem" borderBottomRightRadius="0.5rem" background="#0350a4" color="white" textAlign="center" className="vedio-name" fontSize="1.5rem">
//                   {vedio.video_id} || {vedioName(vedio.video_file)}
//                 </Text>
//               </Box>
//             ))}
//           </Box>
//           {/*   RECORDING VEDIOS END */}
//         </Box>

//         {/* SCREENSHOTS  START */}
//         <Snapshots snaps={snaps} setMulti={setMulti} />
//         {/* SCREENSHOTS END */}

//         {/* MULTIVIEW START */}
//         <MultiView
//           multi={multi}
//           setMulti={setMulti}
//           snaps={snaps}
//           patientId={patientId}
//           surgeryId={surgeryId}
//           getSnaps={getSnaps}
//         />
//         {/* MULTIVIEW END */}
//       </Box>
//       {/* GALLERY END */}
//     </Box>
//   );
// }

// export default SurgeryDetails;



/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

//      MEDIA CONTROLLERS IMPORT
import {
  getImageListBySurgery,
  getVedioListBySurgery,
  surgeryDetails,
} from '../../Config/api';
import EditSurgery from '../Components/EditSurgery';
import Snapshots from '../Gallery/Snapshots';
import MultiView from '../Gallery/MultiView';
import useAuth from '../../User/Components/useAuth';

function SurgeryDetails() {
  const { auth } = useAuth();
  const [vedios, setVedios] = useState([]);
  const [multi, setMulti] = useState(false);
  const { id } = useParams();
  const data = id && id.includes(',') ? id.split(',') : [id];
  const [surgeryId, patientId] = data;
  const [surgery, setSurgery] = useState([]);
  const [sid, setSid] = useState(null);
  const accessToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const getSurgery = async () => {
    try {
      const { data } = await axios.get(surgeryDetails(surgeryId), {
        headers,
      });
      setSurgery(data);
      setSid(data.surgery_id);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getSurgery();
  }, []);

  // snaps start
  const [snaps, setSnaps] = useState([]);
  const getSnaps = async () => {
    try {
      if (sid) {
        const response = await axios.get(getImageListBySurgery(sid), {
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
  useEffect(() => {
    getSnaps();
  }, [sid]);
  // snaps end

  // vedios start
  const getVedios = async () => {
    try {
      if (sid) {
        const response = await axios.get(getVedioListBySurgery(sid), {
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
  useEffect(() => {
    getVedios();
  }, [sid]);
  // vedios end

  const dataRight = [
    { label: 'Surgeon Name', value: surgery.surgeon_name },
    { label: 'Surgery Type', value: surgery.surgery_type },
    {
      label: 'Body Part',
      value: surgery.body_part,
    },
    {
      label: 'Date',
      value: surgery.surgery_date,
    },
  ];
  const dataLeft = [
    { label: 'Additional Surgeon', value: surgery.additional_surgeon },
    { label: 'Anesthesiologist', value: surgery.anesthesiologist },
    {
      label: 'Surgical History Details',
      value: surgery.surgery_history_details,
    },
    {
      label: 'Operation Theatre Number',
      value: surgery.operation_theatre_number,
    },
  ];

  const navigate = useNavigate();
  const handleStart = () => {
    navigate(`/recording/${[sid, patientId]}`);
  };
  const vedioName = (vedioPath) => {
    return vedioPath.split('/').pop().replace('.webm', '');
  }
  return (
    <Box className="surgery-details">
      {/*  GO BACK BUTTON START */}
      <span className="back">
        <Button
          size="sm"
          background="#003975"
          _hover={{ background: '#0350a4' }}
          onClick={() => navigate(-1)}
          color="white"
        >
          Go Back
        </Button>
      </span>
      {/*  GO BACK BUTTON END */}
      {/* SURGERY DETAILS START */}
      <Heading textAlign="center" fontSize="3rem" color="red">
        Surgery Details
      </Heading>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        fontSize="1.2rem"
      >
        <Box height="100%">
          {dataRight.map((item, i) => (
            <Box key={i} style={{ display: 'flex', gap: '1rem' }}>
              <Text fontWeight="bold">{item.label} :</Text>
              <Text color="#003975">{item.value}</Text>
            </Box>
          ))}
        </Box>
        <Box height="100%">
          {dataLeft.map((item, i) => (
            <Box key={i} style={{ display: 'flex', gap: '1rem' }}>
              <Text fontWeight="bold">{item.label} :</Text>
              <Text color="#003975">{item.value}</Text>
            </Box>
          ))}
        </Box>
      </Box>
      {/* SURGERY DETAILS END */}

      {/* START RECORDING AND EDIT SURGERY BUTTON START */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        width="50%"
        alignSelf="center"
      >
        <EditSurgery Surgery={surgery} getSurgery={getSurgery} />

        <Button
          color="white"
          background="#D81924"
          _hover={{ background: 'red' }}
          width="20%"
          alignSelf="center"
          onClick={() => navigate(`/receipt/${[surgeryId, patientId]}`)}
          id="recordButton"
        >
          Generate Report
        </Button>
        <Button
          color="white"
          background="#D81924"
          _hover={{ background: 'red' }}
          width="20%"
          alignSelf="center"
          onClick={handleStart}
          id="recordButton"
        >
          Start Recording
        </Button>
      </Box>
      {/* START RECORDING AND EDIT SURGERY END */}

      {/* GALLERY START */}
      <Heading textAlign="center" fontSize="3rem" color="red">
        Recordings
      </Heading>
      <Box className="container">
        <Box className="video">
          <Heading>Video:</Heading>
          {/*   RECORDING VEDIOS START */}
          <Box className="media-container">
            {vedios.map((vedio, i) => (
              <Box key={i}>
                <Box
                  className="media"
                  onClick={() =>
                    navigate(
                      `/vedios/${vedio.video_id}?video_file=file:${vedio.video_file}&surgery_id=${sid}&patient_id=${patientId}`
                    )
                  }
                  position="relative"
                >
                  <video src={'file://' + `${vedio.video_file}`} />
                  {/* <Text background="red" borderTopLeftRadius="0.5rem" width="auto" padding="0rem 0.4rem" textAlign="center" fontSize="1.5rem" color="white" position="absolute" top="0">{vedio.video_id}</Text> */}
                  {/* {console.log(vedio)} */}
                </Box>
                <Text width="100%" borderBottomLeftRadius="0.5rem" borderBottomRightRadius="0.5rem" background="#0350a4" color="white" textAlign="center" className="vedio-name" fontSize="1.5rem">
                  {vedio.video_id} || {vedioName(vedio.video_file)}
                </Text>
              </Box>
            ))}
          </Box>
          {/*   RECORDING VEDIOS END */}
        </Box>

        {/* SCREENSHOTS  START */}
        <Snapshots snaps={snaps} setMulti={setMulti} />
        {/* SCREENSHOTS END */}

        {/* MULTIVIEW START */}
        <MultiView
          multi={multi}
          setMulti={setMulti}
          snaps={snaps}
          patientId={patientId}
          surgeryId={surgeryId}
          getSnaps={getSnaps}
        />
        {/* MULTIVIEW END */}
      </Box>
      {/* GALLERY END */}
    </Box>
  );
}

export default SurgeryDetails;
