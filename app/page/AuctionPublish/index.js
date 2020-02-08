/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, TextInput, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback, Alert, Keyboard, Platform, PermissionsAndroid,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Switch from 'react-native-switch-pro';
import ImagePicker from 'react-native-image-crop-picker';
import AliyunOSS from 'aliyun-oss-react-native';
import { clean } from 'react-native-camera';
import {
  Image, Dropdown, KeyboardScrollView, SingleBtn, ModalNormal,
} from '../../components';
import {
  showToast, showModalbox, showActionSheet, closeModalbox,
} from '../../utils/MutualUtil';
import {
  STATUSBAR_HEIGHT, PADDING_TAB, hitSlop,
} from '../../common/Constant';
import Images from '../../res/Images';
import { YaHei } from '../../res/FontFamily';
import ChooseTagModal from './ChooseTagModal';
import PhotoModal from './PhotoModal';
import { wPx2P } from '../../utils/ScreenUtil';
import AutoUploadImage from './AutoUploadImage';
import { request } from '../../http/Axios';
import {
  getAuctionTags, resetRoute, formatDate, getUserInfo, debounce,
} from '../../utils/CommonUtils';
import { fetchListData } from '../../redux/actions/listData';
import { getUser } from '../../redux/actions/userInfo';

const SIZE = wPx2P(80);
const continueTimes = Array(72).fill('').map((v, i) => ({ title: `${i + 1}小时`, id: i + 1 }));
const sendOutTimes = [
  { title: '48小时', id: 1 },
  { title: '15天', id: 2 },
  { title: '30天', id: 3 },
];

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchListData, getUser,
  }, dispatch);
}

class FreeTradeSearch extends PureComponent {
  static navigationOptions = () => ({ title: '发布商品' });
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    const item = this.routeParams.item || {};
    this.data = this.routeParams.item || { images: [] };
    const tag = getAuctionTags().find(v => v.id == item.gt_id) || {};
    window.photoImages = {};
    this.photoType = tag.name;
    if (this.photoType) {
      window.photoImages[this.photoType] = (item.images || []).map(v => ({
        key: `tower/auction/${v.url.split('?')[0].split('/').pop()}`,
        uri: v.url,
        uploadStatus: 'success',
      }));
    }
    this.autoUploadImage = {};
    this.state = {
      title: item.title || '',
      tag,
      continueTime: continueTimes[item.l_time - 1 || 23],
      sendOutTime: sendOutTimes.find(v => v.id == item.s_time) || {},
      buyoutPrice: item.buyout_price / 100 || '',
      minPrice: item.min_price / 100 || '',
      autoPutOn: item.auto_put_on != 0,
      images: window.photoImages[this.photoType] || [],
      description: item.description,
    };
  }

  componentDidMount() {
    AliyunOSS.addEventListener('uploadProgress', this.uploadProgress);
    if (getUserInfo().is_check != 1) {
      const { navigation, getUser } = this.props;
      showModalbox({
        element: (<ModalNormal
          title="实名认证"
          showCancel={false}
          sure={() => {
            if (!this.authName) {
              showToast('请输入真实姓名');
            } else if (!this.authNum) {
              showToast('请输入真实身份证号码');
            } else if (this.authNum?.length < 18) {
              showToast('请输入18位身份证号码');
            } else {
              request('/user/do_check_user', { params: { idcard: this.authNum, name: this.authName }, showLoading: true }).then(() => {
                getUser();
                closeModalbox();
              });
            }
          }}
          CustomDom={(
            <View>
              <Text style={styles.modalTitle}>姓名</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="请输入真实姓名"
                selectionColor="#00AEFF"
                placeholderTextColor="#D0D0D0"
                underlineColorAndroid="transparent"
                clearButtonMode="while-editing"
                onChangeText={(v) => { this.authName = v; }}
              />
              <Text style={[styles.modalTitle, { marginTop: 20 }]}>身份证号</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="请输入真实身份证号码"
                selectionColor="#00AEFF"
                maxLength={18}
                placeholderTextColor="#D0D0D0"
                underlineColorAndroid="transparent"
                clearButtonMode="while-editing"
                onChangeText={(v) => { this.authNum = v; }}
              />
              <Text style={{ fontSize: 12, color: '#F16060', marginTop: 20 }}>根据法律规定</Text>
              <Text style={{ fontSize: 12, color: '#F16060' }}>发布商品需要先实名认证</Text>
            </View>
          )}
          closeModalbox={() => {
            closeModalbox();
            navigation.pop();
          }}
        />),
        options: {
          backButtonClose: false,
          backdropPressToClose: false,
          style: {
            height: 350,
            width: 265,
            borderRadius: 2,
          },
        },
      });
    }
  }

  componentWillUnmount() {
    window.photoImages = {};
    AliyunOSS.removeEventListener('uploadProgress');
    clean();
  }

  uploadProgress = (p) => {
    const progress = p.currentSize / p.totalSize;
    if (progress === 1) {
      window.photoImages[this.photoType] = window.photoImages[this.photoType].map((v) => {
        if (v.key === p.currentKey) {
          return ({ ...v, uploadStatus: 'success' });
        }
        return v;
      });
    }
    this.autoUploadImage[p.currentKey] && this.autoUploadImage[p.currentKey].onChange(progress);
  }

  onChangeTitle = (title) => {
    this.setState({ title });
  }

  onChangeDescribe = (description) => {
    this.setState({ description });
  }

  onChangeBuyoutPrice = (buyoutPrice) => {
    this.setState({ buyoutPrice });
  }

  onChoosedTag = (tag) => {
    this.photoType = tag.name;
    this.setState({ tag, images: window.photoImages[tag.name] });
  }

  onChoosedContinueTime = (continueTime) => {
    this.setState({ continueTime });
  }

  onChoosedSendOutTime = (sendOutTime) => {
    this.setState({ sendOutTime });
  }

  onChangeMinPrice = (minPrice) => {
    this.setState({ minPrice });
  }

  submit = () => {
    const {
      title, tag, continueTime, sendOutTime, buyoutPrice, minPrice, autoPutOn, images = [], description,
    } = this.state;
    const { navigation, fetchListData } = this.props;
    const hint = {
      title: '请填写标题',
      tag: '请选择标签',
      continueTime: '请选择持续时间',
      sendOutTime: '请选择发货时间',
      minPrice: '请填写起拍价',
      images: '请添加拍品图片',
      description: '请填写拍品描述',
    };
    if (!title) {
      showToast(hint.title);
      return;
    } if (!tag?.id) {
      showToast(hint.tag);
      return;
    } if (!continueTime?.title) {
      showToast(hint.continueTime);
      return;
    } if (!sendOutTime?.title) {
      showToast(hint.sendOutTime);
      return;
    } if (!minPrice) {
      showToast(hint.minPrice);
      return;
    } if (`${minPrice}`.includes('.')) {
      showToast('请输入整数的起拍价');
      return;
    } if (parseInt(minPrice) >= parseInt(buyoutPrice)) {
      showToast('一口价必须高于起拍价');
      return;
    } if (`${buyoutPrice}`.includes('.')) {
      showToast('请输入整数的一口价');
      return;
    } if (images.length < 1) {
      showToast(hint.images);
      return;
    } if (!description) {
      showToast(hint.description);
      return;
    }
    const imagesArrApi = this.data.images.map(v => `tower/auction/${v.url.split('?')[0].split('/').pop()}`);
    const imagesArrLocal = images.map(v => v.key);
    const add_images = images.filter(v => v.key).map((v, index) => {
      if (!imagesArrApi.includes(v.key)) {
        return ({ index, url: `/${v.key}` });
      }
      return false;
    }).filter(v => v);
    const del_images = this.data.images.filter(v => !imagesArrLocal.includes(`tower/auction/${v.url.split('?')[0].split('/').pop()}`)).map(v => v.id);
    if ((window.photoImages[tag.name] || []).some(v => v.uri && !v.uploadStatus)) {
      showToast('请等待图片上传完成再发布');
      return;
    }
    const params = {
      title,
      gt_id: tag.id,
      l_time: continueTime.id,
      s_time: sendOutTime.id,
      buyout_price: buyoutPrice,
      min_price: minPrice,
      add_images: JSON.stringify(add_images),
      del_images: del_images.join(','),
      description,
      auto_put_on: autoPutOn ? 1 : 0,
    };
    // 带上id为编辑
    if (this.data.id) { params.id = this.data.id; }
    request('/auction/auction_apply', { params }).then((res) => {
      navigation.navigate('Pay', {
        params: {
          payData: res.data,
          successCallback: () => {
            fetchListData('auctionSellerHistory', {}, 'refresh');
            resetRoute([
              { routeName: 'BottomNavigator', params: { params: { index: 4 } } },
              { routeName: 'AuctionGoods', params: { params: { type: 'auctionSellerHistory' } } },
            ]);
          },
        },
      });
    });
  }

  requestCameraPermission = async () => {
    if (Platform.OS === 'ios') { return true; }
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (granted === 'granted') {
        return true;
      }
      showToast('获取权限失败，无法进行拍照');
      return false;
    } catch (err) {
      showToast(err.toString());
      return false;
    }
  }

  requestReadPermission = async () => {
    if (Platform.OS === 'ios') { return true; }
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      if (granted === 'granted') {
        return true;
      }
      showToast('获取存储权限失败，无法上传图片');
      return false;
    } catch (err) {
      showToast(err.toString());
      return false;
    }
  }

  showPhotoModal = async (type, index) => {
    this.photoType = type;
    window.photoImages[type] = window.photoImages[type] || [];
    Keyboard.dismiss();
    const grantedCamera = await this.requestCameraPermission();
    if (!grantedCamera) {
      return;
    }
    const grantedRead = await this.requestReadPermission();
    if (!grantedRead) {
      return;
    }
    showModalbox({
      element: (<PhotoModal
        onChoosed={this.onChoosedTag}
        type={type}
        index={index}
      />),
      options: {
        style: {
          height: SCREEN_HEIGHT - STATUSBAR_HEIGHT,
          backgroundColor: 'transparent',
        },
        position: 'bottom',
        backdropOpacity: 0,
        onClosed: () => {
          this.setState({ images: window.photoImages[type] || [] });
        },
      },
    });
  }

  toTakePhoto = (index) => {
    const { tag } = this.state;
    if (!tag?.id) {
      showToast('请先选择标签');
      return;
    } if (tag.name === 'dress') {
      showModalbox({
        element: (
          <View style={styles.dressModal}>
            <TouchableOpacity onPress={() => { this.showPhotoModal('clothes', index); }} style={styles.dressModalItem}>
              <Text>上装</Text>
            </TouchableOpacity>
            <View style={styles.shuxian} />
            <TouchableOpacity onPress={() => { this.showPhotoModal('trousers', index); }} style={styles.dressModalItem}>
              <Text>下装</Text>
            </TouchableOpacity>
          </View>),
        options: {
          style: {
            height: PADDING_TAB + 120,
            backgroundColor: 'transparent',
          },
          position: 'bottom',
        },
      });
    } else {
      this.showPhotoModal(tag.name, index);
    }
  }

  openActionSheet = (index) => {
    const { tag } = this.state;
    if (!tag?.id) {
      showToast('请先选择标签');
    } else {
      showActionSheet({
        options: ['相册', '相机', '取消'],
        cancelButtonIndex: 2,
        onPress: way => this.choosePhotoWay(way, index),
      });
    }
  }

  choosePhotoWay = (way, index) => {
    if (way === 0) {
      ImagePicker.openPicker({
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
        cropping: true,
        freeStyleCropEnabled: false,
        mediaType: 'photo',
        cropperChooseText: '选择',
        cropperCancelText: '取消',
        loadingLabelText: '加载中...',
      }).then((image) => {
        const item = {
          uri: image.path,
          key: `tower/auction/${`${formatDate(Date.now() / 1000, 'yyyy-MM-dd-hh-mm-ss')}-${image.path.split('/').pop()}`}`,
          uploadStatus: null,
        };
        if (!window.photoImages[this.photoType]) {
          window.photoImages[this.photoType] = [];
        }
        if (window.photoImages[this.photoType][index]) {
          window.photoImages[this.photoType] = window.photoImages[this.photoType].map((v, i) => {
            if (i === index) {
              return item;
            }
            return v;
          });
        } else {
          window.photoImages[this.photoType] = [...(window.photoImages[this.photoType] || []), item];
        }
        this.setState({ images: window.photoImages[this.photoType] });
      });
    } else if (way === 1) {
      this.toTakePhoto(index);
    }
  }

  deleteImage = (index) => {
    Alert.alert(
      '',
      '确认删除该图片吗？',
      [
        { text: '取消', onPress: () => {} },
        {
          text: '确定',
          onPress: () => {
            window.photoImages[this.photoType] = window.photoImages[this.photoType].filter((v, i) => i !== index);
            this.setState({ images: window.photoImages[this.photoType] });
          },
        },
      ],
    );
  }

  toChooseTag = () => {
    showModalbox({
      element: (<ChooseTagModal onChoosed={this.onChoosedTag} />),
      options: {
        style: {
          height: 250 + PADDING_TAB,
          backgroundColor: 'transparent',
        },
        position: 'bottom',
      },
    });
  }

  render() {
    const {
      tag, continueTime, sendOutTime, minPrice, autoPutOn, images: imageState = [], buyoutPrice, description, title,
    } = this.state;
    const fee = [5, 8, 10][sendOutTime.id - 1 || 0];
    const minDeposit = [100, 300, 500][sendOutTime.id - 1 || 0];
    const images = imageState.filter(v => v.uri);
    const deposit = Math.max(minDeposit, Math.ceil(minPrice * fee / 100));
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <KeyboardScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          getInputRefs={() => [this.textInputMinPrice, this.textInputDescription]}
          contentContainerStyle={styles.scrollView}
        >
          <TouchableWithoutFeedback onPress={() => this.textInputTitle.focus()}>
            <View>
              <Text style={styles.title}>标题</Text>
              <TextInput
                style={styles.input}
                placeholder="标题最多30个字"
                defaultValue={`${title}`}
                selectionColor="#00AEFF"
                placeholderTextColor="#D0D0D0"
                underlineColorAndroid="transparent"
                ref={(v) => { this.textInputTitle = v; }}
                clearButtonMode="while-editing"
                onChangeText={this.onChangeTitle}
              />
            </View>
          </TouchableWithoutFeedback>

          <TouchableOpacity onPress={this.toChooseTag}>
            <Text style={styles.title}>选择分类</Text>
            <View style={styles.tagWrapper}>
              <Text style={{ color: tag?.id ? '#000' : '#D0D0D0', fontSize: 13 }}>{tag?.type_name || '未选择分类'}</Text>
              <Image source={Images.iconRight} style={styles.right} />
            </View>
          </TouchableOpacity>

          <Text style={styles.title}>拍卖相关设置</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity hitSlop={hitSlop} onPress={() => this.continueTime.open()} style={[styles.timeView, { flex: 1.2 }]}>
              <View style={styles.timeWrapper}>
                <Text style={{ color: continueTime.title ? '#000' : '#D0D0D0', fontSize: 13 }}>{continueTime.title || '设置持续时间'}</Text>
              </View>
              <Dropdown
                ref={(v) => { this.continueTime = v; }}
                filter={this.onChoosedContinueTime}
                options={continueTimes}
                width={90}
                returnFullItem
                showChoosedTitle={false}
                offsetRight={100}
              />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={hitSlop} onPress={() => this.sendOutTime.open()} style={[styles.timeView, { marginLeft: 17, flex: 2 }]}>
              <Text style={{ fontSize: 13 }}>发货时间：</Text>
              <View style={styles.timeWrapper}>
                <Text style={{ color: sendOutTime.title ? '#000' : '#D0D0D0', fontSize: 13 }}>{sendOutTime.title || '设置发货时间'}</Text>
              </View>
              <Dropdown
                ref={(v) => { this.sendOutTime = v; }}
                filter={this.onChoosedSendOutTime}
                options={sendOutTimes}
                width={90}
                returnFullItem
                showChoosedTitle={false}
              />
            </TouchableOpacity>
          </View>

          <TouchableWithoutFeedback onPress={() => this.textInputBuyoutPrice.focus()}>
            <View>
              <Text style={[styles.title, { marginBottom: 5 }]}>一口价</Text>
              <View style={styles.buyoutPriceWrapper}>
                <Text style={{ fontSize: 13, marginRight: 5 }}>￥</Text>
                <TextInput
                  style={styles.buyoutPrice}
                  defaultValue={`${buyoutPrice}`}
                  placeholder="(选填)"
                  keyboardType="number-pad"
                  selectionColor="#00AEFF"
                  maxLength={7}
                  placeholderTextColor="#D0D0D0"
                  underlineColorAndroid="transparent"
                  clearButtonMode="while-editing"
                  ref={(v) => { this.textInputBuyoutPrice = v; }}
                  onChangeText={this.onChangeBuyoutPrice}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.textInputMinPrice.focus()}>
            <View>
              <View style={{ marginTop: 20, flexDirection: 'row' }}>
                <View style={styles.baozhengjin}>
                  <Text style={{ fontSize: 14, marginRight: 10 }}>保证金</Text>
                  <Text style={{ fontSize: 13 }}>￥</Text>
                  <Text style={{ color: '#FFA700', fontSize: 14 }}>{deposit}</Text>
                </View>
                <View style={[styles.buyoutPriceWrapper, { marginLeft: 10 }]}>
                  <Text style={{ fontSize: 13, marginRight: 5 }}>￥</Text>
                  <TextInput
                    style={styles.buyoutPrice}
                    defaultValue={`${minPrice}`}
                    placeholder="填写起拍价格"
                    keyboardType="number-pad"
                    selectionColor="#00AEFF"
                    maxLength={7}
                    placeholderTextColor="#D0D0D0"
                    underlineColorAndroid="transparent"
                    clearButtonMode="while-editing"
                    onChangeText={this.onChangeMinPrice}
                    ref={(v) => { this.textInputMinPrice = v; }}
                  />
                </View>
              </View>
              <Text style={{ fontSize: 9, color: '#D0D0D0' }}>{`保证金为起拍价的 ${fee} %，最低${minDeposit}元。`}</Text>
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => this.setState({ autoPutOn: !autoPutOn })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 18 }}>
              <Text style={{ marginRight: 13 }}>流拍自动上架</Text>
              <Switch
                width={34}
                height={18}
                backgroundActive="#FFA700"
                backgroundInactive="#B3B3B3"
                value={autoPutOn}
              />
            </View>
          </TouchableWithoutFeedback>

          <Text style={[styles.title, { marginBottom: 5 }]}>添加拍品图片</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            { images.map((v, i) => (
              <AutoUploadImage
                type={this.photoType}
                key={v.key}
                index={i}
                item={v}
                deleteImage={this.deleteImage}
                ref={(ref) => { this.autoUploadImage[v.key] = ref; }}
                size={styles.image}
                toTakePhoto={this.openActionSheet}
              />
            )) }
            <TouchableOpacity onPress={() => this.openActionSheet(images?.length)} style={[styles.image, styles.toTakePhoto]}>
              <Image style={{ height: 24, width: 24 }} source={require('../../res/image/cross.png')} />
              <Text style={{ color: '#888', marginTop: 10 }}>添加图片</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>拍品描述</Text>
          <TextInput
            style={styles.inputDescribe}
            defaultValue={description}
            placeholder="添加内容"
            selectionColor="#00AEFF"
            placeholderTextColor="#D0D0D0"
            underlineColorAndroid="transparent"
            ref={(v) => { this.textInputDescription = v; }}
            clearButtonMode="while-editing"
            onChangeText={this.onChangeDescribe}
            multiline
          />
        </KeyboardScrollView>
        <SingleBtn onPress={debounce(this.submit)} text={`发布(保证金￥${deposit})`} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalTitle: {
    fontFamily: YaHei,
    marginBottom: Platform.OS === 'android' ? 8 : 10,
  },
  modalInput: {
    borderBottomColor: '#CCD0D7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: 200,
    padding: 0,
    paddingBottom: Platform.OS === 'android' ? 0 : 3,
    fontFamily: YaHei,
    color: '#000',
  },
  scrollView: {
    paddingHorizontal: parseInt(wPx2P(18.5)),
    paddingBottom: 100 + PADDING_TAB,
  },
  inputDescribe: {
    minHeight: 100,
    borderColor: '#CCD0D7',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    padding: 5,
    textAlignVertical: 'top',
    color: '#000',
  },
  dressModal: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: PADDING_TAB,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shuxian: {
    backgroundColor: '#ddd',
    width: StyleSheet.hairlineWidth,
    height: '50%',
  },
  dressModalItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 18,
    marginBottom: 10,
  },
  input: {
    fontSize: 13,
    paddingBottom: 2,
    borderBottomColor: '#CCD0D7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    color: '#000',
  },
  right: {
    height: 9,
    width: 6,
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeWrapper: {
    borderBottomColor: '#CCD0D7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginRight: 5,
    flex: 1,
    paddingBottom: 2,
  },
  timeView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  buyoutPrice: {
    fontSize: 13,
    flex: 1,
    paddingVertical: 2,
  },
  buyoutPriceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#CCD0D7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: 135,
  },
  baozhengjin: {
    borderBottomColor: '#CCD0D7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: SIZE,
    height: SIZE,
    marginBottom: 5,
  },
  toTakePhoto: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#CCD0D7',
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default connect(null, mapDispatchToProps)(FreeTradeSearch);
