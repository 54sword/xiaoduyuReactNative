
let config = {
  debug: false,

  // 反馈邮箱（用户无法登陆或使用异常，可以通过该邮箱联系我们）
  feedbackEmail: '54sword@163.com',

  // 官网
  officialWebsite: 'https://www.xiaoduyu.com',

  // 原始的api域名，第三方登录的时候，跳转使用
  apiDomain: 'https://api.xiaoduyu.com',

  // graphql
  graphqlUrl: 'https://api.xiaoduyu.com/graphql',

  // websocket 链接地址
  socketUrl: 'https://api.xiaoduyu.com',

  // GA: '',
  
  // 微信开放平台，移动应用openid
  wechatAppid: '',

  editor: {
    // 是否启动开发环境
    dev: false
  },
  
  GA: ''
}

// 开发环境配置
if (config.debug) {
  config.graphqlUrl = 'http://192.168.1.4:3000/graphql';
  config.socketUrl = 'http://192.168.1.4:3000';
  //开发环境富文本编辑器配置
  // ./editor
  config.editor = {
    // 是否启动开发环境
    dev: false,
    // 服务器地址
    host: '192.168.1.4',
    // 端口
    port: 9000
  }
}


module.exports = config;
