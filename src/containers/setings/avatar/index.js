import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Button, Image, TextInput, TouchableOpacity } from 'react-native';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import { ifIphoneX } from 'react-native-iphone-x-helper';

// tools
import { uploadFile } from '../../../common/upload-qiniu';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateUser, loadUserInfo } from '../../../actions/user';
import { getProfile } from '../../../reducers/user';
import { getQiNiuToken } from '../../../actions/qiniu';

// components
import Wait from '../../../components/ui/wait';
import HeadButton from '../../../components/ui/head-button';

// styles
import styles from './styles';

class ResetAvatar extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    let option = { title: '头像' }

    if (params.showActionSheet) {
      option.headerRight = (<TouchableOpacity onPress={()=>params.showActionSheet()}>
                    <HeadButton name="修改" />
                  </TouchableOpacity>);
    }

    return option
  }

  constructor (props) {
    super(props)
    this.state = {
      qiniu: null,
      submitting: false
    }
    this.handlePress = this.handlePress.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
  }

  async componentDidMount() {

    // 获取七牛的token
    let [ err, res ] = await this.props.getQiNiuToken();

    if (res) this.setState({ qiniu: res });

    this.props.navigation.setParams({
      showActionSheet: this.showActionSheet
    });
  }

  showActionSheet() {
    this.ActionSheet.show();
  }

  async handlePress(i) {

    const self = this;

    await new Promise(resolve=>{
      setTimeout(()=>{
        resolve();
      }, 500);
    });

    if (!i) {
    } else if (i == 1) {

      ImagePicker.openCamera({
        width: 512,
        height: 512,
        cropping: true
      }).then(image => {
        self.updateAvatar(image);
      }).catch(e => {});

    } else if (i == 2) {

      ImagePicker.openPicker({
        width: 512,
        height: 512,
        cropping: true
      }).then(image => {
        self.updateAvatar(image);
      }).catch(e => {});

    }
  }

  updateAvatar(image) {

    const self = this;
    const { me, updateUser, loadUserInfo } = this.props;
    const { qiniu } = this.state;

    image.localIdentifier = new Date().getTime() + '-' + me._id;
    self.setState({ visible: true });

    uploadFile({
      name: new Date().getTime() + '-' + me._id,
      imagePath: image.path,
      qiniu,
      callback: async (progress, imageUrl) => {
        if (!imageUrl) return;
        self.setState({ visible: false });

        await updateUser({ avatar: imageUrl });
        await loadUserInfo({});
      }
    });

  }

  render() {

    const self = this;
    const { me } = this.props
    const { submitting } = this.state

    let avatar = 'https:' + me.avatar_url.replace('thumbnail/!50', 'thumbnail/!300')

    return (<View style={styles.container}>
              <Image source={{uri: avatar}} style={styles.avatar} />

              <ActionSheet
                ref={o => this.ActionSheet = o}
                title={'上传头像'}
                options={[ '取消', '拍照', '相册']}
                cancelButtonIndex={0}
                destructiveButtonIndex={0}
                onPress={this.handlePress}
                styles={{
                  ...ifIphoneX({
                    cancelButtonBox: { paddingBottom:20, height:65 }
                  }, {})
                }}
              />

              {this.state.visible ? <Wait text="头像上传中..." /> : null}

              <View>
                <Text>禁止使用低俗或者敏感图片作为头像</Text>
              </View>

          </View>)
  }
}

export default connect(state => ({
    me: getProfile(state)
  }),
  (dispatch) => ({
    getQiNiuToken: bindActionCreators(getQiNiuToken, dispatch),
    updateUser: bindActionCreators(updateUser, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)(ResetAvatar);
