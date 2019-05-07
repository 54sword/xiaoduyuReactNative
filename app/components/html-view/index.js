import React, { Component } from 'react';
import { StyleSheet, View, Text, Linking, Dimensions, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import HTMLView from 'react-native-htmlview';

// import ImageView from 'react-native-image-view';
import ImageViewer from 'react-native-image-zoom-viewer';

// import Lightbox from 'react-native-lightbox';
// import LightboxImage from 'react-native-image-lightbox';

// import HTML from 'react-native-render-html'
// import HtmlRender from 'react-native-html-render'

// const {height, width} = Dimensions.get('window');

// import Lightbox from 'react-native-lightbox';

import Img from '../image'
import styles from './styles'

import * as HTMLConverter from '../../common/html-converter'

/*
function rendCodeBlock(codeText, styles) {
    let codeLines = codeText.split('\n');
    return codeLines.map(function (line, index, arr) {
        let lineNum = index + 1;
        if (line == '')
            line = '\n';
        if (index == codeLines.length - 1)
            return null;
        return (
            <View key={'codeRow' + index} style={styles.codeRow}>
                <View style={styles.lineNumWrapper}>
                    <Text style={styles.lineNum}>
                        {lineNum + '.'}
                    </Text>
                </View>

                <View style={styles.codeLineWrapper}>
                    <Text style={styles.codeLine}>
                        {line}
                    </Text>
                </View>
            </View>
        );
    });
}
*/

export default class HtmlViewComponent extends Component {

  static defaultProps = {
    fontSize: 15,
    lineHeight: 21,
    colorDark: '#000'
  }

  constructor (props) {
    super(props);

    const { html } = props;

    let images = HTMLConverter.getImagesFromHTML(html),
        contentHtml = HTMLConverter.link(html+'').replace(/^(\<p\>\<\/p\>)|(\<p\>\<\/p\>)$/g,"");

    this.state = {
      images,
      imageVisible: false,
      current: 0,
      contentHtml
    }
    this.renderNode = this.renderNode.bind(this)
  }

  renderNode(node, index, siblings, parent, defaultRenderer) {

    const { imgOffset = 0, fontSize, lineHeight } = this.props
    // const { images } = this.state;
    // console.log(node.name);

    if (node.name == 'img') {

      // return (<Lightbox navigator={navigator}>
      //   <Image
      //     style={{ height: 300 }}
      //     source={{ uri: 'http://knittingisawesome.com/wp-content/uploads/2012/12/cat-wearing-a-reindeer-hat1.jpg' }}
      //   />
      // </Lightbox>)
      
      // this.state.images.push(node.attribs.src);

      return (<TouchableOpacity key={index} onPress={()=>{
        this.setState({
          imageVisible: true,
          current: this.state.images.indexOf(node.attribs.src)
        })
      }}
      activeOpacity={0.8}
      >
        <Img key={index} image={node.attribs.src} offset={imgOffset} />
      </TouchableOpacity>)
      
      // console.log(node)

  //     return (<LightboxImage 
  //       key={index}
  //       imageWidth = {260}
  //       imageHeight = {260}
  //       underlayColor = "#fff"
  //       imagesource = {'https:'+node.attribs.src.split('?')[0]}>
  // </LightboxImage>)
      

      // <Img key={index} image={node.attribs.src.split('?')[0]} offset={imgOffset} /> 
      // return (<Lightbox navigator={this.props.navigator} key={index}>
      //     <Image
      //     imageWidth = {260}
      //     imageHeight = {260}
      //     style={{ height: 300, width: 300 }}
      //     source={{ uri: 'https:'+node.attribs.src.split('?')[0] }}
      //     />
      // </Lightbox>)
      
    } else if (node.name == 'blockquote') {
      return (<View key={index} style={styles.blockquote}><Text style={{color:'#292524'}}>{node.children[0].data}</Text></View>)
    } else if (node.name == 'div') {
      // console.log(node);

      if (node.attribs['data-youtube'] ||
      node.attribs['data-youku'] ||
      node.attribs['data-qq'] ||
      node.attribs['data-163-music-song'] ||
      node.attribs['data-163-music-playlist']
      ) {
        return (<View style={styles.notSupportVideo} key={index}><Text style={styles.notSupportVideoText}>不支持视频播放</Text></View>)
      }

    } else if (node.name == 'pre') {

      let lineNum = 0;

      return (<ScrollView key={index} style={styles.code} horizontal={true}>
        <View style={styles.codeWrapper}>
          {node.children.map((item, key)=>{

            if (item.name && item.name == 'br'){

            } else {
              lineNum++

              return (<View key={key} style={styles.codeRow}>
                <View style={styles.lineNumWrapper}>
                    <Text style={styles.lineNum}>
                        {lineNum}
                    </Text>
                </View>
                <View style={styles.codeLineWrapper}>
                  <Text style={styles.codeText}>{item.data}</Text>
                </View>
              </View>)
            }


            })}
        </View>
      </ScrollView>)



      // return <View key={index}><Text>12313</Text></View>
    } else if (node.name == 'li') {
      return (
        <View key={index} style={{ marginTop: 7 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'column', width: 20 }}>
              {node.parent.name == 'ol' ? <Text style={{fontSize,lineHeight,color:'#292524'}}>{index+1}. </Text> : <Text>{'\u2022'}</Text>}
            </View>
            <View style={{ flexDirection: 'column', width: '90%'}}>
              <Text style={{fontSize,lineHeight,color:'#292524'}}>{defaultRenderer(node.children, parent)}</Text>
            </View>
          </View>
        </View>
      );
    } else if (node.name == 'ul' || node.name == 'ol') {
      return (
        <View key={index}>
          {defaultRenderer(node.children, parent)}
        </View>
      );
    } else if (node.name == 'h2') {

      return node.children.map((node, index)=>{
          return (<View key={index} style={styles.h2}>
            <Text style={styles.h2Text}>{node.data}</Text>
          </View>)
        })
    }

    // else if (node.name == 'li') {
      // console.log(node.children[0].data);
      // return (<Text>{node.children[0].data}</Text>)
    // }

    /*
    else if (node.type == 'text' && node.parent.name == 'pre') {
      return (<View key={index} style={{ flex:1, padding:10,backgroundColor:'red', width:200, height:200}}>
        <Text>{node.data}</Text>
      </View>)
    }
    */

    // if (node.name == 'blockquote') {
    //   return (<View styles={styles.global}></View>)
    // }
  }

  _renderNode(node, index, parent, type) {
    //Your code here
  }


  render () {

    const { colorDark } = this.props;
    const { imageVisible, current, images, contentHtml } = this.state;

    // let html = this.props.html;
    
    // html = HTMLConverter.link(html);

    // html = html.replace(/^(\<p\>\<\/p\>)|(\<p\>\<\/p\>)$/g,"");

    if (!contentHtml) return <Text></Text>;

    const { fontSize, lineHeight } = this.props;

    const htmlStyles = StyleSheet.create({
      a: {
        fontSize,
        color: '#008cff',
        lineHeight
      },
      p: {
        fontSize,
        lineHeight,
        color: colorDark
      },
      strong: {
        fontSize,
        fontWeight:'bold',
        lineHeight,
        color: colorDark
      }
    });


    const _images = [];

    images.map(item=>{

      _images.push({

        // url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',

        url: 'https:'+item
        // title: 'Paris',
        // width: 806,
        // height: 720,
      })
    });

    // console.log(_images);

    
    // const _images = [
    //   {
    //       source: {
    //           uri: 'https://cdn.pixabay.com/photo/2017/08/17/10/47/paris-2650808_960_720.jpg',
    //       },
    //       title: 'Paris',
    //       width: 806,
    //       height: 720,
    //   },
    // ];

    // style={styles.content}
    return (<View>

      <Modal visible={imageVisible} transparent={true}>
        <ImageViewer
          imageUrls={_images}
          onClick={()=>{
            this.setState({ imageVisible: false });
          }}
          loadingRender={()=>{
            return <View style={{ flex:1, justifyContent:'center', alignItems:'center'}}>
              <Text style={{color:'#fff'}}>加载中...</Text>
            </View>;
          }}
          index={current}
          />
      </Modal>

      <HTMLView
        stylesheet={htmlStyles}
        value={contentHtml}
        onLinkPress={(url) => Linking.openURL(url)}
        renderNode={this.renderNode}
        addLineBreaks={false}
        />

    </View>

    )

  }

}

