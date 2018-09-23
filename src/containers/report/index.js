
import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, Button, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { RNToasty } from 'react-native-toasty';

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadReportTypes, addReport } from '../../actions/report'
import { getReportTypes } from '../../reducers/report-types'

// styls
import gStyles from '../../styles'

// components
import Wait from '../../components/ui/wait'

@connect(
  (state, props) => ({
    reportList: getReportTypes(state)
  }),
  dispatch => ({
    addReport: bindActionCreators(addReport, dispatch),
    loadReportTypes: bindActionCreators(loadReportTypes, dispatch)
  })
)
export default class Report extends Component {

  static navigationOptions = ({navigation}) => ({
    headerTitle: '举报'
  })

  constructor (props) {
    super(props)
    this.state = {
      submitting: false,
      reportId: 0,
      detail: '',
      showDetail: false
    }
    this.submit = this.submit.bind(this)
    this.chooseReportItem = this.chooseReportItem.bind(this)
  }

  componentWillMount() {

    const { reportList, loadReportTypes } = this.props

    if (reportList.length == 0) {
      loadReportTypes({})
    }

  }

  chooseReportItem(index, value) {
    this.state.reportId = value;

    if (value == 3 || value == 4 || value == 6) {
      this.setState({ reportId: value, showDetail: true });
    } else {
      this.setState({ reportId: value, showDetail: false });
    }

  }

  async submit() {

    const { reportId, showDetail } = this.state;
    const { addReport, navigation } = this.props;
    const { people, comment, posts } = this.props.navigation.state.params;
    let detail = this.refs.detail._lastNativeText;

    // 将换行符切换成字符串
    detail = detail.replace(/(\n|\r)/g, "<br />");

    if (!reportId) return Alert.alert('', '请选择举报类型');
    if (showDetail && !detail) return this.refs.detail.focus();

    let data = { report_id: reportId }
    
    if (people) data.people_id = people._id;
    if (comment) data.comment_id = comment._id;
    if (posts) data.posts_id = posts._id;
    if (showDetail) data.detail = detail;

    let [ err, res ] = await addReport({ data });

    if (res && res.success) {
      RNToasty.Success({
        title: '您的举报已提交成功，感谢'
      });
      navigation.goBack();
    } else {
      RNToasty.Warn({
        title:  err.message || '提交失败'
      });
    }

  }

  render() {

    const self = this
    const { reportList } = this.props
    const { people, comment, posts } = this.props.navigation.state.params
    const { showDetail } = this.state

    let text = '';

    if (people) text = <View><Text>举报用户 {people.nickname}</Text></View>
    if (comment) text = <View><Text>举报用户 {comment.user_id.nickname} 的评论</Text></View>
    if (posts) text = (<View>
        <View><Text>举报用户 {posts.user_id.nickname} 的帖子</Text></View>
        <View><Text>{posts.title}</Text></View>
      </View>)

    return (<ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
      <View style={gStyles['m-15']}>

        <View style={gStyles['m-15']}>{text}</View>

        <RadioGroup onSelect = {this.chooseReportItem}>
          {reportList.map(item=>{
            return (<RadioButton value={item.id} key={item.id}>
              <Text>{item.text}</Text>
            </RadioButton>)
          })}
        </RadioGroup>

        {showDetail ?
          <View style={gStyles['m-15']}>
            <Text>需要补充举报说明：</Text>
            <TextInput
              ref="detail"
              // onChangeText={(detail) => this.setState({detail})}
              multiline={true}
              style={{ height:100, borderWidth: 1, borderColor: '#e2e2e2', paddingLeft:10, marginTop:20 }}
              />
          </View>
          : null}

        <TouchableOpacity onPress={this.submit} style={[gStyles.fullButton, gStyles['m-10']]}>
          <Text style={gStyles.white}>提交</Text>
        </TouchableOpacity>

      </View>

      {this.state.visible ? <Wait /> : null}

    </ScrollView>)
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#ffff'
  }
});
