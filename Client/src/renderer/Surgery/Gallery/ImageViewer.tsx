/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  Image,
  useToast,
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
  editCommentOnSurgeryImage,
  getCommentOnSurgeryImage,
} from '../../Config/api';

function ImageViewer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const zoomLevelRef = useRef(100);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [temp] = useSearchParams();
  const address = temp.get('image_file');
  const id = useParams().imageId;
  const [inputs, setInputs] = useState({
    comment_text: '',
    headline: '',
  });
  const toast = useToast();

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
      await axios.post(
        addCommentOnSurgeryImage(id),
        { ...inputs, image: id },
        { headers },
      );
      toast({
        title: 'Comment Added!',
        status: 'success',
        isClosable: true,
        position: 'top',
        duration: 3000,
      });
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
  const handleRotate = () => {
    setRotationAngle((prevAngle) => prevAngle + 90);
  };
  useEffect(() => {
    const getComments = async () => {
      try {
        if (id) {
          const response = await axios.get(getCommentOnSurgeryImage(id), {
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
  }, [id, commentModalOpen]);
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        deleteCommentOnSurgeryImage(commentId),
        { headers },
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.comment_id !== commentId),
      );
      toast({
        title: 'Comment Deleted',
        status: 'success',
        isClosable: true,
        position: 'top',
        duration: 3000,
      });
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

  const [commentInputs, setCommentInputs] = useState({
    comment_text: '',
    headline: '',
    image: id,
  });
  const [editingComment, setEditingComment] = useState(null);
  const handleCommentChange = (e) => {
    setCommentInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  const handleUpdateComment = async (commentId) => {
    try {
      await axios.put(
        editCommentOnSurgeryImage(commentId),
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
      handleCloseCommentModal();
    } catch (err) {
      console.log(err);
    }
  }
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
        <Image
          src={address}
          alt=""
          style={{
            objectFit: 'contain',
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel / 100
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
            <FormControl mb={6}>
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
                      onClick={() => setEditingComment(comment.comment_id)}
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
  );
}

export default ImageViewer;