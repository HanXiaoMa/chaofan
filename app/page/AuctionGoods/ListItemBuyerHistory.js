import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  FadeImage, AvatarWithShadow, CountdownCom, ScaleView,
} from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { YaHei } from '../../res/FontFamily';
import { itemOnPress } from '../../utils/Auction';

type Props = {
  item: Object,
};

export default class ListItem extends PureComponent<Props> {
  toAuctionDetail = () => {
    const { item } = this.props;
    itemOnPress(item);
  }

  render() {
    const { item, titleStyle } = this.props;
    return (
      <ScaleView style={styles.container} onPress={this.toAuctionDetail}>
        <FadeImage source={{ uri: item.image }} style={styles.shoe} />
        <View style={styles.right}>
          <Text style={titleStyle}>{item.title}</Text>
          <View style={{ justifyContent: 'flex-end', flex: 1 }}>
            <CountdownCom
              style={styles.time}
              time={item.end_time}
              format="竞拍结束 time"
              endTimerText="竞拍已结束"
            />
            {
              item.max_buy?.price ? (
                <View style={styles.priceWrapper}>
                  <AvatarWithShadow size={20} source={{ uri: item.max_buy.avatar }} />
                  <Text style={styles.maxPrice}>最高出价</Text>
                  <Text style={{ fontSize: 10 }}>￥</Text>
                  <Text style={styles.price}>{item.max_buy.price / 100}</Text>
                </View>
              ) : <Text style={styles.wuchujia}>暂无出价</Text>
            }
          </View>
        </View>
      </ScaleView>
    );
  }
}

const styles = StyleSheet.create({
  wuchujia: {
    color: '#BFBFBF',
    fontSize: 12,
    fontFamily: YaHei,
  },
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 9,
    marginBottom: 7,
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
    paddingRight: 8,
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
    width: wPx2P(100.5),
    height: wPx2P(97),
  },
  time: {
    color: '#FEA702',
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
});
