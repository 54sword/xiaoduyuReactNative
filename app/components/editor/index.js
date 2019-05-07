
import React, { Component } from 'react';
import {
  StyleSheet, Text, View, Button, Image, TouchableOpacity,
  TouchableHighlight, ActivityIndicator, Platform,
  KeyboardAvoidingView, Keyboard, Alert
} from 'react-native';

import { Toast, ModalIndicator } from 'teaset';

import { ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';

import { WebView } from "react-native-webview";

import ImagePicker from 'react-native-image-crop-picker';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// tools
import { uploadFile } from '../../common/upload-qiniu';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../store/reducers/user';
import { getQiNiuToken } from '../../store/actions/qiniu';

// styles
import styles from './styles';

import { editor } from '../../../config';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    getQiNiuToken: bindActionCreators(getQiNiuToken, dispatch)
  })
)
export default class Editor extends Component {

  static defaultProps = {
    // darft json
    darftJSON: '',
    getContent: ()=>{},
    focus: true,
    placeholder: '请输入...',
    onChange: ()=>{},
    type: 'comment'
  }


  constructor() {
    super()
    this.state = {
      qiniu: null,
      json: '',
      html: '',
      loading: false,
      isMount: true,
      showPlaceholder: false,
      iPhoneX: isIphoneX()
    }
    this.addPhoto = this.addPhoto.bind(this);
    this.init = this.init.bind(this);
    this.onBridgeMessage = this.onBridgeMessage.bind(this);
    this.sendToBridge = this.sendToBridge.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);

    this.webview = React.createRef();
  }

  async componentDidMount() {

    // 获取七牛的token
    let [ err, res ] = await this.props.getQiNiuToken();

    Keyboard.addListener('keyboardWillShow',()=>{
      if (!this.state.isMount) return;
      this.setState({
        showPlaceholder: false
      });
    });

    Keyboard.addListener('keyboardWillHide',()=>{
      if (!this.state.isMount) return;
      this.setState({
        showPlaceholder: true
      });
    });

    if (!this.state.isMount) return;

    if (res) this.setState({ qiniu: res });
  }

  componentWillUnmount() {

    Keyboard.removeListener('keyboardWillShow');
    Keyboard.removeListener('keyboardWillHide');

    this.state.isMount = false;
    this.sendToBridge('blur');
  }

  // 监听浏览器发来的消息
  onBridgeMessage(message) {

    let obj = null;

    try {
      obj = JSON.parse(message);
    } catch (err) {
      console.log(err);
    }

    if (!obj || !obj.type) return;

    switch (obj.type) {
      case 'onchange':
        this.state.html = obj.data.html;
        this.state.json = obj.data.json;
        this.props.onChange(obj.data.json);
        break;
      case 'uploaded':
        this.state.loading = false;
      case 'console':
        // console.log('-----');
        // console.log(obj.data);
        break;
    }
  }

  //发送消息给浏览器
  sendToBridge(type, data = '') {

    if (!this.state.isMount) return;

    try {
      // const { webviewbridge } = this.refs;
      let json = encodeURIComponent(JSON.stringify({ type, data }));

      const StringAs = (string) => {
        return string.replace(/(\\|\"|\'|\n|\r|\t)/g, "\\$1");
      }

      json = StringAs(json);

      // webviewbridge.sendToBridge(json);

      this.webview.current.postMessage(json);
    } catch (err) {
      console.log(err);
    }

  }

  // 初始化
  init() {

    if (!this.state.isMount) return;

    const { darftJSON, placeholder, getContent, focus } = this.props;

    this.sendToBridge('placeholder', placeholder);

    if (darftJSON) {
      this.sendToBridge('set-content', JSON.parse(darftJSON));
      this.props.onChange(darftJSON);
    }
    
    if (focus) {
      // setTimeout(()=>{
        this.sendToBridge('focus');
      // }, 1000);
    }

    // 发送获取json、html、loading状态的方法给父组件
    getContent(()=>{
      const { json, html, loading } = this.state;
      return {
        json,
        html,
        loading
      }
    });
  }

  handleUploadImage (image) {

    const self = this;
    const { me } = this.props;
    const { qiniu } = this.state;

    uploadFile({
      name: image.localIdentifier,
      imagePath: image.path,
      qiniu,
      callback: (progress, imageUrl)=>{

        if (!imageUrl) return;

        // console.log(imageUrl);

        self.sendToBridge('add-image', {
          name: image.localIdentifier,
          src: imageUrl
        });

      }
    });

  }

  addPhoto (type) {
    
    const self = this;
    const fn = type == 'camera' ?
      ImagePicker.openCamera({
        compressImageMaxWidth: 900,
        compressImageMaxHeight: 900
      })
      :
      ImagePicker.openPicker({
        multiple: true,
        maxFiles: 9
      });
    const { me } = this.props;

    fn.then(images => {

      // console.log(images);

      if (type == 'camera') {
        images.localIdentifier = new Date().getTime() + '-' + me._id;
        images = [images];
      }

      if (images.length == 0) return;

      let data = [];
      
      images.map(image=>{

        if (!image.localIdentifier) {
          let arr = image.path.split('/');
          image.localIdentifier = arr[arr.length - 1];
        }

        data.push({
          name: image.localIdentifier,
          src: ''
        });
      });

      self.state.loading = true;
      self.sendToBridge('add-image-placeholder', data);

      images.map(image=>{
        self.handleUploadImage(image);
      });

    }).catch(err=>{

      Toast.fail('图片上传失败');
    
      // console.log('======');
      // console.log(err)

      // Alert.alert(err)
      
      
      self.sendToBridge('blur');
      /*
      setTimeout(()=>{
        self.sendToBridge('focus');
      }, 100);
      */

    });

  }

  render() {
    const self = this;
    let { showPlaceholder, iPhoneX } = this.state;

    if (!iPhoneX) showPlaceholder = false;

    let source = (Platform.OS == 'ios') ? require('../../../editor/dist/index.html') : { uri: 'file:///android_asset/index.html' };

    // if (editor.dev) {
      // source = {
      //   uri: 'http://'+editor.host+':'+editor.port
      // }
    // }

    // source = {
    //   uri: 'http://192.168.1.4:5000'
    // }

    // originWhitelist={['*']}
    // source={{html: '<h1>Hello world</h1>'}}

    // return null;

    return (<View style={styles.container}>

            
            <WebView
              originWhitelist={['*']}
              style={{flex:1}}
              ref={this.webview}
              source={source}
              autoFocus={true}
              hideKeyboardAccessoryView={true}
              onMessage={(event)=>{
                this.onBridgeMessage(event.nativeEvent.data)
                // console.log(event.nativeEvent.data)
              }}
              // useWebKit=
              onLoad={()=>{
                setTimeout(()=>{
                  self.init();
                }, 500);
              }}
              />
              

            {/* 
            <WebViewBridge
              keyboardDisplayRequiresUserAction={false}
              hideKeyboardAccessoryView={true}
              onBridgeMessage={this.onBridgeMessage}
              ref="webviewbridge"
              source={source}
              autoFocus={true}
              onLoad={()=>{
                setTimeout(()=>{
                  self.init();
                }, 500);
              }}
              />
            */}

            {/* 控制台 */}
            <View style={styles.control}>
              <View style={styles.controlLeft}>
                <TouchableOpacity onPress={()=>{ self.addPhoto(); }} style={styles.controlItem}>
                  <Image source={require('./images/image.png')} style={styles.controlIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{ self.addPhoto('camera'); }} style={styles.controlItem}>
                  <Image source={require('./images/photo.png')} style={styles.controlIcon} />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={()=>{
                  self.sendToBridge('blur');
                  Keyboard.dismiss();
                }} style={styles.controlItem}>
                  <Image source={require('./images/pick-up.png')} style={styles.controlIcon} />
                </TouchableOpacity>
              </View>
            </View>

            {showPlaceholder ? <View style={{height:20}}></View> : null}

            {Platform.OS === 'ios' ? <KeyboardSpacer /> : null}

            {/*Platform.OS === 'android' && this.props.type == 'comment' ? null : <KeyboardSpacer />*/}

          </View>)
  }

}
