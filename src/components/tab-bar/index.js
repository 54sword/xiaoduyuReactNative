
import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Text, Image, AsyncStorage, TouchableOpacity, PixelRatio, Animated, Dimensions } from 'react-native'
import Platform from 'Platform'

import WriteIcon from '../ui/icon/write'

const { height, width } = Dimensions.get('window');

import { ifIphoneX } from 'react-native-iphone-x-helper'

let tabWidth = 60;

class Tabbar extends Component {

  static defaultProps = {
    tabWidth: tabWidth
  }

  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
      tabWidth: this.props.tabWidth,
      contentOffset: { x: 0, y: 0 }
    }
    this.updateAnimation = this.updateAnimation.bind(this)
  }

  componentWillMount() {
    const { initialPage } = this.props
    this.updateAnimation(initialPage)
  }

  componentDidMount() {
    const self = this
    this.props.onScroll((index)=>{
      self.updateAnimation(index)
    })
  }

  updateAnimation(index) {

    const { tabs } = this.props
    let { tabWidth, contentOffset } = this.state

    let params = { fadeAnim: tabWidth * index }

    let postion = { x: 0, y: 0 }

    // 平均显示个数
    let per = Math.floor(width/tabWidth)

    // 超出部分的平均数
    let offset = (width - (tabWidth*per)) / 2

    let min = width/2,
        max = tabs.length * tabWidth - width

    // 大于屏幕个数时候，才对其计算
    if (tabs.length > per) {

      if (index * tabWidth > max) {
        postion.x = index * tabWidth - max
        if (postion.x > max) postion.x = max
      } else if (index * tabWidth > min) {
        postion.x = index * tabWidth - (per * tabWidth) / 2
      }

      if (Platform.OS == 'android') {
        if (this.refs['scroll-view']) {
          this.refs['scroll-view'].scrollTo(postion)
        }
      } else {
        params.contentOffset = postion
      }

    }

    this.setState(params)

  }

  render() {

    const self = this
    const { tabs, activeTab, goToPage, rightContent, redPointTab = [] } = this.props
    const { tabWidth, contentOffset } = this.state

    // console.log(this.state.fadeAnim);

    let centerContent = (<View style={styles.tabbarCenter}>
                <View style={[styles.tabView, { width: tabWidth * tabs.length }]}>
                  {tabs.map((item, index)=>{
                    return (<View key={index} style={{flex:1}}><TouchableOpacity onPress={()=>{ goToPage(index) }} activeOpacity={0.8} style={activeTab == index ? styles.tabActive : styles.tab}>
                          <Text style={activeTab == index ? { color:'#292524', fontSize: 15, fontWeight:'bold' } : { color:'#81848b', fontSize: 15 }}>{item}</Text>
                      </TouchableOpacity>
                      {redPointTab.indexOf(index) != -1 ? <View style={styles.redPoint}></View> : null}
                    </View>)
                  })}
                </View>
                <View style={{ width: tabWidth * tabs.length }}>
                  <Animated.View style={[styles.underline, { marginLeft: this.state.fadeAnim + (60 - 16)/2 }]}></Animated.View>
                </View>
              </View>)

    if (tabs.length > Math.floor(width/tabWidth)) {
      centerContent = (<ScrollView
        ref="scroll-view"
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentOffset={contentOffset}
      >
        {centerContent}
      </ScrollView>)
    }


    return(<View style={styles.tabbar}>

        {/*<View style={styles.tabbarLeft}></View>*/}

        {centerContent}

        <View style={styles.tabbarRight}>
          {rightContent}
        </View>

      </View>)
  }
}

var styles = StyleSheet.create({
  tabbar: {
    justifyContent: 'space-between',
    ...ifIphoneX({
      backgroundColor: '#fff',
      paddingTop:20,
      height:60,
      flexDirection: 'row',
      borderBottomWidth: 1/PixelRatio.get(),
      borderColor: '#e2e2e2'
    }, {
      backgroundColor: '#fff',
      paddingTop: Platform.OS === 'android' ? 0 : 0,
      height: Platform.OS === 'android' ? 50 : 45,
      flexDirection: 'row',
      borderBottomWidth: 1/PixelRatio.get(),
      borderColor: '#e2e2e2'
    })
  },

  tabbarLeft: { flex:1 },
  tabbarRight: {},
  tabbarCenter: {
    // flex:1,
    // backgroundColor:'#333'
    // flex:1,
    // justifyContent: 'center',
    // alignItems: 'center'
  },

  scrollView: {
    // flex:1,
    // backgroundColor:'#efefef'
  },

  item: {
    flex: 1
    // flexDirection: 'row',
    // justifyContent: 'center'
  },
  tabView: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center'
  },
  tab: {
    flex:1,
    // borderBottomWidth: 3,
    // borderColor: '#fff',
    // width:80,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#efefef'
  },
  tabActive: {
    flex:1,
    // borderBottomWidth: 3,
    // borderColor: '#08f',
    // width:80,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#efefef'
  },
  // 下划线
  underline: {
    // flex:1,
    height:2,
    width:16,
    borderRadius:1,
    backgroundColor: '#292524',
    ...ifIphoneX({
      marginTop:-8
    },{
      marginTop:-10
    })
  },
  itemFixed: {
    ...ifIphoneX({
      height: 45,
      width: tabWidth,
      justifyContent: 'center',
      alignItems: 'center'
    }, {
      height: 45,
      width: tabWidth,
      justifyContent: 'center',
      alignItems: 'center'
    })
  },

  redPoint: {
    position:'absolute',
    marginTop:10,
    marginLeft:53,
    width:8,
    height:8,
    backgroundColor: 'red',
    borderRadius: 4
  }
})

export default Tabbar
