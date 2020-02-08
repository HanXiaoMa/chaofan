import React, { PureComponent } from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import Modalbox from 'react-native-modalbox';
import { PADDING_TAB } from '../../common/Constant';
import Image from '../Image';
import Images from '../../res/Images';
import Share from '../../utils/ShareUtil';
import { showToast } from '../../utils/MutualUtil';

const schemes = [
  { icon: 'wx', scheme: 2, title: '微信好友' },
  { icon: 'pyq', scheme: 3, title: '朋友圈' },
];

export default class ShareCom extends PureComponent {
  componentDidMount() {
    this.modalbox && this.modalbox.open();
  }

  share = (scheme) => {
    const { data, successCallback, failCallback } = this.props;
    const {
      text, img, url, title,
    } = data;
    Share(text, img, url, title, scheme).then(() => {
      successCallback();
    }).catch((err) => {
      showToast(err);
      failCallback();
    });
  }

  render() {
    const { onClosed } = this.props;
    return (
      <Modalbox
        position="bottom"
        backButtonClose
        onClosed={onClosed}
        style={styles.modalbox}
        ref={(v) => {
          this.modalbox = v;
        }}
      >
        <View style={styles.tisheng}>
          <Text style={{ color: '#4B4B4B', fontSize: 12 }}>分享提升中签率</Text>
        </View>
        <View style={styles.fxt}>
          {
            schemes.map(v => (
              <TouchableOpacity style={{ marginRight: 40 }} key={v.icon} onPress={() => this.share(v.scheme)}>
                <Image style={styles.shareIcon} source={Images[v.icon]} />
                <Text style={{ color: '#5A5A5A', fontSize: 11 }}>{v.title}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
      </Modalbox>
    );
  }
}

const styles = StyleSheet.create({
  modalbox: {
    width: SCREEN_WIDTH,
    height: 138 + PADDING_TAB,
    paddingBottom: PADDING_TAB,
    paddingHorizontal: 30,
  },
  shareIcon: {
    width: 44,
    height: 44,
    marginTop: 14,
    marginBottom: 8,
  },
  tisheng: {
    height: 40,
    borderBottomColor: '#ddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  },
  fxt: {
    flexDirection: 'row',
    flex: 1,
  },
});
