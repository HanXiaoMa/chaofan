import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScaleView, AvatarWithShadow, Image } from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { YaHei } from '../../res/FontFamily';

const Tag1 = (type) => {
  const backgroundColor = {
    1: '#ED4E00',
    2: '#3996FE',
    3: '#00B6A3',
  }[type];
  const text = {
    1: '48小时发货',
    2: '15天发货',
    3: '30天发货',
  }[type];
  return (
    <View style={[styles.tag, { backgroundColor }]}>
      <Text style={{ fontSize: 8, color: '#fff' }}>{text}</Text>
    </View>
  );
};

export default class AuctionListItem extends PureComponent {
  onPress = () => {
    const { navigation, item } = this.props;
    navigation.navigate('AuctionDetail', { params: { item } });
  }

  render() {
    const { index, item } = this.props;
    let time = '';
    const diff = parseInt(item.end_time - Date.now() / 1000);
    const day = diff / (60 * 60 * 24);
    if (day >= 1) {
      time = `<${Math.ceil(day)}天`;
    } else {
      time = `<${Math.ceil(diff / (60 * 60))}小时`;
    }
    // -1审核未通过 1审核中 2拍卖中 3已结束 4已流拍 5已下架
    const isEnd = item.status == 3;
    return (
      <ScaleView onPress={this.onPress} style={[styles.container, { marginTop: index > 0 ? 20 : 0 }]}>
        <View style={styles.image}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {Tag1(item.s_time)}
        </View>

        <View style={styles.middle}>
          <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
          <Text style={{ fontSize: 10, textAlign: 'right', marginTop: 2 }}>{time}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 7 }}>
          {
            isEnd ? <Text style={{ color: '#999' }}>竞拍已结束</Text> : item.max_buy?.price ? (
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <AvatarWithShadow size={20} source={{ uri: item.max_buy.avatar }} />
                <Text style={styles.chujia}>最高出价</Text>
                <Text style={{ fontSize: 10 }} />
                <Text style={styles.price}>{`￥${item.max_buy.price / 100}`}</Text>
              </View>
            ) : <Text style={styles.price}>￥0</Text>
          }
        </View>
      </ScaleView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  image: {
    height: SCREEN_WIDTH / 375 * 297,
    width: SCREEN_WIDTH,
  },
  price: {
    fontSize: 25,
    fontFamily: YaHei,
    top: 6,
  },
  tag: {
    borderRadius: 2,
    position: 'absolute',
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    height: 12,
    bottom: 5,
    right: 4,
  },
  title: {
    height: 40,
    marginLeft: 11,
    fontSize: 14,
    fontFamily: YaHei,
    width: wPx2P(258),
    padding: 0,
  },
  chujia: {
    fontSize: 11,
    color: '#FFA700',
    fontFamily: YaHei,
    marginLeft: 2,
  },
  middle: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
});
