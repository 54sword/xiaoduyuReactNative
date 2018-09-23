
import React, { PureComponent } from 'react';
import { Image } from 'react-native';

export default class LikeIcon extends PureComponent {

  static defaultProps = {
    style: {
      width: 18,
      height: 18
    }
  }

  render() {
    return (<Image source={require('./images/like.png')} style={this.props.style} />)
  }
}
