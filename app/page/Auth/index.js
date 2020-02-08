import React, { PureComponent } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Image, KeyboardDismiss } from '../../components';
import { wPx2P, hPx2P } from '../../utils/ScreenUtil';
import {
  STATUSBAR_AND_NAV_HEIGHT, PADDING_TAB, STATUSBAR_HEIGHT,
} from '../../common/Constant';
import { messageAuth } from '../../redux/actions/userInfo';
import PhoneNumCom from './PhoneNumCom';
import ModalTreaty from './ModalTreaty';
import { getUserInfo } from '../../redux/reselect/userInfo';
import Colors from '../../res/Colors';
import { showToast } from '../../utils/MutualUtil';
import ThirdPartyLogin from './ThirdPartyLogin';

const appJson = require('../../../app.json');

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    messageAuth,
  }, dispatch);
}

class Auth extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.mobile = '';
    this.code = '';
    this.state = {
      disabled: true,
    };
  }

  successAuth = () => {
    const { closeAuth } = this.props;
    if (closeAuth) {
      closeAuth();
    } else {
      this.routeParams.successCallback && this.routeParams.successCallback();
    }
  }

  toLogin = () => {
    const { messageAuth, navigation, closeAuth } = this.props;
    if (this.mobile.length < 11) {
      showToast('请输入正确的手机号码');
    } else if (this.code.length < 6) {
      showToast('请输入6位短信验证码');
    } else {
      messageAuth(this.mobile, this.code).then((isLogin) => {
        if (isLogin) {
          this.successAuth();
        } else {
          const successCallback = () => {
            closeAuth && closeAuth();
            if (this.routeParams.successCallback) {
              this.routeParams.successCallback();
            } else {
              navigation.navigate('BottomNavigator');
            }
          };
          navigation.navigate('NameAge', { params: { successCallback } });
        }
      });
    }
  }

  onChange = (mobile, code) => {
    this.mobile = mobile;
    this.code = code;
    this.setState({ disabled: mobile.length !== 11 || code.length !== 6 });
  }

  toYinsi = () => {
    const { navigation } = this.props;
    navigation.navigate('Web', {
      params: { url: `${appJson.webUrl}/secret` },
      title: '隐私政策',
    });
  }

  toXieyi = () => {
    const { navigation } = this.props;
    navigation.navigate('Web', {
      params: { url: `${appJson.webUrl}/userAgreements` },
      title: '用户协议',
    });
  }

  closeAuth = () => {
    const { closeAuth } = this.props;
    const closeCallback = this.routeParams.closeCallback;
    if (closeAuth) {
      closeAuth();
    } else if (closeCallback) {
      closeCallback();
    }
  }

  render() {
    const { disabled } = this.state;
    const { navigation, userInfo } = this.props;
    if (userInfo.user_s_id) { return null; }

    return (
      <KeyboardDismiss style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Image resizeMode="contain" source={require('../../res/image/logo.png')} style={styles.logo} />
          <PhoneNumCom onChange={this.onChange} />
          <TouchableOpacity
            onPress={this.toLogin}
            style={[styles.frameLogin, { backgroundColor: disabled ? Colors.DISABLE : Colors.YELLOW }]}
          >
            <Text style={styles.login}>登录</Text>
          </TouchableOpacity>
        </View>

        <ThirdPartyLogin successCallback={this.routeParams.successCallback} closeAuth={this.closeAuth} navigation={navigation} successAuth={this.successAuth} />
        <Text style={styles.xieyi}>
          登录即代表已阅读并同意
          <Text style={styles.subfooterText} onPress={this.toXieyi}>用户协议</Text>
          与
          <Text style={styles.subfooterText} onPress={this.toYinsi}>隐私政策</Text>
        </Text>
        <Image onPress={this.closeAuth} resizeMode="contain" source={require('../../res/image/chaNew.png')} style={styles.cha} />
        <ModalTreaty navigation={navigation} />
      </KeyboardDismiss>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    justifyContent: 'space-between',
  },
  logo: {
    height: wPx2P(114),
    width: wPx2P(108),
    marginBottom: hPx2P(50),
    marginTop: hPx2P(55) + STATUSBAR_AND_NAV_HEIGHT,
  },
  frameLogin: {
    height: wPx2P(43),
    width: wPx2P(304),
    alignItems: 'center',
    marginTop: hPx2P(34),
    justifyContent: 'center',
    borderRadius: 2,
    overflow: 'hidden',
  },
  login: {
    color: '#fff',
    fontSize: 16,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000AA',
    zIndex: 5,
  },
  xieyi: {
    color: '#333',
    fontSize: 12,
    marginBottom: hPx2P(60 + PADDING_TAB),
    marginTop: 10,
  },
  subfooterText: {
    color: 'rgb(0,122,255)',
    fontSize: 12,
  },
  cha: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 20,
    right: 25,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
