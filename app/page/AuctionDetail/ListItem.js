/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import {
  AvatarWithShadow, ImageNetUnkoneSize, Slogan, CountdownCom,
} from '../../components';
import { YaHei } from '../../res/FontFamily';
import { formatTimeAgo } from '../../utils/CommonUtils';

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
  renderHint = () => {
    const { text, data, finish } = this.props;
    if (text) {
      return <Text style={[styles.header1Text, { bottom: -1 }]}>{text}</Text>;
    } if (data.status == 2) {
      return (
        <CountdownCom
          style={styles.header1Text}
          time={data.end_time}
          format="竞拍结束 time"
          finish={finish}
          endTimerText="竞拍已结束"
        />
      );
    }
    const stateText = {
      '-1': '审核未通过',
      1: '审核中',
      2: '拍卖中',
      3: '已结束',
      4: '已流拍',
      5: '已下架',
    }[data.status];
    return <Text style={styles.header1Text}>{stateText}</Text>;
  }

  render() {
    const { item, data } = this.props;
    if (item === 'header') {
      return (
        <View style={[styles.header1, { backgroundColor: data.status == 2 ? '#FFA700' : '#D7D7D7' }]}>
          { this.renderHint() }
          <Text style={styles.header1Text}>{`${data.lookers} 围观`}</Text>
        </View>
      );
    } if (item.type === 'middle') {
      const list = data?.join_user_list || [];
      return (
        <View>
          <Slogan marginHorizontal={0} />
          <View>
            <Text style={{ fontSize: 13, marginHorizontal: 3 }}>商品描述</Text>
            <Text style={styles.description}>{data.description}</Text>
            {
              list.length > 0 && (
                <View style={styles.priceListWrapper}>
                  <Text style={{ fontSize: 13, marginBottom: 8 }}>出价记录</Text>
                  {
                  list.map((v, i) => (
                    <View key={i} style={[styles.priceItem, { borderBottomWidth: i === list.length - 1 ? 0 : StyleSheet.hairlineWidth }]}>
                      <View style={{ flexDirection: 'row', flex: 1.5 }}>
                        <AvatarWithShadow size={18} source={{ uri: v.avatar }} />
                        <Text style={{ fontSize: 11, marginLeft: 5 }}>{v.user_name}</Text>
                      </View>
                      <Text style={{ fontSize: 11, flex: 1 }}>
                        ￥
                        <Text style={{ fontSize: 18, fontFamily: YaHei }}>{v.price / 100}</Text>
                      </Text>
                      <Text style={styles.addTime}>{formatTimeAgo(v.add_time)}</Text>
                    </View>
                  ))
                }
                </View>
              )
            }
          </View>
        </View>
      );
    }
    if (item.mask) {
      return (
        <View>
          <ImageNetUnkoneSize style={styles.image} source={{ uri: item.uri.url || item.uri }} />
          {Tag1(data.s_time)}
        </View>
      );
    }
    return <ImageNetUnkoneSize style={styles.image} source={{ uri: item.uri.url || item.uri }} />;
  }
}

const styles = StyleSheet.create({
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
  description: {
    fontSize: 11,
    color: '#767676',
    textAlign: 'justify',
    marginHorizontal: 3,
  },
  addTime: {
    fontSize: 12,
    color: '#B1B1B1',
    flex: 1,
    textAlign: 'right',
  },
  priceListWrapper: {
    backgroundColor: '#fff',
    borderRadius: 2,
    paddingHorizontal: 9,
    paddingTop: 10,
    marginTop: 15,
  },
  priceItem: {
    height: 33,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: '#fff',
    marginTop: 7,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: SCREEN_WIDTH - 18,
  },
  price: {
    fontSize: 18,
    fontFamily: YaHei,
    top: 3.5,
  },
  header1: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    height: 41,
    paddingHorizontal: 12,
  },
  header1Text: {
    color: '#fff',
    fontSize: 13,
  },
  image: {
    width: SCREEN_WIDTH - 18,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 7,
  },
});
