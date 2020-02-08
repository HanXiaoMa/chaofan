/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  Text, ScrollView, View, StyleSheet, TouchableOpacity, Platform, Clipboard,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Image, ExpressItem, Address, ScaleView,
} from '../../components';
import { YaHei } from '../../res/FontFamily';
import { wPx2P } from '../../utils/ScreenUtil';
import {
  formatDate, debounce, resetRoute, getUserInfo, getAddress,
} from '../../utils/CommonUtils';
import { btnOnPress } from '../../utils/Auction';
import { PADDING_TAB } from '../../common/Constant';
import { showToast } from '../../utils/MutualUtil';
import { getSimpleData } from '../../redux/reselect/simpleData';
import { fetchSimpleData } from '../../redux/actions/simpleData';
import { request } from '../../http/Axios';

const TYPE = 'auctionOrderInfo';
function mapStateToProps() {
  return state => ({
    orderInfo: getSimpleData(state, TYPE),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData,
  }, dispatch);
}

class AuctionOrderDetail extends PureComponent {
  static navigationOptions = () => ({ title: '订单详情' });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.item = this.routeParams.item || {};
    this.fetchData();
    this.statusList = [];
    this.userId = getUserInfo().id;
  }

  fetchData = () => {
    const { fetchSimpleData } = this.props;
    fetchSimpleData(TYPE, { order_id: this.item.order_id }, null, this.item);
  }

  onPress = () => {
    const { orderInfo: { data = {} }, navigation } = this.props;
    const address = getAddress();
    if (data.status == 0) {
      request('/auction/order_submit', {
        params: {
          order_id: this.item.order_id,
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
              resetRoute([
                { routeName: 'BottomNavigator', params: { params: { index: 4 } } },
                { routeName: 'AuctionGoods', params: { params: { type: 'auctionBuyerWaitHave' } } },
              ]);
            },
          },
        });
      });
    } else if (data.status == 1) {
      btnOnPress(data, 'inputOrder');
    } else if (data.status == 5) {
      btnOnPress(data, 'confirmHaved', () => this.fetchData('refresh'));
    }
  }

  toCopy = (v) => {
    const { orderInfo: { data = {} } } = this.props;
    if (v) {
      Clipboard.setString(v);
      showToast('运单号已复制');
    } else {
      Clipboard.setString(data.order_id);
      showToast('订单号已复制');
    }
  }

  toExpress = () => {
    const { navigation, orderInfo: { data = {} } } = this.props;
    navigation.navigate('Express', { params: { list: data.mail_list } });
  }

  toDeatil = () => {
    const { navigation } = this.props;
    navigation.navigate('AuctionDetail', { params: { item: { id: this.item.id } } });
  }

  renderGoodsInfo = data => (
    <ScaleView style={styles.header} onPress={this.toDeatil}>
      <Image source={{ uri: data.image }} style={styles.image} />
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={{ fontSize: 13, marginTop: 15 }}>
            ￥
          <Text style={{ fontSize: 13, color: '#EF4444' }}>{data.order_price / 100}</Text>
        </Text>
      </View>
    </ScaleView>
  )

  renderTime = (data) => {
    const timeList = [
      `创建时间：${formatDate(data.create_time)}`,
    ];
    data.pay_time > 0 && timeList.push(`付款时间：${formatDate(data.pay_time)}`);
    data.send_time > 0 && timeList.push(`发货时间：${formatDate(data.send_time)}`);
    data.finish_time > 0 && timeList.push(`完成时间：${formatDate(data.finish_time)}`);
    return (
      <View style={styles.block}>
        <TouchableOpacity style={styles.orderWrapper} onPress={() => this.toCopy()}>
          <Text style={{ fontSize: 12, fontFamily: YaHei }}>{`订单编号：${data.order_id}`}</Text>
          <Image source={require('../../res/image/copy.png')} style={{ height: 9, width: 9, marginLeft: 5 }} />
        </TouchableOpacity>
        { timeList.map(v => <Text style={styles.time} key={v}>{v}</Text>) }
      </View>
    );
  }

  renderBtn = (data, isBuyer) => {
    let text = null;
    if (isBuyer) {
      text = {
        0: '去支付',
        5: '确认收货',
      }[data.status];
    } else if (data.status == 1) {
      text = '去发货';
    }
    if (text) {
      return (
        <View style={styles.bottom}>
          <TouchableOpacity style={[styles.btn, { backgroundColor: '#FFA700' }]} onPress={debounce(this.onPress)}>
            <Text style={styles.btnText}>{text}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  renderAddress = (data, isBuyer) => {
    const { navigation } = this.props;
    if (isBuyer) {
      if (data.status == 0) {
        return (
          <View style={styles.block}>
            <Address navigation={navigation} backRoute="AuctionOrderDetail" />
          </View>
        );
      } if (data.express_link_name) {
        return (
          <View style={[styles.block, { paddingBottom: 5 }]}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text style={styles.shouhuoren}>{`收货人：${data.express_link_name}`}</Text>
              <Text style={styles.shouhuoren}>{data.express_mobile}</Text>
            </View>
            <Text style={styles.address}>{data.express_address}</Text>
            {
              data.mailno && (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }} onPress={() => this.toCopy(data.mailno)}>
                  <Text style={{ fontSize: 15, fontFamily: YaHei }}>{`物流单号：${data.mailno}`}</Text>
                  <Image source={require('../../res/image/copy.png')} style={{ height: 12, width: 12, marginLeft: 5 }} />
                </TouchableOpacity>
              )
            }
          </View>
        );
      }
    }
    return null;
  }

  renderExpress = (data, isBuyer) => {
    if (data.mail_list?.[0] && isBuyer) {
      return (
        <View style={[styles.block, { paddingLeft: 16 }]}>
          <ExpressItem numberOfLines={3} item={data.mail_list[0]} onPress={this.toExpress} />
        </View>
      );
    }
    return null;
  }

  renderProcess = (data, isBuyer) => {
    // 买家付款-未付款违约-扣除违约金/获得违约金
    //         卖家发货-平台鉴定-平台发货-交易完成
    //                        -鉴定失败
    //         逾期未发货-扣除违约金/获得违约金
    // 订单状态
    // -2一口价付款超时订单关闭
    // -1买家付款超时违约            **/**
    // 0待买家付款，                **/**
    // 1待卖家发货                  **/**
    // 2卖家已发货                  **/**
    // 3平台已收货鉴定中，           **/**
    // 4鉴定失败退回，              **/**
    // 5发往买家中                  **/**
    // 6交易完成                    **/**
    // 7卖家发货超时违约             **/**
    const successList = ['买家付款', '卖家发货', '平台鉴定', '平台发货', '交易完成'];
    const process = {
      '-1': { list: ['买家中拍', '未付款违约', isBuyer ? '扣除违约金' : '获得违约金'], finishIndex: 2 },
      0: { list: successList, finishIndex: -1 },
      1: { list: successList, finishIndex: 0 },
      2: { list: successList, finishIndex: 1 },
      3: { list: successList, finishIndex: 2 },
      4: {
        list: ['买家付款', '卖家发货', '平台鉴定', '鉴定失败', isBuyer ? '获得违约金' : '扣除违约金'],
        finishIndex: 4,
      },
      5: { list: successList, finishIndex: isBuyer ? 3 : 4 },
      6: { list: successList, finishIndex: 4 },
      7: { list: ['买家付款', '逾期未发货', isBuyer ? '获得违约金' : '扣除违约金'], finishIndex: 2 },
    }[data.status] || [];
    if (process?.list?.length > 0) {
      return (
        <View style={[styles.block, { paddingHorizontal: 0, flexDirection: 'row', justifyContent: 'center' }]}>
          {
            process.list.map((v, i) => {
              const finish = i <= process.finishIndex;
              return (
                <View style={styles.processWrapper} key={`process-${i}`}>
                  <View style={[styles.processTextWrapper, { backgroundColor: finish ? '#FFA700' : '#E8E8E8' }]}>
                    <Text style={styles.processText}>{v.text || v}</Text>
                  </View>
                  {
                    i < process.list.length - 1 && (
                      <Image
                        style={{ width: 5.5, height: 7 }}
                        source={finish ? require('../../res/image/arrow-yellow.png') : require('../../res/image/arrow-gray.png')}
                      />
                    )
                  }
                </View>
              );
            })
          }
        </View>
      );
    }
    return null;
  }

  renderPayInfo = (data, isBuyer) => {
    if (!isBuyer) {
      return null;
    }
    const priceList = [
      { left: '商品金额', value: data.order_price / 100, rightColor: '#FFA700' },
      { left: '运费', value: '到付' },
    ];
    if (data.pay_type == 1) {
      priceList.push({ left: '付款方式', value: '支付宝支付' });
    } else if (data.pay_type == 2) {
      priceList.push({ left: '付款方式', value: '微信支付' });
    }
    return (
      <View>
        {
          priceList.map((v, i) => (
            <View style={[styles.item, { marginTop: i === 0 ? 15 : 1 }]} key={v.left}>
              <Text style={{ color: v.leftColor || '#000' }}>{v.left}</Text>
              <Text style={{ color: v.rightColor || '#000' }}>{v.value}</Text>
            </View>
          ))
        }
        <Text style={[styles.total, { marginTop: 10 }]}>
          合计 : ￥
          <Text style={[styles.total, { color: '#FFA700' }]}>{data.order_price / 100}</Text>
        </Text>
      </View>
    );
  }

  render() {
    const { orderInfo: { data = {} } } = this.props;
    const isBuyer = this.userId == data.user_id;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          { this.renderGoodsInfo(data) }
          <View style={styles.fengexian} />
          { this.renderAddress(data, isBuyer) }
          { this.renderExpress(data, isBuyer) }
          { this.renderProcess(data, isBuyer) }
          { this.renderTime(data, isBuyer) }
          { this.renderPayInfo(data, isBuyer) }
        </ScrollView>
        { this.renderBtn(data, isBuyer) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  processWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shouhuoren: {
    fontFamily: YaHei,
    color: '#212121',
    fontSize: 13,
  },
  address: {
    fontSize: 12,
    marginTop: 2,
    color: '#858585',
    marginBottom: 10,
  },
  processTextWrapper: {
    marginHorizontal: 3,
    borderRadius: 16,
    height: 16,
    paddingHorizontal: 4,
  },
  processText: {
    fontSize: 10,
    color: '#fff',
    padding: 0,
    lineHeight: 16,
  },
  orderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },
  time: {
    fontSize: 11,
    color: '#606060',
  },
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
  fengexian: {
    backgroundColor: '#C7C7C7',
    height: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    padding: 9,
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 6,
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

export default connect(mapStateToProps, mapDispatchToProps)(AuctionOrderDetail);
