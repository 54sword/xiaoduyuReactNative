import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadTopicList } from '../../../../store/actions/topic';
import { getTopicListById } from '../../../../store/reducers/topic';
import { saveTopicId } from '../../../../store/actions/website';
import { getTopicId } from '../../../../store/reducers/website';
import { getTipsById } from '../../../../store/reducers/tips';

// import NavigationService from '../../../../store/actions/';
import navigationService from '../../../../navigators/service';

// styles
import styles from './styles';

@connect(
  (state, props) => ({
    topicList: getTopicListById(state, 'head'),
    topicId: getTopicId(state),
    unread: {
      home: getTipsById(state, 'home')
    }
  }),
  dispatch => ({
    loadTopicList: bindActionCreators(loadTopicList, dispatch),
    saveTopicId: bindActionCreators(saveTopicId, dispatch)
  })
)
export default class Topics extends Component {

  static defaultProps = {
    onChoose: ()=>{}
  }

  constructor (props) {
    super(props);
    this.state = {}
    this.onChoose = this.onChoose.bind(this);
  }

  componentDidMount() {

    const { loadTopicList } = this.props;

    loadTopicList({
      id: 'head',
      filters: {
        query: {
          parent_id: 'exists',
          page_size: 50,
          sort_by:'sort:-1,posts_count:-1'
        }
      }
    });

  }
  
  onChoose(topic) {

    navigationService.navigate('TopicDetail', { id: topic._id });

    // this.props.saveTopicId(topic._id)
    // this.props.onChoose(topic)
  }

  render() {
    const { data = [] } = this.props.topicList;
    const { topicId } = this.props;
    
    return (<View style={styles.box}>
      
      {/* 
      <View style={styles.titleBar}>
        <View><Text style={styles.titleText}>交流话题</Text></View>
        <TouchableOpacity
          onPress={()=>{
            navigationService.navigate('ChooseTopic', {
              onChoose: this.onChoose
            });
          }}
          style={styles.moreButton}
          >
          <Text style={styles.more}>全部话题</Text>
        </TouchableOpacity>
      </View>
      */}
          
      <View  style={styles.row}>
          {/* 
          <TouchableOpacity
            onPress={()=>this.onChoose({ _id: '', name: '全部' })}
            style={[styles.item, topicId == '' ? styles.active : null ]}
            >
              <Text style={[styles.topicName, topicId == '' ? { color:"#fff" } : null ]}>全部</Text>
            </TouchableOpacity>
            */}

          {data.map((item, index)=>{
            if (index > 16) return null;
            return (<TouchableOpacity
              key={item._id}
              onPress={()=>this.onChoose(item)}
              style={[styles.item, topicId == item._id ? styles.active : null ]}
              >
              <Text style={[styles.topicName, topicId == item._id ? { color:"#fff" } : null ]}>{item.name}</Text>
            </TouchableOpacity>)
          })}
        
      </View>
        
      {/* 
      <TouchableOpacity
          onPress={()=>{
            navigationService.navigate('ChooseTopic', {
              onChoose: this.onChoose
            });
          }}
          style={styles.moreButton}
          >
          <Text style={styles.more}>浏览全部话题</Text>
        </TouchableOpacity>
      */}
      
    </View>)
  }
}
