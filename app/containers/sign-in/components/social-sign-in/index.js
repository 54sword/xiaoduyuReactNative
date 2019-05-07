
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as QQAPI from 'react-native-qq';
import { Toast, ModalIndicator } from 'teaset';

import navigationService from '../../../../navigators/service';

import styles from './styles';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { QQOAuth } from '../../../../store/actions/oauth';

/**
 * 社交账号登陆
 * @type {Object}
 */
@connect(
  (state, props) => ({
  }),
  dispatch => ({
    QQOAuth: bindActionCreators(QQOAuth, dispatch),
  })
)
export default class SocialSignIn extends PureComponent {

  static propTypes = {
    // 执行登陆的回调事件
    handleSignIn: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
    }
    this.toSign = this.toSign.bind(this)
  }

  toSign(name) {

    if (name == 'qq') {
      QQAPI.login().then(async result=>{
        
        let loading = Toast.show({
          text: '登陆中...',
          icon: <ActivityIndicator size='large' />,
          position: 'center',
          duration: 1000 * 60
        });

        let [ err, res ] = await this.props.QQOAuth(result);

        if (res) {
          this.props.handleSignIn(res.access_token)
        }

        Toast.hide(loading);
        
      });

      return;
    }

    navigationService.navigate('OtherSignIn', {
      successCallback: this.props.handleSignIn,
      name
    });

  }

  render() {

    let list = [
      {
        id:'qq',
        image: require('./images/qq.png'),
        name:'QQ'
      },
      {
        id:'weibo',
        image: require('./images/weibo.png'),
        name:'微博'
      },
      {
        id:'github',
        image: require('./images/github.png'),
        name:'GitHub'
      }
    ]

    return (

      <View style={styles.container}>
        <View><Text style={styles.text}>社交账号登录</Text></View>
        <View style={styles.main}>

          {list.map(item=>(
            <TouchableOpacity
              key={item.id}
              onPress={()=>this.toSign(item.id)}
              style={styles.button}>

              <View style={styles.iconView}>
                <Image source={item.image} style={styles.icon} resizeMode="cover" />
              </View>

              <View><Text style={styles.text}>{item.name}</Text></View>

            </TouchableOpacity>
          ))}

        </View>
      </View>

    )
  }
}
