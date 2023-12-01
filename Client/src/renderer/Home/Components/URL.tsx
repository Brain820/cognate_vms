const ip = '192.168.137.139';
// const ip = '10.38.3.96';
// const ip = '10.38.0.233';
const port = '8080';

const rtspUrl = `rtsp://${ip}:${port}/h264_ulaw.sdp`;

const URL = `ws://localhost:2000/stream/?rtsp_url=${rtspUrl}`;

export default URL;
// ws://localhost:2000/stream/?rtsp_url=rtsp://10.38.0.233:8080/h264_ulaw.sdp
