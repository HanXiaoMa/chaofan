import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { bindActionCreators } from 'redux';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import {
  ImageBackground, KeyboardDismiss, AvatarWithShadow,
} from '../../components';
import Images from '../../res/Images';
import Colors from '../../res/Colors';
import { updateUser } from '../../redux/actions/userInfo';
import { getUserInfo } from '../../redux/reselect/userInfo';
import { PADDING_TAB } from '../../common/Constant';
import { wPx2P, hPx2P } from '../../utils/ScreenUtil';
import { showToast, closeModalbox, showActionSheet } from '../../utils/MutualUtil';
import { upload } from '../../http/Axios';
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

const options = ['相册', '相机', '取消'];

class Setting extends PureComponent {
  constructor(props) {
    super(props);
    const { userInfo } = this.props;
    this.state = {
      list: [
        { title: '头像', key: 'avatar', value: userInfo.avatar },
        { title: '昵称', key: 'user_name', value: userInfo.user_name },
        { title: '性别', key: 'sex', value: userInfo.sex },
        { title: '年龄', key: 'age', value: userInfo.age },
        { title: '鞋码', key: 'size', value: userInfo.size },
      ],
      modalIsOpen: false,
    };
  }

  submit = () => {
    const { updateUser, navigation } = this.props;
    const { list } = this.state;
    updateUser({
      size: list[4].value === '0.0' ? -1 : list[4].value,
      sex: list[2].value,
      age: list[3].value === '0' ? -1 : list[3].value,
      user_name: list[1].value,
      avatar: list[0].value,
    }).then(() => {
      showToast('资料修改成功');
      navigation.pop();
    });
  }

  sizeChange = (size) => {
    this.size = size;
  }

  onPress = (item) => {
    const { userInfo } = this.props;
    this.user_name = userInfo.user_name;
    this.sex = userInfo.sex;
    this.age = userInfo.age;
    this.size = userInfo.size;
    if (item.key === 'avatar') {
      showActionSheet({
        options,
        cancelButtonIndex: 2,
        onPress: this.openPicker,
      });
    } else if (item.key === 'size') {
      const { modalIsOpen } = this.state;
      if (!modalIsOpen) {
        this.sizeWrapper.measure((x, y, w, h, px, py) => {
          this.setState({ modalIsOpen: true });
          showChooseSize(SCREEN_HEIGHT - py - 50, this.chooseSize, () => this.setState({ modalIsOpen: false }));
        });
      } else {
        this.closeModal();
      }
    }
  }

  chooseSize = (size) => {
    this.changeValue('size', size);
    this.closeModal();
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
    closeModalbox();
  }

  openPicker = (i) => {
    if ([0, 1].includes(i)) {
      ImagePicker[['openPicker', 'openCamera'][i]]({
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
        cropping: true,
        freeStyleCropEnabled: true,
        useFrontCamera: true,
        mediaType: 'photo',
        cropperChooseText: '选择',
        cropperCancelText: '取消',
        loadingLabelText: '加载中...',
      }).then((image) => {
        upload('/user/up_avatar', {
          type: 1,
          avatar: image.path,
        }).then((res) => {
          this.changeValue('avatar', res.data);
        });
      });
    }
  }

  onChangeName = (name) => {
    const text = name.slice(0, 8);
    this.valueInput.setNativeProps({ text });
    this.changeValue('user_name', text);
  }

  changeValue = (key, value) => {
    const { list } = this.state;
    this.setState({
      list: list.map((v) => {
        if (v.key === key) {
          return ({ ...v, value });
        }
        return v;
      }),
    });
  }

  changeSex = () => {
    const { list } = this.state;
    const sex = list[2].value === '男' ? '女' : '男';
    this.changeValue('sex', sex);
  }

  render() {
    const { list, modalIsOpen } = this.state;
    const { userInfo } = this.props;
    return (
      <KeyboardDismiss style={styles.container}>
        {
          list.map((v) => {
            const Wrapper = ['sex', 'age', 'user_name'].includes(v.key) ? View : TouchableOpacity;
            return (
              <Wrapper
                onPress={() => this.onPress(v)}
                key={v.key}
                style={[styles.itemWrapper, { marginBottom: v.key === 'avatar' ? 7 : 2, height: v.key === 'avatar' ? 64 : 56 }]}
              >
                <Text style={styles.text}>{v.title}</Text>
                <View style={styles.itemRight}>
                  {
                    v.key === 'avatar' ? <AvatarWithShadow source={{ uri: v.value }} size={40} />
                      : v.key === 'sex' ? (
                        <ImageBackground
                          source={v.value === '女' ? Images.chooseGirl : v.value === '男' ? Images.chooseBoy : Images.nosex}
                          style={styles.sexBtnWrapper}
                          onPress={this.changeSex}
                        />
                      ) : v.key === 'size' ? (
                        <View style={{ flexDirection: 'row' }} collapsable={false} ref={(v) => { this.sizeWrapper = v; }}>
                          <Text style={{ color: '#DEDEDE', fontSize: 12, marginRight: 5 }}>{v.value}</Text>
                          <View style={styles.arrow}>
                            <View style={modalIsOpen ? styles.arrowUp : styles.arrowDown} />
                          </View>
                        </View>
                      ) : v.key === 'age' ? (
                        <TextInput
                          style={styles.input}
                          placeholder={['0', '0.0'].includes(v.value) ? '未设置' : userInfo[v.key]}
                          selectionColor="#00AEFF"
                          placeholderTextColor="#DEDEDE"
                          maxLength={3}
                          underlineColorAndroid="transparent"
                          keyboardType="number-pad"
                          onChangeText={(text) => { this.changeValue(v.key, text); }}
                        />
                      ) : (
                        <TextInput
                          style={styles.input}
                          ref={(v) => { this.valueInput = v; }}
                          placeholder={['0', '0.0'].includes(v.value) ? '未设置' : userInfo[v.key]}
                          selectionColor="#00AEFF"
                          placeholderTextColor="#DEDEDE"
                          underlineColorAndroid="transparent"
                          onChangeText={this.onChangeName}
                        />
                      )
                  }
                </View>
              </Wrapper>
            );
          })
        }
        <TouchableOpacity style={styles.btn} onPress={this.submit}>
          <Text style={{ color: '#fff', fontSize: 16 }}>确认修改</Text>
        </TouchableOpacity>
      </KeyboardDismiss>
    );
  }
}

const styles = StyleSheet.create({
  sexBtnWrapper: {
    flexDirection: 'row',
    width: 55,
    height: 23,
    overflow: 'hidden',
    borderRadius: 2,
  },
  btn: {
    height: 46,
    width: wPx2P(265),
    backgroundColor: Colors.YELLOW,
    overflow: 'hidden',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hPx2P(PADDING_TAB + 30),
  },
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACK,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: '#000',
    padding: 0,
    includeFontPadding: false,
    textAlign: 'right',
    height: '100%',
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  text: {
    color: '#333',
    fontSize: 13,
  },
  right: {
    height: 7.5,
    width: 5,
    marginLeft: 10,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    height: '100%',
  },
  arrow: {
    height: 17,
    width: 17,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: Colors.YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
