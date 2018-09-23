

var config = {
  debug: false,

  // 反馈邮箱（用户无法登陆或使用异常，可以通过该邮箱联系我们）
  feedback_email: '54sword@gmail.com',
  // API 地址
  // api_url: 'https://api.xiaoduyu.com',
  api_url: 'http://192.168.1.4:3000',
  api_verstion: 'api/v1',

  // 官网
  official_website: 'https://www.xiaoduyu.com',

  // 原始的api域名，第三方登录的时候，跳转使用
  original_api_domain: 'https://api.xiaoduyu.com',

  graphql_url: 'https://api.xiaoduyu.com/graphql',

  // websocket 链接地址
  socket_url: 'https://api.xiaoduyu.com',

  GA: '',
  // 微信开放平台，移动应用openid
  wechat_appid: 'wxdc4c0a66df9da9b5',

  editor: {
    // 是否启动开发环境
    dev: false
  }
}

// 开发环境配置
if (config.debug) {
  config.graphql_url = 'http://192.168.1.4:3000/graphql';
  config.socket_url = 'http://192.168.1.4:3000';
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
