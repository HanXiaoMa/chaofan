/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import clear from 'react-native-clear-cache';
import Image from '../../components/Image';
import Images from '../../res/Images';
import Colors from '../../res/Colors';
import { updateUser, weChatBind, toLogIn } from '../../redux/actions/userInfo';
import { getUserInfo } from '../../redux/reselect/userInfo';

const baseURL = require('../../../app.json').webUrl;

const bottomList = [
  { title: '切换账号', type: 'toLogIn' },
];

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUser, weChatBind, toLogIn,
  }, dispatch);
}

class Safesetting extends PureComponent {
  constructor(props) {
    super(props);
    const { userInfo } = this.props;
    this.state = {
      cache: 0,
      unit: '',
      list: [
        [
          { title: '交易密码', type: 'password' },
        ], [
          { title: '绑定微信', type: 'wx', value: !!userInfo.wx_openid },
        ], [
          { title: '清理内存', type: 'clearCache' },
          { title: '隐私政策', type: 'secret' },
          { title: '用户协议', type: 'userAgreements' },
          { title: '关于炒饭', type: 'about' },
        ],
      ],
    };
  }

  componentDidMount() {
    clear.getCacheSize((cache, unit) => {
      this.setState({ cache, unit });
    });
  }

  onPress = ({ type, title }) => {
    const { navigation, weChatBind, toLogIn } = this.props;
    const { list } = this.state;
    if (type === 'clearCache') {
      clear.runClearCache(() => {
        clear.getCacheSize((cache, unit) => {
          this.setState({ cache, unit });
        });
      });
    } else if (type === 'toLogIn') {
      Alert.alert(
        '',
        '确认退出登录吗？',
        [
          { text: '取消', onPress: () => {} },
          {
            text: '确定',
            onPress: () => {
              toLogIn(() => {
                navigation.navigate('BottomNavigator', { params: { index: 4 } });
              }, () => {
                navigation.navigate('BottomNavigator', { params: { index: 2 } });
              });
            },
          },
        ],
      );
    } else if (type === 'password') {
      navigation.navigate('Password', { title });
    } else if (type === 'wx') {
      weChatBind(2).then(() => {
        this.setState({
          list: list.map(group => group.map(item => (item.type === type ? { ...item, value: true } : item))),
        });
      });
    } else if (type === 'secret') {
      navigation.navigate('Web', { title, params: { url: `${baseURL}/secret` } });
    } else if (type === 'userAgreements') {
      navigation.navigate('Web', { title, params: { url: `${baseURL}/userAgreements` } });
    } else if (type === 'about') {
      navigation.navigate('ImagePage', {
        title: '关于炒饭',
        params: {
          images: [{ source: require('../../res/image/about.png'), style: { width: 375, height: 728 } }],
        },
      });
    }
  }

  render() {
    const { list, cache, unit } = this.state;
    return (
      <View style={styles.container}>
        <View>
          {
            list.map((group, i) => (
              <View key={`group${i}`} style={{ marginBottom: 15 }}>
                {
                  group.map((item) => {
                    const Wrapper = item.value ? View : TouchableOpacity;
                    return (
                      <Wrapper
                        onPress={() => this.onPress(item)}
                        key={item.type}
                        style={styles.itemWrapper}
                      >
                        <Text style={styles.text}>{item.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {['wx'].includes(item.type) && <Text style={{ color: '#BDBDBD', fontSize: 12 }}>{item.value ? '已绑定' : '未绑定'}</Text>}
                          {item.type === 'clearCache' && <Text style={{ color: '#BDBDBD', fontSize: 12 }}>{cache + unit}</Text>}
                          {item.value || <Image source={Images.iconRight} style={styles.right} />}
                        </View>
                      </Wrapper>
                    );
                  })
                }
              </View>
            ))
          }
        </View>
        <View style={{ marginBottom: 50 }}>
          {
            bottomList.map(item => (
              <TouchableOpacity
                onPress={() => this.onPress(item)}
                key={item.type}
                style={[styles.itemWrapper, { marginBottom: 15, justifyContent: 'center' }]}
              >
                <Text style={styles.text}>{item.title}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACK,
    justifyContent: 'space-between',
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    alignItems: 'center',
    height: 55,
    marginBottom: 2,
  },
  text: {
    color: '#333',
    fontSize: 13,
  },
  frameAvatar: {
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    height: 15,
    width: 10,
    marginLeft: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Safesetting);
