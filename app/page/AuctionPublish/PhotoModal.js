import React, { PureComponent } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, FlatList,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import {
  PADDING_TAB,
} from '../../common/Constant';
import { Image } from '../../components';
import { closeModalbox } from '../../utils/MutualUtil';
import { getPhotoImages } from './Images';
import { formatDate } from '../../utils/CommonUtils';

const cameraSize = {
  height: SCREEN_WIDTH,
  width: SCREEN_WIDTH,
};
const MARGIN_TOP = SCREEN_HEIGHT < 800 ? 10 : 10;
const ICON_HEIGHT = SCREEN_HEIGHT < 800 ? 62.2 : 67.2;
const ICON_WIDTH = SCREEN_HEIGHT < 800 ? 64.4 : 69.6;

export default class PhotoModal extends PureComponent {
  constructor(props) {
    super(props);
    const { type, index } = this.props;
    if (!window.photoImages[type]) { window.photoImages[type] = []; }
    const images = window.photoImages[type].length > 0 ? window.photoImages[type] : getPhotoImages(type) || [];
    this.originalImages = [...window.photoImages[type]];
    if (!index && images.filter(v => !v.uri).length === 0) {
      images === [...images, ...getPhotoImages()];
    }
    this.state = {
      images,
      currentIndex: index || 0,
    };
  }

  takePicture = async () => {
    const { images, currentIndex } = this.state;
    const { type } = this.props;
    if (this.camera) {
      const data = await this.camera.takePictureAsync({
        quality: 0.5,
        writeExif: false,
        width: 1080,
        orientation: 'portrait',
        // pauseAfterCapture: true,
      });
      const photoImages = images.map((v, i) => {
        if (i === currentIndex) {
          return ({
            ...v,
            uri: data.uri,
            key: `tower/auction/${`${formatDate(Date.now() / 1000, 'yyyy-MM-dd-hh-mm-ss')}-${data.uri.split('/').pop()}`}`,
            uploadStatus: null,
          });
        }
        return v;
      });
      this.setState({ images: photoImages });
      window.photoImages[type] = photoImages;
    }
  };

  rePhoto = () => {
    const { images, currentIndex } = this.state;
    // this.camera.resumePreview();
    this.setState({
      images: images.map((v, i) => {
        if (i === currentIndex) {
          return ({ ...v, uri: null });
        }
        return v;
      }),
    });
  }

  toNextPhoto = () => {
    const { currentIndex, images } = this.state;
    // this.camera.resumePreview();
    if (images?.length - 1 === currentIndex) {
      this.addPhoto();
    } else {
      this.setState({ currentIndex: currentIndex + 1 });
      this.flatList.scrollToIndex({ index: currentIndex + 1, viewPosition: 0.5 });
    }
  }

  addPhoto = () => {
    const { images } = this.state;
    // this.camera.resumePreview();
    this.setState({
      images: [...images, ...getPhotoImages()],
      currentIndex: images?.length,
    }, () => {
      setTimeout(() => {
        this.flatList.scrollToEnd();
      }, 50);
    });
  }

  goBack = () => {
    const { type } = this.props;
    window.photoImages[type] = this.originalImages;
    closeModalbox();
  }

  renderItem = ({ item, index }) => {
    const { currentIndex } = this.state;
    return (
      <TouchableOpacity
        onPress={item.onPress || (() => {
          // this.camera.resumePreview();
          this.setState({ currentIndex: index });
        })}
        style={{ ...styles.icon, borderColor: index === currentIndex ? 'red' : 'rgba(255,159,58, 0.9)', marginRight: 5 }}
      >
        <Image style={item.style || { height: ICON_HEIGHT, width: ICON_WIDTH }} source={item.uri ? { uri: item.uri } : item.icon} />
      </TouchableOpacity>
    );
  }

  render() {
    const { images, currentIndex } = this.state;
    const list = [...images, {
      icon: require('../../res/image/cross.png'), style: { height: 24, width: 24 }, onPress: this.addPhoto,
    }];
    const disablePhoto = !!images[currentIndex]?.uri;
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => { this.camera = ref; }}
          style={[cameraSize, { overflow: 'hidden' }]}
          type={RNCamera.Constants.Type.back}
          ratio="1:1"
          flashMode={RNCamera.Constants.FlashMode.auto}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: '相机权限',
            message: '我们将访问您的相机，用于拍摄上传，是否同意？',
            buttonPositive: '好的',
            buttonNegative: '拒绝',
          }}
          androidRecordAudioPermissionOptions={{
            title: '相机权限',
            message: '我们将访问您的相机，用于拍摄上传，是否同意？',
            buttonPositive: '好的',
            buttonNegative: '拒绝',
          }}
        />

        <Image
          style={{ ...cameraSize, ...styles.imageMask }}
          resizeMode="contain"
          source={images[currentIndex]?.uri ? { uri: images[currentIndex]?.uri } : images[currentIndex]?.mask}
        />

        <Text style={{ textAlign: 'center', marginTop: MARGIN_TOP, opacity: images[currentIndex]?.title ? 1 : 0 }}>
          {images[currentIndex]?.title || '占位'}
        </Text>
        <FlatList
          data={list}
          ref={(v) => { this.flatList = v; }}
          renderItem={this.renderItem}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: MARGIN_TOP }}
          showsHorizontalScrollIndicator={false}
          horizontal
          removeClippedSubviews={false}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          keyExtractor={(item, index) => `${item.key}-${index}`}
        />

        {
          disablePhoto ? (
            <View style={{ flexDirection: 'row', flex: 1, paddingBottom: PADDING_TAB }}>
              <TouchableOpacity onPress={this.rePhoto} style={styles.rePhotoWrapper}>
                <Text style={styles.rePhoto}>重新拍摄</Text>
              </TouchableOpacity>
              <View style={styles.shuxian} />
              <TouchableOpacity onPress={this.toNextPhoto} style={styles.rePhotoWrapper}>
                <Text style={styles.rePhoto}>下一张</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              disabled={disablePhoto}
              onPress={this.takePicture}
              style={[styles.photoSize, styles.photo, { borderColor: disablePhoto ? '#dbdbdb' : 'rgba(255,159,58, 0.9)' }]}
            >
              <Image style={styles.photoSize} source={disablePhoto ? require('../../res/image/photo_disable.png') : require('../../res/image/photo.png')} />
            </TouchableOpacity>
          )
        }
        <Image style={styles.backIcon} onPress={this.goBack} source={require('../../res/image/back-white.png')} />
        <Text style={styles.closeBtn} onPress={() => closeModalbox()}>完成</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backIcon: {
    position: 'absolute',
    left: 20,
    top: 18,
    height: 25,
    width: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    color: '#fff',
    top: 18,
    fontWeight: '900',
    fontSize: 16,
  },
  imageMask: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  photoSize: {
    width: SCREEN_HEIGHT < 800 ? 65 : 70,
    height: SCREEN_HEIGHT < 800 ? 65 : 70,
  },
  photo: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT < 800 ? 35 : (50 + PADDING_TAB),
    alignSelf: 'center',
    borderRadius: 110,
    width: SCREEN_HEIGHT < 800 ? 85 : 95,
    height: SCREEN_HEIGHT < 800 ? 85 : 95,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWrapper: {
    marginRight: 5,
  },
  icon: {
    width: ICON_WIDTH,
    height: ICON_HEIGHT,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,159,58, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  example: {
    position: 'absolute',
    width: 75,
    height: 75,
    backgroundColor: '#fff',
  },
  rePhoto: {
    color: '#222',
    fontSize: 16,
    textAlign: 'center',
  },
  shuxian: {
    height: 80,
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
    alignSelf: 'center',
  },
  rePhotoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
