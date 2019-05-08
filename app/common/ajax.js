
import config from '../../config'
// import errors from '../../config/errors'
import axios from 'axios'

/*
// 将错误代码转换成错误信息
const converterErrorInfo = (res) => {

  // 合成
  let synthesis = (string, key, value) => {
    return string.replace(new RegExp("({"+key+"})","g"), value)
  }

  // 获取错误提示
  if (res.error) {
    res._error = res.error
    if (typeof res.error == 'string' || typeof res.error == 'number') {
      res.error = errors[res.error] || '错误代码: '+res.error
    } else if (typeof res.error == 'object') {
      for (let i in res.error) {
        res.error[i] = errors[res.error[i]] || '错误代码: '+res.error[i]
      }
    }
  }

  // 替换字符串中的参数
  if (res.error_data) {
    if (typeof res.error == 'array') {
      for (let i in res.error) {
        for (let n in res.error_data) {
          res.error[0] = synthesis(res.error[0], n, res.error_data[n])
        }
      }
    } else if (typeof res.error == 'string') {
      for (let i in res.error_data) {
        res.error = synthesis(res.error, i, res.error_data[i])
      }
    }
  }

  return res

}
*/
// 等待请求结束
// let wait = {}

const AJAX = ({ url = '', type = 'get', data = {}, headers = {}, callback = ()=>{} }) => {

  let option = {
    url: config.api_url + '/' + config.api_verstion + url,
    method: type
  }

  // ajax 请求唯一 id
  // let id = option.url + JSON.stringify(data)

  // 如果已经有请求正在进行,那么拦截相同的请求
  // if (wait[id]) {
  //   if (config.debug && console.log) console.log(url+' 正在请求中，请等候...')
  //   return
  // }

  if (type == 'get') {
    data._t = new Date().getTime()
    option.params = data
  } else if (type == 'post') {
    option.data = data
  }

  if (headers && headers.AccessToken) {
    option.headers = headers
  }

  if (type == 'post' && headers.AccessToken) {
    option.data.access_token = headers.AccessToken
    delete option.headers
  }

  if (config.debug && console.log) console.log('请求: ', option)

  return axios(option).then(resp => {

    // 请求成功
    // delete wait[id]
    if (config.debug && console.log) console.log('成功返回: ', resp)
    if (resp && resp.data) {
      callback(resp.data)
    } else {
      callback(null)
    }
  })
  .catch(function (error, res) {

    if (config.debug && console.log) {
      if (error.response) {
        console.log('失败返回: ', error.response.data)
      }
    }

    if (error && error.response && error.response.data) {
      callback(error.response.data)
    } else {
      // 没有网络
      callback(null)
    }
  })
}

export default AJAX
