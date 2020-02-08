import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import { TabBar } from '../../components';
import Colors from '../../res/Colors';
import { YaHei } from '../../res/FontFamily';
import List from './List';
import { fetchSimpleData } from '../../redux/actions/simpleData';
import { getSimpleData } from '../../redux/reselect/simpleData';

const AuctionSellerRoutes = [
  { key: 'auctionSellerHistory', title: '拍卖历史' },
  { key: 'auctionSellerWaitPay', title: '待支付' },
  { key: 'auctionSellerWaitSendOut', title: '待发货' },
  { key: 'auctionSellerSendOut', title: '已发货' },
  { key: 'auctionSellerComplete', title: '已完成' },
];
const AuctionBuyerRoutes = [
  { key: 'auctionBuyerHistory', title: '参拍记录' },
  { key: 'auctionBuyerWaitPay', title: '待付款' },
  { key: 'auctionBuyerWaitHave', title: '待收货' },
  { key: 'auctionBuyerComplete', title: '已完成' },
];

function mapStateToProps() {
  return state => ({
    auctionSellerWaitSendOutNum: getSimpleData(state, 'auctionSellerWaitSendOutNum'),
    auctionBuyerWaitPayNum: getSimpleData(state, 'auctionBuyerWaitPayNum'),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData,
  }, dispatch);
}

class AuctionGoods extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    this.routeParams = navigation.getParam('params') || {};
    this.routeType = AuctionSellerRoutes.findIndex(v => v.key === this.routeParams.type) > -1 ? 'seller' : 'buyer';
    return ({
      title: `拍卖中心(${this.routeType === 'seller' ? '卖家' : '买家'})`,
      headerRight: this.routeType === 'seller' ? (
        <TouchableOpacity onPress={() => navigation.navigate('AuctionPublish')}>
          <Text style={{ marginRight: 12, color: '#FFA700', fontFamily: YaHei }}>发起拍卖</Text>
        </TouchableOpacity>
      ) : null,
    });
  } ;

  constructor(props) {
    super(props);
    const { navigation, fetchSimpleData } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.routeType = AuctionSellerRoutes.findIndex(v => v.key === this.routeParams.type) > -1 ? 'seller' : 'buyer';
    const routes = this.routeType === 'seller' ? AuctionSellerRoutes : AuctionBuyerRoutes;
    const index = Math.max(routes.findIndex(v => v.key === this.routeParams.type), 0);
    this.state = {
      routes,
      index,
    };
    if (this.routeType === 'seller') {
      fetchSimpleData('auctionSellerWaitSendOutNum');
    } else {
      fetchSimpleData('auctionBuyerWaitPayNum');
    }
  }

  onIndexChange = (index) => {
    this.setState({ index });
  }

  renderScene = ({ route }) => {
    const { navigation } = this.props;
    return <List navigation={navigation} type={route.key} routeType={this.routeType} />;
  }

  renderTabBar = (props) => {
    const { routes } = this.state;
    const { auctionSellerWaitSendOutNum, auctionBuyerWaitPayNum } = this.props;
    return (
      <TabBar
        style={styles.tabBar}
        routes={routes.map((v) => {
          if (v.key === 'auctionSellerWaitSendOut' && this.routeType === 'seller') {
            return ({ ...v, extra: auctionSellerWaitSendOutNum.data > 0 ? <View style={styles.dot} /> : null });
          } if (v.key === 'auctionBuyerWaitPay' && this.routeType !== 'seller') {
            return ({ ...v, extra: auctionBuyerWaitPayNum.data > 0 ? <View style={styles.dot} /> : null });
          }
          return v;
        })}
        itemMargin={routes.length > 4 ? 20 : 25}
        position={props.position}
        onIndexChange={this.onIndexChange}
      />
    );
  }

  render() {
    return (
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
    paddingLeft: 35,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: YaHei,
  },
  nav: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    height: 5,
    width: 5,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    position: 'absolute',
    right: 5,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AuctionGoods);
