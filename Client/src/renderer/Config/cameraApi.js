import axios from "axios";
import crypto from 'crypto';
import { img_sett,vid_sett,OSD_Sett} from '../../../../camera_config';
// import { img_sett,vid_sett,OSD_Sett} from '../Config/camera_config';
console.log("image Setting",img_sett)
// const username = 'admin';
// const password = '123456';


function generateDigestHeader(method, path, realm, nonce, qop, nc, cnonce,username,password) {
    const ha1 = crypto.createHash('md5').update(`${username}:${realm}:${password}`).digest('hex');
    const ha2 = crypto.createHash('md5').update(`${method}:${path}`).digest('hex');
    const response = crypto.createHash('md5').update(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`).digest('hex');

    return `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${path}", qop=${qop}, nc=${nc}, cnonce="${cnonce}", response="${response}"`;
  }

  async function makeDigestRequest(body1,camera_ip,username,password){
    const apiUrl = 'http://' + `${camera_ip}` + '/digest/frmPTZControl';
    try {
      const response = await axios.get(apiUrl);
      console.log('Response:', response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const authenticateHeader = error.response.headers['www-authenticate'];
        const digestParams = authenticateHeader.match(/(\w+)="([^"]*)"/g).reduce((acc, param) => {
          const [key, value] = param.split('=');
          acc[key] = value.replace(/"/g, '');
          return acc;
        }, {});

        const { realm, nonce, qop } = digestParams;
        const method = 'POST';
        const path = '/digest/frmPTZControl';
        const nc = '00000001'; 
        const cnonce = crypto.randomBytes(8).toString('hex');

        const digestHeader = generateDigestHeader(method, path, realm, nonce, qop, nc, cnonce,username,password);
        const authenticatedResponse = await axios.post(apiUrl, body1, {
          headers: {
            'Authorization': digestHeader,
          },
        });

        console.log('Authenticated Response:', authenticatedResponse.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  export const zoomInApi = async (body1,body2,camera_ip,username,password) => {
    try {
      makeDigestRequest(body1,camera_ip,username,password);
      setTimeout(() => {
        makeDigestRequest(body2,camera_ip,username,password);
      }, 100)
    } catch (error) {
      console.log(error);
    }
  }
  export const zoomOutApi = async (body1,body2,camera_ip,username,password) => {
    try {
      makeDigestRequest(body1,camera_ip,username,password);
      setTimeout(() => {
        makeDigestRequest(body2,camera_ip,username,password);
      }, 100)
    } catch (error) {
      console.log(error);
    }
  }


  export const zoomInApi_VMS = async (camera_ip,username,password,camera_zoom_speed) => {
    console.log("Inside Zoom api",camera_zoom_speed)
    const apiUrl = 'http://' + `${camera_ip}` + '/web/cgi-bin/hi3510/ptzctrl.cgi?-step=0&-act=zoomin&-speed='+`${camera_zoom_speed}`;
    const stopapiUrl = 'http://' + `${camera_ip}` + '/web/cgi-bin/hi3510/ptzctrl.cgi?-step=0&-act=stop&-speed='+`${camera_zoom_speed}`;
    // const username = 'admin';
    // const password = 'admin';

    try {
        await axios.get(apiUrl, {
            auth: {
                username: username,
                password: password
            }
        });
        await new Promise(resolve => setTimeout(resolve, 40));
        await axios.get(stopapiUrl, {
          auth: {
              username: username,
              password: password
          }
      });
    } catch (error) {
      console.log(error)
    }
};
  export const zoomOutApi_VMS = async (camera_ip,username,password,camera_zoom_speed) => {
    const apiUrl = 'http://' + `${camera_ip}` + '/web/cgi-bin/hi3510/ptzctrl.cgi?-step=0&-act=zoomout&-speed=' +`${camera_zoom_speed}`;
    const stopapiUrl = 'http://' + `${camera_ip}` + '/web/cgi-bin/hi3510/ptzctrl.cgi?-step=0&-act=stop&-speed='+`${camera_zoom_speed}`;
    // const username = 'admin';
    // const password = 'admin';

    try {
        await axios.get(apiUrl,  {
            auth: {
                username: username,
                password: password
            }
        });
        // Introduce a delay of 100 milliseconds
        await new Promise(resolve => setTimeout(resolve, 40));

        await axios.get(stopapiUrl, {
            auth: {
                username: username,
                password: password
            }
        });
    } catch (error) {
      console.log(error)
    }
};

export const frameRateApi_VMS = async (camera_ip,username,password,camera_framerate) => {
  console.log("Testing",vid_sett)
  const set_video_data="cmd=setvideoattr&cururl=http%3A%2F%2F"+`${camera_ip}`+"%2Fweb%2Fvideo.html&"+
                      "-videomode="  +`${vid_sett.setvideoattr.videomode}`+"&"+
  +                   "-vinorm="    +`${vid_sett.setvideoattr.vinorm}`+   "&"+
                      "-profile=" +`${vid_sett.setvideoattr.profile}`+"&"+
                      "cmd=setvencattr&"+
                      "-chn=" +`${vid_sett.setvencattr.chn}`+"&"+
                      "-bps=" +`${vid_sett.setvencattr.bps}`+"&"+
                      "-fps=" +`${camera_framerate}`+"&"+ //`${vid_sett.setvencattr.fps}`+"&"+
                      "-brmode=" +`${vid_sett.setvencattr.brmode}`+"&"+
                      "-imagegrade=" +`${vid_sett.setvencattr.imagegrade}`+"&"+
                      "-gop=" +`${vid_sett.setvencattr.gop}`+"&"+
                      "cmd=setvencattr&"+
                      "-chn=" +`${vid_sett.setvencattr_2.chn}`+"&"+
                      "-bps=" +`${vid_sett.setvencattr_2.bps}`+"&"+
                      "-fps=" +`${camera_framerate}`+"&"+ //`${vid_sett.setvencattr.fps}`+"&"+
                      "-brmode=" +`${vid_sett.setvencattr_2.brmode}`+"&"+
                      "-imagegrade=" +`${vid_sett.setvencattr_2.imagegrade}`+"&"+
                      "-gop=" +`${vid_sett.setvencattr_2.gop}`
                      


  const apiUrl = 'http://' + `${camera_ip}` + "/web/cgi-bin/hi3510/param.cgi?"+`${set_video_data}`;
  // const username = 'admin';
  // const password = 'admin';
  console.log("Api working inside Frame Rate",camera_ip,username,password,camera_framerate)
  try {
      await axios.get(apiUrl,  {
          auth: {
              username: username,
              password: password
          }
      });
  } catch (error) {
    console.log(error)
  }
};

export const WDRStatusApi_VMS = async (camera_ip,username,password,camera_wdr_status) => {
  const set_image_data="cmd=setinfrared&cururl=http%3A%2F%2F"+`${camera_ip}`+"%2Fweb%2Fdisplay.html"+
  "&-infraredstat="+`${img_sett.setinfrared.infraredstat}`+
  "&cmd=setircutattr"+
  "&-saradc_switch_value="+`${img_sett.setircutattr.saradc_switch_value}`+
  "&cmd=setlampattrex"+
  "&-lamp_mode="+`${img_sett.setlampattrex.lamp_mode}`+
  "&cmd=setimageattr"+
  "&-brightness="+`${img_sett.setimageattr.brightness}`+
  "&-contrast="+`${img_sett.setimageattr.contrast}`+
  "&-saturation="+`${img_sett.setimageattr.saturation}`+
  "&-sharpness="+`${img_sett.setimageattr.sharpness}`+
  "&-mirror="+`${img_sett.setimageattr.mirror}`+
  "&-flip="+`${img_sett.setimageattr.flip}`+
  "&-shutter="+`${img_sett.setimageattr.shutter}`+
  "&-night="+`${img_sett.setimageattr.night}`+
  "&-wdr="+`${camera_wdr_status}`+//`${img_sett.setimageattr.wdr}`+
  "&-wdrvalue="+`${img_sett.setimageattr.wdrvalue}`+
  "&-noise="+`${img_sett.setimageattr.noise}`+
  "&-gc="+`${img_sett.setimageattr.gc}`+
  "&-ae="+`${img_sett.setimageattr.ae}`+
  "&-targety="+`${img_sett.setimageattr.targety}`+
  "&-aemode="+`${img_sett.setimageattr.aemode}`+
  "&-image_type="+`${img_sett.setimageattr.image_type}`+
  "&-imgmode="+`${img_sett.setimageattr.imgmode}`;



  const apiUrl = "http://" + `${camera_ip}` + "/web/cgi-bin/hi3510/param.cgi?"+`${set_image_data}`;
  // const username = 'admin';
  // const password = 'admin';
  console.log("Api working inside WDR",camera_ip,username,password,camera_wdr_status)
  try {
      await axios.get(apiUrl,  {
          auth: {
              username: username,
              password: password
          }
      });
  } catch (error) {
    console.log(error)
  }
};


export const OSDSettApi_VMS = async (camera_ip,username,password) => {
  const set_OSD_data="cmd=setoverlayattr&cururl=http%3A%2F%2F"+`${camera_ip}`+"192.168.1.88%2Fweb%2Fosd.html"+
  "&-region="+`${OSD_Sett.setoverlayattr.region}`+
  "&-show="+`${OSD_Sett.setoverlayattr.show}`+
  "&-place="+`${OSD_Sett.setoverlayattr.place}`+
  "&-name="+`${OSD_Sett.setoverlayattr.name}`;




  const apiUrl = "http://" + `${camera_ip}` + "/web/cgi-bin/hi3510/param.cgi?"+`${set_OSD_data}`;

  console.log("Api working inside OSD",camera_ip,username,password)
  try {
      await axios.get(apiUrl,  {
          auth: {
              username: username,
              password: password
          }
      });
  } catch (error) {
    console.log(error)
  }
};