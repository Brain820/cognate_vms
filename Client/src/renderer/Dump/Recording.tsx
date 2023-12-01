/* eslint-disable promise/always-return */
import { Button } from '@chakra-ui/react';
import { IpcRenderer } from 'electron';
import { useRef, useState, useEffect } from 'react';

function Recording() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  // const stream = navigator.mediaDevices.getUserMedia({ video: true });
  useEffect(() => {
      let stream = navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            console.log("working fine");
            console.log(videoRef);
            videoRef.current.srcObject = stream;
          }
        })
      .catch((error) => {
        console.error(`Error accessing the camera: ${error}`);
      });
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    // async function getWebcamStream() {
    //   try {
    //     // Attach the webcam stream to the video element
    //     if (videoRef.current) {
    //       videoRef.current.srcObject = stream;
    //     }
    //   } catch (error) {
    //     console.error('Error accessing webcam:', error);
    //   }
    // }
    //   getWebcamStream();
    // mediaRecorderRef.current = new MediaRecorder(stream);
    // mediaRecorderRef.current.ondataavailable = (event) => {
    //   if (event.data.size > 0) {
    //     setRecordedChunks([...recordedChunks, event.data]);
    //   }
    // };
    // mediaRecorderRef.current.onstop = () => {
    //   if (recordedChunks.length > 0) {
    //     const recordedVideo = new Blob(recordedChunks, { type: 'video/webm' });
    //     // Send the recorded video data to the main process for saving
    //     const reader = new FileReader();
    //     reader.onload = () => {
    //       const videoBuffer = Buffer.from(reader.result);
    //       ipcRenderer.send('save-video', videoBuffer);
    //     };
    //     reader.readAsArrayBuffer(recordedVideo);
    //   }
    //   setIsRecording(false);
    // };
    // mediaRecorderRef.current.start();
    // setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <>
      <video ref={videoRef} width="50%" height="50%" />
      <Button onClick={startRecording}>Start Recording</Button>
      <Button onClick={stopRecording}>Stop Recording</Button>
    </>
  );
}

export default Recording;
