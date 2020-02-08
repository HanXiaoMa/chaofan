/* eslint-disable react/no-array-index-key */
// 支付成功页面，支付失败直接在支付页显示弹窗，不跳转到该页面
import React, { PureComponent } from 'react';
import {
  ScrollView, StyleSheet, Text, View, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import {
  BottomBtnGroup, CountdownCom, ActivityImage,
} from '../../components';
import Colors from '../../res/Colors';
import { YaHei, RuiXian } from '../../res/FontFamily';
import {
  debounce, shareAcyivity, getAppOptions, copy, resetRoute,
} from '../../utils/CommonUtils';
import { hPx2P, wPx2P } from '../../utils/ScreenUtil';
import { STATUSBAR_HEIGHT } from '../../common/Constant';
import { getSimpleData } from '../../redux/reselect/simpleData';

// commission 支付佣金 buyGoods 购买商品 buyActivityGoods 购买活动商品 postage 支付邮费 service 支付服务费 management 库管费
const shopInfoTest = {
  goods: {
    image: 'https://image.chaofun.co/tower/goods/image/5dc971c29076a553942.jpg?x-oss-process=image/resize,m_lfit,w_282',
    goods_name: '123456',
  },
  activity: {
    b_type: '1',
  },
};

const payTypeTest = '';

function mapStateToProps() {
  return state => ({
    simpleData: getSimpleData(state, 'activityInfo'),
  });
}

class PaySuccess extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
  }

  showShare = () => {
    const { simpleData } = this.props;
    const payType = this.routeParams.payType || payTypeTest;
    const shopInfo = payType === 'commission' ? simpleData.data : this.routeParams.shopInfo || shopInfoTest;
    shareAcyivity(shopInfo, payType);
  };

  confirm = () => {
    const { navigation } = this.props;
    const payType = this.routeParams.payType || payTypeTest;
    const routes = [{ routeName: 'BottomNavigator', params: { params: { index: 4 } } }];
    if (payType === 'commission') {
      navigation.navigate('ShopDetail');
    } else if (['buyGoods', 'buyActivityGoods', 'management'].includes(payType)) {
      resetRoute([...routes, { routeName: 'MyGoods', params: { params: { type: 'warehouse' } } }]);
    } else if (payType === 'postage') {
      resetRoute([...routes, { routeName: 'MyGoods', params: { params: { type: 'sendOut' } } }]);
    } else if (payType === 'service') {
      resetRoute([...routes, { routeName: 'MyGoods', params: { params: { type: 'onSale' } } }]);
    }
  };

  toFreeTrade = () => {
    const { navigation } = this.props;
    navigation.navigate('BottomNavigator', { params: { index: 0 } });
  }

  toWarehouse = (type) => {
    const { navigation } = this.props;
    navigation.navigate('MyGoods', {
      title: '我的库房',
      type,
    });
  }

  toMyGoods = (type) => {
    const { navigation } = this.props;
    navigation.navigate('MyGoods', {
      title: '我的商品',
      type,
    });
  }

  toCopy = () => {
    copy('address');
  }

  renderBottom = () => {
    const { simpleData } = this.props;
    const payType = this.routeParams.payType || payTypeTest;
    const shopInfo = payType === 'commission' ? simpleData.data : this.routeParams.shopInfo || shopInfoTest;
    if (payType === 'commission' && shopInfo?.activity?.b_type) {
      return null;
    } if (['buyActivityGoods', 'buyGoods'].includes(payType)) {
      return (
        <Text style={styles.share}>
          商品购买成功，可在
          <Text onPress={() => this.toWarehouse('warehouse')} style={{ color: '#0097C2', fontSize: 13 }}>我的库房</Text>
          中提货或者发布到
          <Text onPress={this.toFreeTrade} style={{ color: '#0097C2', fontSize: 13 }}>交易市集</Text>
        </Text>
      );
    } if (payType === 'service') {
      return (
        <Text style={styles.share}>
          商品上架成功，可在
          <Text onPress={() => this.toWarehouse('warehouse')} style={{ color: '#0097C2', fontSize: 13 }}>我的库房</Text>
          或
          <Text onPress={() => this.toMyGoods('onSale')} style={{ color: '#0097C2', fontSize: 13 }}>我的商品</Text>
          中修改价格或下架商品
        </Text>
      );
    } if (payType === 'postage') {
      return (
        <Text style={styles.share} onPress={() => this.toWarehouse('sendOut')}>
          邮费支付成功，可在我的库房
          <Text style={{ color: '#0097C2', fontSize: 13 }}>已出库</Text>
          中查看物流单号
        </Text>
      );
    } if (payType === 'management') {
      return (
        <Text style={styles.share} onPress={() => this.toWarehouse('warehouse')}>
          仓库管理费支付成功，可在邮寄商品后到
          <Text style={{ color: '#0097C2', fontSize: 13 }}>我的库房</Text>
          中填写物流单号
        </Text>
      );
    }
    return null;
  }

  render() {
    const { simpleData } = this.props;
    const payType = this.routeParams.payType || payTypeTest;
    const shopInfo = (payType === 'commission' ? simpleData.data : this.routeParams.shopInfo) || shopInfoTest;
    const btns = [{ text: '确定', onPress: debounce(this.confirm) }];
    if (payType === 'commission') {
      btns.unshift({ text: '邀请助攻', onPress: debounce(this.showShare) });
    } else if (payType === 'buyActivityGoods') {
      btns.unshift({ text: '分享', onPress: debounce(this.showShare) });
    }
    const hints = payType === 'management' ? [
      { text: '指定快递：顺丰快递', needStar: true },
      { text: `收件人：${getAppOptions()?.link_name}` },
      { text: `手机号码：${getAppOptions()?.mobile}` },
      { text: `邮寄地址：${getAppOptions()?.address}` },
    ] : [];
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: 'center', marginTop: STATUSBAR_HEIGHT + 20 }}>
            <ActivityImage source={{ uri: shopInfo.goods.image }} />
            <Text style={styles.shopName}>{shopInfo.goods.goods_name}</Text>
            <View style={styles.hengxian} />
            <Text style={styles.status}>支付成功!</Text>
            {
              payType === 'commission' && (
                <CountdownCom
                  time={shopInfo.activity.end_time}
                  style={styles.time}
                  format="距活动结束 time"
                  noMax
                  extraTextStyle={[styles.time, { color: '#727272' }]}
                />
              )
            }
          </View>
          {
            hints.length > 0 && (
            <TouchableOpacity activeOpacity={1} onPress={this.toCopy} style={{ width: wPx2P(375), paddingHorizontal: 20, marginTop: 15 }}>
              {hints.map((v, i) => (
                <View key={i} style={{ flexDirection: 'row', marginTop: 2 }}>
                  {v.needStar ? <Text style={styles.hint}>* </Text> : <Text style={[styles.hint, { color: 'transparent' }]}>* </Text>}
                  <Text style={[styles.hint, { flex: 1 }]}>{v.text}</Text>
                </View>
              ))}
            </TouchableOpacity>
            )
          }
          {this.renderBottom()}
        </ScrollView>
        {
          payType === 'commission' && shopInfo?.activity?.b_type && (
            <View style={styles.shareText}>
              <Text style={{ fontSize: 13 }} onPress={this.showShare}>
              赶快
                <Text style={{ color: '#0097C2', fontSize: 13 }}>分享</Text>
              活动链接给好友吧
              </Text>
              <Text style={{ fontSize: 13 }} onPress={this.showShare}>
                {shopInfo.activity.b_type === '1'
                  ? '每位好友的加入都能多一个抽中的机会' : '邀请好友来帮我抢购买资格'}
              </Text>
            </View>
          )
        }
        <BottomBtnGroup showShadow={!(payType === 'commission' && shopInfo?.activity?.b_type)} btns={btns} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  hengxian: {
    backgroundColor: '#E2E2E2',
    height: StyleSheet.hairlineWidth,
    width: wPx2P(345),
    marginVertical: 10,
  },
  scrollView: {
    alignItems: 'center',
    paddingTop: 10,
  },
  shareText: {
    width: wPx2P(345),
    paddingTop: 15,
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: wPx2P(15),
    paddingBottom: 3,
  },
  mainView: {
    flex: 1,
    alignItems: 'center',
    paddingTop: hPx2P(30 + STATUSBAR_HEIGHT),
    paddingBottom: hPx2P(20),
    justifyContent: 'space-between',
  },
  waitLeft: {
    fontSize: 16,
    fontFamily: YaHei,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
  },
  share: {
    fontSize: 13,
    color: '#696969',
    marginTop: 20,
    marginHorizontal: 15,
    lineHeight: 15,
  },
  time: {
    fontFamily: YaHei,
    color: Colors.YELLOW,
  },
  goodImage: {
    width: wPx2P(258),
    height: wPx2P(160),
    marginBottom: 10,
  },
  shopName: {
    justifyContent: 'center',
    fontSize: 13,
    fontFamily: RuiXian,
    marginHorizontal: 17,
    textAlign: 'justify',
    lineHeight: 15.5,
  },
  status: {
    fontSize: 20,
    fontFamily: YaHei,
    marginBottom: 5,
    color: '#FFA700',
  },
  icon: {
    width: wPx2P(47),
    height: wPx2P(47),
    position: 'absolute',
    right: 20,
    top: 15,
  },
  bottomWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  hint: {
    fontSize: 11,
    color: '#888',
    textAlign: 'justify',
  },
});

export default connect(mapStateToProps)(PaySuccess);
