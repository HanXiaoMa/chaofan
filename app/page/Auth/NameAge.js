import React, { PureComponent } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Image, KeyboardDismiss, InputVarySize } from '../../components';
import { wPx2P, hPx2P } from '../../utils/ScreenUtil';
import {
  PADDING_TAB,
} from '../../common/Constant';
import { showToast } from '../../utils/MutualUtil';
import { receiveUser } from '../../redux/actions/userInfo';
import { getUserInfo } from '../../redux/reselect/userInfo';
import Colors from '../../res/Colors';

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

class NameAge extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity onPress={() => {
        const successCallback = navigation.getParam('params')?.successCallback;
        successCallback && successCallback();
      }}
      >
        <Text style={{ marginRight: 20, color: '#08f' }}>稍后设置</Text>
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);
    const { userInfo, navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.state = {
      user_name: userInfo.user_name || '',
      age: userInfo.age || '',
    };
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  }

  goNext = () => {
    const { navigation, receiveUser } = this.props;
    const { user_name, age } = this.state;
    if (!user_name) {
      showToast('请输入昵称');
    } else if (!age) {
      showToast('请输入年龄');
    } else {
      receiveUser({ user_name, age });
      navigation.navigate('GenderSize', {
        params: {
          successCallback: this.routeParams.successCallback,
        },
      });
    }
  }

  onChangeName = (user_name) => {
    this.setState({ user_name });
  }

  onChangeAge = (age) => {
    this.setState({ age });
  }

  render() {
    const { user_name, age } = this.state;
    return (
      <KeyboardDismiss style={styles.container}>
        <Image resizeMode="contain" source={require('../../res/image/logo.png')} style={styles.logo} />
        <View style={{ height: 107.5, justifyContent: 'space-between' }}>
          <View style={styles.wrapper}>
            <Text style={{ fontSize: 13 }}>昵称</Text>
            <InputVarySize
              onChangeText={this.onChangeName}
              selectionColor="#00AEFF"
              placeholder="输入昵称"
              defaultValue={user_name}
              maxLength={8}
            />
          </View>

          <View style={styles.wrapper}>
            <Text style={{ fontSize: 13 }}>年龄</Text>
            <InputVarySize
              onChangeText={this.onChangeAge}
              keyboardType="number-pad"
              selectionColor="#00AEFF"
              placeholder="输入年龄"
              mask="[000]"
              defaultValue={age}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={this.goNext}
          style={[styles.frameLogin, { backgroundColor: user_name === '' || age === '' ? Colors.DISABLE : Colors.YELLOW }]}
        >
          <Text style={styles.login}>下一步</Text>
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
  frameLogin: {
    height: wPx2P(43),
    width: wPx2P(304),
    alignItems: 'center',
    marginTop: hPx2P(34),
    justifyContent: 'center',
    borderRadius: 2,
    overflow: 'hidden',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: wPx2P(304),
    paddingBottom: 3,
    borderBottomColor: '#E4E4EE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logo: {
    height: wPx2P(114),
    width: wPx2P(108),
    marginBottom: hPx2P(43.5),
    marginTop: hPx2P(55),
  },
  age: {
    flex: 1,
    marginRight: 8,
    marginLeft: 16,
    color: '#666',
    padding: 0,
    includeFontPadding: false,
  },
  bottom: {
    flexDirection: 'row',
    bottom: hPx2P(24 + PADDING_TAB),
    position: 'absolute',
  },
  login: {
    color: '#fff',
    fontSize: 16,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NameAge);
