import { StackActions, NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function push(routeName, params) {
  // console.log(_navigator._navigation.push);

  // _navigator.dispatch(
    _navigator._navigation.push({
      routeName,
      params,
    })
  // );
}

function setParamsByRouteKey ({ key, params }) {
  _navigator.dispatch(
    NavigationActions.setParams({ key, params })
  );
}

function goBack() {
  _navigator.dispatch(NavigationActions.back());
}

function restart() {

  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Entrance' })]
  });

  _navigator.dispatch(resetAction);
}

function popToTop() {
  _navigator._navigation.popToTop()
}


export default {
  navigate,
  goBack,
  restart,
  popToTop,
  setParamsByRouteKey,
  setTopLevelNavigator,
};
