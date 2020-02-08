/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Text, ScrollView, View, StyleSheet,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { BottomPay, ShoeImageHeader } from '../../components';
import { YaHei } from '../../res/FontFamily';
import Colors from '../../res/Colors';
import { getSimpleData } from '../../redux/reselect/simpleData';
import { fetchSimpleData } from '../../redux/actions/simpleData';
import { showNoPayment } from '../../utils/CommonUtils';
import { request } from '../../http/Axios';

function mapStateToProps() {
  return (state, props) => ({
    payData: getSimpleData(state, props.navigation.getParam('params').api.type),
    appOptions: getSimpleData(state, 'appOptions'),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData,
  }, dispatch);
}

class PayDetail extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation, fetchSimpleData } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    const { type, params } = this.routeParams.api;
    fetchSimpleData(type, params);
  }

  componentDidMount() {
    const { navigation } = this.props;
    if (this.routeParams.api.type === 'freeTradeToOrder') {
      this.didBlurSubscription = navigation.addListener(
        'willFocus',
        (payload) => {
          if (['Navigation/BACK', 'Navigation/POP'].includes(payload.action.type) && window.waitPay) {
            window.waitPay = null;
            showNoPayment();
          }
        },
      );
    }
  }

  componentWillUnmount() {
    this.didBlurSubscription && this.didBlurSubscription.remove();
  }

  onPress = () => {
    const { payData: { data = {} } } = this.props;
    const { type, params } = this.routeParams.api;
    if (type === 'freeTradeToOrder') {
      request('/order/do_buy_free', { params }).then((res) => {
        window.waitPay = res.data.order_id;
        this.toPay(res.data);
      });
    } else {
      this.toPay(data);
    }
  }

  toPay = (data) => {
    const { navigation } = this.props;
    navigation.navigate('Pay', {
      params: {
        type: this.routeParams.type,
        payType: this.routeParams.payType,
        payData: {
          order_id: data.order_id,
          price: ['service', 'management', 'price', 'postage'].reduce((sum, v) => sum + (data[v] || 0) * 1, 0),
        },
        shopInfo: {
          goods: this.routeParams.goodsInfo,
        },
      },
    });
  }

  renderBlock = items => (
    <View style={styles.orderInfo}>
      {
        items.map((v, i) => (
          <View key={i} style={[styles.itemWrapper, { borderBottomColor: i === items.length - 1 ? '#fff' : '#F2F2F2' }]}>
            <Text style={{ fontSize: 12, marginVertical: 10 }}>{v.text}</Text>
            <Text style={{ fontSize: 12, color: i === 0 ? '#000' : 'red' }}>{`${i !== 0 ? '+' : ''}￥${(v.price / 100).toFixed(2)}`}</Text>
          </View>
        ))
      }
    </View>
  )

  render() {
    const { payData: { data = {} } } = this.props;
    const goodsInfo = this.routeParams.goodsInfo;
    const items = [];
    // price 商品价格 management 仓库管理费 service 服务费 postage 快递费
    data.price && items.push({ text: '商品价格 : ', price: data.price });
    data.management && items.push({ text: '仓库管理费 : ', price: data.management });
    data.service && items.push({ text: '平台服务费 : ', price: data.service });
    data.postage && items.push({ text: '快递费 : ', price: data.postage });
    const total = ['service', 'management', 'price'].reduce((sum, v) => sum + (data[v] || 0) * 1, 0);
    const text = [
      '平台资费标准说明',
      '现在将对用户在炒饭APP交易过程中产生的费用作出如下说明',
      '转账服务费：第三方支付平台对每笔转账收取的手续费及平台转账服务提供的技术支持服务费用。',
      '平台服务费：包含鉴别费(对每件商品进行多重鉴别真伪服务产生的服务费用)，包装服务费(商品发货至买家时所需的各类包装材料及人工包装服务所产生的服务费用)。',
      '仓库管理费：对每件商品进行仓库储存所产生的服务费用。',
    ];

    return (
      <View style={{ flex: 1, backgroundColor: Colors.MAIN_BACK }}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <ShoeImageHeader showPrice={!!goodsInfo.price} item={goodsInfo} showSize />
          { this.renderBlock(items) }
          {/* <View style={styles.orderInfo}>
            <View style={[styles.itemWrapper0, { borderBottomColor: '#F2F2F2' }]}>
              <Text style={{ fontSize: 12, color: '#585858' }}>{`订单编号 : ${data.order_id}`}</Text>
            </View>
            <View style={[styles.itemWrapper0, { borderBottomColor: '#fff' }]}>
              <Text style={{ fontSize: 10, color: '#A2A2A2', marginTop: 3 }}>{`创建日期 : ${formatDate(data.add_time)}`}</Text>
            </View>
          </View> */}
          <View style={[styles.orderInfo, { paddingVertical: 10 }]}>
            {
              text.map((v, i) => (
                <View key={i} style={{ flexDirection: 'row', marginTop: 2 }}>
                  {i > 1 && <Text style={styles.text}>* </Text>}
                  <Text style={[styles.text, { flex: 1 }]}>{v}</Text>
                </View>
              ))
            }
          </View>
        </ScrollView>
        <BottomPay text="去支付" price={total} onPress={this.onPress} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  price: {
    fontFamily: YaHei,
    fontSize: 15,
    color: Colors.YELLOW,
  },
  itemWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 11,
    color: '#888',
    textAlign: 'justify',
    lineHeight: 13,
  },
  itemWrapper0: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  orderInfo: {
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginTop: 9,
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: 9,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(PayDetail);
