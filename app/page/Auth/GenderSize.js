import React, { PureComponent } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Image, KeyboardDismiss } from '../../components';
import Images from '../../res/Images';
import { wPx2P, hPx2P } from '../../utils/ScreenUtil';
import {
  PADDING_TAB,
} from '../../common/Constant';
import { YaHei } from '../../res/FontFamily';
import { showToast, closeModalbox } from '../../utils/MutualUtil';
import { updateUser } from '../../redux/actions/userInfo';
import { getUserInfo } from '../../redux/reselect/userInfo';
import Colors from '../../res/Colors';
import { showChooseSize } from '../../utils/CommonUtils';

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUser,
  }, dispatch);
}

class GenderSize extends PureComponent {
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
      size: '',
      sex: userInfo.sex,
      modalIsOpen: false,
    };
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  }

  goNext = () => {
    const { userInfo, updateUser } = this.props;
    const { size, sex } = this.state;
    if (!sex) {
      showToast('请选择性别');
    } if (!size) {
      showToast('请选择鞋码');
    }
    const user = {
      size, sex, user_name: userInfo.user_name, age: userInfo.age,
    };
    updateUser(user).then(() => {
      if (this.routeParams.successCallback) {
        this.routeParams.successCallback();
      }
    });
  }

  changeSex = () => {
    const { sex } = this.state;
    this.setState({ sex: sex === '男' ? '女' : '男' });
  }

  chooseSize = (size) => {
    this.setState({ size });
    this.closeModal();
  }

  openModal = () => {
    const { modalIsOpen } = this.state;
    if (!modalIsOpen) {
      this.sizeWrapper.measure((x, y, w, h, px, py) => {
        this.setState({ modalIsOpen: true });
        showChooseSize(SCREEN_HEIGHT - py - 45, this.chooseSize, () => this.setState({ modalIsOpen: false }));
      });
    } else {
      this.closeModal();
    }
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
    closeModalbox();
  }

  render() {
    const { size, sex, modalIsOpen } = this.state;
    return (
      <KeyboardDismiss style={styles.container}>
        <Image resizeMode="contain" source={require('../../res/image/logo.png')} style={styles.logo} />
        <View style={{ height: 100, justifyContent: 'space-between' }}>
          <TouchableOpacity style={styles.wrapper} onPress={this.changeSex}>
            <Text style={styles.text}>性别</Text>
            <View style={styles.inputWrapper}>
              <Text style={{ color: '#E4E4EE', fontSize: 13 }}>选择性别</Text>
              <Image
                source={sex === '女' ? Images.chooseGirl : sex === '男' ? Images.chooseBoy : Images.nosex}
                style={styles.sexBtnWrapper}
                onPress={this.changeSex}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wrapper}
            onPress={this.openModal}
            ref={(v) => { this.sizeWrapper = v; }}
            collapsable={false}
          >
            <View style={styles.sizeWrapper0}>
              <Text style={styles.text}>鞋码</Text>
              <Text style={styles.size}>{size}</Text>
            </View>
            <TouchableOpacity style={styles.btn} onPress={this.openModal}>
              <View style={modalIsOpen ? styles.arrowUp : styles.arrowDown} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.frameLogin, { backgroundColor: size === '' || sex === '' ? Colors.DISABLE : Colors.YELLOW }]}
          onPress={this.goNext}
        >
          <Text style={styles.nextText}>开始体验</Text>
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
  text: {
    fontSize: 13,
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
  btn: {
    height: 17,
    width: 17,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: Colors.YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sexBtnWrapper: {
    width: 55,
    height: 23,
    marginLeft: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sizeWrapper0: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 29,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 3,
    width: wPx2P(304),
    borderBottomColor: '#E4E4EE',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
  },
  size: {
    fontSize: 24,
    fontFamily: YaHei,
    fontWeight: 'bold',
    marginLeft: 25,
  },
  arrowUp: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderBottomWidth: 5,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: '#fff',
    borderRightColor: 'transparent',
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 5,
    borderBottomWidth: 0,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#fff',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
  },
  sizeWrapper: {
    width: wPx2P(94),
    height: wPx2P(40),
    marginVertical: wPx2P(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  sexText: {
    marginTop: hPx2P(67),
    width: wPx2P(41),
    height: wPx2P(25),
  },
  sizeGender: {
    width: wPx2P(307),
    height: wPx2P(91),
    marginBottom: hPx2P(32),
  },
  sex: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderText: {
    fontFamily: YaHei,
    fontWeight: 'bold',
  },
  boy: {
    width: wPx2P(130),
    height: wPx2P(40),
  },
  bottom: {
    flexDirection: 'row',
    bottom: hPx2P(34 + PADDING_TAB),
    position: 'absolute',
    height: wPx2P(48),
    width: wPx2P(244),
    backgroundColor: Colors.YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    overflow: 'hidden',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
  },
  iconUp: {
    height: wPx2P(15),
    width: wPx2P(26),
  },
  sizeText: {
    fontFamily: YaHei,
    fontSize: 21,
    padding: 0,
  },
  genderWrapper: {
    flexDirection: 'row',
    marginTop: hPx2P(13),
  },
  iconBoy: {
    height: wPx2P(59),
    width: wPx2P(66),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GenderSize);
