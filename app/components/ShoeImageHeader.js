import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Image from './Image';
import Price from './Price';
import { wPx2P } from '../utils/ScreenUtil';
import { RuiXian } from '../res/FontFamily';

type Props = {
  item: Number,
  showSize?: Boolean,
  showPrice?: Boolean,
  style?: Object,
};

export default class ShoeImageHeader extends PureComponent<Props> {
  static defaultProps = {
    showSize: null,
    showPrice: true,
    style: {},
  }

  render() {
    const {
      item, showSize, showPrice, style, priceRight,
    } = this.props;
    return (
      <View style={[styles.container, style]}>
        <Image source={{ uri: item.icon }} style={styles.image} />
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text style={styles.title}>{item.goods_name}</Text>
          <View style={{ alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 11, color: '#333' }}>{showSize ? `SIZE：${item.size}` : ''}</Text>
            {
              showPrice ? (item.price * 1 > 0
                ? <Price price={item.price} priceRight={priceRight} />
                : <Text style={{ fontSize: 12, color: '#666' }}>暂无报价</Text>) : null
            }
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginTop: 8,
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 9,
    height: 125,
  },
  image: {
    height: wPx2P(93),
    width: wPx2P(150),
    marginRight: 10,
  },
  title: {
    fontFamily: RuiXian,
    fontSize: 15,
    lineHeight: 17,
  },
});
