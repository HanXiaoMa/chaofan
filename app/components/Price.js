import React, { PureComponent } from 'react';
import {
  Text, StyleSheet, View, Platform,
} from 'react-native';
import { BrowalliaNew } from '../res/FontFamily';

export default class Price extends PureComponent {
  render() {
    const { price, priceRight } = this.props;
    return (
      <View style={styles.wrapper}>
        <Text style={styles.qian}>￥</Text>
        <Text style={styles.price}>{price / 100}</Text>
        {priceRight}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 22,
  },
  qian: {
    fontSize: 10,
    position: 'relative',
  },
  price: {
    fontFamily: BrowalliaNew,
    fontSize: 20,
    top: Platform.OS === 'ios' ? -2.5 : 3.5,
    position: 'relative',
  },
});
