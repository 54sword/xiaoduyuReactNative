import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, PixelRatio } from 'react-native'

// import AnimatedHeader from 'react-native-animated-header';
// import Collapsible from 'react-native-collapsible-header';
// import Headroom from 'react-native-headroom'

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getPostsTips } from '../../reducers/website';
import { getProfile } from '../../reducers/user';
import { loadNewPosts } from '../../actions/posts';

// components
import PostsList from '../../components/posts/list';
import NotSignIn from '../../components/not-sign-in';
import Header from '../../components/header';

// styles
import styles from './styles';

@connect(
  (state, props) => ({
    me: getProfile(state),
    postsTips: getPostsTips(state)
  }),
  dispatch => ({
    loadNewPosts: bindActionCreators(loadNewPosts, dispatch)
  })
)
export default class Follow extends Component {

  static navigationOptions = ({navigation}) => {

    const { params = {} } = navigation.state;

    return {
      title: '关注',
      // tabBarVisible: false,
      tabBarIcon: ({ tintColor }) => (<View>
        <Image
          source={require('./images/home.png')}
          style={[styles.icon, {tintColor: tintColor}]}
          />
        {params.redPoint ? <View style={styles.redPoint}></View> : null}
      </View>),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        if (global.signInStatus) {
          if (params.load) params.load();
          defaultHandler();
        } else {
          navigation.navigate('Sign', {
            routeName: 'Follow'
            // setParams: {
              // start: true
            // }
            // onSignInFinish: ()=>{
            //   params.start();
            // }
          });
        }
      }
    }

  }

  constructor (props) {
    super(props)
    this.state = {
      redPoint: false,
      // 是否是当前显示的界面
      focus: true
    }
  }

  componentDidMount() {

    const { loadNewPosts } = this.props;

    this.didFocusSubscription = this.props.navigation.addListener('didFocus', payload=>{
      this.state.focus = true;
    });

    this.didBlurSubscription = this.props.navigation.addListener('didBlur', payload=>{
      this.state.focus = false;
    });

    this.props.navigation.setParams({
      load: async () => {

        // 如果是在当前页面，按下tab nav 按钮，则刷新
        if (this.state.focus) {
          
          // console.log(this.list.props);

          // setTimeout(()=>{
            // this.list.scrollToIndex({ viewPosition: 1, index: 0, animated: true });
            this.list.props._onRefresh(true);
          // });
          return;
        }

        let hasNew = await loadNewPosts();
        if (this.list && hasNew) {
          this.list.scrollToIndex({ viewPosition: 1, index: 0 });
          return;
        }

      }
    });

  }

  componentWillMount() {
    if (this.didFocusSubscription) this.didFocusSubscription.remove();
    if (this.didBlurSubscription) this.didBlurSubscription.remove();
  }

  render() {
    const { navigation, me } = this.props;

    return <View
          style={{ flex:1 }}>

            <PostsList
            {...this.props}
            renderHeader={
              <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:16, fontWeight:'bold', color:'#292524'}}>你的关注</Text>
              </View>
            }
            navigation={navigation}
            name={'follow'}
            filters={{
              query: {
                method: 'user_follow',
                sort_by: "sort_by_date",
                deleted: false,
                weaken: false
              }
            }}
            collapsible={true}
            getRef={(list)=>{
              this.list = list;
            }}
            />

          </View>
  }
}
