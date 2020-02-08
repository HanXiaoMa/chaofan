import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image, ScaleView } from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { formatDate } from '../../utils/CommonUtils';
import Styles from '../../res/style';

// type 类型
// 22 交易区 商品被拍下已付款时
// 25 用户提货 炒饭发货后
// 26 自由交易 鉴定通过
// 27 炒饭收到用户所发货品时
// 28 鉴定未通过

// 31 拍卖 商品审核通过（上架）
// 32 拍卖 商品审核未通过（上架）
// 33 拍卖成功待发货时
// 34 发货时效提醒
// 35 商品流拍
// 36 交易失败时保证赔付时（买家）
// 37 给买家发货时
// 38 拍卖 鉴定未通过 卖家
// 39 拍卖 鉴定通过 卖家
// 40 交易失败时保证赔付时（卖家）
// 41 拍卖 鉴定未通过 买家
// 42 出价被超过
// 43 拍卖成功 买家通知付款

export default class NoticeItem extends PureComponent {
  onPress = () => {
    const { item, navigation } = this.props;
    if (['22'].includes(item.type)) {
      // 自由交易商品被买下
      navigation.navigate('MyGoods', {
        title: '我的商品',
        params: {
          type: 'goodsSelled',
        },
      });
    } else if (['26', '27', '28'].includes(item.type)) {
      // 自由交易鉴定
      navigation.navigate('MyGoods', {
        title: '我的商品',
        params: {
          type: 'warehouse',
        },
      });
    } else if (['25'].includes(item.type)) {
      // 自由交易用户提货
      navigation.navigate('MyGoods', {
        title: '我的库房',
        params: {
          type: 'sendOut',
        },
      });
    } else if (['31', '32', '35', '42'].includes(item.type)) {
      // 去拍卖详情
      navigation.navigate('AuctionDetail', { params: { item: { id: item.activity_id } } });
    } else if (['33', '34', '36', '37', '38', '39', '40', '41', '43'].includes(item.type)) {
      // 去拍卖订单详情
      navigation.navigate('AuctionOrderDetail', {
        params: {
          item: { order_id: item.order_id }, isView: true,
        },
      });
    }
  }

  render() {
    const { item } = this.props;
    return (
      <View>
        <Text style={styles.date}>{formatDate(item.add_time)}</Text>
        <ScaleView onPress={this.onPress} style={styles.container}>
          <Image source={{ uri: item.icon }} style={styles.shoe} />
          <View style={{ flex: 1 }}>
            <Text style={Styles.listTitle}>{item.activity_name}</Text>
          </View>
        </ScaleView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginHorizontal: 9,
    flexDirection: 'row',
  },
  date: {
    color: '#B6B6B6',
    fontSize: 10,
    textAlign: 'center',
    marginVertical: 10,
  },
  shoe: {
    width: wPx2P(129 * 0.87),
    height: wPx2P(80 * 0.87),
    justifyContent: 'center',
    paddingLeft: wPx2P(17),
    paddingTop: wPx2P(12),
    marginRight: 15,
  },
});
