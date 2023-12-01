/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadPlayer } from 'rtsp-relay/browser';

//      MEDIA CONTROLLERS IMPORT
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
  Stop as StopIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import {
  getImageListBySurgery,
  getVedioListBySurgery,
  surgeryDetails,
} from '../../Config/api';
import EditSurgery from '../Components/EditSurgery';
import Snapshots from '../Gallery/Snapshots';
import MultiView from '../Gallery/MultiView';
import URL from '../../Home/Components/URL';
import useAuth from '../../User/Components/useAuth';
import { useCompany } from '../../Company/CompanyContext';

function SurgeryDetails() {
  const [Img, setImg] = useState(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const { auth } = useAuth();
  const [localStream, setLocalStream] = useState(null);
  const { company } = useCompany();

  const [vedios, setVedios] = useState([]);
  const [multi, setMulti] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { id } = useParams();
  const data = id && id.includes(',') ? id.split(',') : [id];
  const [surgeryId, patientId] = data;
  const [surgery, setSurgery] = useState([]);
  const [sid, setSid] = useState(null);
  const [file, setFile] = useState(null);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) throw new Error('Ref is null');

    loadPlayer({
      url: URL,
      canvas: canvasRef.current,
    });
    if (canvasRef.current && videoRef.current) {
      const stream = canvasRef.current.captureStream();
      videoRef.current.srcObject = stream;
      setLocalStream(stream);
    }
  }, []);
  useEffect(() => {
    const getSurgery = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };
        const { data } = await axios.get(surgeryDetails(surgeryId), {
          headers,
        });
        setSurgery(data);
        setSid(data.surgery_id);
      } catch (err) {
        console.log(err);
      }
    };
    getSurgery();
  }, []);

  // const mediaRecorderRef = useRef(null);
  // const [isRecording, setIsRecording] = useState(false);

  // let storage_stream = '';
  // async function startRecording() {
  //   let outputFileName = '';
  //   if (!mediaRecorderRef.current) {
  //     const currentDateTime = new Date().toISOString().replace(/[-T:]/g, '');
  //     // const outputFileName =
  //     // 'C:\\Users\\YOGESH KUMAR\\Desktop\\Cognate Desktop\\rec.mp4';
  //     outputFileName = `C:\\Users\\YOGESH KUMAR\\Desktop\\Cognate Desktop\\rec_${sid}_${currentDateTime}.mp4`;
  //     storage_stream = require('fs').createWriteStream(outputFileName, {
  //       flags: 'a',
  //     });
  //     mediaRecorderRef.current = new MediaRecorder(localStream);

  //     mediaRecorderRef.current.ondataavailable = async (event) => {
  //       const blob = new Blob([event.data], { type: 'video/mp4' });
  //       const fileBuffer = Buffer.from(await blob.arrayBuffer());

  //       if (fileBuffer.length > 0) {
  //         storage_stream.write(fileBuffer);
  //         console.log('Writing data to file...');
  //       }
  //     };

  //     mediaRecorderRef.current.onstart = (event) => {
  //       // videoRef.current.srcObject =  mediaRecorderRef.current.srcObject;
  //       console.log('Recording started');
  //     };

  //     mediaRecorderRef.current.onstop = (event) => {
  //       console.log('Recording stopped');
  //       storage_stream.end();
  //     };
  //   }

  //   mediaRecorderRef.current.start(1000);
  //   console.log(mediaRecorderRef.current.state);
  // }

  // function stopRecording() {
  //   if (
  //     mediaRecorderRef.current &&
  //     mediaRecorderRef.current.state === 'recording'
  //   ) {
  //     mediaRecorderRef.current.stop();
  //     storage_stream.end();
  //   }
  // }

  // useEffect(() => {
  //   if (isRecording) {
  //     startRecording();
  //   } else {
  //     stopRecording();
  //   }
  // }, [isRecording]);

  const [rotationAngle, setRotationAngle] = useState(0);
  const handleRotateVideo = () => {
    setRotationAngle((prevDegree) => (prevDegree + 90) % 360);
  };

  const zoomLevelRef = useRef(100);
  const handleZoomOut = () => {
    if (videoRef.current && zoomLevelRef.current > 50) {
      zoomLevelRef.current -= 10;
      videoRef.current.style.transform = `scale(${zoomLevelRef.current / 100})`;
    }
  };
  const handleZoomIn = () => {
    if (videoRef.current) {
      zoomLevelRef.current += 10;
      videoRef.current.style.transform = `scale(${zoomLevelRef.current / 100})`;
    }
  };

  // snaps start
  const [snaps, setSnaps] = useState([]);
  useEffect(() => {
    const getSnaps = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };
        if (sid) {
          const response = await axios.get(getImageListBySurgery(sid), {
            headers,
          });

          if (response.data) {
            setSnaps(response.data);
          } else {
            console.log('API response does not contain data.');
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getSnaps();
  }, [auth?.access_token, sid]);
  // snaps end

  // vedios start
  useEffect(() => {
    const getVedios = async () => {
      try {
        const accessToken = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        };
        if (sid) {
          const response = await axios.get(getVedioListBySurgery(sid), {
            headers,
          });

          if (response.data) {
            setVedios(response.data);
          } else {
            console.log('API response does not contain data.');
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getVedios();
  }, [auth?.access_token, sid]);
  // vedios end

  const dataRight = [
    { label: 'Surgeon Name', value: surgery.surgeon_name },
    { label: 'Surgery Type', value: surgery.surgery_type },
    {
      label: 'Body Part',
      value: surgery.body_part,
    },
    {
      label: 'Date',
      value: surgery.surgery_date,
    },
  ];
  const dataLeft = [
    { label: 'Additional Surgeon', value: surgery.additional_surgeon },
    { label: 'Anesthesiologist', value: surgery.anesthesiologist },
    {
      label: 'Surgical History Details',
      value: surgery.surgery_history_details,
    },
    {
      label: 'Operation Theatre Number',
      value: surgery.operation_theatre_number,
    },
  ];

  const navigate = useNavigate();
  const handleStart = () => {
    navigate(`/recording/${[sid, patientId]}`);
  };
  const handleClose = () => {
    setFile(null);
    setIsPlaying(false);
    setCheck(false);
  };
  return (
    <Box className="surgery-details">
      {/*  GO BACK BUTTON START */}
      <span className="back">
        <Button
          size="sm"
          background="#003975"
          _hover={{ background: '#0350a4' }}
          onClick={() => navigate(-1)}
          color="white"
        >
          Go Back
        </Button>
      </span>
      {/*  GO BACK BUTTON END */}
      {/* SURGERY DETAILS START */}
      <Heading textAlign="center" fontSize="3rem" color="red">
        Surgery Details
      </Heading>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        fontSize="1.2rem"
      >
        <Box height="100%">
          {dataRight.map((item, i) => (
            <Box key={i} style={{ display: 'flex', gap: '1rem' }}>
              <Text fontWeight="bold">{item.label} :</Text>
              <Text color="#003975">{item.value}</Text>
            </Box>
          ))}
        </Box>
        <Box height="100%">
          {dataLeft.map((item, i) => (
            <Box key={i} style={{ display: 'flex', gap: '1rem' }}>
              <Text fontWeight="bold">{item.label} :</Text>
              <Text color="#003975">{item.value}</Text>
            </Box>
          ))}
        </Box>
      </Box>
      {/* SURGERY DETAILS END */}

      {/* START RECORDING AND EDIT SURGERY BUTTON START */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        width="50%"
        alignSelf="center"
      >
        <EditSurgery Surgery={surgery} />

        <Button
          color="white"
          background="#D81924"
          _hover={{ background: 'red' }}
          width="20%"
          alignSelf="center"
          onClick={() => navigate(`/receipt/${[surgeryId, patientId]}`)}
          // onClick={() => navigate(`/receipt/${[sid, patientId]}`)}
          id="recordButton"
        >
          Generate Receipt
        </Button>
        <Button
          color="white"
          background="#D81924"
          _hover={{ background: 'red' }}
          width="20%"
          alignSelf="center"
          onClick={handleStart}
          id="recordButton"
        >
          Start Recording
        </Button>
      </Box>
      {/* START RECORDING AND EDIT SURGERY END */}

      {/* GALLERY START */}
      <Heading textAlign="center" fontSize="3rem" color="red">
        Recordings
      </Heading>
      <Box className="container">
        <Box className="video">
          <Heading>Video:</Heading>
          {/*   RECORDING VEDIOS START */}
          <Box className="media-container">
            {vedios.map((vedio, i) => (
              <Box key={i}>
                {/* {console.log(vedio.video_file,vedio.video_id,sid)} */}
                <Box
                  className="media"
                  onClick={() =>
                    navigate(
                      `/vedios/${[
                        vedio.video_file,
                        vedio.video_id,
                        sid,
                        patientId,
                      ]}`,
                    )
                  }
                >
                  <video src={vedio.video_file} />
                </Box>
              </Box>
            ))}
          </Box>
          {/*   RECORDING VEDIOS END */}
        </Box>

        {/* SCREENSHOTS  START */}
        <Snapshots
          snaps={snaps}
          setSnaps={setSnaps}
          img={Img}
          setImg={setImg}
          multi={multi}
          setMulti={setMulti}
          screenshot={screenshot}
        />
        {/* SCREENSHOTS END */}

        {/* MULTIVIEW START */}
        <MultiView
          multi={multi}
          setMulti={setMulti}
          snaps={snaps}
          patientId={patientId}
          surgeryId={surgeryId}
        />
        {/* MULTIVIEW END */}
        {/* START RECORDING VEDIO COMPONENT START */}
        <Box
          className="popup-media-check"
          style={{ display: check ? 'block' : 'none' }}
          width="100%"
          height="100vh"
        >
          <Box>
            <canvas
              ref={canvasRef}
              style={{ width: '0%', height: '0%', visibility: 'hidden' }}
            />
            <video
              ref={videoRef}
              style={{
                width: '100%',
                height: '100%',
                transform: `rotate(${rotationAngle}deg)`,
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
                    backgroundColor:
                      zoomLevelRef.current <= 50 ? 'gray' : 'white',
                    cursor:
                      zoomLevelRef.current <= 50 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <ZoomOutIcon fontSize="1rem" />
                </Button>
                <Text color="white">{zoomLevelRef.current}%</Text>
                <Button size="sm" onClick={handleZoomIn}>
                  <ZoomInIcon fontSize="1rem" />
                </Button>
              </Box>
              <Box className="controls_duration" display="flex" gap="1rem">
                <Button size="sm">
                  <PauseIcon fontSize="1rem" />
                </Button>
                <Box className="duration">
                  <Text fontSize="1rem" color="white">
                    00:01:15
                  </Text>
                </Box>
                <Button size="sm">
                  <PlayArrowIcon fontSize="1rem" />
                </Button>
                <Button size="sm" onClick={handleClose}>
                  <SaveIcon fontSize="1rem" />
                </Button>
              </Box>
              <Button size="sm" className="snap">
                <CameraAltIcon fontSize="1rem" />
              </Button>
              {screenshot && (
                <Box className="screenshot-container">
                  <img src={screenshot} alt="Screenshot" />
                </Box>
              )}
              <Button
                size="sm"
                className="rotation"
                onClick={handleRotateVideo}
              >
                <ScreenRotationIcon fontSize="1rem" />
              </Button>
            </Box>
            <Box className="comments" display="flex" gap="0.5rem">
              <Button size="sm">
                <AddCommentIcon fontSize="1rem" />
              </Button>
              <Button size="sm">
                <ForumIcon fontSize="1rem" />
              </Button>
            </Box>
          </Box>
        </Box>
        {/* START RECORDING VEDIO COMPONENT START */}
      </Box>
      {/* GALLERY END */}
    </Box>
  );
}

export default SurgeryDetails;
