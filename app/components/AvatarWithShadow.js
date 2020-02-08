import React, { PureComponent } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import FadeImage from './FadeImage';
import { getAppOptions } from '../utils/CommonUtils';

export default class AvatarWithShadow extends PureComponent {
  render() {
    const {
      source, size, isCert, showShadow = true,
    } = this.props;
    const sizes = {
      height: size, width: size, borderRadius: size / 2,
    };
    const height = size / 2.5;
    return (
      <View style={[showShadow ? styles.imageWrapper : styles.noShadow, sizes]}>
        <FadeImage source={source} style={{ ...sizes, overflow: 'hidden' }} />
        {
          isCert === '1' && (
            <FadeImage
              style={{
                ...styles.cert, height, width: height, bottom: -size / 18, right: -size / 18,
              }}
              source={{ uri: getAppOptions()?.cert_url }}
            />
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageWrapper: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(166, 166, 166)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
        position: 'relative',
      },
    }),
  },
  noShadow: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cert: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});
