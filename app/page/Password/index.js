/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Colors from '../../res/Colors';
import { updateUser, setPassword, updatePassword } from '../../redux/actions/userInfo';
import { wPx2P, hPx2P } from '../../utils/ScreenUtil';
import { getUserInfo } from '../../redux/reselect/userInfo';
import { showToast } from '../../utils/MutualUtil';
import { PADDING_TAB, getScreenWidth } from '../../common/Constant';
import KeyboardDismiss from '../../components/KeyboardDismiss';

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUser, setPassword, updatePassword,
  }, dispatch);
}

class Password extends PureComponent {
  constructor(props) {
    super(props);
    this.password = '';
    this.enterPassword = '';
    this.oldPassword = '';
  }

  submit = () => {
    const {
      userInfo, setPassword, navigation, updatePassword,
    } = this.props;
    if (userInfo.password && this.oldPassword.length !== 6) {
      showToast('请输入6位原支付密码');
      return;
    } if (this.password.length !== 6) {
      showToast('请输入6位支付密码');
      return;
    } if (this.enterPassword.length !== 6) {
      showToast('请确认支付密码');
      return;
    } if (this.enterPassword !== this.password) {
      showToast('确认密码与新密码不相同');
      return;
    }
    if (userInfo.password) {
      updatePassword(this.oldPassword, this.password).then(() => {
        showToast('支付密码修改成功');
        navigation.goBack();
      });
    } else {
      setPassword(this.password).then(() => {
        showToast('支付密码设置成功');
        navigation.goBack();
      });
    }
  }

  render() {
    const { userInfo } = this.props;
    const data = [
      { title: `${userInfo.password ? '新密码' : '设置密码'}`, onChangeText: (text) => { this.password = text; } },
      { title: '确认密码', onChangeText: (text) => { this.enterPassword = text; } },
    ];
    userInfo.password && data.unshift({ title: '旧密码', onChangeText: (text) => { this.oldPassword = text; } });
    return (
      <KeyboardDismiss style={styles.container}>
        <View style={styles.main}>
          {
            data.map((v, i) => (
              <View style={styles.extractWhite} key={`${v.title}-${i}`}>
                <Text style={{ fontSize: 12 }}>{`${v.title}: `}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  placeholderTextColor="#d3d3d3"
                  underlineColorAndroid="transparent"
                  onChangeText={v.onChangeText}
                  selectionColor="#00AEFF"
                  maxLength={6}
                />
              </View>
            ))
          }
        </View>
        <TouchableOpacity onPress={this.submit} style={styles.extractRed}>
          <Text style={{ color: '#fff', fontSize: 16 }}>{userInfo.password ? '确认修改' : '设置密码'}</Text>
        </TouchableOpacity>
      </KeyboardDismiss>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.MAIN_BACK,
    paddingBottom: hPx2P(35 + PADDING_TAB),
    paddingTop: hPx2P(30),
  },
  extractRed: {
    width: wPx2P(265),
    height: wPx2P(46),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.YELLOW,
    borderRadius: 2,
    overflow: 'hidden',
  },
  extractWhite: {
    height: 40,
    width: SCREEN_WIDTH - 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  main: {
    flex: 1,
    alignItems: 'center',
  },
  bg_right: {
    width: wPx2P(178),
    height: wPx2P(49),
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameAddres: {
    width: wPx2P(291),
    height: wPx2P(119),
    paddingVertical: wPx2P(10),
    marginBottom: hPx2P(100),
  },
  framePhoneInput: {
    width: wPx2P(291),
    height: wPx2P(52),
    marginBottom: hPx2P(10),
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 13,
    color: '#666',
    height: '100%',
    textAlign: 'right',
    includeFontPadding: false,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Password);
