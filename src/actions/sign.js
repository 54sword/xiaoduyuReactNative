import Ajax from '../common/ajax';
import graphql from '../common/graphql';

// cookie安全措施，在服务端使用 http only 方式储存cookie
export const saveSignInCookie = ({ access_token }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {
      Ajax({
        domain: window.location.origin,
        apiVerstion: '',
        url: '/sign/in',
        type: 'post',
        data: { access_token }
      }).then(res=>{
        resolve([null, res])
      }).catch(err=>{
        resolve([err])
      })
    })
  }
}

// 登录
export const signIn = ({ data }) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        api: 'signIn',
        args: data,
        fields: `
          user_id
          access_token
          expires
        `
      });

      if (err) return resolve([ err ? err.message : '账号或密码错误' ]);

      // 浏览器环境
      if (res.success && typeof window != 'undefined') {
        [ err, res ] = await saveSignInCookie(res)(dispatch, getState);
        window.location.reload();
        return
      }

      resolve([ null, res ]);

    })
  }
}

export const signOut = () => {
  return (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      Ajax({
        domain: window.location.origin,
        apiVerstion: '',
        url: '/sign/out',
        type: 'post'
      }).then(res=>{
        resolve([null, res]);
      }).catch(()=>{
        resolve([true]);
      })
    })
  }
}

export const signUp = (args) => {
  return (dispatch, getState) => {
    return new Promise(async resolve => {

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'addUser',
        args,
        fields: `
          success
        `
      });

      if (err) {
        resolve([err])
      } else {
        resolve([null, res])
      }

    })
  }
}

// 清空所有数据
export const cleanAllData = () => {
  return (dispatch, getState) => {
    console.log('清空所有数据');
    console.log(getState);
    let state = getState();
    state = {};
    console.log(getState());
  }
}
