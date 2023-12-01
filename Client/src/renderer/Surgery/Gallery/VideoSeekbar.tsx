import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
function VideoSeekBar({ currentTime, duration, onSeek }) {
  const handleSeek = (value) => {
    onSeek(value);
  };

  return (
    <Box width="100%" padding="0 1rem">
      <Slider
        aria-label="video-seekbar"
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSeek}
      >
        <SliderTrack bg="#fff" height="4px">
          <SliderFilledTrack bg="#286195" />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          <Box color="#286195" as={GraphicEqIcon} />
        </SliderThumb>
      </Slider>
    </Box>
  );
}

export default VideoSeekBar;
