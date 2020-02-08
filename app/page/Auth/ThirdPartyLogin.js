import React, { PureComponent } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ImageBackground } from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { thirdPartyLogin } from '../../redux/actions/userInfo';
import { updateSchemes } from '../../redux/actions/schemes';
import { getSchemes } from '../../redux/reselect/schemes';

function mapStateToProps() {
  return state => ({
    schemes: getSchemes(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    thirdPartyLogin,
    updateSchemes,
  }, dispatch);
}

class ThirdPartyLogin extends PureComponent {
  componentDidMount() {
    const { updateSchemes } = this.props;
    updateSchemes();
  }

  auth = (i) => {
    const {
      navigation, thirdPartyLogin, successAuth, closeAuth, successCallback: successCallbackProps,
    } = this.props;
    thirdPartyLogin(i).then((res) => {
      if (res?.user_s_id) {
        successAuth();
      } else {
        const successCallback = () => {
          closeAuth && closeAuth();
          if (successCallbackProps) {
            successCallbackProps();
          } else {
            navigation.navigate('BottomNavigator');
          }
        };
        navigation.navigate('PhoneNum', { params: { successCallback } });
      }
    });
  }

  render() {
    const { schemes } = this.props;
    const supports = schemes.filter(v => v.supported);
    if (supports.length === 0) {
      return null;
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
        <View style={{ alignItems: 'center', marginHorizontal: wPx2P(51), flexDirection: 'row' }}>
          <View style={styles.hengxian} />
          <Text style={{ fontSize: 11, color: '#707479', marginHorizontal: wPx2P(11) }}>其他方式登录</Text>
          <View style={styles.hengxian} />
        </View>
        <View style={styles.thirdWrapper}>
          {
            supports.map(v => (
              <ImageBackground
                key={v.id}
                onPress={() => this.auth(v.authId)}
                source={v.loginIcon}
                style={styles.wechat}
              />
            ))
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  hengxian: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#EEEEF4',
  },
  login: {
    color: '#fff',
    fontSize: 16,
  },
  thirdWrapper: {
    marginTop: 13,
    flexDirection: 'row',
  },
  wechat: {
    height: wPx2P(47),
    width: wPx2P(47),
    marginHorizontal: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ThirdPartyLogin);
