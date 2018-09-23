
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native';

import NavigationService from '../../../../actions/navigation-service';

import styles from './styles';

/**
 * 社交账号登陆
 * @type {Object}
 */
export default class SocialSignIn extends PureComponent {

  static propTypes = {
    // 执行登陆的回调事件
    handleSignIn: PropTypes.func.isRequired
  }

  toSign(name) {

    NavigationService.navigate('OtherSignIn', {
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
        <View><Text style={styles.text}>社交账号登陆</Text></View>
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
