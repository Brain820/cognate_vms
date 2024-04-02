import { Box, Button, Text } from '@chakra-ui/react';
import { BsCircleFill } from 'react-icons/bs';
import { IoMdRefresh } from 'react-icons/io';
import { useRef, useEffect, useState } from 'react';
import { loadPlayer } from 'rtsp-relay/browser';
import { useCompany } from '../../Company/CompanyContext';

function CCTV() {
  const [stable, setStable] = useState(false);
  const [reload, setReload] = useState(false);
  const canvasRef = useRef(null);
  const { company } = useCompany();

  useEffect(() => {
    let player:any;
    (async function(){
      if (!company)return
      console.log("rtsp_url",company.video_streaming)
      player = await loadPlayer({
        url:`ws://localhost:2000/stream/?rtsp_url=` + `${company.video_streaming}`,
        canvas: document.getElementById('canvas') as any ,
        // videoBufferSize:262144,
        // progressive: false,
        throttled: true,
        disableGl: true,
        pauseWhenHidden: true,
        disconnectThreshold: 5000,
      });
      console.log("rtsp_url",company.video_streaming)
      player.onSourceEstablished; () => {
        console.log('Connection established');
        setStable(true);
      }
      player.onDisconnect; () => {
        console.log('Connection lost!');
        setStable(false);
      }
    })()
    return () =>
      {try {player.destroy()}
        catch (error) {
        console.log(error)
      }}
  }, [reload,company]);

  const [rotationAngle, setRotationAngle] = useState(0);
  const clickReload = () => {
    setReload(!reload);
    setRotationAngle((prevDegree) => prevDegree + 360);
  };

  return (
    <Box className="cctv" borderRadius="2rem" alignContent="center" marginRight="5.5rem" boxShadow="0px 1px 4px 0px rgba(0, 0, 0, 0.25)">
      <Box
        className="cctv-options"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        background="#E0E0E0"
        padding="0.5rem 1rem"
        borderTopLeftRadius="2rem" 
        borderTopRightRadius="2rem"
        width="75vw"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap="1rem"
        >
          <BsCircleFill color={stable ? 'green' : 'red'} />
          <Text
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="0.1rem"
            color="#800000"
          >
            Live Camera
          </Text>
        </Box>
        <Button
          background="none"
          size="sm"
          _hover={{
            background: 'none',
          }}
          onClick={clickReload}
        >
          <IoMdRefresh
            fontSize="1.5rem"
            style={{
              transform: `rotate(${rotationAngle}deg)`,
              transition: 'transform 0.5s ease-in-out',
            }}
          />
        </Button>
      </Box>

      <Box className="rtsp" height="45rem" background="black" width="75vw" borderBottomLeftRadius="2rem" borderBottomRightRadius="2rem">
        <canvas
          id="canvas"
          ref={canvasRef}
          style={{ width: '100%', height: '100%', borderBottomLeftRadius:'2rem', borderBottomRightRadius:'2rem' }}
        />
      </Box>
    </Box>
  );
}

export default CCTV;