import React, { PureComponent } from 'react';
import {
  View, TouchableOpacity, Text, Animated, StyleSheet,
} from 'react-native';
import { Image } from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { uploadOss } from '../../utils/Upload';

export default class ChooseTagModal extends PureComponent {
  constructor(props) {
    super(props);
    const { item, size } = this.props;
    this.state = {
      uploadStatus: item.uploadStatus || 'uploading',
    };
    this.translateY = new Animated.Value(item.uploadStatus === 'success' ? -size.height : 0);
    // this.opacity = new Animated.Value(item.uploadStatus === 'success' ? 1 : 0);
    this.progress = item.uploadStatus === 'success' ? 1 : 0;
  }

  componentDidMount() {
    this.upload();
  }

  onChange = (progress) => {
    if (this.progress >= progress) { return; }
    this.progress = progress;
    const { size } = this.props;
    Animated.timing(
      this.translateY,
      {
        toValue: -progress * size.height,
        duration: 1000,
        useNativeDriver: true,
      },
    ).start();
  }

  upload = () => {
    const { item, type } = this.props;
    if (item.uploadStatus !== 'success') {
      uploadOss(item.key, item.uri)
        // .then(() => {
        //   this.opacity.setValue(1);
        // })
        .catch(() => {
          window.photoImages[type] = window.photoImages[type].map((v) => {
            if (v.name === item.name) {
              return ({ ...v, uploadStatus: 'failed' });
            }
            return v;
          });
          this.setState({ uploadStatus: 'failed' });
        });
    }
  }

  onPress = () => {
    const { index, toTakePhoto } = this.props;
    const { uploadStatus } = this.state;
    if (uploadStatus === 'failed') {
      this.upload();
    } else {
      toTakePhoto(index);
    }
  }

  render() {
    const {
      item, size, index, deleteImage,
    } = this.props;
    const { uploadStatus } = this.state;
    return (
      <View style={[size, { marginRight: index % 4 === 3 ? 0 : wPx2P(6) }]}>
        <Image source={{ uri: item.uri }} style={size} />
        <TouchableOpacity onPress={this.onPress} style={styles.touchableOpacity}>
          { uploadStatus === 'failed' && <Text style={{ color: '#fff' }}>上传失败</Text> }
          {/* <Animated.Image
            source={require('../../res/image/uploaded.png')}
            style={{ height: 25, width: 25, opacity: this.opacity }}
          /> */}
          <Animated.View style={[styles.mask, { transform: [{ translateY: this.translateY }] }]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteImage(index)} style={styles.chaNewWrapper}>
          <Image source={require('../../res/image/close-auction.png')} style={styles.chaNew} />
        </TouchableOpacity>
        { index === 0 && <Text style={styles.zhutu}>主图</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  touchableOpacity: {
    backgroundColor: 'transparent',
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mask: {
    backgroundColor: '#222',
    opacity: 0.4,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  chaNewWrapper: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 2,
    right: -3.5,
    top: -3.5,
    borderRadius: 20,
  },
  chaNew: {
    width: 15,
    height: 15,
  },
  zhutu: {
    backgroundColor: '#FFA700',
    opacity: 0.95,
    position: 'absolute',
    bottom: 0,
    fontSize: 11,
    color: '#fff',
    width: 35,
    textAlign: 'center',
  },
});
