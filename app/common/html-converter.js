function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

// 从html字符串中，获取所有图片地址
export const getImagesFromHTML = (str) => {

  let imgReg = /\<img(.*?)>/g;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  let result = [];

  let imgs = str.match(imgReg);

  if (imgs && imgs.length > 0) {
    imgs.map(img=>{
      let _img = img.match(srcReg);
      if (_img && _img[1]) result.push(_img[1]);
    });
  }

  return result;
}

export const link = (str) => {

  if (!str) return '';

  str = str.replace('&nbsp;', ' ');

  let imgReg = /(<a(.*?)>(.*?)<\/a>|<img(.*?)>)/gi;

  let aList = [];
  let arr = str.match(imgReg);

  // console.log(arr);

  if (arr && arr.length > 0) {
    str.match(imgReg).map(item=>{
      let id = '#'+randomString(18)+'#';

      aList.push({
        id,
        value: item
      });

      str = str.replace(item, id);
    });
  }

  let linkReg = /(http:\/\/>http:\/\/|http:\/\/|https:\/\/|www\.|magnet\:\?xt\=)(.*?)(?=\s|http|https|\)|\>|\]|\}|\<|\"|\'|$)/gi;

  let links = str.match(linkReg);

  // console.log(links);


  if (links && links.length > 0) {

    function sortNumber(a,b) {
      return b.length - a.length;
    }

    links = links.sort(sortNumber);

    let _links = [];
    
    links.map(item=>{

      /*
      switch (true) {
        case item.indexOf('youtube.com') != -1:
          return;
        case item.indexOf('youku.com') != -1:
          return;
        case item.indexOf('bilibli.com') != -1:
          return;
        case item.indexOf('music.163.com') != -1:
          return;
        // case item.indexOf('v.qq.com') != -1:
          // return;
      }
      */


      let id = '#'+randomString(18)+'#';

      _links.push({
        id,
        value: item
      })
      str = str.replace(item, id);
    });

    _links.map(item=>{
      
      // if (Device.isMobileDevice()) {
        // str = str.replace(item.id, `<a href=${item.value} rel="nofollow">${item.value}</a>`);
      // } else {

        let href = item.value.indexOf('http') == -1 ? 'http:'+item.value : item.value;

        str = str.replace(item.id, `<a href=${href} target="_blank" rel="nofollow">${item.value}</a>`);
      // }

    })

  }

  if (aList.length > 0) {
    aList.map(item=>{
      str = str.replace(item.id, item.value);
    })
  }

  return str;

}