/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
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
import {
  ZoomOut as ZoomOutIcon,
  ZoomIn as ZoomInIcon,
  CameraAlt as CameraAltIcon,
  AddComment as AddCommentIcon,
  Forum as ForumIcon,
  ScreenRotation as ScreenRotationIcon,
  ContentCut as ContentCutIcon,
  Pause as PauseIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import EditIcon from '@mui/icons-material/Edit';


import fixWebmDuration from "fix-webm-duration";
import VideoSeekBar from '../Gallery/VideoSeekbar';
import VideoTimeLapse from '../Gallery/VideoTimeLapse';
import { createWriteStream} from 'fs';
import {
  addCommentOnSurgeryVedio,
  addSurgeryImage,
  addSurgeryVedio,
  deleteCommentOnSurgeryVedio,
  editCommentOnSurgeryVedio,
  getCommentOnSurgeryVedio,
} from '../../Config/api';
import { useCompany } from '../../Company/CompanyContext';

function Vedios() {
  // State And Variable Declaration
  const { company } = useCompany();
  // const { auth } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const videoRef = React.useRef(null);
  const canvasRef = useRef(null);
  const zoomLevelRef = useRef(100);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isScreenshotTaken, setIsScreenshotTaken] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [inputs, setInputs] = useState({
    comment_text: '',
    headline: '',
  });
  const [viewCommentModal, setViewCommentModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const Recording_Time = useRef(0);
  const [duration, setDuration] = useState(0);
  const [temp] = useSearchParams();
  const surgeryId = temp.get('surgery_id');
  const patientId = temp.get('patient_id');
  const params = useParams();
  const id = params.videoId;


  const accessToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}${currentDate
      .getDate()
      .toString()
      .padStart(2, '0')}${currentDate
        .getHours()
        .toString()
        .padStart(2, '0')}${currentDate
          .getMinutes()
          .toString()
          .padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}`;

  // Event Handlers Start


  const handlePause = () => {
    console.log(videoRef.current.duration)
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.pause();
          setIsClipping(false);
      }
    }
  }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      
    }
  };
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleAdd = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await axios.post(
        addCommentOnSurgeryVedio(id),
        { ...inputs, video: id },
        { headers },
      );
      onClose();
    } catch (err) {
      console.log(err);
    }
  };
  const handleRotateVideo = () => {
    setRotationAngle((prevDegree) => prevDegree + 90);
  };

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
    const roundedZoomLevel = Math.round(clampedZoomLevel); // Round to the nearest integer
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

  const fs = require('fs').promises;
  const path = require('path');
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
        const directoryPath = path.join(
          `${company.storage_path}`,
          `/patient${patientId}`,
          `surgery${surgeryId}`,
          'snapshots',
        );
        await makeDirectory(directoryPath);
        const newImagePath = path.join(
          `${directoryPath}`,
          `/${formattedDate}.png`,
        );
        const imageBuffer = Buffer.from(imageDataUrl.split(',')[1], 'base64');
        await fs.writeFile(newImagePath, imageBuffer);

        const response = await axios.post(
          addSurgeryImage(surgeryId),
          { image_file: newImagePath, surgery: surgeryId, patient: patientId },
          { headers },
        );
        setIsScreenshotTaken(true);
        toast({
          title: 'Screenshot taken',
          description: 'Screenshot saved successfully',
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: 'top',
        });
      } catch (error) {
        console.error('Error saving or uploading screenshot:', error.message);
      }
    }
  };

  const handleCloseViewCommentModal = () => {
    setViewCommentModal(false);
  };
  const handleSeek = (seekTime) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

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
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };
  // Even Handlers End
  useEffect(() => {
    const getComments = async () => {
      try {
        if (id) {
          const response = await axios.get(getCommentOnSurgeryVedio(id), {
            headers,
          });

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
  }, [id, viewCommentModal]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(videoElement.duration);
    };

    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('durationchange', handleDurationChange);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener(
          'durationchange',
          handleDurationChange,
        );
      };
    }
  }, [videoRef]);

  const handleStartTimeChange = (e) => {
    setClipTimes((prev) => ({ ...prev, startTime: e.target.value }));
  };

  const handleEndTimeChange = (e) => {
    setClipTimes((prev) => ({ ...prev, endTime: e.target.value }));
  };
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const formatNumber = (num) => num.toString().padStart(2, '0');

    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(
      seconds,
    )}`;
  };

  const [commentInputs, setCommentInputs] = useState({
    comment_text: '',
    headline: '',
    video: id,
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
      });
      setEditingComment(null);
      handleCloseViewCommentModal();
    } catch (err) {
      console.log(err);
    }
  }

  // Vedio Clip Section Start

  const [startClip, setStartClip] = useState(false);
  const [clipTimes, setClipTimes] = useState({ startTime: 0, endTime: 0 });
  let outputFileName = '';
  const mediaRecorderRef = useRef(null);

  async function handleClip() {
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
      'surgery' + `${surgeryId}`,
      'clippedVedio',
    );
    await makeDirectory(directoryPath);
    outputFileName = path.join(
      `${directoryPath}`,
      `/${formattedDate}` + '_clip.webm',
    );
    const startTime = parseFloat(clipTimes.startTime);
    const endTime = parseFloat(clipTimes.endTime);

    if (!mediaRecorderRef.current) {
      const storageStream = createWriteStream(outputFileName, { flags: 'a' });
      if (videoRef.current.paused==false){
        const options={type: 'video/webm',
                       };
        // const options = {
                      //   mimeType: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
                      // };
        mediaRecorderRef.current = new MediaRecorder(videoRef.current.captureStream(),options);

        let mediadata=[];
        mediaRecorderRef.current.ondataavailable = async (event) => {
          // mediadata.push(event.data);
          Recording_Time.current += 1;
          // let v_duration=Recording_Time.current*1000
          // const blob = new Blob([event.data], { type: 'video/webm'});
          // fixWebmDuration(blob, Recording_Time.current*1000,{logger: false}).then (async function (fixedBlob) {
          //   console.log('fix blogsize',fixedBlob.size)
          //   const fileBuffer = Buffer.from(await fixedBlob.arrayBuffer());

          // if (fileBuffer.length > 0) {
            if (event.data.size>0){
            mediadata.push(event.data)
            // storageStream.write(fileBuffer);
            console.log('Writing data to file...');
          };
    // });
    };

        mediaRecorderRef.current.onstart = (event) => {
          console.log('Clipping started');
          setStartClip(true);
          setIsClipping(true);
          async function handleSaveClip() {
            try {
              const response = await axios.post(
                addSurgeryVedio(surgeryId),
                {
                  video_file: outputFileName,
                  surgery: surgeryId,
                  patient: patientId,
                },
                { headers },
              );
              // setRecordingId(response.data.video_id);
              console.log(response);
            } catch (error) {
              console.log(error);
            }
          }
          handleSaveClip();
        };

        mediaRecorderRef.current.onstop = async (event) => {

          const v_duration=Recording_Time.current*1000
          
          const blob = new Blob(mediadata, { type: 'video/webm'});
           console.log("####################",blob.size)
          fixWebmDuration(blob, v_duration,{logger: false}).then (async function (fixedBlob) {
          const fileBuffer = Buffer.from(await fixedBlob.arrayBuffer());
          // const data = event.data;
          console.log("####################",fixedBlob.size);
          console.log("")
          storageStream.write(fileBuffer)
          console.log("working")
          
          });
          // storageStream.close()
          Recording_Time.current=0;
          setIsClipping(false);
          mediaRecorderRef.current=null
        
      };

        mediaRecorderRef.current.start(1000);
        console.log(mediaRecorderRef.current.state);
      } 
      // catch (error) {
      //   console.log(error);
      // }
    }
  }

  function stopRecording() {
    // console.log(mediaRecorderRef.current.state)
    if (
      mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')
    ) {
      mediaRecorderRef.current.stop();
      setStartClip(false);
      mediaRecorderRef.current=null
    }
  }

  const clipVedio = () => {
    if (startClip) {
      stopRecording();
    } else {
      handleClip();
    }
  }
  const [isClipping, setIsClipping] = useState(false);

  const handleCheckClipping = () => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === 'recording' ) {
        mediaRecorderRef.current.pause();
        setIsClipping(false);
      } else if (mediaRecorderRef.current.state === 'paused' && videoRef.current.paused == false) {
        mediaRecorderRef.current.resume();
        setIsClipping(true);
      }
    }
    else{console.log("clipping didn't started")}
  };

  // Vedio Clip Section End




  return (
    <Box className="popup-media" width="100vw" height="100vh">
      <Button
        id="span"
        onClick={() => navigate(-1)}
        background="transparent"
        _hover={{ background: 'transparent' }}
        outline="none"
      >
        <CancelIcon />
      </Button>
      <Box
        style={{
          width: '100%',
          height: '95vh',
          background: 'black',
          overflow: 'hidden',
        }}
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
          src={temp.get('video_file')}
          ref={videoRef}
          className={isScreenshotTaken ? 'screenshot-taken' : ''}
          autoPlay={true}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: '100vw',
            height: '100%',
            objectFit: 'contain',
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel / 100
              }) rotate(${rotationAngle}deg) scale(${zoomLevel / 100})`,
            transition: 'transform 0.5s ease',
          }}
        />
      </Box>
      <Box
        className="seekbar-and-timelapse"
        height="5vh"
        width="100%"
        position="absolute"
        bottom="5vh"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="1.5rem"
      >
        <VideoSeekBar
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
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
        <Box className="clip" display="flex" gap="0.5rem" color="white" alignItems="center" ml={4}>
          {/* <Input
          type="time"
          size="sm"
          step="1"
          value={clipTimes.startTime}
          onChange={handleStartTimeChange}
        />
        <Input
          type="time"
          size="sm"
          step="1"
          value={clipTimes.endTime}
          onChange={handleEndTimeChange}
        /> */}
          <Button size="sm" onClick={handleCheckClipping}>
            {isClipping === true ? (
              <PauseCircleFilledIcon />
            ) : (
              <PlayCircleIcon />
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
          <Button size="sm" onClick={clipVedio}>
            <ContentCutIcon fontSize="1rem" />
          </Button>
        </Box>
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
            <Button size="sm" onClick={handleZoomOut}>
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
          <Box
            className="controls_duration"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="0.5rem"
            background="black"
            color="white"
            height="100%"
            padding="0rem 0.5rem"
          >
            <Box className="duration">
              <VideoTimeLapse currentTime={currentTime} duration={duration} />
            </Box>
            <Button size="sm" onClick={isPlaying ? handlePause : handlePlay}>
              {isPlaying ? (
                <PauseIcon fontSize="1rem" />
              ) : (
                <PlayArrowIcon fontSize="1rem" />
              )}
            </Button>
          </Box>
          <Button size="sm" className="snap" onClick={handleTakeScreenshot}>
            <CameraAltIcon fontSize="1rem" />
          </Button>
          <Button size="sm" className="rotation" onClick={handleRotateVideo}>
            <ScreenRotationIcon fontSize="1rem" />
          </Button>
        </Box>
        {/* COMMENTS START */}
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
        </Box>
        {/* COMMENTS END */}
      </Box>
    </Box>
  );
}
export default Vedios;
