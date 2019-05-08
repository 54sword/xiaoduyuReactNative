
import React from 'react'
import ReactDOM from 'react-dom'

export class MyEditor extends React.Component {

  constructor(props) {
    super(props);
    // this.myRef = React.createRef();
  }

  componentDidMount() {
    
    // iOS window.addEventListener and Android document.addEventListener
    let eventListener = document.addEventListener || window.addEventListener;
    
    eventListener('message', function (e) {
      if (e.data && e.data.type) {
      } else {
        window.ReactNativeWebView.postMessage('hi! RN');
      }
    })

    document.getElementById('input').focus();
  }

  render() {
    //  autoFocus={true}
    return(<div>
      <div>hello world 123</div>
      <input id="input" type="text" placeholder="input..." />
    </div>)
  }
}


ReactDOM.render(
  <MyEditor />,
  document.getElementById('app')
)
