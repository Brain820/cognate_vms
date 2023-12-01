import { Box, Button, Heading, Image } from '@chakra-ui/react';
import React, { useState } from 'react';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CancelIcon from '@mui/icons-material/Cancel';
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ForumIcon from '@mui/icons-material/Forum';
import { useNavigate } from 'react-router-dom';

function Snapshots(props) {
  const { snaps, setSnaps, img, setImg, multi, setMulti, screenshot } = props;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);

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
  const handleWheel = (e) => {
    const newZoomLevel = zoomLevel + e.deltaY * 0.01;
    const clampedZoomLevel = Math.max(50, Math.min(200, newZoomLevel));
    setZoomLevel(clampedZoomLevel);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel((prevZoom) => prevZoom - 10);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => prevZoom + 10);
  };
  const handleRotate = () => {
    setRotationAngle((prevAngle) => prevAngle + 90);
  };

  const navigate = useNavigate();
  return (
    <Box className="snapshot">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Heading>Snapshots</Heading>
        <Button onClick={() => setMulti(true)}>
          <ViewColumnIcon fontSize="large" />
        </Button>
      </Box>
      <Box className="media-container">
        {snaps.map((item, i) => (
          <Box key={i}>
            <Box
              className="media"
              onClick={() =>
                navigate(`/images/${[item.image_file, item.image_id]}`)
              }
            >
              <Image src={item.image_file} alt="Screenshot not visible" />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Snapshots;
