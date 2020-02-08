import React, { Component } from 'react';
import {
  StyleSheet, Platform, View, TouchableOpacity, Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { YaHei } from '../../res/FontFamily';
import { toServer } from '../../utils/CommonUtils';

const injectedJavaScript = Platform.OS === 'ios' ? `
(function() {
  function wrap(fn) {
    return function wrapper() {
      var res = fn.apply(this, arguments);
      window.ReactNativeWebView.postMessage('navigationStateChange');
      return res;
    }
  }

  history.pushState = wrap(history.pushState);
  history.replaceState = wrap(history.replaceState);
  window.addEventListener('popstate', function() {
    window.ReactNativeWebView.postMessage('navigationStateChange');
  });
})();

true;
` : null;

export default class Web extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    if (this.routeParams.showHelp) {
      navigation.setParams({
        headerRight: (
          <TouchableOpacity onPress={toServer}>
            <Text style={{ marginRight: 20, fontFamily: YaHei, color: '#FFA700' }}>客服中心</Text>
          </TouchableOpacity>
        ),
      });
    }
  }

  onShouldStartLoadWithRequest = (e) => {
    const scheme = e.url.split('://')[0];
    if (scheme === 'http' || scheme === 'https') {
      return true;
    }
    return false;
  }

  goBack = () => {
    const { navigation } = this.props;
    if (this.canGoBack) {
      this.webview.goBack();
    } else {
      navigation.pop();
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          style={styles.webView}
          source={{ uri: this.routeParams.url }}
          ref={(v) => { this.webview = v; }}
          startInLoadingState
          onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
          mixedContentMode="always"
          injectedJavaScript={injectedJavaScript}
          onMessage={({ nativeEvent: state }) => {
            if (state.data === 'navigationStateChange') {
              this.canGoBack = state.canGoBack;
            }
          }
        }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  nowifiWrapper: {
    flex: 1,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  nowifiHintText: {
    color: '#D5D5D5',
    fontSize: 14,
    marginTop: 12,
  },
  refreshNetworkBtn: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#B6B6B6',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 34,
    marginTop: 50,
  },
  refreshNetworkBtnText: {
    color: '#666666',
    fontSize: 14,
  },
});
