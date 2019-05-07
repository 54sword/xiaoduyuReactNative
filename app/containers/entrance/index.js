import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';

import * as Push from '../../common/aliyun-push';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../store/reducers/user';
import { checkClientInstalled } from '../../store/actions/client-installed';
import { saveTopicId } from '../../store/actions/website';
import { initUnlockToken } from '../../store/actions/unlock-token';

// components
import Loading from "../../components/ui/loading";

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    checkClientInstalled: bindActionCreators(checkClientInstalled, dispatch),
    saveTopicId: bindActionCreators(saveTopicId, dispatch),
    initUnlockToken: bindActionCreators(initUnlockToken, dispatch)
  })
)
export default class Entrance extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      network: true,
      block: false
    }
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  async init() {

    let res = await global.initialAppDate();
    
    const { me, navigation, checkClientInstalled, initUnlockToken } = this.props;

    initUnlockToken();

    // 检测微信、QQ类软件是否安装
    checkClientInstalled();

    try {
      let topic = await AsyncStorage.getItem('topic');
      topic = JSON.parse(topic);
      this.props.saveTopicId(topic._id);
    } catch(e) {
    }

    if (res == 'network error') {
      this.setState({
        network: false,
        loading: false
      });
    } else if (res == 'block account') {
      this.setState({
        block: true,
        loading: false
      });
    } else {
      this.setState({
        loading: false
      });

      navigation.dispatch(StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'App' })]
      }));

      // 进入入口界面后，需要跳转到界面路由名称
      const { jumpToRouteName, setParams = {}, callback = ()=>{} } = this.props.navigation.state.params || {};
      if (jumpToRouteName) navigation.navigate(jumpToRouteName, setParams);
      if (callback) setTimeout(callback, 2000);

      // 启动jpush
      Push.start(me && me._id ? me._id : '');
    }

    // 隐藏启动屏
    SplashScreen.hide();
  }

  render() {

    const { loading, network, block } = this.state;

    if (loading) return <Loading />;

    if (!network) {
      return (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <View style={{alignItems:'center'}}><Text style={{fontSize:22,fontWeight:'bold'}}>连接异常</Text></View>
        <View style={{alignItems:'center',marginTop:10,marginBottom:20}}>
          <Text style={{fontSize:15}}>请尝试重新连接服务器...</Text>
        </View>

        <TouchableOpacity onPress={()=>{
          this.setState({ loading: true });
          setTimeout(this.init, 1000);
        }}
        style={{alignItems:'center', height:40, paddingLeft:20, paddingRight:20, justifyContent:'center', backgroundColor:'#597fec', borderRadius:20}}
        >
          <Text style={{color:'#fff'}}>重新连接</Text>
        </TouchableOpacity>
      </View>);
    }

    if (block) {
      return (<View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:16}}>你的账号被禁止使用</Text>
      </View>);
    }

    return null;
  }

}
