// // Disable no-unused-vars, broken for spread args
// /* eslint no-unused-vars: off */
// import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
// import { useRef } from 'react';
// // import { contextBridge, IpcRendererEvent } from 'electron';

// // const { ipcRenderer } = window.require('electron');

// export type Channels = 'ipc-example';
// // window.require = require;
// const electronHandler = {
//   ipcRenderer: {
//     sendMessage(channel: Channels, ...args: unknown[]) {
//       ipcRenderer.send(channel, ...args);
//     },
//     on(channel: Channels, func: (...args: unknown[]) => void) {
//       const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
//         func(...args);
//       ipcRenderer.on(channel, subscription);

//       return () => {
//         ipcRenderer.removeListener(channel, subscription);
//       };
//     },
//     once(channel: Channels, func: (...args: unknown[]) => void) {
//       ipcRenderer.once(channel, (_event, ...args) => func(...args));
//     },
//     // eslint-disable-next-line global-require
//     // fs: require('fs'),
//   },
// };

// // const mediaRecorderRef = useRef(null);

// // document.addEventListener('DOMContentLoaded', function () {
// //   const recordButton = document.getElementById('recordButton');
// //   // let cut = new MediaRecorder()
// //   recordButton.addEventListener('click', () => {
// //     const vedioTag = document.getElementById('vedio');
// //     const src = vedioTag.captureStream();
// //     console.log("working");
// //     mediaRecorderRef.current = new MediaRecorder(src);

// //     mediaRecorderRef.current.ondataavailable = (event) => {
// //       if (event.data.size > 0) {
// //         setRecordedChunks([...recordedChunks, event.data]);
// //       }
// //     };
// //     mediaRecorderRef.current.onstop = () => {
// //       if (recordedChunks.length > 0) {
// //         const recordedVideo = new Blob(recordedChunks, { type: 'video/webm' });

// //         // Send the recorded video data to the main process for saving
// //         const reader = new FileReader();
// //         reader.onload = () => {
// //           const videoBuffer = Buffer.from(reader.result);
// //           ipcRenderer.send('save-video', videoBuffer);
// //         };
// //         reader.readAsArrayBuffer(recordedVideo);
// //       }

// //       setIsRecording(false);
// //     };
// //   });
// //   const stopButton = document.getElementById('stopButton');
// //   stopButton?.addEventListener('click', function () {
// //     if (mediaRecorderRef.current) {
// //       console.log("stoped")
// //       mediaRecorderRef.current.stop();
// //     }
// //   });
// // });

// contextBridge.exposeInMainWorld('electron', electronHandler);

// export type ElectronHandler = typeof electronHandler;
