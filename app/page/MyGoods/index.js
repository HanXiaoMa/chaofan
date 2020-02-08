import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import List from './List';
import { TabBar, CustomHeader } from '../../components';
import Colors from '../../res/Colors';
import { YaHei } from '../../res/FontFamily';
import HeaderRight from './HeaderRight';
import { getAppOptions, getUserInfo, getGoodsOnSale } from '../../utils/CommonUtils';
import Modal from './Modal';
import { showShare } from '../../utils/MutualUtil';

const baseURL = require('../../../app.json').webUrl;
const imageUrl = require('../../../app.json').imageUrl;

const GoodsRoutes = [
  { key: 'onSale', title: '上架中', apiType: 'goodsOnSale' },
  { key: 'selled', title: '出售成功', apiType: 'goodsSelled' },
];
const WarehouseRoutes = [
  { key: 'warehouse', title: '仓库', apiType: 'warehouse' },
  { key: 'uncomplete', title: '待付款', apiType: 'uncomplete' },
  { key: 'sendOut', title: '已出库', apiType: 'sendOut' },
];

class MyGoods extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.routeType = GoodsRoutes.findIndex(v => v.key === this.routeParams.type) > -1 ? 'Goods' : 'Warehouse';
    const routes = this.routeType === 'Goods' ? GoodsRoutes : WarehouseRoutes;
    const initIndex = Math.max(routes.findIndex(v => v.key === this.routeParams.type), 0);
    this.state = {
      routes,
      index: initIndex,
    };
  }

  onIndexChange = (index) => {
    this.setState({ index });
  }

  renderScene = ({ route }) => {
    const { navigation } = this.props;
    return <List itemAction={this.itemAction} navigation={navigation} apiType={route.apiType} route={this.routeType} type={route.key} />;
  }

  renderTabBar = (props) => {
    const { routes, index } = this.state;
    return (
      <View style={styles.header}>
        <TabBar
          style={styles.tabBar}
          routes={routes}
          position={props.position}
          onIndexChange={this.onIndexChange}
        />
        {
          (this.routeType === 'Goods' || index === 0) && (
            <HeaderRight
              color={index === 0 ? Colors.RED : '#FF9600'}
              prefix={`${this.routeType === 'Goods' ? (index === 0 ? '上架中: ' : '出售成功: ') : '库存 '}`}
              apiType={routes[index].apiType}
            />
          )
        }
      </View>
    );
  }

  itemAction = (type, route, item, refresh) => {
    const { navigation } = this.props;
    if (['express', 'edit', 'cancel'].includes(type)) {
      this.modalbox.open(type, item, refresh, route);
    } else if (['pickUp', 'sendBack'].includes(type)) {
      navigation.navigate('PickUp', {
        title: '支付运费',
        params: {
          item,
        },
      });
    } else if (type === 'pay') {
      navigation.navigate('Pay', {
        params: {
          type: '1',
          payType: item.order_type === '1' ? 'buyGoods' : 'buyActivityGoods',
          payData: {
            order_id: item.order_id,
            price: item.order_price,
            management: item.order_type === '1' ? getAppOptions()?.management : null,
          },
          shopInfo: {
            goods: item.goods,
            order_id: item.order_id,
          },
        },
      });
    } else if (type === 'publish') {
      navigation.navigate('PutOnSale', {
        title: '发布商品',
        params: {
          item,
        },
      });
    }
  }

  toShare = () => {
    const item = {
      text: getGoodsOnSale()?.list?.[0]?.goods_name || '安全 简单 高效',
      img: getGoodsOnSale()?.list?.[0]?.icon || `${imageUrl}/tower/other/cf.png?x-oss-process=image/resize,m_lfit,w_60`,
    };
    showShare({
      text: item.text,
      img: item.img,
      url: `${baseURL}/shareMyShoese/${getUserInfo()?.id}`,
      title: `我在炒饭APP上有${getGoodsOnSale()?.count}双鞋正在销售，快来看看有没有你喜欢的吧`,
    });
  };

  navRightOnPress = () => {
    const { navigation } = this.props;
    if (this.routeType === 'Goods') {
      this.toShare();
    } else {
      navigation.navigate('FreeTradePublish', { params: { title: '选择' } });
    }
  }

  render() {
    const { navigation } = this.props;
    const rightText = this.routeType === 'Goods' ? '分享' : '我要寄售';
    return (
      <View style={{ flex: 1 }}>
        <CustomHeader
          navigation={navigation}
          Right={(
            <TouchableOpacity onPress={this.navRightOnPress} style={styles.rightWrapper}>
              <Text style={{ color: '#FFA700', fontFamily: YaHei }}>{rightText}</Text>
            </TouchableOpacity>
          )}
        />
        <TabView
          style={styles.tabView}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={this.onIndexChange}
          useNativeDriver
          initialLayout={{ width: SCREEN_WIDTH }}
          lazy
        />
        <Modal
          navigation={navigation}
          ref={(v) => { this.modalbox = v; }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACK,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabBar: {
    height: 39,
    flexDirection: 'row',
    paddingTop: 12,
  },
  rightWrapper: {
    paddingRight: 12,
    height: '100%',
    paddingLeft: 40,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: YaHei,
  },
  nav: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MyGoods;
