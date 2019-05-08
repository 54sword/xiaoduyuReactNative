import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadSessionList, readSession } from '../../store/actions/session';
import { getSessionListById } from '../../store/reducers/session';
import { getProfile } from '../../store/reducers/user'

// modules
// import Shell from '@modules/shell';
// import Meta from '@modules/meta';
import MessageList from '../../components/message/list';
import Loading from '../../components/ui/loading';
import styles from './styles';

@connect(
  (state, props) => {
    const { id } = props.navigation.state.params;
    return {
      me: getProfile(state),
      list: getSessionListById(state, id)
    }
  },
  dispatch => ({
    loadList: bindActionCreators(loadSessionList, dispatch),
    readSession: bindActionCreators(readSession, dispatch)
  })
)
export default class SessionDetail extends React.Component {

  static navigationOptions = ({navigation}) => {

    const { title } = navigation.state.params;

    return {
      headerTitle: title
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      session: null,
      loading: true,
      unread_count: 0
    }
  }

  async componentDidMount() {

    const { id, title } = this.props.navigation.state.params;
    let { list, loadList, readSession } = this.props;
    if (!list.data) {
      await loadList({
        id,
        filters: { query: { _id: id } }
      });
    }

    let session = this.props.list.data[0];

    if (session) {

      if (session.unread_count > 0) {
        readSession({ _id: id });
      }
      
      this.state.unread_count = session.unread_count;

      this.setState({
        session: session,
        loading: false
      });

    }
    
  }
  
  /*
  componentWillReceiveProps(props) {

    if (this.state.loading) return;

    // 当前界面，有新的消息的时候，更新当前会话的为已读
    if (props.list && props.list.data && props.list.data[0]) {
      let session = props.list.data[0];
      if (session && session.unread_count > 0) {
        this.props.readSession({ _id: session._id });
      }  
    }

  }
  */

  componentWillUnmount() {
    let session = this.props.list.data[0];
    if (session && session.unread_count > 0) {
      this.props.readSession({ _id: session._id });
    }
  }

  render() {
    
    const { id } = this.props.navigation.state.params;
    const { loading, session } = this.state;
    const { me } = this.props;
    const { navigate } = this.props.navigation;

    if (loading) {
      return <Loading />
    }

    if (!session) {
      return <View><Text>会话不存在</Text></View>
    }

    return(
      <SafeAreaView style={{flex:1}}>

        <View style={{flex:1}}>
        
          <MessageList
            key={id}
            id={id}
            filters={{
              query: {
                user_id: session.user_id._id+','+session.addressee_id._id,
                addressee_id: session.user_id._id+','+session.addressee_id._id,
                sort_by: 'create_at:-1'
              }
            }}
            />
        </View>
        
        <TouchableOpacity
          style={styles.reply}
          onPress={()=>{
            if (me) {
              navigate('writeMessage', {
                addressee_id: session.user_id._id
              });
            } else {
              /*
              navigate('SignIn', {
                routeName: 'PostsDetail',
                setParams: {
                  title: posts.title,
                  id: posts._id
                },
                onSignInFinish: () => {
                  navigate('writeMessage', { posts_id: posts._id });
                }
              });
              */
            }
          }}
          >
          <Text>回复</Text>
        </TouchableOpacity>

            {/*!loading && session.user_id._id ?                
              <div styleName="editor" className="border-top">
                <Editor addressee_id={session.user_id._id} />
              </div>
            : null*/}

      </SafeAreaView>
    )
  }

}
