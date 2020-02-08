import React, { PureComponent } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { wPx2P, hPx2P } from '../../utils/ScreenUtil';
import {
  PADDING_TAB,
} from '../../common/Constant';
import PhoneNumCom from './PhoneNumCom';
import Colors from '../../res/Colors';
import { wxBindMobile } from '../../redux/actions/userInfo';
import { Image, KeyboardDismiss } from '../../components';
import { showToast } from '../../utils/MutualUtil';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    wxBindMobile,
  }, dispatch);
}

class PhoneNum extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.mobile = '';
    this.state = {
      disabled: true,
    };
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  }

  goNext = () => {
    const { navigation, wxBindMobile } = this.props;
    if (this.mobile.length < 11) {
      showToast('请输入正确的手机号码');
      return;
    } if (this.code.length < 6) {
      showToast('请输入6位短信验证码');
      return;
    }
    wxBindMobile(this.mobile, this.code).then(() => {
      navigation.navigate('NameAge', {
        params: {
          successCallback: this.routeParams.successCallback,
        },
      });
    });
  }

  onChange = (mobile, code) => {
    this.mobile = mobile;
    this.code = code;
    this.setState({ disabled: mobile.length !== 11 || code.length !== 6 });
  }

  render() {
    const { disabled } = this.state;
    return (
      <KeyboardDismiss style={styles.container}>
        <Image resizeMode="contain" source={require('../../res/image/logo.png')} style={styles.logo} />
        <PhoneNumCom isBind onChange={this.onChange} />
        <TouchableOpacity
          style={[styles.frameLogin, { backgroundColor: disabled ? Colors.DISABLE : Colors.YELLOW }]}
          onPress={this.goNext}
        >
          <Text style={styles.nextText}>绑定手机</Text>
        </TouchableOpacity>
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
  },
  logo: {
    height: wPx2P(114),
    width: wPx2P(108),
    marginBottom: hPx2P(50),
    marginTop: hPx2P(55),
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
  phoneNum: {
    width: wPx2P(307),
    height: wPx2P(92),
  },
  frameBlack: {
    flexDirection: 'row',
    bottom: hPx2P(34 + PADDING_TAB),
    position: 'absolute',
    height: wPx2P(48),
    width: wPx2P(244),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    overflow: 'hidden',
  },
  bottom: {
    flexDirection: 'row',
    bottom: hPx2P(24 + PADDING_TAB),
    position: 'absolute',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default connect(null, mapDispatchToProps)(PhoneNum);
