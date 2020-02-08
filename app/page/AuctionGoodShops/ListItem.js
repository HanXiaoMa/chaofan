import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ScaleView, Image, AuctionUserItem,
} from '../../components';
import { YaHei } from '../../res/FontFamily';

export default class ListItem extends PureComponent {
  onPress = () => {
    const { navigation, item } = this.props;
    navigation.navigate('AuctionShop', { params: { shopInfo: item } });
  }

  render() {
    const { item } = this.props;
    return (
      <ScaleView onPress={this.onPress} style={styles.container}>
        <AuctionUserItem
          item={item}
          marginBottom={0}
          marginHorizontal={4}
          CustomBtn={(
            <View style={styles.focusBtn}>
              <Text style={{ fontSize: 13, color: '#fff' }}>进店</Text>
            </View>
          )}
        />
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.image?.[0] }} style={styles.leftImage} />
          <View>
            <Image source={{ uri: item.image?.[1] }} style={styles.rightTopImage} />
            <Image source={{ uri: item.image?.[2] }} style={styles.rightBottomImage} />
          </View>
          <View style={styles.priceWrapper}>
            <Text style={styles.price1}>最高出价</Text>
            <Text style={[styles.price1, { top: 0.5 }]}>￥</Text>
            <Text style={styles.price}>{(item.max_buy?.price || item.min_price) / 100}</Text>
          </View>
        </View>

      </ScaleView>
    );
  }
}

const styles = StyleSheet.create({
  price1: {
    color: '#fff',
    fontSize: 12,
    fontFamily: YaHei,
  },
  price: {
    fontSize: 15,
    fontFamily: YaHei,
    padding: 0,
    color: '#fff',
    bottom: 0,
  },
  priceWrapper: {
    paddingHorizontal: 3,
    position: 'absolute',
    flexDirection: 'row',
    bottom: 12,
    backgroundColor: '#FFA700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftImage: {
    height: (SCREEN_WIDTH - 49) * 180 / 327,
    width: (SCREEN_WIDTH - 49) * 219 / 327,
    marginRight: 5,
  },
  rightTopImage: {
    height: (SCREEN_WIDTH - 49) * 87.5 / 327,
    width: (SCREEN_WIDTH - 49) * 108 / 327,
  },
  rightBottomImage: {
    height: (SCREEN_WIDTH - 49) * 87.5 / 327,
    width: (SCREEN_WIDTH - 49) * 108 / 327,
    marginTop: 5,
  },
  imageWrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EBEBEB',
    flexDirection: 'row',
    marginHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 11,
  },
  container: {
    marginTop: 7,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  focusBtn: {
    height: 24,
    width: 51,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFA700',
  },
});
