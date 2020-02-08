import React, { PureComponent } from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { wPx2P } from '../../utils/ScreenUtil';
import { debounce } from '../../utils/CommonUtils';
import { showToast } from '../../utils/MutualUtil';
import { sendMessage } from '../../redux/actions/userInfo';
import { getUserInfo } from '../../redux/reselect/userInfo';
import { InputVarySize } from '../../components';

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    sendMessage,
  }, dispatch);
}

class PhoneNumCom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '',
      timer: null,
      code: '',
    };
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  // onChange = (formatted, mobile) => {
  //   const { code } = this.state;
  //   const { onChange } = this.props;
  //   if (mobile.length === 11) {
  //     const { userInfo: { sendPhone, sendTime } } = this.props;
  //     if (sendPhone === mobile && Date.now() - sendTime < 60000) {
  //       this.startTimer(true);
  //     } else {
  //       this.clearInterval();
  //       this.setState({ timer: null });
  //     }
  //   }
  //   onChange(mobile, code);
  //   this.setState({ mobile });
  // }

  // startTimer = (samePhone) => {
  //   const { userInfo } = this.props;
  //   const time = Math.min(parseInt((59000 - Date.now() + userInfo.sendTime) / 1000), 59);
  //   this.setState({
  //     timer: samePhone ? time : 59,
  //   });
  //   this.intervalTimer = setInterval(() => {
  //     const { timer } = this.state;
  //     if (timer > 1) {
  //       this.setState({ timer: timer - 1 });
  //     } else {
  //       this.clearInterval();
  //       this.setState({ timer: null });
  //     }
  //   }, 1000);
  // }

  // toSendCode =() => {
  //   const { userInfo, sendMessage } = this.props;
  //   const { mobile } = this.state;
  //   if (mobile.length < 11) {
  //     showToast('请输入正确的手机号码');
  //   }
  //   if ((Date.now() - userInfo.sendTime > 60000) || userInfo.sendPhone !== mobile) {
  //     sendMessage('/user/send_message', mobile, Date.now()).then(() => {
  //       showToast(`验证码已发送至${mobile}`);
  //       this.startTimer();
  //       this.codeInput.focus();
  //     }).catch(() => this.clearInterval());
  //   }
  // }

  onChange = (formatted, mobile) => {
    const { code } = this.state;
    const { onChange } = this.props;
    onChange(mobile, code);
    this.setState({ mobile });
  }

  startTimer = (samePhone) => {
    const { userInfo } = this.props;
    const time = Math.min(parseInt((59000 - Date.now() + userInfo.sendTime) / 1000), 59);
    this.setState({
      timer: samePhone ? time : 59,
    });
    this.intervalTimer = setInterval(() => {
      const { timer } = this.state;
      if (timer > 1) {
        this.setState({ timer: timer - 1 });
      } else {
        this.clearInterval();
        this.setState({ timer: null });
      }
    }, 1000);
  }

  onChangeText = (formatted, code) => {
    const { onChange } = this.props;
    const { mobile } = this.state;
    onChange(mobile, code);
    this.setState({ code });
  }

  toSendCode =() => {
    const { sendMessage, isBind } = this.props;
    const { mobile } = this.state;
    if (mobile.length < 11) {
      showToast('请输入正确的手机号码');
      return;
    }
    sendMessage(isBind ? '/user/check_mobile' : '/user/send_message', mobile, Date.now()).then(() => {
      showToast(`验证码已发送至${mobile}`);
      this.startTimer();
      this.codeInput.focus();
    }).catch(() => this.clearInterval());
  }

  clearInterval = () => {
    this.intervalTimer && clearInterval(this.intervalTimer);
  }

  render() {
    const { timer } = this.state;
    return (
      <View style={{ height: 100, justifyContent: 'space-between' }}>
        <View style={styles.wrapper}>
          <Text style={styles.text}>手机号</Text>
          <InputVarySize
            onChangeText={this.onChange}
            mask="[000] [0000] [0000]"
            keyboardType="number-pad"
            selectionColor="#00AEFF"
            placeholder="输入手机号"
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={styles.text}>验证码</Text>
          <InputVarySize
            onChangeText={this.onChangeText}
            mask="[000000]"
            keyboardType="number-pad"
            selectionColor="#3FCF77"
            placeholder="输入验证码"
            ref={(v) => { this.codeInput = v; }}
          />
          <TouchableOpacity onPress={debounce(this.toSendCode)}>
            <Text style={styles.login}>
              {`${timer ? `重发${timer}` : '获取验证码'}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
  },
  login: {
    fontSize: 13,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 3,
    width: wPx2P(304),
    borderBottomColor: '#E4E4EE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PhoneNumCom);
