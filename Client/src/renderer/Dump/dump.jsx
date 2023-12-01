/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/button-has-type */
import React, { useState, useRef } from 'react';

const { ipcRenderer } = window.require('electron');

function VideoRecorder() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks([...recordedChunks, event.data]);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      if (recordedChunks.length > 0) {
        const recordedVideo = new Blob(recordedChunks, { type: 'video/webm' });

        // Send the recorded video data to the main process for saving
        const reader = new FileReader();
        reader.onload = () => {
          const videoBuffer = Buffer.from(reader.result);
          ipcRenderer.send('save-video', videoBuffer);
        };
        reader.readAsArrayBuffer(recordedVideo);
      }

      setIsRecording(false);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay />

      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>

      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
    </div>
  );
}

export default VideoRecorder;
