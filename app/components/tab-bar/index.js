
import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, PixelRatio, Animated, Dimensions } from 'react-native'
import Platform from 'Platform'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getTipsById } from '../../store/reducers/tips';

import navigationService from '../../navigators/service';

const { height, width } = Dimensions.get('window');

let tabWidth = 60;

import styles from './style';


@connect(
  (state, props) => ({
    redPointTab: [
      false,
      //getTipsById(state, 'home'),
      getTipsById(state, 'feed'),
      getTipsById(state, 'subscribe')
    ]
  }),
  dispatch => ({
  })
)
export default class Tabbar extends Component {

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
    const { tabs, activeTab, goToPage, leftContent, rightContent, redPointTab } = this.props
    const { tabWidth, contentOffset } = this.state

    /*
    let centerContent = (<View style={styles.tabbarCenter}>
                <View style={[styles.tabView]}>
                  {tabs.map((item, index)=>{
                    return (<View key={index} style={{flex:1}}>
                      <TouchableOpacity onPress={()=>{ goToPage(index) }} activeOpacity={0.8} style={activeTab == index ? styles.tabActive : styles.tab}>
                          <Text numberOfLines={1} ellipsizeMode="tail" style={activeTab == index ? { color:'#292524', fontSize: 15, fontWeight:'bold' } : { color:'#81848b', fontSize: 15 }}>{item}</Text>
                      </TouchableOpacity>
                      {redPointTab.indexOf(index) != -1 ? <View style={styles.redPoint}></View> : null}
                    </View>)
                  })}
                </View>
                <View style={{ width: tabWidth * tabs.length }}>
                  <Animated.View style={[styles.underline, { marginLeft: this.state.fadeAnim + (tabWidth - 16)/2 }]}></Animated.View>
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
    */

    return(<View style={styles.tabbar}>
        <View style={styles.tabbarLeft}>{leftContent}</View>
        <View style={styles.tabbarCenter}>
          <View style={[styles.tabView]}>
            {tabs.map((item, index)=>{
              return (<View key={index} style={{flex:1}}>
                <TouchableOpacity
                  onPress={()=>{

                    // if (activeTab == index) {
                    //   navigationService.navigate('ChooseTopic', {
                    //     onChoose: this.props.onChoose
                    //   });
                    // } else {
                      goToPage(index)
                    // }
                    
                  }}
                  activeOpacity={0.8}
                  style={activeTab == index ? styles.tabActive : styles.tab}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[(activeTab == index ? { color:'#1177fa', fontSize: 15, fontWeight:'bold' } : { color:'#5e6472', fontSize: 15, fontWeight:'bold' }) ]}
                      >
                      {/*activeTab == 0 && index == 0 ?
                        <Image source={require('./images/select-arrow.png')} style={styles.selectArrow} />
                      : null*/}
                      {item}
                    </Text>
                    {/*activeTab == 0 && index == 0 ?
                      <View style={styles.arrowBotton}>
                        <Image source={require('./images/select-arrow.png')} style={{width:10,height:10}} />
                      </View>
                    : null*/}
                </TouchableOpacity>
                {redPointTab[index] ? <View style={styles.redPoint}></View> : null}
                {/* {redPointTab.indexOf(index) != -1 ? <View style={styles.redPoint}></View> : null} */}
              </View>)
            })}
          </View>
          <View style={{ width: tabWidth * tabs.length }}>
            <Animated.View style={[styles.underline, { marginLeft: this.state.fadeAnim + (tabWidth - 16)/2-1 }]}></Animated.View>
          </View>
        </View>
        <View style={styles.tabbarRight}>{rightContent}</View>
      </View>)
  }
}