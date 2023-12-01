/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import EditIcon from '@mui/icons-material/Edit';

import useAuth from '../../User/Components/useAuth';
import VideoSeekBar from '../Gallery/VideoSeekbar';
import VideoTimeLapse from '../Gallery/VideoTimeLapse';
import { getCommentOnSurgeryVedio } from '../../Config/api';
import { useCompany } from '../../Company/CompanyContext';

function Vedios() {
  // State And Variable Declaration
  const { company } = useCompany();
  const { auth } = useAuth();
  const { videoId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const videoRef = React.useRef(null);
  const canvasRef = useRef(null);
  const zoomLevelRef = useRef(100);
  const [isPlaying, setIsPlaying] = useState(false);
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
  const [duration, setDuration] = useState(0);
  const data =
    videoId && videoId.includes(',') ? videoId.split(',') : [videoId];
  const [address, id, surgeryId, patientId] = data;

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
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
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
        `http://127.0.0.1:8000/api/patients/add-comment-on-surgery-video/${id}/`,
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

  const handleTakeScreenshot = async () => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png');

      const fs = require('fs').promises;
      try {
        const makeDirectory = async (path) => {
          try {
            await fs.access(path);
          } catch (error) {
            await fs.mkdir(path, { recursive: true });
          }
        };

        const directoryPath = `${company.storage_path}\\patient${patientId}\\surgery${surgeryId}\\snapshots`;
        await makeDirectory(directoryPath);

        const newImagePath = `${directoryPath}\\${formattedDate}_screenshot.png`;
        const imageBuffer = Buffer.from(imageDataUrl.split(',')[1], 'base64');
        await fs.writeFile(newImagePath, imageBuffer);

        const response = await axios.post(
          `http://127.0.0.1:8000/api/patients/add-surgery-image/${surgeryId}/`,
          { image_file: newImagePath, surgery: surgeryId, patient: patientId },
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
  // Even Handlers End
  useEffect(() => {
    const getComments = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };
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
  }, [auth?.access_token, id, comments]);

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
    return;
  }, [videoRef]);

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
        <video
          src={address}
          ref={videoRef}
          className={isScreenshotTaken ? 'screenshot-taken' : ''}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: '100vw',
            height: '100%',
            objectFit: 'contain',
            transform: `translate(${position.x}px, ${position.y}px) scale(${
              zoomLevel / 100
            }) rotate(${rotationAngle}deg) scale(${zoomLevel / 100})`,
            transition: 'transform 0.5s ease',
          }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
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
        <Box className="clip" display="flex" gap="0.5rem" color="white">
          <Input type="time" size="sm" step="1" />
          <Input type="time" size="sm" step="1" />
          <Button size="sm">
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
          {/* MODAL AFTER TAKING SCREENSHOT START */}
          {/* <Modal isOpen={commentModalOpen} onClose={handleCloseCommentModal}>
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
                  <Input
                    placeholder="Comment"
                    name="comment_text"
                    onChange={handleChange}
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
          </Modal> */}
          {/* MODAL AFTER TAKING SCREENSHOT END */}
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
                        <Button background="none" _hover={{background: "none"}}>
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
        </Box>
        {/* COMMENTS END */}
      </Box>
    </Box>
  );
}
export default Vedios;
