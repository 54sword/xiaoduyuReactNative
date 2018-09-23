


// 将代码中的<img />替换成[图片]
export const htmlImgTransformText = (html, length = 140) => {

  let imgReg = /<img(.*?)>/gi;
  let imgs = [];
  let img;

  while (img = imgReg.exec(html)) {
    imgs.push(img[0]);
  }
  
  imgs.map(item=>{
    html = html.replace(item, '[图片] ');
  });

  // 删除所有html标签
  html = html.replace(/<[^>]+>/g,"");

  if (html.length > length) html = html.slice(0, length)+'...';

  return html;
}
