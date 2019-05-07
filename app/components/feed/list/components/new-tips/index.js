import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { loadNewFeed } from '@actions/feed';
import { getProfile } from '../../../../../store/reducers/user';
import { getFeedListById } from '../../../../../store/reducers/feed';
import { refreshFeedListById } from '../../../../../store/actions/feed';
import { loadTips } from '../../../../../store/actions/tips';
import { loadUserInfo } from '../../../../../store/actions/user';
import { getTipsById } from '../../../../../store/reducers/tips';
import styles from './style';

@connect(
  (state, props) => {
    const { topicId } = props;
    return {
      me: getProfile(state),
      // isMember: isMember(state),
      getFeedListById: id => getFeedListById(state, id),
      hasNew: getTipsById(state, topicId)
    }
  },
  dispatch => ({
    // loadNewFeed: bindActionCreators(loadNewFeed, dispatch),
    // loadPostsList: bindActionCreators(loadPostsList, dispatch),
    refreshFeedListById: bindActionCreators(refreshFeedListById, dispatch),
    loadTips: bindActionCreators(loadTips, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  })
)
export default class NewFeedTips extends React.Component {

  static propTypes = {
    // 话题的id
    topicId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      display: false
    }
    this.loadNewPosts = this.loadNewPosts.bind(this);
  }

  async componentDidMount() {

    const { me, topicId, getFeedListById, loadUserInfo, loadTips } = this.props;

    let date = me[`last_find_${topicId}_at`] || '';
    
    if (!date) return;
    
    let { data = null } = getFeedListById(topicId);

    if (!data || !data[0]) return;

    // 如果当前帖子的中数据比当前用户的记录要大，说明已经是最新的，更新用户的数据，以及tips状态
    if (topicId == 'feed' &&
        new Date(date).getTime() < new Date(data[0].create_at).getTime()
      ) {
        await loadUserInfo({});
        loadTips();
    }
    
  }

  componentWillReceiveProps(props) {
    if (this.props.topicId != props.topicId) {
      this.props = props;
      this.componentDidMount();
    }
  }

  async loadNewPosts() {
    const { topicId, refreshFeedListById, loadTips, loadUserInfo } = this.props;

    if (topicId == 'feed') {
      await refreshFeedListById(topicId);
      await loadUserInfo({});
      loadTips();
    }
  }

  render() {
    const { hasNew } = this.props;
    if (!hasNew) return null;
    return <TouchableOpacity style={styles.button} onPress={this.loadNewPosts}><Text>有新的动态</Text></TouchableOpacity>
  }

}
