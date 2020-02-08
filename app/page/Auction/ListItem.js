import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScaleView, AvatarWithShadow, Image } from '../../components';
import { YaHei } from '../../res/FontFamily';

const WIDTH = (SCREEN_WIDTH - 26) / 2;
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

export default class ListItem extends PureComponent {
  onPress = () => {
    const { navigation, item } = this.props;
    navigation.push('AuctionDetail', { params: { item } });
  }

  render() {
    const { index, item } = this.props;
    let time = '';
    const diff = parseInt(item.end_time - Date.now() / 1000);
    const day = diff / (60 * 60 * 24);
    if (day >= 1) {
      time = `<${Math.ceil(day)}天`;
    } else {
      const hours = Math.ceil(diff / (60 * 60));
      if (hours > 1) {
        time = `<${hours}小时`;
      } else {
        const minute = Math.ceil(diff / 60);
        time = `<${minute}分钟`;
      }
    }
    // -1审核未通过 1审核中 2拍卖中 3已结束 4已流拍 5已下架
    const isEnd = item.status == 3;
    return (
      <ScaleView onPress={this.onPress} style={{ ...styles.container, marginLeft: index % 2 === 1 ? 8 : 9 }}>
        <View style={styles.image}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {Tag1(item.s_time)}
        </View>
        {/* <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#eee' }} /> */}
        <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 7 }}>
          {
            isEnd ? <Text style={{ color: '#999' }}>竞拍已结束</Text> : (
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  <AvatarWithShadow
                    size={20}
                    source={{ uri: item.max_buy?.avatar || 'https://image.chaofun.co/tower/avatar/icon-boy.png?x-oss-process=image/resize,m_lfit,w_60' }}
                  />
                  <Text style={styles.user_name}>{item.max_buy?.user_name || '暂无出价'}</Text>
                </View>
                <View style={styles.bottom}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                    { item.max_buy?.price && <Text style={styles.chujia}>最高出价</Text> }
                    <Text style={{ fontSize: 10 }}>￥</Text>
                    <Text style={styles.price}>{(item.max_buy?.price || item.min_price) / 100}</Text>
                  </View>
                  <Text style={{ fontSize: 10 }}>{time}</Text>
                </View>
              </View>
            )
          }
        </View>
      </ScaleView>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
  },
  user_name: {
    marginLeft: 5,
    fontSize: 13,
  },
  noOffer: {
    color: '#FFA700',
    fontFamily: YaHei,
    top: 3,
  },
  container: {
    backgroundColor: '#fff',
    paddingBottom: 7,
    marginBottom: 7,
    width: WIDTH,
    height: 275,
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  image: {
    height: WIDTH,
    width: WIDTH,
  },
  price: {
    fontSize: 17,
    fontFamily: YaHei,
    top: 3,
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
    padding: 0,
    marginBottom: 2,
    marginTop: 5,
    marginHorizontal: 7,
    fontFamily: YaHei,
  },
  chujia: {
    fontSize: 11,
    color: '#FFA700',
    fontFamily: YaHei,
    marginLeft: 2,
  },
});
