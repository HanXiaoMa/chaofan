import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Colors from '../../res/Colors';
import { YaHei, RuiXian } from '../../res/FontFamily';
import { FadeImage, BottomPay, BtnGroup } from '../../components';
import { updateUser } from '../../redux/actions/userInfo';
import { getUserInfo } from '../../redux/reselect/userInfo';
import { wPx2P } from '../../utils/ScreenUtil';
import { formatDate, getAppOptions, copy } from '../../utils/CommonUtils';
import { request } from '../../http/Axios';
import { getAddress } from '../../redux/reselect/address';
import { getSimpleData } from '../../redux/reselect/simpleData';

const PaddingHorizontal = 20;

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
    simpleData: getSimpleData(state, 'appOptions'),
    address: getAddress(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUser,
  }, dispatch);
}

class PickUp extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.item = this.routeParams.item;
  }

  changeAddress = () => {
    const { navigation } = this.props;
    navigation.navigate('ChooseAddress', {
      title: '选择收货地址',
    });
  }

  toPay =() => {
    const { navigation, simpleData, address: { current } } = this.props;
    request('/order/pay_postage', { params: { address_id: current.id, id: this.item.id } }).then(() => {
      navigation.navigate('Pay', {
        params: {
          type: '3',
          payType: 'postage',
          payData: {
            order_id: this.item.id,
            price: simpleData?.data?.postage,
          },
        },
      });
    });
  }

  toAdd = () => {
    const { navigation } = this.props;
    navigation.navigate('AddressEdit', {
      title: '添加收货地址',
      params: {
        address: {
          is_default: true,
        },
      },
    });
  }

  render() {
    const item = this.item;
    const { simpleData, address: { current: address = {}, isChoosed } } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.header}>
            <FadeImage source={{ uri: item.goods.icon }} style={styles.shoe} />
            <View style={{ flex: 1 }}>
              <View style={{ justifyContent: 'space-between', flex: 1 }}>
                <Text style={styles.shopTitle}>{item.goods.goods_name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Text style={{ color: '#212121', fontSize: 11, fontFamily: YaHei }}>{`SIZE：${item.size}`}</Text>
                </View>
              </View>
            </View>
          </View>
          {
            address.link_name ? (
              <View style={styles.shouhuorenWrapper}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Text style={styles.shouhuoren}>{`收货人：${address.link_name}`}</Text>
                  <Text style={styles.shouhuoren}>{address.mobile}</Text>
                </View>
                <Text style={styles.address}>{address.address}</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20,
                }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.yuandian}>
                      <View style={styles.yuandian1} />
                    </View>
                    <Text style={{ fontSize: 12, color: '#212121' }}>已选</Text>
                    {/* <Text style={{ fontSize: 12, color: '#212121' }}>{`${isChoosed ? '已选' : '默认地址'}`}</Text> */}
                  </View>
                  <BtnGroup btns={[{ onPress: this.changeAddress, text: '更改物流信息', color: '#0097C2' }]} />
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.addWrapper} onPress={this.toAdd}>
                <View style={styles.addIcon}>
                  <Text style={styles.plus}>+</Text>
                </View>
                <Text style={styles.add}>添加收货地址</Text>
              </TouchableOpacity>
            )
          }
          <View style={styles.shouhuorenWrapper}>
            <Text style={styles.dingdan}>{`订单编号：${item.order_id}`}</Text>
            <Text style={styles.dingdan}>{`创建日期：${formatDate(item.add_time)}`}</Text>
          </View>
          <Text style={styles.hint}>友情提示：</Text>
          <Text style={styles.hint1}>本站默认顺丰物流发货，若需其他物流方式请直接联系客服 :</Text>
          <Text onPress={() => copy('wx')} style={styles.hint1}>{`微信：${getAppOptions()?.wx}`}</Text>
          <Text style={[styles.hint1, { textAlign: 'right' }]}>物流价格由第三方物流公司提供</Text>
        </ScrollView>

        <BottomPay disabled={!address.link_name} price={simpleData?.data?.postage / 100} onPress={this.toPay} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C7C7C7',
    paddingHorizontal: PaddingHorizontal,
    paddingVertical: 7,
  },
  shoe: {
    width: wPx2P(113),
    height: wPx2P(65),
    marginRight: 15,
  },
  shopTitle: {
    fontSize: 13,
    color: 'rgba(0,0,0,1)',
    fontFamily: RuiXian,
    textAlign: 'justify',
    flex: 1,
    lineHeight: 15,
  },
  time: {
    fontSize: 11,
    color: Colors.YELLOW,
  },
  cuoguo: {
    color: Colors.YELLOW,
    fontSize: 10,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  shouhuorenWrapper: {
    marginLeft: PaddingHorizontal,
    paddingVertical: 13,
    backgroundColor: '#fff',
    borderRadius: 2,
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C7C7C7',
    paddingRight: PaddingHorizontal,
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
  },
  yuandian: {
    height: 12,
    width: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    marginRight: 5,
    borderColor: '#0097C2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yuandian1: {
    backgroundColor: '#0097C2',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    width: 4,
  },
  dingdan: {
    fontSize: 11,
  },
  hint: {
    fontSize: 13,
    fontFamily: YaHei,
    marginHorizontal: 22,
    marginTop: 16,
    marginBottom: 10,
    textAlign: 'justify',
  },
  hint1: {
    fontSize: 12,
    fontFamily: YaHei,
    marginHorizontal: 22,
    color: '#858585',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontFamily: YaHei,
  },
  addWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 85,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginTop: 7,
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  add: {
    color: '#8E8D8D',
  },
  addIcon: {
    backgroundColor: '#BCBCBC',
    width: 13,
    height: 13,
    borderRadius: 6.5,
    overflow: 'hidden',
    alignItems: 'center',
    marginRight: 5,
  },
  plus: {
    fontSize: 12,
    color: '#fff',
    lineHeight: 13.5,
    fontWeight: 'bold',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PickUp);
