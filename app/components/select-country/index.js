import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ReactNativeModal } from "react-native-modal";

import To from '../../common/to';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadCountries } from '../../store/actions/countries';
import { getCountries } from '../../store/reducers/countries';

// styles
import styles from './styles';

@connect(
  (state, props) => ({
    countries: getCountries(state)
  }),
  dispatch => ({
    loadCountries: bindActionCreators(loadCountries, dispatch)
  })
)
export default class SelectCountry extends Component {

  static defaultProps = {
    onChoose: (item)=>{ }
  }

  constructor (props) {
    super(props)
    this.state = {
      item: null,
      visible: false
    }
  }

  async componentDidMount() {
    
    const { onChoose, loadCountries } = this.props;

    let [ err, res ] = await To(loadCountries());

    if (res) {
      onChoose(res[0]);
      this.setState({ item: res[0] });
    }
  }

  render() {

    const { countries = [], onChoose } = this.props;
    const { item, visible } = this.state;
    const data = {};

    countries.map(item=>{
      data[item.name + '' + item.code] = item;
    });

    const abbr = item ? item.abbr : '';

    return (<View>

      {item ?
        <TouchableOpacity
          onPress={()=>{ this.setState({ visible: true }); }}
          style={styles.select}>
          <Text style={styles.selectText}>{item.name + item.code}</Text>
          <Image source={require('./images/select.png')} style={styles.selectIcon} />
        </TouchableOpacity>
        : null}

      <ReactNativeModal isVisible={visible}>
        <View style={styles.modalView}>
          <View style={styles.header}><Text>选择国家</Text></View>
          <ScrollView style={styles.scrollView}>
            <View>
              {countries.map((item,i)=>{
                return (<TouchableOpacity key={i} onPress={() => {
                  onChoose(item);
                  this.setState({ visible: false, item });
                }}>
                  <View style={styles.countryItemView}>
                    <Text style={abbr == item.abbr ? styles.active : null}>{item.name + item.code}</Text>
                  </View>
                </TouchableOpacity>)
              })}
            </View>
          </ScrollView>
        </View>
      </ReactNativeModal>

    </View>)
  }
}
