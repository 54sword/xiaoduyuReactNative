import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

let imageCache = {};

class Img extends React.Component {

  static propTypes = {
    image: PropTypes.string.isRequired
  }

  static defaultProps = {
    width: 0,
    height: 0,
    // 图片宽度的偏移值，width - offset
    offset: 0,
    style: {
      marginTop: 5,
      marginBottom: 5,
      backgroundColor: '#efefef'
    }
  }

  constructor(props) {
    super(props);

    let { offset, image, width, height } = this.props;

    let _image = image.split('//');
    _image[0] = 'https:';
    _image = _image.join('//');

    if (width && height) {
      imageCache[_image] = { width, height }
    } else if (imageCache[_image]) {
      width = imageCache[_image].width;
      height = imageCache[_image].height;
    }

    this.state = {
      width,
      height,
      offset,
      image: _image,
      isMount: true
    }

  }

  componentDidMount() {

    const { offset, image } = this.state;

    if (imageCache[image]) return;
    
    Image.getSize(image, (width, height) => {

      if (!this.state.isMount) return;

      // 如果图片宽度大雨屏幕宽度，缩放到屏幕适合的比例
      if (width > global.screen.width - offset) {

        height = parseInt(height * ((global.screen.width - offset)/width)); //按照屏幕宽度进行等比缩放
        width = global.screen.width - offset;
      }

      this.setState({ width, height });
      imageCache[image] = { width, height };

    }, (e)=>{
      console.log(e);
    });

  }

  componentWillUnmount() {
    this.state.isMount = false;
  }

  render() {

    const { width, height, image, style } = this.state;

    return (
        <Image
          style={[
            { width: width, height: height },
            style
          ]}
          resizeMode='contain'
          source={{ uri: image, cache: 'force-cache' }}
          />
    )
  }
}

export default Img
