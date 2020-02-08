import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FadeImage, ScaleView, BtnGroup } from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { YaHei } from '../../res/FontFamily';
import { formatDate } from '../../utils/CommonUtils';
import { btnOnPress, itemOnPress } from '../../utils/Auction';

type Props = {
  item: Object,
};

export default class ListItemBuyerComplete extends PureComponent<Props> {
  toAuctionDetail = () => {
    const { item } = this.props;
    itemOnPress(item, true);
  }

  render() {
    const { item, routeType, titleStyle } = this.props;
    const isSuccess = ['5', '6'].includes(item.status);
    const btns = [
      { text: '联系客服', onPress: () => btnOnPress(item, 'server'), color: '#000' },
    ];
    const text = {
      '-1': '付款超时',
      4: '拍品未通过鉴定',
      7: routeType === 'seller' ? '发货逾期' : '卖家发货逾期',
    }[item.status];
    return (
      <ScaleView style={styles.container} onPress={this.toAuctionDetail}>
        <FadeImage source={{ uri: item.image }} style={styles.shoe} />
        <View style={styles.right}>
          <Text style={titleStyle}>{item.title}</Text>
          { isSuccess ? (
            <View>
              <Text style={{ fontSize: 11, marginBottom: 2 }}>
                {routeType === 'seller' ? '交易完成' : '已完成'}
                <Text style={{ fontSize: 11, color: '#FEA702' }}>{` ${formatDate(item.finish_time)}`}</Text>
              </Text>
              <Text style={{ fontSize: 11, marginBottom: 2 }}>{`订单号：${item.order_id}`}</Text>
              <Text style={{ fontSize: 11 }}>
                ￥
                <Text style={{ fontSize: 12, color: '#EF4444' }}>{item.order_price / 100}</Text>
              </Text>
            </View>
          ) : (
            <View>
              <Text style={{ fontSize: 11, color: '#EF4444' }}>{text}</Text>
              <Text style={{ fontSize: 11 }}>{`订单号：${item.order_id}`}</Text>
              <Text style={{ fontSize: 11 }}>
                ￥
                <Text style={{ fontSize: 13, color: '#EF4444' }}>{item.order_price / 100}</Text>
              </Text>
              <Text style={{ fontSize: 11 }}>
                {`${routeType === 'seller' ? '扣除' : '收到'}保证金￥`}
                <Text style={{ fontSize: 11, color: '#EF4444' }}>{item.deposit_price / 100}</Text>
              </Text>
            </View>
          ) }
          <View style={styles.btn}>
            <BtnGroup btns={btns} />
          </View>
        </View>
      </ScaleView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 9,
    marginBottom: 7,
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
  },
  maxPrice: {
    fontSize: 11,
    color: '#FFA700',
    fontFamily: YaHei,
    marginLeft: 4,
    marginRight: 2,
  },
  right: {
    flex: 1,
    marginLeft: 10,
    marginTop: 2,
    paddingVertical: 3,
  },
  shoe: {
    width: wPx2P(129.5),
    height: wPx2P(125),
  },
  time: {
    color: '#EF4444',
    fontSize: 11,
  },
  priceWrapper: {
    marginBottom: 2,
    marginLeft: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 19,
    fontFamily: YaHei,
    top: 4,
  },
  btn: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 13,
    marginBottom: 2,
  },
});
