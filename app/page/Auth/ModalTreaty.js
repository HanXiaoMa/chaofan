/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Colors from '../../res/Colors';
import { getUserInfo } from '../../redux/reselect/userInfo';
import { receiveUser } from '../../redux/actions/userInfo';

const baseURL = require('../../../app.json').webUrl;

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    receiveUser,
  }, dispatch);
}

class ModalTreaty extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      disAgree: false,
    };
  }

  toWeb = (i) => {
    const { navigation } = this.props;
    navigation.navigate('Web', {
      params: {
        url: `${baseURL}/${i === 1 ? 'secret' : 'userAgreements'}`,
      },
      title: i === 1 ? '隐私政策' : '用户协议',
    });
  }

  disAgreeText = () => {
    this.setState({
      disAgree: true,
    });
  }

  agree = () => {
    const { receiveUser } = this.props;
    receiveUser({ isAgreeTreaty: true });
  }

  render() {
    const { disAgree } = this.state;
    const { userInfo } = this.props;
    if (userInfo.isAgreeTreaty) {
      return null;
    }
    const list = [
      '欢迎使用炒饭APP！\n依据最新法律要求，特地向您推送本提示。炒饭一直致力采用最大可能的方法和手段保护您的信息安全，'
      + '并根据使用服务的具体功能需要收集信息。\n除非得到授权，我们不会向任何第三方提供您的信息。您可以阅读我们完整的',
      '《隐私政策》',
      '和',
      '《用户协议》',
      '了解我们的承诺。',
    ];
    return (
      <View style={styles.container}>
        <View style={[styles.wrapper, { height: disAgree ? 164.5 : 328, marginTop: disAgree ? 0 : (SCREEN_WIDTH - 328) * 0.2 }]}>
          <Text style={styles.title}>温馨提示</Text>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.contentWrapper}>
            {
            disAgree
              ? <Text style={styles.content}>请同意《隐私政策》和《用户协议》全部条款后再开始使用我们的服务</Text>
              : (
                <Text>
                  {
                    list.map((v, i) => {
                      if ([1, 3].includes(i)) {
                        return <Text key={`agree_hint${i}`} style={styles.agree_hint} onPress={() => this.toWeb(i)}>{v}</Text>;
                      }
                      return <Text key={`agree_hint${i}`} style={styles.content}>{v}</Text>;
                    })
                  }
                </Text>
              )
          }
          </ScrollView>
          {
            disAgree
              ? (
                <TouchableOpacity
                  onPress={() => { this.setState({ disAgree: false }); }}
                  style={{
                    height: 44,
                    borderTopColor: '#d8d8d8',
                    borderTopWidth: StyleSheet.hairlineWidth,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: Colors.YELLOW, fontSize: 17 }}>下一步</Text>
                </TouchableOpacity>
              )
              : (
                <View style={{
                  flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 24.5, marginBottom: 18, marginTop: 25,
                }}
                >
                  <TouchableOpacity onPress={this.disAgreeText}>
                    <Text style={styles.disAgreeText}>不同意</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.agree}>
                    <Text style={styles.agreeText}>同意</Text>
                  </TouchableOpacity>
                </View>
              )
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: 300,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    color: '#333',
    marginTop: 25,
    marginBottom: 15,
    textAlign: 'center',
  },
  contentWrapper: {
    height: 180,
    overflow: 'hidden',
    paddingHorizontal: 24.5,
  },
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  disAgreeText: {
    fontSize: 17,
    color: '#666',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#979797',
    borderRadius: 5,
    height: 40,
    width: 122,
    textAlign: 'center',
    lineHeight: 40,
  },
  agreeText: {
    fontSize: 17,
    color: '#fff',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: Colors.YELLOW,
    height: 40,
    width: 122,
    textAlign: 'center',
    lineHeight: 40,
  },
  agree_hint: {
    fontSize: 14,
    color: 'rgb(0, 122, 255)',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalTreaty);
