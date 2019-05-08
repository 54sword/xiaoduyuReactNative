import React, { Component } from 'react'
import { View, Text, ScrollView, Image, StyleSheet, Alert, TouchableOpacity, PixelRatio, Platform } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { saveTopicId } from '../../../../store/actions/website';
import { getTipsById } from '../../../../store/reducers/tips';



import navigationService from '../../../../navigators/service';


// components
import Header from '../../../../components/header'

// styles
import styles from './style';

@connect(
  (state, props) => ({
    unread: getTipsById(state, 'home') || getTipsById(state, 'feed') || getTipsById(state, 'subscribe') || getTipsById(state, 'excellent')
  }),
  dispatch => ({
    saveTopicId: bindActionCreators(saveTopicId, dispatch)
  })
)
export default class Head extends Component {

  constructor (props) {
    super(props)
    this.state = {
      topic: null
    }
    this.showAllTopic = this.showAllTopic.bind(this)
    this.onChoose = this.onChoose.bind(this)
  }
  
  async componentDidMount() {

    try {
      let topic = await AsyncStorage.getItem('topic');
      topic = JSON.parse(topic);
      this.setState({ topic });
      this.onChoose(topic);
    } catch(e) {
    }

  }

  showAllTopic() {
    navigationService.navigate('ChooseTopic', {
      onChoose: this.onChoose
    });
  }
  
  onChoose(topic) {
    this.state.topic = topic;
    this.props.saveTopicId(topic._id);
    AsyncStorage.setItem('topic', JSON.stringify(topic));
  }

  render() {

    const { unread } = this.props;
    const { topic } = this.state;
    
    return (<Header
        left={<TouchableOpacity
            onPress={()=>{ navigationService.navigate('Search'); }}
            style={styles.headIconButton}
            >
            <Image source={require('./images/search.png')} style={styles.headIcon} />
          </TouchableOpacity>}
        center={<TouchableOpacity style={styles.topic} onPress={this.showAllTopic}>
            <Text style={styles.topicText}>
              {unread ? '(有新动态)' : ''}
              {topic ? topic.name : '全部'}
            </Text>
            <Image style={styles.arrow} source={require('./images/select-arrow.png')} />
          </TouchableOpacity>}
        right={<TouchableOpacity
            onPress={()=>{ navigationService.navigate('WritePosts'); }}
            style={styles.headIconButton}
            >
            <Image source={require('./images/plus.png')} style={styles.headIcon} />
          </TouchableOpacity>}
        />)
  }
}
