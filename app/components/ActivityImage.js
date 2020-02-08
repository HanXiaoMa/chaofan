/* eslint-disable react/no-array-index-key */
/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import FadeImage from './FadeImage';
import Image from './Image';
import { wPx2P } from '../utils/ScreenUtil';

export default class ActivityImage extends PureComponent {
  render() {
    const { source } = this.props;
    return (
      <View>
        <FadeImage resizeMode="contain" style={styles.goodImage} source={source} />
        <Image style={styles.icon} source={require('../res/image/icon_mask.png')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  goodImage: {
    width: wPx2P(375),
    height: wPx2P(250),
  },
  icon: {
    height: 42,
    width: 42,
    position: 'absolute',
    right: 20,
    top: 20,
  },
});
