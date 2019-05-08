import { StackActions, NavigationActions } from 'react-navigation';

// import tracker from '../common/google-analytics';

let _navigator;

let StackRouterRoot = null;

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
  _navigator._navigation.push({
    routeName,
    params,
  })
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
  onNavigationStateChange: function(e, newState, action) {
    StackRouterRoot = e;
    // console.log(action);

    if (action.type == 'Navigation/NAVIGATE') {
      // tracker.trackScreenView(action.routeName);
    }
    
  },
  // 获取当前互动的路由对象
  getCurrentRoute: function() {

    if (!StackRouterRoot) return null;

    let getRouter = (obj) => {
      if (obj.routes) {
        return getRouter(obj.routes[obj.index]);
      } else {
        return obj;
      }
    }

    return getRouter(StackRouterRoot)
  },
  getComponentForRouteName: function(key) {
    if (!_navigator) return null;
    return _navigator._navigation.router.getComponentForRouteName(key);
  }
};
