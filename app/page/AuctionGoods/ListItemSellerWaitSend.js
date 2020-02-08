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

export default class ListItemSellerWaitSend extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const { item } = this.props;
    this.state = {
      breakOff: item.status == 7,
    };
  }

  toAuctionDetail = () => {
    const { item } = this.props;
    itemOnPress(item, true);
  }

  finish = () => {
    const { refresh } = this.props;
    refresh && refresh();
    this.setState({ breakOff: true });
  }

  renderMiddle = () => {
    const { item } = this.props;
    const { breakOff } = this.state;
    const diff = item.latest_send_time - Date.now() / 1000;
    return (
      <View style={styles.middle}>
        {
            diff > 3600 * 72 ? (
              <Text style={{ fontSize: 11 }}>
                请在
                <Text style={{ fontSize: 11, color: '#EF4444' }}>{`${Math.ceil(diff / 3600 / 24)}天`}</Text>
                内发货
              </Text>
            ) : (
              <CountdownCom
                style={styles.time}
                time={item.latest_send_time}
                format="请在 time 内发货"
                endTimerText="你未在规定时间内发货，交易已关闭"
                endStyle={{ fontSize: 11 }}
                extraTextStyle={{ fontSize: 11 }}
                finish={this.finish}
              />
            )
          }
        { breakOff && <Text style={{ fontSize: 11, color: '#EF4444', marginTop: 2 }}>保证金已扣除</Text>}
      </View>
    );
  }

  render() {
    const { item, titleStyle, type } = this.props;
    const { breakOff } = this.state;
    const btns = [
      { text: '联系客服', onPress: () => btnOnPress(item, 'server'), color: '#000' },
    ];
    if (type === 'auctionSellerWaitSendOut' && item.latest_send_time > parseInt(Date.now() / 1000) && !breakOff) {
      btns.unshift({ text: '填写订单号', onPress: () => btnOnPress(item, 'inputOrder'), color: '#0A8CCF' });
    }
    return (
      <ScaleView style={styles.container} onPress={this.toAuctionDetail}>
        <FadeImage source={{ uri: item.image }} style={styles.shoe} />
        <View style={styles.right}>
          <Text style={titleStyle}>{item.title}</Text>
          { this.renderMiddle() }
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
  baozhengjin: {
    fontSize: 11,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
});
