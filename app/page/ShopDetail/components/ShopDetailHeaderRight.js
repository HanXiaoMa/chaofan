/**
 * @file 商品详情导航右布局
 * @date 2019/8/18 16:13
 * @author ZWW
 */
import React, { PureComponent } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import Images from '../../../res/Images';
import { Image } from '../../../components';
import { YaHei } from '../../../res/FontFamily';

export default class ShopDetailHeaderRight extends PureComponent {
  render() {
    const { rate, onPress } = this.props;
    if (rate) {
      const Wrapper = onPress ? TouchableOpacity : View;
      return (
        <Wrapper onPress={onPress} style={_styles.mainView}>
          <Text style={_styles.rateTitle}>中签率</Text>
          <Image resizeMode="contain" style={_styles.imageShoe} source={Images.lot_win_rate} />
          <Text style={_styles.rateTitle}>{rate}</Text>
        </Wrapper>
      );
    }
    return <View />;
  }
}

const _styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rateTitle: {
    fontSize: 12,
    fontFamily: YaHei,
    color: '#000',
    fontWeight: '400',
  },
  rateImage: {
    width: 13,
    height: 12,
  },
  imageShoe: {
    width: 22,
    marginHorizontal: 1,
    height: 19,
  },
});
