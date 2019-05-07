import React, { PureComponent } from 'react';
import { View } from 'react-native';

import CommentList from '../../components/comment/list';
import PostsList from '../../components/posts/list';
// import TopicList from '../../components/topic-list';
import BlockList from '../../components/block/list';
import FollowList from '../../components/follow/list';

export default class List extends PureComponent {

  static navigationOptions = ({navigation}) => ({
    headerTitle: navigation.state.params.title
  })
  
  render() {

    const { navigation } = this.props;
    const { id, filters, args, fields, componentName, canClick = true, hideUserInfo = false } = this.props.navigation.state.params;

    let component = null;

    switch(componentName) {
      case 'PostsList':
        component = <PostsList navigation={navigation} name={id} filters={filters} hideUserInfo={hideUserInfo} />
        break
      case 'CommentList':
        component = <CommentList navigation={navigation} name={id} filters={filters} canClick={canClick} onlyDisplayComment={true} />
        break
      // case 'TopicList':
        // component = <TopicList navigation={navigation} name={id} filters={filters} />
        // break
      case 'FollowList':
        component = <FollowList navigation={navigation} id={id} args={args} fields={fields} />
        break
      case 'BlockList':
        component = <BlockList navigation={navigation} name={id} filters={filters} />
        break
    }

    return (<View style={{flex:1}}>{component}</View>)

  }
}
