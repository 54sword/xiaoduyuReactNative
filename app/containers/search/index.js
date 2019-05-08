import React, { Component } from 'react';
import { TextInput, Text, View, TouchableOpacity, Platform } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// components
import PostsList from '../../components/posts/list';
import PeopleList from '../../components/people/list';

// styles
import styles from './styles';

export default class Search extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      type: 'posts',
      q: ''
    }
    this.handleSearch = this.handleSearch.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
  }

  handleSearch(e) {
    this.setState({ q: e });
  }

  onChangeType(type) {
    this.setState({ type });
  }

  render() {

    const { navigation } = this.props;
    const { type, q } = this.state;

    return (<View style={{flex:1}}>

      <View style={styles.header}>

        <TextInput
          style={styles.searchInput}
          placeholder={"搜索帖子、话题和用户"}
          onChangeText={this.handleSearch}
          clearButtonMode="while-editing"
          autoFocus={true}
          returnKeyType='search'
          // onSubmitEditing={this.searchHouseByMLS}
          />

        <TouchableOpacity
          style={styles.headButton}
          onPress={()=>{ navigation.goBack(); }}
          >
          <Text style={styles.headButtonText}>取消</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.typeBar}>
        <TouchableOpacity
          style={[styles.typeButton, type == 'posts' ? styles.activeTypeButton : null]}
          onPress={()=>this.onChangeType('posts')}
          >
          <Text>帖子</Text></TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type == 'people' ? styles.activeTypeButton : null]}
          onPress={()=>this.onChangeType('people')}
          >
          <Text>用户</Text></TouchableOpacity>
      </View>

      <View style={{flex:1}}>

        {q && type == 'posts' ?
          <PostsList
            {...this.props}
            name={q}
            key={q}
            filters={{
              variables: {
                title: q,
                sort_by: "create_at",
                deleted: false,
                weaken: false
              }
            }}
            scrollLoad={true}
            />
          : null}

        {q && type == 'people' ?
          <PeopleList
            {...this.props}
            name={q}
            key={q}
            filters={{
              variables: {
                nickname: q
              }
            }}
            />
          : null}

      </View>

      {Platform.OS === 'android' ? null : <KeyboardSpacer />}

    </View>)
  }
}
