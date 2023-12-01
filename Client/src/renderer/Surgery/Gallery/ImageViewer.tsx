/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Textarea,
} from '@chakra-ui/react';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CancelIcon from '@mui/icons-material/Cancel';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ForumIcon from '@mui/icons-material/Forum';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import useAuth from '../../User/Components/useAuth';
import {
  addCommentOnSurgeryImage,
  deleteCommentOnSurgeryImage,
} from '../../Config/api';

function ImageViewer() {
  const { auth } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { imageId } = useParams();
  const navigate = useNavigate();
  const zoomLevelRef = useRef(100);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const data =
    imageId && imageId.includes(',') ? imageId.split(',') : [imageId];
  const [address, id] = data;
  const [inputs, setInputs] = useState({
    comment_text: '',
    headline: '',
  });

  const accessToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  // Event Handlers Start
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleAdd = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
      await axios.post(
        addCommentOnSurgeryImage(id),
        { ...inputs, image: id },
        { headers },
      );
      onClose();
    } catch (err) {
      console.log(err);
    }
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
  const handleRotate = () => {
    setRotationAngle((prevAngle) => prevAngle + 90);
  };
  useEffect(() => {
    const getComments = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `http://localhost:8000/api/patients/get-comment-on-surgery-image/${id}/`,
            { headers },
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
  }, [auth.access_token, id, comments, headers]);
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        deleteCommentOnSurgeryImage(commentId),
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
  const handleCloseCommentModal = () => {
    setCommentModalOpen(false);
  };
  const handleOpenCommentModal = () => {
    setCommentModalOpen(true);
  };
  // Event Handlers End

  return (
    <Box
      className="popup-media"
      width="100vw"
      height="100vh"
      background="black"
    >
      <Button
        id="span"
        onClick={() => navigate(-1)}
        background="transparent"
        _hover={{ background: 'transparent' }}
      >
        <CancelIcon />
      </Button>
      <Box
        style={{
          width: '100%',
          height: '95vh',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <img
          src={address}
          alt=""
          style={{
            objectFit: 'contain',
            transform: `translate(${position.x}px, ${position.y}px) scale(${
              zoomLevel / 100
            }) rotate(${rotationAngle}deg) scale(${zoomLevel / 100})`,
            maxWidth: '100%',
            maxHeight: '100%',
            width: '100vw',
            height: '100%',
            transformOrigin: 'center center',
            transition: 'transform 0.5s ease',
          }}
        />
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
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Heading</FormLabel>
              <Input
                placeholder="Heading"
                name="headline"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
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
        className="media-controllers"
        height="5vh"
        width="100%"
        background="#286195"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="1.5rem"
      >
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
          <Button size="sm" className="rotation" onClick={handleRotate}>
            <ScreenRotationIcon fontSize="1rem" />
          </Button>
          <Button size="sm" onClick={onOpen}>
            <AddCommentIcon fontSize="1rem" />
          </Button>
          <Button size="sm" onClick={handleOpenCommentModal}>
            <ForumIcon fontSize="1rem" />
          </Button>
        </Box>
      </Box>
      <Modal isOpen={commentModalOpen} onClose={handleCloseCommentModal}>
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
          <ModalHeader>Comments on this Image</ModalHeader>
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
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      background="none"
                      _hover={{ background: 'none', color: 'red' }}
                      onClick={() => handleDeleteComment(comment.comment_id)}
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
  );
}

export default ImageViewer;
