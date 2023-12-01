/* eslint-disable react/destructuring-assignment */
import { Box, Button, ButtonGroup, Image, useToast } from '@chakra-ui/react';
import { useState } from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ForumIcon from '@mui/icons-material/Forum';
import axios from 'axios';
import { useCompany } from '../../Company/CompanyContext';

function MultiView(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRightIndex, setCurrentRightIndex] = useState(0);
  const showPreviousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(props.snaps.length - 1);
    }
  };

  const showNextImage = () => {
    if (currentIndex < props.snaps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const showPreviousRightImage = () => {
    if (currentRightIndex > 0) {
      setCurrentRightIndex(currentRightIndex - 1);
    } else {
      setCurrentRightIndex(props.snaps.length - 1);
    }
  };

  const showNextRightImage = () => {
    if (currentRightIndex < props.snaps.length - 1) {
      setCurrentRightIndex(currentRightIndex + 1);
    } else {
      setCurrentRightIndex(0);
    }
  };
  const { company } = useCompany();
  const toast = useToast();
  const [isScreenshotTaken, setIsScreenshotTaken] = useState(false);
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
  const accessToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
  const handleTakeScreenshot = async () => {
    const multiViewGallery = document.querySelector('.multi-view-gallery');

    if (multiViewGallery) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = multiViewGallery.offsetWidth * 2; // Assuming both left and right images are side by side
      canvas.height = multiViewGallery.offsetHeight;

      // Draw left image
      const leftImage = multiViewGallery.querySelector('.left-image-img img');
      context.drawImage(
        leftImage,
        0,
        0,
        multiViewGallery.offsetWidth,
        canvas.height,
      );

      // Draw right image
      const rightImage = multiViewGallery.querySelector('.right-image-img img');
      context.drawImage(
        rightImage,
        multiViewGallery.offsetWidth,
        0,
        multiViewGallery.offsetWidth,
        canvas.height,
      );

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

        const directoryPath = `${company.storage_path}\\patient${props.patientId}\\surgery${props.surgeryId}\\compareSnapshots`;
        await makeDirectory(directoryPath);

        const newImagePath = `${directoryPath}\\${formattedDate}_screenshot.png`;
        const imageBuffer = Buffer.from(imageDataUrl.split(',')[1], 'base64');
        await fs.writeFile(newImagePath, imageBuffer);

        const response = await axios.post(
          `http://127.0.0.1:8000/api/patients/add-surgery-image/${props.surgeryId}/`,
          {
            image_file: newImagePath,
            surgery: props.surgeryId,
            patient: props.patientId,
          },
          { headers },
        );
        console.log(props.surgeryId)
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

  return (
    <Box className="multi-view" display={props.multi ? 'block' : 'none'}>
      {props.multi ? (
        <Box className="multi-view-gallery">
          <Button
            className="span"
            onClick={() => props.setMulti(false)}
            background="transparent"
            _hover={{ background: 'transparent' }}
          >
            <CancelIcon />
          </Button>
          <Box className="left-image" height="100vh" width="50vw">
            <Box className="left-image-img">
              {props.snaps.map(() => (
                <Image src={props.snaps[currentIndex].image_file} alt="" />
              ))}
            </Box>
            <ButtonGroup
              background="transparent"
              padding="0.3rem"
              width="50vw"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              position="fixed"
              top="50%"
            >
              <Button
                onClick={showPreviousImage}
                size="sm"
                background="transparent"
              >
                <NavigateBeforeIcon />
              </Button>
              <Button
                onClick={showNextImage}
                size="sm"
                background="transparent"
              >
                <NavigateNextIcon />
              </Button>
            </ButtonGroup>
          </Box>
          <Box className="right-image" height="100vh" width="50vw">
            <Box className="right-image-img">
              {props.snaps.map(() => (
                <Image src={props.snaps[currentRightIndex].image_file} alt="" />
              ))}
            </Box>
            <ButtonGroup
              background="transparent"
              padding="0.3rem"
              width="50vw"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              position="fixed"
              top="50%"
            >
              <Button
                onClick={showPreviousRightImage}
                size="sm"
                background="transparent"
              >
                <NavigateBeforeIcon />
              </Button>
              <Button
                onClick={showNextRightImage}
                size="sm"
                background="transparent"
              >
                <NavigateNextIcon />
              </Button>
            </ButtonGroup>
          </Box>
          <ButtonGroup
            background="#286195"
            width="100%"
            position="fixed"
            padding="0.3rem"
            bottom="0"
            left="0"
            gap="2rem"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {/* <Button size="sm">
              <AddCommentIcon fontSize="1rem" />
            </Button> */}
            <Button size="sm" onClick={handleTakeScreenshot}>
              <CameraAltIcon fontSize="1rem" />
            </Button>
            {/* <Button size="sm">
              <ForumIcon fontSize="1rem" />
            </Button> */}
          </ButtonGroup>
        </Box>
      ) : (
        <h2>hi</h2>
      )}
    </Box>
  );
}

export default MultiView;
