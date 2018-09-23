/** @format */
// import '@babel/polyfill';
import {AppRegistry} from 'react-native';
// import Root from './App';
import Root from './src/root';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Root);
