import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ScaleView, FadeImage, Image,
} from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { showToast } from '../../utils/MutualUtil';
import Colors from '../../res/Colors';
import { YaHei } from '../../res/FontFamily';

export default class ShopListItemCom extends PureComponent {
  toShopDetailPage = () => {
    const { navigation, item, onPress } = this.props;
    if (Date.now() / 1000 - item.end_time > -1) {
      showToast('活动已结束');
      return;
    } if (onPress) {
      onPress();
      return;
    }
    navigation.navigate('ShopDetail', {
      title: '商品详情',
      params: {
        rate: '+25',
        shopId: item.id,
        type: item.type,
      },
    });
  };

  render() {
    const { item, index } = this.props;
    const now = Date.now() / 1000;
    const isEnd = item.end_time - now < 1;
    const isStart = item.start_time - now < 1;
    return (
      <ScaleView style={{ ...styles.scaleView, marginTop: index > 0 ? 15 : 0 }} onPress={this.toShopDetailPage}>
        <FadeImage style={styles.imageShoe} source={{ uri: item.image }} />

        <View style={{ backgroundColor: '#F1F3F7' }}>
          <View style={styles.statusWrapper}>
            <Image
              style={styles.qian}
              source={item.b_type === '2' ? require('../../res/image/tag-qiang.png') : require('../../res/image/tag-qian.png')}
            />
            <Text style={[styles.status, { color: isEnd ? '#EF4444' : '#0084FF' }]}>
              {isEnd ? '已结束' : isStart ? '正在抢购' : '活动中' }
            </Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>{item.activity_name}</Text>
          <Text style={styles.price}>{`￥${item.price / 100}`}</Text>
        </View>
      </ScaleView>
    );
  }
}

const styles = StyleSheet.create({
  statusWrapper: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontFamily: YaHei,
    padding: 0,
  },
  scaleView: {
    backgroundColor: Colors.WHITE_COLOR,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  qian: {
    height: wPx2P(12),
    width: wPx2P(42),
    marginLeft: 12,
    marginRight: 4,
  },
  imageShoe: {
    width: wPx2P(300),
    height: wPx2P(186),
    alignSelf: 'center',
    marginVertical: wPx2P(52),
  },
  title: {
    fontSize: 14,
    fontFamily: YaHei,
    marginHorizontal: 12,
    height: 40,
    padding: 0,
    marginBottom: 3,
  },
  price: {
    marginLeft: 8,
    fontSize: 25,
    fontFamily: YaHei,
  },
});
