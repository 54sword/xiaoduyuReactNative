import Qiniu,{ Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu'

export const uploadFile = ({ name, imagePath, qiniu, callback })=>{

  Rpc.uploadFile(imagePath, qiniu.token, { key : name }).then((response) => {

    if (response.responseText) {
      let res = JSON.parse(response.responseText);
      let imageUrl = qiniu.url+'/'+res.key;
      callback(100, imageUrl);
    }

  }).then((responseText) => {
    console.log(responseText);
    // callback(100, qiniu.url+'/'+name);
  }).catch((error, e) => {

    if (error && error.response) {
      try{
        let res = JSON.parse(error.response);

        if (res && res.error && res.error == 'file exists') {
          callback(100, qiniu.url+'/'+name);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log(error);
    }

  });

}
