import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  FadeImage, CountdownCom, ScaleView, BtnGroup,
} from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { YaHei } from '../../res/FontFamily';
import { btnOnPress, itemOnPress } from '../../utils/Auction';

type Props = {
  item: Object,
};

export default class ListItemBuyerWaitpay extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const { item } = this.props;
    this.state = {
      breakOff: item.status == -1 || (item.latest_pay_time && item.latest_pay_time < Date.now() / 1000),
    };
  }

  isBreakOff = () => {
    const { item } = this.props;
    const { breakOff } = this.state;
    return breakOff || item.status == -1 || (item.latest_pay_time && item.latest_pay_time < Date.now() / 1000);
  }

  toAuctionDetail = () => {
    const { item } = this.props;
    itemOnPress(item, true);
  }

  finish = () => {
    this.setState({ breakOff: true });
  }

  renderMiddle = (breakOff) => {
    const { routeType, item } = this.props;
    if (routeType === 'seller') {
      if (breakOff) {
        return (
          <Text style={styles.baozhengjin}>
            未在规定时间内付款，获得保证金
            <Text style={{ color: '#FFA700', fontSize: 11 }}>{item.deposit_price / 100}</Text>
            元
          </Text>
        );
      } if (item.status == 0) {
        return <Text style={{ color: '#FFA700', fontSize: 11 }}>等待买家付款</Text>;
      }
    } else {
      return (
        <View>
          {
            breakOff ? <Text style={{ fontSize: 11, marginTop: 3 }}>未在规定时间内付款，交易已关闭</Text>
              : (
                <CountdownCom
                  style={styles.time}
                  time={item.latest_pay_time}
                  format="请于 time 完成付款"
                  endTimerText="未在规定时间内付款，交易已关闭"
                  endStyle={{ fontSize: 11 }}
                  extraTextStyle={{ fontSize: 11 }}
                  finish={this.finish}
                />
              )
          }
          {breakOff && <Text style={styles.kouchu}>{`扣除保证金 ￥${item.deposit_price / 100}`}</Text>}
        </View>
      );
    }
  }

  render() {
    const { item, titleStyle, routeType } = this.props;
    const breakOff = this.isBreakOff();
    const btns = [];
    if (routeType === 'seller') {
      if (item.pay_status == -1) {
        btns.push({ text: '未付款' });
      }
    } else {
      // 支付状态 -1逾期未支付，0未支付 1已支付
      btns.push({
        text: '付款', onPress: () => btnOnPress(item, 'pay'), disabled: breakOff, color: '#0A8CCF',
      });
    }
    return (
      <ScaleView style={styles.container} onPress={this.toAuctionDetail}>
        <FadeImage source={{ uri: item.image }} style={styles.shoe} />
        <View style={styles.right}>
          <Text style={titleStyle}>{item.title}</Text>
          { this.renderMiddle(breakOff) }
          <View style={styles.btn}>
            <Text style={{ fontSize: 11 }}>
              ￥
              <Text style={{ fontSize: 13, color: '#EF4444' }}>{item.order_price / 100}</Text>
            </Text>
            <BtnGroup btns={btns} />
          </View>
        </View>
      </ScaleView>
    );
  }
}

const styles = StyleSheet.create({
  kouchu: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 2,
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
    flexDirection: 'row',
    flex: 1,
    paddingRight: 13,
    marginBottom: 2,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  baozhengjin: {
    fontSize: 11,
  },
});
