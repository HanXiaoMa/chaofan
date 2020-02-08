import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  FadeImage, ScaleView, BtnGroup,
} from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { formatDate } from '../../utils/CommonUtils';
import { btnOnPress, itemOnPress } from '../../utils/Auction';

type Props = {
  item: Object,
};

export default class ListItemSellerWaitSend extends PureComponent<Props> {
  toAuctionDetail = () => {
    const { item } = this.props;
    itemOnPress(item, true);
  }

  render() {
    const { item, titleStyle } = this.props;
    const btns = [
      { text: '联系客服', onPress: () => btnOnPress(item, 'server'), color: '#000' },
    ];
    return (
      <ScaleView style={styles.container} onPress={this.toAuctionDetail}>
        <FadeImage source={{ uri: item.image }} style={styles.shoe} />
        <View style={styles.right}>
          <Text style={titleStyle}>{item.title}</Text>
          <View style={styles.middle}>
            <Text style={{ fontSize: 11 }}>
          发货时间
              <Text style={{ fontSize: 11, color: '#FEA702', marginTop: 2 }}>{` ${formatDate(item.send_time)}`}</Text>
            </Text>
            <Text style={{ fontSize: 11, marginTop: 2 }}>{`订单号：${item.order_id}`}</Text>
            <Text style={{ fontSize: 11, color: '#EF4444', marginTop: 2 }}>等待平台鉴定</Text>
          </View>
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
  btn: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 13,
    marginBottom: 2,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
});
