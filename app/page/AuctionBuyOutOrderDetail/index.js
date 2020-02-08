/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  Text, ScrollView, View, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { Image, Address } from '../../components';
import { YaHei } from '../../res/FontFamily';
import { PADDING_TAB } from '../../common/Constant';
import { wPx2P } from '../../utils/ScreenUtil';
import { request } from '../../http/Axios';
import { getAddress, resetRoute, debounce } from '../../utils/CommonUtils';
import { showToast } from '../../utils/MutualUtil';

export default class AuctionBuyOutOrderDetail extends PureComponent {
  static navigationOptions = () => ({ title: '订单确认' });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    const { item, successCallback } = this.routeParams;
    this.item = item || {};
    this.successCallback = successCallback;
  }

  onPress = () => {
    const { navigation } = this.props;
    const address = getAddress();
    if (!address) {
      showToast('请先添加收货地址');
    } else {
      request('/auction/buy_one_price', {
        params: {
          id: this.item.id,
          express_address: address.address,
          express_link_name: address.link_name,
          express_mobile: address.mobile,
        },
        showLoading: true,
      }).then((res) => {
        navigation.navigate('Pay', {
          params: {
            payData: res.data,
            successCallback: () => {
              this.successCallback && this.successCallback();
              resetRoute([
                { routeName: 'BottomNavigator', params: { params: { index: 4 } } },
                { routeName: 'AuctionGoods', params: { params: { type: 'auctionBuyerWaitHave' } } },
              ]);
            },
          },
        });
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const price = this.item.buyout_price / 100;
    const list = [
      { left: '成交金额', value: price, rightColor: '#FFA700' },
      { left: '运费', value: '到付' },
    ];
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image source={{ uri: this.item.images?.[0] }} style={styles.image} />
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.title}>{this.item.title}</Text>
              <Text style={{ fontSize: 13, marginTop: 15 }}>
                ￥
                <Text style={{ fontSize: 13, color: '#EF4444' }}>{price}</Text>
              </Text>
            </View>
          </View>
          <View style={styles.block}>
            <Address navigation={navigation} backRoute="AuctionBuyOutOrderDetail" />
          </View>
          {list.map((v, i) => (
            <View style={[styles.item, { marginTop: i === 0 ? 15 : 1 }]} key={v.left}>
              <Text style={{ color: v.leftColor || '#000' }}>{v.left}</Text>
              <Text style={{ color: v.rightColor || '#000' }}>{v.value}</Text>
            </View>
          ))}
          <Text style={[styles.total, { marginTop: 10 }]}>
            合计 : ￥
            <Text style={[styles.total, { color: '#FFA700' }]}>{price}</Text>
          </Text>
        </ScrollView>
        <View style={styles.bottom}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#FFA700' }]} onPress={debounce(this.onPress)}>
            <Text style={styles.btnText}>提交订单</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    height: 66 + PADDING_TAB,
    backgroundColor: '#fff',
    paddingBottom: PADDING_TAB,
    paddingTop: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(188, 188, 188)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
      },
      android: {
        elevation: 50,
        position: 'relative',
      },
    }),
  },
  btn: {
    height: 46,
    width: 198,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    fontFamily: YaHei,
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 9,
    borderBottomColor: '#C7C7C7',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 15,
  },
  image: {
    width: wPx2P(106),
    height: wPx2P(106),
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 13,
  },
  block: {
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: '#C7C7C7',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  total: {
    marginLeft: 20,
    fontSize: 16,
    fontFamily: YaHei,
  },
});
