import { Box, Text } from '@chakra-ui/react';
import { BsCircleFill } from 'react-icons/bs';
import { IoMdRefresh } from 'react-icons/io';
import React, { useRef, useEffect } from 'react';
import { loadPlayer } from 'rtsp-relay/browser';
import URL from './URL';
import { useCompany } from '../../Company/CompanyContext';

function CCTV() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const { company } = useCompany();
  useEffect(() => {
    if (!canvasRef.current) throw new Error('Ref is null');

    loadPlayer({
      // url: URL,
      url: `${company.video_streaming}`,
      canvas: canvasRef.current,
    });
    if (canvasRef.current && videoRef.current) {
      const stream = canvasRef.current.captureStream();
      videoRef.current.srcObject = stream;
    }
  }, [company.video_streaming]);

  return (
    <Box className="cctv">
      <Box className="cctv-options">
        <Box className="status">
          <BsCircleFill color="green" />
          <Text>Live Camera</Text>
        </Box>
        <Box className="refresh">
          <IoMdRefresh />
        </Box>
      </Box>
      <Box className="rtsp" height="36rem" background="black" width="90vw">
        <canvas
          ref={canvasRef}
          style={{ width: '0%', height: '0%', visibility: 'hidden' }}
        />
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%' }}
          autoPlay
        />
      </Box>
    </Box>
  );
}

export default CCTV;
