import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { StackActions, NavigationActions } from 'react-navigation';

import * as JPush from '../../common/jpush';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '../../reducers/user';
import { loadUnreadCount } from '../../actions/notification';
import { newPostsTips } from '../../actions/posts';
import { checkClientInstalled } from '../../actions/client-installed';

// components
import Loading from "../../components/ui/loading";

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({
    loadUnreadCount: bindActionCreators(loadUnreadCount, dispatch),
    newPostsTips: bindActionCreators(newPostsTips, dispatch),
    checkClientInstalled: bindActionCreators(checkClientInstalled, dispatch)
  })
)
export default class Entrance extends Component {

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

    const { me, navigation, loadUnreadCount, newPostsTips, checkClientInstalled } = this.props;

    // 检测微信、QQ类软件是否安装
    checkClientInstalled();

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
        actions: [NavigationActions.navigate({ routeName: 'Main' })]
      }));

      // 进入入口界面后，需要跳转到界面路由名称
      const { jumpToRouteName, setParams = {}, callback = ()=>{} } = this.props.navigation.state.params || {};
      if (jumpToRouteName) navigation.navigate(jumpToRouteName, setParams);
      if (callback) setTimeout(callback, 2000);

      // 启动jpush
      JPush.start(me && me._id ? me._id : '');

      // 登陆用户查询未读通知，以及新帖子提醒
      if (me && me._id) {
        loadUnreadCount();
        newPostsTips();
      }

    }

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
        <Text style={{fontSize:16}}>你的账号被封</Text>
      </View>);
    }

    return null;
  }

}
