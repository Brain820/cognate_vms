const express = require('express');
const app = express();
const cors = require('cors');

const { proxy, scriptUrl } = require('rtsp-relay')(app);

app.ws('/stream/', (ws, req) =>
  proxy({
    transport: 'tcp',
    url: `${req.query.rtsp_url}`,//rtsp://10.14.6.68:8080/h264_ulaw.sdp,
  })(ws),
);

app.use(cors({
    origin: '*',
}));

app.get('/stream/', (req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://' + location.host + '/stream/' + '?rtsp_url=${req.query.rtsp_url}',
      canvas: document.getElementById('canvas')
    });
  </script>
`),
);


app.listen(2000);
