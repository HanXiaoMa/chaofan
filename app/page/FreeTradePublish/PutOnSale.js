/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Text, ScrollView, View, StyleSheet, TextInput, TouchableOpacity, Platform,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { PADDING_TAB } from '../../common/Constant';
import { Image, ShoeImageHeader } from '../../components';
import { YaHei, RuiXian } from '../../res/FontFamily';
import Colors from '../../res/Colors';
import { getSimpleData } from '../../redux/reselect/simpleData';
import { fetchSimpleData } from '../../redux/actions/simpleData';
import { showToast } from '../../utils/MutualUtil';
import { requestApi } from '../../http/Axios';
import { fetchListData } from '../../redux/actions/listData';

const TYPE = 'warehousePutOnSale';
const baseURL = require('../../../app.json').webUrl;

function mapStateToProps() {
  return state => ({
    info: getSimpleData(state, TYPE),
    appOptions: getSimpleData(state, 'appOptions'),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData,
    fetchListData,
  }, dispatch);
}

class PutOnSale extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation, fetchSimpleData } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.item = this.routeParams.item;
    fetchSimpleData(TYPE, { order_id: this.item.order_id });
    this.state = {
      price: 0,
      agreed: true,
    };
  }

  toPay = () => {
    const { price, agreed } = this.state;
    const { navigation, appOptions, fetchListData } = this.props;
    if (!agreed) {
      showToast('同意卖家须知后可继续上架');
      return;
    }
    if (price * 1 <= 0) {
      showToast('请输入价格');
      return;
    }
    const params = { order_id: this.item.order_id, price };
    if (appOptions?.data?.fee > 0) {
      navigation.navigate('PayDetail', {
        title: '支付服务费',
        params: {
          api: {
            type: 'freeTradeToRelease',
            params,
          },
          type: 4,
          payType: 'service',
          goodsInfo: {
            ...this.item,
            price: price * 100,
            image: (this.item.goods || this.item).image,
            icon: (this.item.goods || this.item).icon,
            goods_name: (this.item.goods || this.item).goods_name,
          },
        },
      });
    } else {
      requestApi('freeTradeToRelease', { params }).then(() => {
        fetchListData('warehouse');
        navigation.navigate('MyGoods', {
          title: '我的库房',
          params: {
            type: 'warehouse',
          },
        });
      });
    }
  }

  toWeb = () => {
    const { navigation } = this.props;
    navigation.navigate('Web', {
      title: '隐私协议',
      params: {
        url: `${baseURL}/secret`,
      },
    });
  }

  change= () => {
    const { agreed } = this.state;
    this.setState({ agreed: !agreed });
  }

  render() {
    const { info, appOptions } = this.props;
    const { price, agreed } = this.state;
    const deposit = Math.ceil(price * appOptions?.data?.fee) / 100;
    const text = [
      '平台资费标准说明',
      '现在将对用户在炒饭APP交易过程中产生的费用作出如下说明',
      '转账服务费：第三方支付平台对每笔转账收取的手续费及平台转账服务提供的技术支持服务费用。',
      '平台服务费：包含鉴别费(对每件商品进行多重鉴别真伪服务产生的服务费用)，包装服务费(商品发货至买家时所需的各类包装材料及人工包装服务所产生的服务费用)。',
      '仓库管理费：对每件商品进行仓库储存所产生的服务费用。',
    ];
    const item = { ...this.item, goods_name: (this.item.goods || this.item).goods_name, image: (this.item.goods || this.item).image };

    return (
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={false} style={styles.scrollView}>
          <View style={styles.top}>
            <ShoeImageHeader style={{ marginHorizontal: 0 }} item={item} showSize showPrice={false} />
            <View style={styles.shoeSalePrice}>
              <Text style={{ fontSize: 13 }}>
                最高售价：
                <Text style={styles.TopPrice}>{`￥${info.data?.max_price / 100}`}</Text>
              </Text>
              <Text style={{ fontSize: 13 }}>
                最低售价：
                <Text style={styles.LowPrice}>{`￥${info.data?.min_price / 100}`}</Text>
              </Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 9 }}>
            <View style={styles.shoesCommission}>
              <View style={styles.inputPrice}>
                <Text style={{ color: '#999' }}>￥</Text>
                <TextInput
                  style={styles.inputPriceTextare}
                  keyboardType="numeric"
                  placeholder="输入价格"
                  maxLength={9}
                  selectionColor="#00AEFF"
                  underlineColorAndroid="transparent"
                  clearButtonMode="while-editing"
                  onChangeText={(price) => { this.setState({ price }); }}
                />
              </View>
              <View style={styles.shoesCommissionMoney}>
                <Text style={styles.priceText}>{`平台服务费(${appOptions?.data?.fee}%)：￥${deposit}`}</Text>
              </View>
            </View>
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
          </View>
        </ScrollView>
        <View style={styles.bottom}>
          <View style={styles.priceWrapper}>
            <TouchableOpacity onPress={this.change}>
              <Image
                style={{ width: 20, height: 20 }}
                source={agreed ? require('../../res/image/selectIcon.png') : require('../../res/image/unSelect.png')}
              />
            </TouchableOpacity>
            <Text style={styles.ihavekonw}>我已阅读</Text>
            <TouchableOpacity onPress={this.toWeb}>
              <Text style={styles.salerNeedKnow}>卖家须知</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.zhifu, { backgroundColor: !agreed ? '#e2e2e2' : Colors.YELLOW }]}
            onPress={this.toPay}
          >
            <Text style={styles.queren}>上架</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  title: {
    fontFamily: RuiXian,
    fontSize: 15,
    textAlign: 'justify',
    lineHeight: 18,
  },
  top: {
    backgroundColor: '#fff',
    borderRadius: 2,
    marginHorizontal: 9,
    marginTop: 7,
    paddingBottom: 9,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  shoeSalePrice: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 9,
  },
  inputPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    overflow: 'hidden',
    borderColor: '#999',
    borderWidth: StyleSheet.hairlineWidth,
    height: 33,
    paddingLeft: 5,
  },
  shoesCommission: {
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  shoesCommissionInput: {
    borderColor: '#DBDBDB',
    borderWidth: 1,
    backgroundColor: '#FBFBFB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 7,
  },
  shoesCommissionMoney: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  shoesCommissionIncome: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 9,
  },
  priceText: {
    fontSize: 13,
    color: '#000',
    fontFamily: YaHei,
  },
  TopPrice: {
    color: '#37B6EB',
    fontSize: 13,
  },
  LowPrice: {
    color: Colors.YELLOW,
    fontSize: 13,
  },
  inputPriceTextare: {
    flex: 1,
    marginLeft: 5,
    padding: 0,
    includeFontPadding: false,
    color: '#000',
  },
  zhifu: {
    flex: 1,
    height: 44,
    marginLeft: 20,
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    height: 66 + PADDING_TAB,
    backgroundColor: '#fff',
    paddingBottom: PADDING_TAB,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
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
  priceWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 20,
  },
  ihavekonw: {
    marginLeft: 9,
    fontSize: 12,
    color: '#555555',
  },
  queren: {
    color: '#fff',
    fontSize: 16,
    fontFamily: YaHei,
  },
  salerNeedKnow: {
    fontSize: 12,
    color: '#37B6EB',
  },
  orderInfo: {
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginTop: 9,
    borderRadius: 2,
    overflow: 'hidden',
  },
  text: {
    fontSize: 11,
    color: '#888',
    textAlign: 'justify',
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(PutOnSale);
