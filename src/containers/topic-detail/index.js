import React, { Component } from 'react';
import { View, Text, Image, Button, TouchableOpacity } from 'react-native';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadTopicList } from '../../actions/topic';
import { getTopicListByKey } from '../../reducers/topic';
import { getProfile } from '../../reducers/user';


// components
import PostsList from '../../components/posts/list';
import Loading from '../../components/ui/loading';
import Nothing from '../../components/nothing';
import FollowButton from '../../components/follow/button';

// styles
import styles from './styles';

@connect(
  (state, props) => {
    const id = props.navigation.state.params.id;
    return {
      topicList: getTopicListByKey(state, id),
      me: getProfile(state)
    }
  },
  dispatch => ({
    loadTopics: bindActionCreators(loadTopicList, dispatch)
  })
)
export default class TopicDetail extends Component {

  static navigationOptions = ({ navigation }) => {

    const { params = {} } = navigation.state

    let obj = {
      title: params.title
    }

    if (params.headerRight) obj.headerRight = params.headerRight;

    return obj;
  }

  constructor (props) {
    super(props)
    this.state = {
      nothing: ''
    }

    this.createPosts = this.createPosts.bind(this)
  }


  async componentDidMount() {

    const self = this;
    const { id } = this.props.navigation.state.params;
    const { me, topicList, loadTopics } = this.props;
    const { navigate } = this.props.navigation;

    let topic = topicList && topicList.data && topicList.data[0] ? topicList.data[0] : null;

    if (!topicList || !topicList.data || !topicList.data[0]) {

      let [ err, list ] = await loadTopics({
        id: id,
        filters: { variables: { _id: id } }
      });

      if (err || !list || !list.data || !list.data[0]) {
        this.setState({
          nothing: err || '该话题不存在'
        });
        return;
      }

      topic = list.data[0];

    }

    this.props.navigation.setParams({
      headerRight: (<View style={styles.headerRight}>

        {me ?
          <TouchableOpacity
            onPress={()=>{
              navigate('WritePosts', { topic, useCache: false });
            }}
            style={{
              marginRight:15,
              paddingLeft:12,
              paddingRight:12,
              borderRadius:12,
              height:25,
              justifyContent:'center',
              borderWidth:1,
              borderColor:'#436ce6'
            }}
            >
            <Text style={{color:'#436ce6'}}>发帖</Text>
          </TouchableOpacity>
          : null}



      </View>)
    })

  }

  createPosts() {

    const { navigate } = this.props.navigation
    const { topic } = this.props.navigation.state.params
    navigate('WritePosts', { topic })
  }

  render() {

    const { id } = this.props.navigation.state.params;
    const { navigation, topicList } = this.props;
    const { nothing } = this.state;
    const { loading, data } = topicList || {};

    const topic = data && data[0] ? data[0] : null;

    if (nothing) return <Nothing content={nothing} />;
    if (!topic || loading) return <Loading />;

    return (<View style={styles.container}>

            <PostsList
              navigation={navigation}
              renderHeader={<View style={styles.topicContainer}>

                <View>
                  <Image source={{uri:'https:'+topic.avatar}} style={styles.avatar} />
                </View>

                <View style={{flex:1}}>
                  <View><Text style={styles.name}>{topic.name}</Text></View>
                  <View><Text>{topic.brief}</Text></View>
                  <View style={{marginTop:5}}>
                    <Text style={{fontSize:13,color:'rgb(112, 112, 112)'}}>{topic.posts_count} 帖子 {topic.follow_count} 关注</Text>
                  </View>
                </View>

                <View>
                  <FollowButton
                    topic={topic}
                    onFinish={()=>{
                      self.componentDidMount();
                    }}
                    buttonType="max-white"
                    />
                </View>

              </View>}
              name={id}
              filters={{
                query: {
                  sort_by: "sort_by_date",
                  deleted: false,
                  weaken: false,
                  page_size: 10,
                  topic_id: id
                }
              }}
              />

          </View>)
  }
}
