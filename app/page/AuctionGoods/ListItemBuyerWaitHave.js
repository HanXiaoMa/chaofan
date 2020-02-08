import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  FadeImage, ScaleView, BtnGroup, CountdownCom,
} from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { YaHei } from '../../res/FontFamily';
import { formatDate } from '../../utils/CommonUtils';
import { btnOnPress, itemOnPress } from '../../utils/Auction';

type Props = {
  item: Object,
};

export default class ListItemBuyerWaitSend extends PureComponent<Props> {
  toAuctionDetail = () => {
    const { item } = this.props;
    itemOnPress(item, true);
  }

  render() {
    const { item, titleStyle } = this.props;
    const isSend = item.status == 5;
    // 订单状态 -1买家逾期付款订单关闭 0买家未付款，1买家已付款卖家未发货 2卖家已发货  3平台已收货鉴定中，4鉴定失败退回，5发往买家中，6交易完成，7卖家发货逾期
    const btns = [
      { text: '联系客服', onPress: () => btnOnPress(item, 'server'), color: '#000' },
    ];
    if (isSend) {
      btns.unshift({ text: '确认收货', onPress: () => btnOnPress(item, 'confirmHaved'), color: '#0A8CCF' });
    }
    return (
      <ScaleView style={styles.container} onPress={this.toAuctionDetail}>
        <FadeImage source={{ uri: item.image }} style={styles.shoe} />
        <View style={styles.right}>
          <Text style={titleStyle}>{item.title}</Text>
          { isSend ? (
            <View>
              <Text style={{ fontSize: 11, marginBottom: 2 }}>
                发货时间
                <Text style={{ fontSize: 11, color: '#FEA702' }}>{` ${formatDate(Date.now() / 1000)}`}</Text>
              </Text>
            </View>
          ) : item.status == 1 ? (
            <CountdownCom
              style={styles.statusText}
              time={item.seller_lastet_send_time}
              format="等待卖家发货 time"
              endTimerText="卖家已发货，等待平台鉴定"
            />
          ) : (
            <View>
              <Text style={styles.statusText}>{ { 2: '卖家已发货，等待平台鉴定', 3: '平台鉴定中' }[item.status] }</Text>
              <Text style={{ fontSize: 11 }}>
                ￥
                <Text style={{ fontSize: 13, color: '#EF4444' }}>{item.order_price / 100}</Text>
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
  statusText: {
    fontSize: 12,
    marginBottom: 2,
    color: '#EF4444',
  },
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
