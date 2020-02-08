/* @flow */
import React, { PureComponent } from 'react';
import {
  View, TouchableOpacity, Text, StyleSheet,
} from 'react-native';
import Image from './Image';
import { YaHei } from '../res/FontFamily';
import { splitPhone } from '../utils/CommonUtils';
import { wPx2P } from '../utils/ScreenUtil';

export default class FadeImage extends PureComponent {
  toPhone = (v, i) => {
    // if (i % 2 == 1) {
    //   const url = `tel:${v}`;
    //   Linking.canOpenURL(url).then((supported) => {
    //     if (supported) {
    //       Linking.openURL(url);
    //     }
    //   });
    // }
  }

  render() {
    const {
      onPress, item, index, numberOfLines,
    } = this.props;
    const Wrapper = onPress ? TouchableOpacity : View;
    return (
      <Wrapper style={styles.expressBlock} onPress={onPress}>
        <View style={{ alignItems: 'flex-end', width: 40, marginTop: index > 0 ? 20 : 0 }}>
          <Text style={{ fontSize: 12, color: '#929292', right: -5 }}>{item.acceptTime.slice(5, 11)}</Text>
          <Text style={{ fontSize: 10, color: '#929292' }}>{item.acceptTime.slice(11, 16)}</Text>
        </View>
        <View style={{ alignItems: 'center', marginHorizontal: 10 }}>
          {index > 0 && <View style={styles.shuxian1} />}
          <View style={styles.yuandian} />
          <View style={styles.shuxian} />
        </View>
        <View style={{ flex: 1, marginTop: index > 0 ? 20 : 0 }}>
          <Text style={{ fontSize: 13, fontFamily: YaHei }}>{item.remark}</Text>
          <Text>
            {
              splitPhone(item.acceptAddress).map((v, i) => (
                <Text
                  numberOfLines={numberOfLines}
                  key={v}
                  onPress={() => this.toPhone(v, i)}
                  style={{ fontSize: 14, color: i % 2 == 1 ? '#FFA700' : '#343434' }}
                >
                  {v}
                </Text>
              ))
            }
          </Text>
        </View>
        {onPress && <Image source={require('../res/image/icon-arrow-right.png')} style={styles.rightIcon} />}
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  rightIcon: {
    height: 9,
    width: 6,
    alignSelf: 'center',
  },
  yuandian: {
    height: 5,
    width: 5,
    borderRadius: 5,
    backgroundColor: '#FFA700',
    marginTop: 4,
  },
  shuxian: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    width: StyleSheet.hairlineWidth,
    marginTop: 2,
  },
  shuxian1: {
    backgroundColor: '#EFEFEF',
    width: StyleSheet.hairlineWidth,
    height: 22,
  },
  image: {
    width: wPx2P(106),
    height: wPx2P(106),
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 13,
  },
  expressBlock: {
    flexDirection: 'row',
  },
});
