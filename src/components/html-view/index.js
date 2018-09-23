

import React, { Component } from 'react'
import { StyleSheet, View, Text, Linking, Dimensions, Image, ScrollView } from 'react-native'
import HTMLView from 'react-native-htmlview'
// import HTML from 'react-native-render-html'
// import HtmlRender from 'react-native-html-render'

// const {height, width} = Dimensions.get('window');

import Lightbox from 'react-native-lightbox';

import Img from '../image'

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
    lineHeight: 26
  }

  constructor (props) {
    super(props)
    this.renderNode = this.renderNode.bind(this)
  }

  renderNode(node, index, siblings, parent, defaultRenderer) {

    const { imgOffset = 0, fontSize, lineHeight } = this.props
    // console.log(node.name);

    if (node.name == 'img') {
      return <Img key={index} image={node.attribs.src} offset={imgOffset} />
      /*
      return (<Lightbox navigator={this.props.navigator} key={index}>
        <Img key={index} image={node.attribs.src} offset={imgOffset} />
      </Lightbox>)
      */
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

    let html = this.props.html;

    html = html.replace(/^(\<p\>\<\/p\>)|(\<p\>\<\/p\>)$/g,"");

    if (!html) return <Text></Text>;

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
        color:'#292524'
      },
      strong: {
        fontSize,
        fontWeight:'bold',
        lineHeight,
        color:'#292524'
      }
    });

    return (
      <HTMLView
        stylesheet={htmlStyles}
        value={html}
        onLinkPress={(url) => Linking.openURL(url)}
        renderNode={this.renderNode}
        addLineBreaks={false}
      />
    )

  }

}


const styles = StyleSheet.create({
  code: {
    marginTop:10,
    marginBottom:10,
    // padding:15,
    // paddingLeft:0,
    backgroundColor: '#222',
    flexDirection: 'row',
    // flexDirection: 'column'
    // backgroundColor: '#484848'
  },
  codeRow: {
      flex: 1,
      flexDirection: 'row',
      height: 25,
      alignItems: 'center'
  },

  codeWrapper: {
      flexDirection: 'column'
  },

  codeText: {
    color: '#a8ff60'
  },

  lineNumWrapper: {
      width: 40,
      height: 25,
      backgroundColor: 'rgb(59, 58, 58)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 10,
      //paddingTop: 20
  },

  lineNum: {
      // width: 50,
      color: 'rgba(255,255,255,0.5)',
  },

  codeLineWrapper: {
      height: 25,
      flexDirection: 'row',
      alignItems: 'center',
      // paddingLeft: 10,
      paddingRight: 20
  },

  notSupportVideo: {
    flex:1,
    backgroundColor: 'rgb(241, 241, 241)',
    alignItems: 'center',
    padding:10,
    marginTop:10,
    marginBottom:10
  },

  notSupportVideoText: {
    color: 'rgb(167, 167, 167)'
  },

  blockquote: {
    padding:10,
    backgroundColor: '#f4f4f4',
    borderLeftWidth: 5,
    borderColor:'#c6c6c6',
    marginTop:10,
    marginBottom:10
  }

})
