/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ModalNormal, KeyboardDismiss } from '../../components';
import Colors from '../../res/Colors';
import { updateUser } from '../../redux/actions/userInfo';
import { getUserInfo } from '../../redux/reselect/userInfo';
import { getSimpleData } from '../../redux/reselect/simpleData';
import { wPx2P, hPx2P } from '../../utils/ScreenUtil';
import { debounce } from '../../utils/CommonUtils';
import {
  PADDING_TAB, STATUSBAR_AND_NAV_HEIGHT,
} from '../../common/Constant';
import { request } from '../../http/Axios';
import { showToast, showModalbox, closeModalbox } from '../../utils/MutualUtil';
import { YaHei } from '../../res/FontFamily';

const baseURL = require('../../../app.json').webUrl;

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
    appOptions: getSimpleData(state, 'appOptions'),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUser,
  }, dispatch);
}

class BalanceExtract extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity onPress={() => navigation.navigate('BalanceDetail', { params: { title: '明细' } })}>
        <Text style={{ marginRight: 12, color: '#FFA700', fontFamily: YaHei }}>明细</Text>
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      timer: null,
    };
  }

  submit = () => {
    const { userInfo, updateUser } = this.props;
    if (!this.name) {
      showToast('请输入收款人姓名');
      return;
    } if (!this.account) {
      showToast('请输入收款人账户');
      return;
    } if (!this.price) {
      showToast('请输入提现金额');
      return;
    } if (this.price * 1 > userInfo.balance / 100) {
      showToast('超出可提现上限');
      return;
    } if (!this.codes) {
      showToast('请输入短信验证码');
      return;
    }
    showModalbox({
      element: (<ModalNormal
        sure={() => {
          request('/user/user_cash', {
            params: {
              price: this.price,
              name: this.name,
              account: this.account,
              codes: this.codes,
              mobile: userInfo.mobile,
            },
          }).then(() => {
            showToast('提现申请成功');
            updateUser();
            closeModalbox();
          });
        }}
        closeModalbox={closeModalbox}
        CustomDom={
          (
            <View>
              <Text>{`收款人姓名：${this.name}`}</Text>
              <Text>{`收款人账户：${this.account}`}</Text>
              <Text>{`提现金额：${this.price}`}</Text>
            </View>
          )
        }
        title="确认提现账户及金额"
      />),
    });
  }

  instructions = () => {
    const { navigation } = this.props;
    navigation.navigate('Web', {
      title: '提现说明',
      params: {
        url: `${baseURL}/help/extract`,
        showHelp: true,
      },
    });
  }

  toSendCode = () => {
    const { userInfo } = this.props;
    request('/user/cash_message', {
      params: {
        mobile: userInfo.mobile,
      },
    }).then(() => {
      this.start();
    });
  }

  start = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.setState({ timer: 59 });
    this.timer = setInterval(() => {
      const { timer } = this.state;
      if (timer <= 1) {
        clearInterval(this.timer);
        this.setState({ timer: null });
      } else {
        this.setState({ timer: timer - 1 });
      }
    }, 1000);
  }

  render() {
    const { userInfo, appOptions } = this.props;
    const { timer } = this.state;
    const data = [
      { title: '可提现金额', onChangeText: (text) => { this.name = text; } },
      { title: '姓名', onChangeText: (text) => { this.name = text; } },
      { title: '支付宝账号', keyboardType: 'numeric', onChangeText: (text) => { this.account = text; } },
      { title: '提现金额', keyboardType: 'numeric', onChangeText: (text) => { this.price = text; } },
    ];
    return (
      <KeyboardDismiss style={styles.container}>
        <View>
          {
            data.map((v, i) => (
              <View style={styles.extractWhite} key={`${v.title}-${i}`}>
                <Text style={{ fontSize: 12 }}>{`${v.title}: `}</Text>
                {
                  i === 0 ? <Text style={{ fontSize: 12 }}>{userInfo.balance / 100}</Text> : (
                    <TextInput
                      style={styles.input}
                      keyboardType={v.keyboardType}
                      placeholderTextColor="#d3d3d3"
                      underlineColorAndroid="transparent"
                      // clearButtonMode="while-editing"
                      onChangeText={v.onChangeText}
                      selectionColor="#00AEFF"
                    />
                  )
                }
              </View>
            ))
          }
          <View>
            <Text style={styles.mobile}>
              你的绑定手机号为：
              <Text style={[styles.mobile, { color: '#C0C0C0' }]}>{userInfo.mobile}</Text>
            </Text>
            <View style={[styles.extractWhite, { marginTop: 8 }]}>
              <TextInput
                style={[styles.input, { textAlign: 'left' }]}
                keyboardType="number-pad"
                placeholderTextColor="#d3d3d3"
                placeholder="输入验证码"
                underlineColorAndroid="transparent"
                selectionColor="#00AEFF"
                maxLength={6}
                onChangeText={(text) => { this.codes = text; }}
              />
              <TouchableOpacity
                style={{ height: '100%', justifyContent: 'center' }}
                onPress={debounce(this.toSendCode)}
                disabled={!!timer}
              >
                <Text style={{ fontSize: 12 }}>{timer ? `重发${timer}` : '获取验证码'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.btn} onPress={this.instructions}>
            <Text style={{ fontSize: 12, color: '#37B6EB' }}>提现说明 &gt;</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: hPx2P(35) + PADDING_TAB }}>
          <Text style={styles.date}>{appOptions?.data?.account_time}</Text>
          <TouchableOpacity onPress={this.submit} style={styles.extractRed}>
            <Text style={{ color: '#fff', fontSize: 16 }}>提交申请</Text>
          </TouchableOpacity>
        </View>
      </KeyboardDismiss>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT - STATUSBAR_AND_NAV_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: Colors.MAIN_BACK,
    alignItems: 'center',
    paddingTop: hPx2P(26),
    justifyContent: 'space-between',
  },
  rightWrapper: {
    paddingRight: 12,
    height: '100%',
    paddingLeft: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobile: {
    fontSize: 12,
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
  date: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: hPx2P(27),
    marginTop: hPx2P(10),
    textAlign: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 12,
    color: '#666',
    height: '100%',
    textAlign: 'right',
    includeFontPadding: false,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BalanceExtract);
