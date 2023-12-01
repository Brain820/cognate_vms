// /* eslint-disable camelcase */
// /* eslint-disable jsx-a11y/media-has-caption */
// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
//   Text,
//   useDisclosure,
// } from '@chakra-ui/react';
// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { loadPlayer } from 'rtsp-relay/browser';
// import {
//   ZoomOut as ZoomOutIcon,
//   ZoomIn as ZoomInIcon,
//   CameraAlt as CameraAltIcon,
//   AddComment as AddCommentIcon,
//   Forum as ForumIcon,
//   ScreenRotation as ScreenRotationIcon,
//   Pause as PauseIcon,
//   // Cancel as CancelIcon,
//   PlayArrow as PlayArrowIcon,
//   Save as SaveIcon,
// } from '@mui/icons-material';
// import axios from 'axios';
// // import URL from '../../Home/Components/URL';
// import { createWriteStream } from 'fs';
// import { addSurgeryVedio } from '../../Config/api';
// import { useCompany } from '../../Company/CompanyContext';

// function Recording() {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const { company } = useCompany();
//   const { surgeryId } = useParams();
//   const data =
//     surgeryId && surgeryId.includes(',') ? surgeryId.split(',') : [surgeryId];
//   const [srgryId, patientId] = data;
//   const navigate = useNavigate();
//   const canvasRef = useRef(null);
//   const videoRef = useRef(null);
//   // let [localStream, setLocalStream] = useState();
//   const [localStream, setLocalStream] = useState(null);
//   useEffect(() => {
//     if (!canvasRef.current) throw new Error('Ref is null');
//     loadPlayer({
//       url: `${company.video_streaming}`,
//       canvas: canvasRef.current,
//     });
//     if (canvasRef.current && videoRef.current) {
//       const stream = canvasRef.current.captureStream();
//       videoRef.current.srcObject = stream;
//       setLocalStream(stream);
//       // setLocalStream(canvasRef.current.captureStream());
//     }
//   }, [company.video_streaming]);
//   const mediaRecorderRef = useRef(null);
//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//   const day = String(currentDate.getDate()).padStart(2, '0');
//   const hours = String(currentDate.getHours()).padStart(2, '0');
//   const minutes = String(currentDate.getMinutes()).padStart(2, '0');
//   const seconds = String(currentDate.getSeconds()).padStart(2, '0');
//   const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
//   let storage_stream = '';
//   const fs = require('fs').promises;
//   let outputFileName = '';
//   const [isRecording, setIsRecording] = useState(false);
//   while (!localStream) {
//      new Promise((resolve) => setTimeout(resolve, 1000));
//   }
//   async function startRecording() {
//     const makeDirectory = async (path) => {
//       try {
//         await fs.access(path);
//       } catch (error) {
//         await fs.mkdir(path, { recursive: true });
//       }
//     };

//     const directoryPath = `${company.storage_path}\\patient${patientId}\\surgery${srgryId}\\recordings`;
//     await makeDirectory(directoryPath);
//     outputFileName = `${directoryPath}\\${formattedDate}_recording.mp4`;
//     if (!mediaRecorderRef.current) {
//       storage_stream = createWriteStream(outputFileName, {
//         flags: 'a',
//       });
//       try{
//         mediaRecorderRef.current = new MediaRecorder(localStream);

//         mediaRecorderRef.current.ondataavailable = async (event) => {
//           const blob = new Blob([event.data], { type: 'video/mp4' });
//           const fileBuffer = Buffer.from(await blob.arrayBuffer());

//           if (fileBuffer.length > 0) {
//             storage_stream.write(fileBuffer);
//             console.log('Writing data to file...');
//           }
//         };

//         mediaRecorderRef.current.onstart = (event) => {
//           console.log('Recording started');
//         };

//         mediaRecorderRef.current.onstop = (event) => {
//           console.log('Recording stopped');
//           console.log(outputFileName);
//           storage_stream.end();
//           async function handleSaveRecording() {
//             try {
//               await axios.post(
//                 addSurgeryVedio(srgryId),
//                 {
//                   video_file: outputFileName,
//                   surgery: srgryId,
//                   patient: patientId,
//                 },
//                 { headers },
//               );
//             } catch (error) {
//               console.log(error);
//             }
//           }
//           handleSaveRecording();
//         };
//         mediaRecorderRef.current.start(1000);
//       }
//       catch(error){
//         console.log(error);
//       }
//       }
//     console.log(mediaRecorderRef.current.state);
//   }
//   const accessToken = localStorage.getItem('token');
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${accessToken}`,
//   };
//   function stopRecording() {
//     if (
//       mediaRecorderRef.current &&
//       mediaRecorderRef.current.state === 'recording'
//     ) {
//       mediaRecorderRef.current.stop();
//       storage_stream.end();
//     }
//   }

//   useEffect(() => {
//     startRecording();
//   }, [startRecording]);

//   const zoomLevelRef = useRef(100);
//   const handleZoomOut = () => {
//     if (videoRef.current && zoomLevelRef.current > 50) {
//       zoomLevelRef.current -= 10;
//       videoRef.current.style.transform = `scale(${zoomLevelRef.current / 100})`;
//     }
//   };
//   const handleZoomIn = () => {
//     if (videoRef.current) {
//       zoomLevelRef.current += 10;
//       videoRef.current.style.transform = `scale(${zoomLevelRef.current / 100})`;
//     }
//   };
//   const handleClose = () => {
//     stopRecording();
//     navigate(-1);
//   };
//   const [rotationAngle, setRotationAngle] = useState(0);
//   const handleRotateVideo = () => {
//     setRotationAngle((prevDegree) => (prevDegree + 90) % 360);
//   };

//   // const handleCheckRecording = () => {
//   //   if (mediaRecorderRef.current.state) {
//   //     if (mediaRecorderRef.current.state === 'recording') {
//   //       mediaRecorderRef.current.pause();
//   //     } else if (mediaRecorderRef.current.state === 'paused') {
//   //       mediaRecorderRef.current.resume();
//   //     }
//   //   }
//   // };
//   return (
//     <Box className="recording-window" width="100vw" height="100vh">
//       <Box className="recording-container" width="100%" height="95vh">
//         <canvas
//           ref={canvasRef}
//           style={{ width: '0%', height: '0%', visibility: 'hidden' }}
//         />
//         <video
//           ref={videoRef}
//           style={{
//             maxWidth: '100%',
//             maxHeight: '100%',
//             width: '100vw',
//             height: '100%',
//             transform: `rotate(${rotationAngle}deg) scale(${
//               zoomLevelRef.current / 100
//             })`,
//           }}
//           id="vedio"
//           autoPlay
//         />
//       </Box>
//       <Box
//         className="media-controllers"
//         height="5vh"
//         width="100%"
//         background="#286195"
//         display="flex"
//         alignItems="center"
//         justifyContent="space-between"
//         gap="1.5rem"
//       >
//         <Box
//           height="100%"
//           background="#003975"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           gap="1rem"
//           width="40%"
//         >
//           <Box
//             className="zoom"
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             gap="0.5rem"
//           >
//             <Button
//               size="sm"
//               onClick={handleZoomOut}
//               style={{
//                 backgroundColor: zoomLevelRef.current <= 50 ? 'gray' : 'white',
//                 cursor: zoomLevelRef.current <= 50 ? 'not-allowed' : 'pointer',
//               }}
//             >
//               <ZoomOutIcon fontSize="1rem" />
//             </Button>
//             <Text color="white">{zoomLevelRef.current}%</Text>
//             <Button size="sm" onClick={handleZoomIn}>
//               <ZoomInIcon fontSize="1rem" />
//             </Button>
//           </Box>
//           <Modal isOpen={isOpen} onClose={onClose}>
//             <ModalOverlay />
//             <ModalContent>
//               <ModalHeader>Create your account</ModalHeader>
//               <ModalCloseButton />
//               <ModalBody pb={6}>
//                 <FormControl>
//                   <FormLabel>First name</FormLabel>
//                   <Input placeholder="First name" />
//                 </FormControl>
//                 <FormControl mt={4}>
//                   <FormLabel>Last name</FormLabel>
//                   <Input placeholder="Last name" />
//                 </FormControl>
//               </ModalBody>
//               <ModalFooter>
//                 <Button colorScheme="blue" mr={3}>
//                   Save
//                 </Button>
//                 <Button onClick={onClose}>Cancel</Button>
//               </ModalFooter>
//             </ModalContent>
//           </Modal>
//           <Box className="controls_duration" display="flex" gap="1rem">
//             {/* <Button size="sm" onClick={handleCheckRecording}>
//               {mediaRecorderRef.current.state === 'resume' ? (
//                 <PauseIcon fontSize="1rem" />
//               ) : (
//                 <PlayArrowIcon fontSize="1rem" />
//               )}
//             </Button> */}
//             <Box className="duration">
//               <Text fontSize="1rem" color="white">
//                 00:01:15
//               </Text>
//             </Box>
//             <Button size="sm" onClick={handleClose}>
//               <SaveIcon fontSize="1rem" />
//             </Button>
//           </Box>
//           <Button size="sm" className="snap">
//             <CameraAltIcon fontSize="1rem" />
//           </Button>
//           <Button size="sm" className="rotation" onClick={handleRotateVideo}>
//             <ScreenRotationIcon fontSize="1rem" />
//           </Button>
//         </Box>
//         <Box className="comments" display="flex" gap="0.5rem">
//           <Button size="sm" onClick={onOpen}>
//             <AddCommentIcon fontSize="1rem" />
//           </Button>
//           <Button size="sm">
//             <ForumIcon fontSize="1rem" />
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

// export default Recording;

/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/media-has-caption */
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadPlayer } from 'rtsp-relay/browser';
import {
  ZoomOut as ZoomOutIcon,
  ZoomIn as ZoomInIcon,
  CameraAlt as CameraAltIcon,
  AddComment as AddCommentIcon,
  Forum as ForumIcon,
  ScreenRotation as ScreenRotationIcon,
  Pause as PauseIcon,
  // Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
// import URL from '../../Home/Components/URL';
import { createWriteStream } from 'fs';
import { addSurgeryVedio, getCommentOnSurgeryVedio } from '../../Config/api';
import { useCompany } from '../../Company/CompanyContext';

function Recording() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { company } = useCompany();
  const { surgeryId } = useParams();
  const data =
    surgeryId && surgeryId.includes(',') ? surgeryId.split(',') : [surgeryId];
  const [srgryId, patientId] = data;
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  // let [localStream, setLocalStream] = useState();
  const [localStream, setLocalStream] = useState(null);
  useEffect(() => {
    if (!canvasRef.current) throw new Error('Ref is null');
    loadPlayer({
      url: `${company.video_streaming}`,
      canvas: canvasRef.current,
    });
    if (canvasRef.current && videoRef.current) {
      const stream = canvasRef.current.captureStream();
      videoRef.current.srcObject = stream;
      setLocalStream(stream);
      // setLocalStream(canvasRef.current.captureStream());
    }
  }, [company.video_streaming]);

  const mediaRecorderRef = useRef(null);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
  let storage_stream = '';
  const fs = require('fs').promises;
  let outputFileName = '';
  const [isRecording, setIsRecording] = useState(false);
  const [vedioLength, setVedioLength] = useState(0);
  const [viewCommentModal, setViewCommentModal] = useState(false);
  const accessToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const [recordingId, setRecordingId] = useState('');
  async function startRecording() {
    const makeDirectory = async (path) => {
      try {
        await fs.access(path);
      } catch (error) {
        await fs.mkdir(path, { recursive: true });
      }
    };

    const directoryPath = `${company.storage_path}\\patient${patientId}\\surgery${srgryId}\\recordings`;
    await makeDirectory(directoryPath);
    outputFileName = `${directoryPath}\\${formattedDate}_recording.mp4`;
    if (!mediaRecorderRef.current) {
      storage_stream = createWriteStream(outputFileName, {
        flags: 'a',
      });
      try {
        mediaRecorderRef.current = new MediaRecorder(localStream);

        mediaRecorderRef.current.ondataavailable = async (event) => {
          const blob = new Blob([event.data], { type: 'video/mp4' });
          const fileBuffer = Buffer.from(await blob.arrayBuffer());

          if (fileBuffer.length > 0) {
            storage_stream.write(fileBuffer);
            console.log('Writing data to file...');
          }
        };

        mediaRecorderRef.current.onstart = (event) => {
          console.log('Recording started');
          setIsRecording(true);
          async function handleSaveRecording() {
            try {
              const response = await axios.post(
                addSurgeryVedio(srgryId),
                {
                  video_file: outputFileName,
                  surgery: srgryId,
                  patient: patientId,
                },
                { headers },
              );
              setRecordingId(response.data.video_id);
              console.log(response);
            } catch (error) {
              console.log(error);
            }
          }
          handleSaveRecording();
        };

        mediaRecorderRef.current.onstop = (event) => {
          console.log('Recording stopped');
          console.log(outputFileName);
          // storage_stream.end();
          // async function handleSaveRecording() {
          //   try {
          //     await axios.post(
          //       addSurgeryVedio(srgryId),
          //       {
          //         video_file: outputFileName,
          //         surgery: srgryId,
          //         patient: patientId,
          //       },
          //       { headers },
          //     );
          //   } catch (error) {
          //     console.log(error);
          //   }
          // }
          // handleSaveRecording();
        };

        mediaRecorderRef.current.start(1000);
        console.log(mediaRecorderRef.current.state);
      } catch (error) {
        console.log(error);
      }
    }
  }
  const [inputs, setInputs] = useState({
    comment_text: '',
    headline: '',
  });
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleAdd = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/patients/add-comment-on-surgery-video/${recordingId}/`,
        { ...inputs, video: recordingId },
        { headers },
      );
      onClose();
    } catch (err) {
      console.log(err);
    }
  };
  function stopRecording() {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
  }

  useEffect(() => {
    if (!localStream) {
      console.log('Stream is null');
    }
    startRecording();
  }, [startRecording]);

  const zoomLevelRef = useRef(100);
  const [dragStart, setDragStart] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleMouseDown = (e) => {
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e) => {
    if (dragStart) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY,
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  const handleMouseUp = () => {
    setDragStart(null);
  };

  const updateZoomLevel = (newZoomLevel) => {
    const clampedZoomLevel = Math.max(50, Math.min(200, newZoomLevel));
    const roundedZoomLevel = Math.round(clampedZoomLevel);
    setZoomLevel(roundedZoomLevel);
    zoomLevelRef.current = roundedZoomLevel;
  };

  const handleWheel = (e) => {
    const newZoomLevel = zoomLevel + e.deltaY * 0.01;
    updateZoomLevel(newZoomLevel);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      updateZoomLevel(zoomLevel - 10);
    }
  };

  const handleZoomIn = () => {
    updateZoomLevel(zoomLevel + 10);
  };
  const handleClose = () => {
    stopRecording();
    navigate(-1);
  };
  const [rotationAngle, setRotationAngle] = useState(0);
  const handleRotateVideo = () => {
    setRotationAngle((prevDegree) => (prevDegree + 90) % 360);
  };

  const handleCheckRecording = () => {
    if (mediaRecorderRef.current.state) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
        setIsRecording(false);
      } else if (mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
        setIsRecording(true);
      }
    }
  };
  const toast = useToast();
  const [isScreenshotTaken, setIsScreenshotTaken] = useState(false);
  const handleTakeScreenshot = async () => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png');
      try {
        const makeDirectory = async (path) => {
          try {
            await fs.access(path);
          } catch (error) {
            await fs.mkdir(path, { recursive: true });
          }
        };

        const directoryPath = `${company.storage_path}\\patient${patientId}\\surgery${srgryId}\\snapshots`;
        await makeDirectory(directoryPath);

        const newImagePath = `${directoryPath}\\${formattedDate}_screenshot.png`;
        const imageBuffer = Buffer.from(imageDataUrl.split(',')[1], 'base64');
        await fs.writeFile(newImagePath, imageBuffer);

        const response = await axios.post(
          `http://127.0.0.1:8000/api/patients/add-surgery-image/${srgryId}/`,
          { image_file: newImagePath, surgery: srgryId, patient: patientId },
          { headers },
        );
        console.log(
          'Screenshot',
          response.status === 200 ? 'uploaded successfully' : 'upload error',
        );
        console.log('Saved locally:', newImagePath);
        setIsScreenshotTaken(true);
        toast({
          title: 'Screenshot taken',
          description: 'Screenshot saved successfully',
          status: 'success',
          duration: 1000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error saving or uploading screenshot:', error.message);
      }
    }
  };
  const [comments, setComments] = useState([]);
  const handleCloseViewCommentModal = () => {
    setViewCommentModal(false);
  };
  useEffect(() => {
    const getComments = async () => {
      try {
        if (recordingId) {
          const response = await axios.get(
            getCommentOnSurgeryVedio(recordingId),
            {
              headers,
            },
          );

          if (response.data) {
            setComments(response.data);
          } else {
            console.log('API response does not contain data.');
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getComments();
  }, [comments, recordingId]);
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/patients/delete-comment-on-surgery-video/${commentId}`,
        { headers },
      );

      if (response.status === 200) {
        console.log('Comment deleted successfully');
      } else {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.comment_id !== commentId),
        );
      }
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };
  return (
    <Box className="recording-window" width="100vw" height="100vh">
      <Box
        className="recording-container"
        // width="100%"
        // height="95vh"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          style={{ width: '0%', height: '0%', visibility: 'hidden' }}
        />
        <video
          ref={videoRef}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: '100vw',
            height: '100%',
            // transform: `rotate(${rotationAngle}deg) scale(${
            //   zoomLevelRef.current / 100
            // })`,
            transform: `translate(${position.x}px, ${position.y}px) scale(${
              zoomLevel / 100
            }) rotate(${rotationAngle}deg) scale(${zoomLevel / 100})`,
          }}
          id="vedio"
          autoPlay
        />
      </Box>
      <Box
        className="media-controllers"
        height="5vh"
        width="100%"
        background="#286195"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="1.5rem"
      >
        <Box width="10%" />
        <Box
          height="100%"
          background="#003975"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="1rem"
          width="40%"
        >
          <Box
            className="zoom"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="0.5rem"
          >
            <Button
              size="sm"
              onClick={handleZoomOut}
              style={{
                backgroundColor: zoomLevelRef.current <= 50 ? 'gray' : 'white',
                cursor: zoomLevelRef.current <= 50 ? 'not-allowed' : 'pointer',
              }}
            >
              <ZoomOutIcon fontSize="1rem" />
            </Button>
            <Text color="white">{zoomLevelRef.current}%</Text>
            <Button size="sm" onClick={handleZoomIn}>
              <ZoomInIcon fontSize="1rem" />
            </Button>
          </Box>
          <Modal isOpen={isOpen} onClose={onClose} motionPreset="scale">
            <ModalOverlay />
            <ModalContent
              maxHeight="45rem"
              style={{
                position: 'fixed',
                right: 0,
                bottom: '0rem',
                height: '100%',
              }}
            >
              <ModalHeader>Add Your Comment</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={4}>
                <FormControl>
                  <FormLabel>Heading</FormLabel>
                  <Input
                    placeholder="Heading"
                    name="headline"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Comment</FormLabel>
                  <Textarea
                    placeholder="Comment"
                    name="comment_text"
                    onChange={handleChange}
                    resize="vertical"
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleAdd}>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Modal
            isOpen={viewCommentModal}
            onClose={handleCloseViewCommentModal}
          >
            <ModalOverlay />
            <ModalContent
              maxHeight="45rem"
              style={{
                position: 'fixed',
                right: 0,
                bottom: '0rem',
                height: '100%',
              }}
            >
              <ModalHeader>Comments on this Vedio</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6} overflow="auto" scrollBehavior="smooth">
                {comments.map((comment, i) =>
                  comment ? (
                    <Box
                      border="1px solid black"
                      background="cyan.50"
                      borderRadius="0.5rem"
                      padding="1rem"
                      marginBottom="1rem"
                      key={i}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      transition="transform 0.5s ease"
                    >
                      <Box>
                        <Heading as="h5" size="sm">
                          {comment.headline}
                        </Heading>
                        <Text>{comment.comment_text}</Text>
                        {/* {console.log(comment.comment_id)}; */}
                      </Box>
                      <Box display="flex" position="absolute" right="0" top="0">
                        <Button
                          background="none"
                          _hover={{ background: 'none' }}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          onClick={() =>
                            handleDeleteComment(comment.comment_id)
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Text>No comments yet</Text>
                  ),
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
          <Box className="controls_duration" display="flex" gap="1rem">
            <Button size="sm" onClick={handleCheckRecording}>
              {isRecording === true ? (
                <PauseIcon fontSize="1rem" />
              ) : (
                <PlayArrowIcon fontSize="1rem" />
              )}
            </Button>
            <Box className="duration" height="100%">
              <Text
                fontSize="1rem"
                color="white"
                background="black"
                minWidth="5rem"
                width="auto"
                height="4vh"
                textAlign="center"
              >
                {vedioLength}
              </Text>
            </Box>
            <Button size="sm" onClick={handleClose}>
              <SaveIcon fontSize="1rem" />
            </Button>
          </Box>
          <Button size="sm" className="snap" onClick={handleTakeScreenshot}>
            <CameraAltIcon fontSize="1rem" />
          </Button>
          <Button size="sm" className="rotation" onClick={handleRotateVideo}>
            <ScreenRotationIcon fontSize="1rem" />
          </Button>
        </Box>
        <Box className="comments" display="flex" gap="0.5rem">
          <Button size="sm" onClick={onOpen}>
            <AddCommentIcon fontSize="1rem" />
          </Button>
          <Button
            size="sm"
            onClick={() => setViewCommentModal(!viewCommentModal)}
          >
            <ForumIcon fontSize="1rem" />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Recording;
