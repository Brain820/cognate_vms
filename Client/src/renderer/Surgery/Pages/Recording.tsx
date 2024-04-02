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
  PlayArrow as PlayArrowIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import fixWebmDuration from "fix-webm-duration";
import { createWriteStream, createReadStream, readFile } from 'fs';
import { addCommentOnSurgeryVedio, addSurgeryImage, addSurgeryVedio, deleteCommentOnSurgeryVedio, editCommentOnSurgeryVedio, getCommentOnSurgeryVedio } from '../../Config/api';
import { useCompany } from '../../Company/CompanyContext';
import { duration } from '@mui/material';
// const streamToBlob = require('stream-to-blob');
import crypto from 'crypto';

import { zoomInApi, zoomInApi_VMS, zoomOutApi, zoomOutApi_VMS } from '../../Config/cameraApi';




function Recording() {

  const path = require('path');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { company } = useCompany();
  const { surgeryId } = useParams();
  const data =
    surgeryId && surgeryId.includes(',') ? surgeryId.split(',') : [surgeryId];
  const [srgryId, patientId] = data;
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const Recording_Time = useRef(0);
  // const [localStream, setLocalStream] = useState(null);
  const [startpausetime, setstartpausetime] = useState(null);
  const [pauseduration, setpauseduration] = useState(0);

  useEffect(() => {
    
    let player: any;
    (async function () {
      player = await loadPlayer({
        url: `ws://localhost:2000/stream/?rtsp_url=` + `${company.video_streaming}`,
        canvas: document.getElementById('video_canvas') as any,
        throttled: true,
        disableGl: true,
        pauseWhenHidden: true,
        disconnectThreshold: 5000,
        onSourceEstablished: () => {
          console.log('Connection established');
          // setLocalStream(canvasRef.current.captureStream());
        }
      });
      player.onDisconnect; () => {
        console.log('Connection lost!');
      }
    })()
    return () => {
      try { player.destroy() }
      catch (error) {
        console.log(error)
      }
    }
  }, []);



  const mediaRecorderRef = useRef(null);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
  const fs = require('fs').promises;
  let outputFileName = '';
  const [isRecording, setIsRecording] = useState(false);
  const [viewCommentModal, setViewCommentModal] = useState(false);
  const accessToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const [recordingId, setRecordingId] = useState('');
  const toast = useToast();
  var startTime: any;
  async function startRecording() {

    const makeDirectory = async (dir_path) => {
      try {
        await fs.access(dir_path);
      } catch (error) {
        await fs.mkdir(dir_path, { recursive: true });
      }
    };

    const directoryPath = path.join(
      `${company.storage_path}`,
      '/patient' + `${patientId}`,
      'surgery' + `${srgryId}`,
      'recordings',
    );
    var storageStream: any;
    var starttime: any;
    await makeDirectory(directoryPath);
    outputFileName = path.join(
      `${directoryPath}`,
      `/${formattedDate}P${patientId}S${srgryId}`,
    );

    if (!mediaRecorderRef.current) {
      storageStream = createWriteStream(outputFileName + '.webm', {
        flags: 'a',
        start: 5
      });
      try {
        mediaRecorderRef.current = new MediaRecorder(canvasRef.current.captureStream());

        videoRef.current.srcObject = canvasRef.current.captureStream();

        mediaRecorderRef.current.ondataavailable = async (event) => {

          const shortBlob = new Blob([event.data], { type: 'video/webm' });
          const shortFileBuffer = Buffer.from(await shortBlob.arrayBuffer());
          if (shortFileBuffer.length > 0) {
            storageStream.write(shortFileBuffer);
            console.log('Writing data to file...');
            // Recording_Time.current += 1;
          }

        };

        mediaRecorderRef.current.onstart = (event) => {
          console.log('Recording started');
          starttime = Date.now()
          setIsRecording(true);
          async function handleSaveRecording() {
            try {
              const response = await axios.post(
                addSurgeryVedio(srgryId),
                {
                  video_file: outputFileName + '.webm',
                  surgery: srgryId,
                  patient: patientId,
                },
                { headers },
              );
              setRecordingId(response.data.video_id);
            } catch (error) {
              console.log(error);
            }
          }
          handleSaveRecording();
        };

        mediaRecorderRef.current.onstop = (event) => {
          console.log(storageStream)
          // storageStream.close()

          readFile(outputFileName + '.webm', function (err, data) {
            // Display the file content
            // console.log(data);
            const uint8Array = new Uint8Array(data);
            // Create Blob from Uint8Array
            console.log(pauseduration);
            let video_duration = Date.now() - starttime - pauseduration;
            // let video_duration=Recording_Time.current*1015 ;
            console.log("video)duration", video_duration)
            const blob = new Blob([uint8Array], { type: 'video/webm' });
            // console.log('################Blob:', blob.size);
            fixWebmDuration(blob, video_duration, { logger: false }).then(async function (fixed_recorded_video) {
              const recorded_fileBuffer = Buffer.from(await fixed_recorded_video.arrayBuffer());
              console.log("####################", fixed_recorded_video.size);
              const resaved_video = createWriteStream(outputFileName + '.webm', { flags: 'w' });
              resaved_video.write(recorded_fileBuffer)
              console.log("working")
            });
          });

          console.log('Recording stopped');
        };

        mediaRecorderRef.current.start(10000);
        // mediaRecorderRef.current.start(1000);
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
        addCommentOnSurgeryVedio(recordingId),
        { ...inputs, video: recordingId },
        { headers },
      );
      toast({
        title: 'Comment Added',
        status: 'success',
        isClosable: true,
        position: 'top',
        duration: 3000,
      })
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
  startRecording();
  useEffect(() => {
    const updateTimer = () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === 'recording'
      ) {
        Recording_Time.current += 1;
        // You can perform additional actions here with the updated timer value
        console.log(`Elapsed Time: ${Recording_Time.current} seconds`);
      };
    };

    const intervalId = setInterval(updateTimer, 1000);

    // Cleanup: Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

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


  const zoomInbody1 = {
    "Ch": 1,
    "Data": {
      "Cmd": 11,
      "IsStop": 0,
      "Speed": company.camera_zoom_speed
    },
    "Dev": 1,
    "Type": 1

  }

  const zoomInbody2 = {
    "Ch": 1,
    "Data": {
      "Cmd": 11,
      "IsStop": 1,
      "Speed": company.camera_zoom_speed
    },
    "Dev": 1,
    "Type": 1
  }
  const zoomOutbody1 = {
    "Ch": 1,
    "Data": {
      "Cmd": 12,
      "IsStop": 0,
      "Speed": company.camera_zoom_speed
    },
    "Dev": 1,
    "Type": 1

  }

  const zoomOutbody2 = {
    "Ch": 1,
    "Data": {
      "Cmd": 12,
      "IsStop": 1,
      "Speed": company.camera_zoom_speed
    },
    "Dev": 1,
    "Type": 1
  }
  
  const cameraIp = company.camera_ip;
  const userId = company.user;
  const password = company.password;
  const camera_zoom_speed=company.camera_zoom_speed

  const handleZoomIn = () => {
    if(company.camera_type === 'digest Auth Camera'){
      zoomInApi(zoomInbody1,zoomInbody2,cameraIp,userId,password);
    }
    if(company.camera_type === 'Basic Auth Camera'){
      zoomInApi_VMS(cameraIp,userId,password,);
    }
    // updateZoomLevel(zoomLevel + 10);
  };
  
  const handleZoomOut = () => {
    if(company.camera_type === 'digest Auth Camera'){
      zoomOutApi(zoomOutbody1,zoomOutbody2,cameraIp,userId,password);
    }
    if(company.camera_type === 'Basic Auth Camera'){
      zoomOutApi_VMS(cameraIp,userId,password,camera_zoom_speed);
    }
    if (zoomLevel > 50) {
      // updateZoomLevel(zoomLevel - 10);
    }
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
        setstartpausetime(Date.now())
        setIsRecording(false);
      } else if (mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
        setpauseduration(pauseduration + Date.now() - startpausetime)
        setIsRecording(true);
      }
    }
  };

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours} : ${formattedMinutes} : ${formattedSeconds}`;
  }
  const [isScreenshotTaken, setIsScreenshotTaken] = useState(false);
  const handleTakeScreenshot = async () => {
    const videoElement = videoRef.current;
    // const videoElement = canvasRef.current;

    if (videoElement) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png');
      try {
        const makeDirectory = async (path) => {
          try {
            await fs.access(path);
          } catch (error) {
            await fs.mkdir(path, { recursive: true });
          }
        };

        const directoryPath = path.join(
          `${company.storage_path}`,
          '/patient' + `${patientId}`,
          'surgery' + `${srgryId}`,
          'snapshots',
        );
        await makeDirectory(directoryPath);

        const newImagePath = path.join(`${directoryPath}`, `/${formattedDate}P${patientId}S${srgryId}` + '.png');
        const imageBuffer = Buffer.from(imageDataUrl.split(',')[1], 'base64');
        await fs.writeFile(newImagePath, imageBuffer);

        const response = await axios.post(
          addSurgeryImage(srgryId),
          { image_file: newImagePath, surgery: srgryId, patient: patientId },
          { headers },
        );
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
        deleteCommentOnSurgeryVedio(commentId),
        { headers },
      );

      if (response.status === 200) {
        console.log('Comment deleted successfully');
      } else {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.comment_id !== commentId),
        );
      }
      toast({
        title: 'Comment Deleted',
        status: 'success',
        isClosable: true,
        position: 'top',
        duration: 3000,
      })
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };

  // Edit Comments currently anavailable
  const [commentInputs, setCommentInputs] = useState({
    comment_text: '',
    headline: '',
    video: recordingId,
  });
  const [editingComment, setEditingComment] = useState(null);
  const handleCommentChange = (e) => {
    setCommentInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const handleUpdateComment = async (commentId) => {
    try {
      await axios.put(
        editCommentOnSurgeryVedio(commentId),
        { ...commentInputs },
        { headers },
      );
      toast({
        title: 'Comment Updated Successfully!',
        status: 'success',
        isClosable: true,
        position: 'top',
        duration: 3000,
      });
      setEditingComment(null);
      handleCloseViewCommentModal();
    } catch (err) {
      console.log(err);
    }
  }

let zoomCount=1
  useEffect(() => {
    while(zoomCount<=6){
      zoomOutApi_VMS(cameraIp,userId,password,camera_zoom_speed);
      console.log("zoomCount",zoomCount)
      zoomCount+=1
    }
    
  },[])
  // Edit Comments currently anavailable
  return (
    <Box className="recording-window" width="100vw" height="100vh">
      <Box
        className="recording-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <canvas
          id="video_canvas"
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
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel / 100
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
                <FormControl mb={6}>
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
                      border="1px solid grey"
                      background="facebook.50"
                      borderRadius="0.5rem"
                      padding="1rem"
                      marginBottom="1rem"
                      key={i}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      transition="transform 0.5s ease"
                      position="relative"
                      _hover={{ transform: 'scale(1.03)' }}
                    >
                      <Box>
                        <Heading as="h5" size="sm">
                          {comment.headline}
                        </Heading>
                        <Text>{comment.comment_text}</Text>
                      </Box>
                      <Box display="flex" position="absolute" right="0" top="0">
                        <Button
                          background="none"
                          _hover={{ background: 'none', color: 'blue' }}
                          onClick={() => setEditingComment(comment.comment_id)}
                          isDisabled
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          background="none"
                          _hover={{ background: 'none', color: 'red' }}
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
              {editingComment && (
                <ModalBody scrollBehavior="smooth" border="3px solid red" borderRadius="1rem" width="90%" alignSelf="center" mb={4} >
                  <ModalHeader>Edit Comment </ModalHeader>
                  <FormControl>
                    <FormLabel fontWeight="bold">HEADING</FormLabel>
                    <Input
                      placeholder="Heading"
                      name="headline"
                      value={commentInputs.headline}
                      onChange={handleCommentChange}
                    />
                  </FormControl>
                  <FormControl mt={2}>
                    <FormLabel fontWeight="bold">COMMENT</FormLabel>
                    <Textarea
                      placeholder="Comment"
                      name="comment_text"
                      onChange={handleCommentChange}
                      value={commentInputs.comment_text}
                      resize="vertical"
                    />
                  </FormControl>
                  <ModalFooter mt={2}>
                    <Button colorScheme="blue" mr={3} onClick={() => handleUpdateComment(editingComment)}
                    >
                      Update
                    </Button>
                    <Button onClick={() => setEditingComment(null)} background="red" color="white" _hover={{ background: "red.600" }}>Cancel</Button>
                  </ModalFooter>
                </ModalBody>
              )}
            </ModalContent>
          </Modal>
          <Box
            className="controls_duration"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="1rem"
          >
            <Button size="sm" onClick={handleCheckRecording}>
              {isRecording === true ? (
                <PauseIcon fontSize="1rem" />
              ) : (
                <PlayArrowIcon fontSize="1rem" />
              )}
            </Button>
            <Box className="duration" height="100%">
              <Text
                fontSize="1.5rem"
                color="white"
                background="black"
                minWidth="8rem"
                width="auto"
                height="3.5vh"
                textAlign="center"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {formatTime(Recording_Time.current)}
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