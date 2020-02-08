import React, { Component } from 'react';
import {
  View, StatusBar, Platform, DeviceEventEmitter,
} from 'react-native';
import { Provider } from 'react-redux';
import { MenuProvider } from 'react-native-popup-menu';
import CodePush from 'react-native-code-push';
import { PersistGate } from 'redux-persist/integration/react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Router } from './app/router/Router';
import { wxPayModule, wxAppId } from './app/native/module';
import { Global } from './app/components';
import { removeNetListener } from './app/http/Axios';
import TestIcon from './app/components/TestIcon';
import store, { persistor } from './app/redux/configureStore';
import GlobalComponent from './app/utils/GlobalComponent';

// setInterval(() => {
//   GlobalComponent.showToast({ text: '5122' });
// }, 5000);

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  rollbackRetryOptions: {
    delayInHours: 0,
    maxRetryAttempts: 9999,
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: { flex: 1 },
    };
  }

  componentDidMount() {
    console.disableYellowBox = true;
    if (!__DEV__) {
      global.console = {
        ...global.console,
        info: () => {},
        log: () => {},
        warn: () => {},
        debug: () => {},
        error: () => {},
      };
    }
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('dark-content');
    }
    // global.XMLHttpRequest = global.originalXMLHttpRequest || global.XMLHttpRequest;
    wxPayModule.registerApp(wxAppId); // 向微信注册

    this.listener = DeviceEventEmitter.addListener('dropstoreGlobal', (e) => {
      if (e.isShow) {
        this.globalCom.show(e.chaoFunEventType, e.params);
      } else {
        this.globalCom.hide(e.chaoFunEventType, e.params);
      }
    });
  }

  componentWillUnmount() {
    removeNetListener();
    this.listener.remove();
  }

  onLayout = (e) => {
    const { height, width } = e.nativeEvent.layout;
    if (width > 0) {
      global.SCREEN_HEIGHT = height;
      global.SCREEN_WIDTH = width;
      this.setState({ style: { height, width } });
    }
  }

  render() {
    const { style } = this.state;
    return (
      <Provider store={store}>
        <MenuProvider backHandler>
          <PersistGate loading={null} persistor={persistor}>
            <View style={style} onLayout={this.onLayout}>
              <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
              <Router uriPrefix="jiangbaochaofan://" />
              <Global ref={(v) => { this.globalCom = v; }} />
              <TestIcon />
              <RootSiblingParent />
            </View>
          </PersistGate>
        </MenuProvider>
      </Provider>
    );
  }
}

export default CodePush(codePushOptions)(App);
export { store };
