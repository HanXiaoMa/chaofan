import React, { PureComponent } from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import { ScaleView, Image, CountdownCom } from '../../components';
import { YaHei } from '../../res/FontFamily';
import { request } from '../../http/Axios';

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
  constructor(props) {
    super(props);
    this.state = {
      text: null,
    };
  }

  onPress = () => {
    const { navigation, item } = this.props;
    navigation.navigate('AuctionDetail', { params: { item } });
  }

  finish = () => {
    const { changeListData, type, item } = this.props;
    this.setState({ text: '正在结算本次拍卖结果' });
    setTimeout(() => {
      request('/auction/get_auction_info', { params: { id: item.id } }).then((res) => {
        changeListData(type, data => ({
          ...data,
          list: data.list.map((v) => {
            if (v.id == item.id) {
              return res.data;
            }
            return v;
          }),
        }));
        setTimeout(() => { this.setState({ text: null }); });
      });
    }, 3000);
  }

  render() {
    const { item } = this.props;
    const { text } = this.state;
    return (
      <ScaleView onPress={this.onPress} style={styles.container}>
        <View style={[styles.image, { marginRight: 10 }]}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {Tag1(item.s_time)}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={styles.priceWrapper}>
              <Text style={styles.chujia}>当前价格</Text>
              <Text style={{ fontSize: 10 }}>￥</Text>
              <Text style={styles.price}>{(item.max_buy?.price || item.min_price) / 100}</Text>
            </View>
            {
              text ? <Text style={[styles.time, { bottom: -1 }]}>{text}</Text> : (
                <CountdownCom
                  style={styles.time}
                  time={item.end_time}
                  finish={this.finish}
                  format="距结束 time"
                  endTimerText="竞拍已结束"
                />
              )
            }
          </View>
        </View>
      </ScaleView>
    );
  }
}

const styles = StyleSheet.create({
  chujia: {
    fontSize: 11,
    color: '#FFA700',
    fontFamily: YaHei,
    marginLeft: 2,
  },
  time: {
    fontFamily: YaHei,
    fontSize: 13,
  },
  price: {
    fontSize: 15,
    fontFamily: YaHei,
    top: 2,
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  image: {
    height: 56,
    width: 56,
    backgroundColor: '#aaa',
  },
  title: {
    height: 37,
    fontSize: 13,
    padding: 0,
  },
  container: {
    marginTop: 7,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    padding: 7,
    flexDirection: 'row',
  },
  tag: {
    borderRadius: 2,
    position: 'absolute',
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 12,
    bottom: 5,
  },
});
