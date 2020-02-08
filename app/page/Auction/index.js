import React, { PureComponent } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TabView } from 'react-native-tab-view';
import { Image, TabBar } from '../../components';
import { receiveUser, toLogIn } from '../../redux/actions/userInfo';
import { STATUSBAR_HEIGHT } from '../../common/Constant';
import List from './List';
import MyFocusList from './MyFocusList';
import AuctionMyshop from '../AuctionShop/Mine';
import { getUserInfo, checkAuth } from '../../utils/CommonUtils';

const ROUTES = [
  { key: 'auctionIndexList', title: '热门竞拍' },
  { key: 'auctionIndexJoinList', title: '我的参拍' },
  { key: 'auctionCollectList', title: '我的收藏' },
  { key: 'auctionMyshop', title: '我的店铺' },
  { key: 'auctionMyFocus', title: '我的关注' },
];

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    receiveUser, toLogIn,
  }, dispatch);
}

class Auction extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: ROUTES,
      loaded: [ROUTES[0].key],
    };
    this.itemMargin = (SCREEN_WIDTH - 20 - 14 * ROUTES.reduce((sum, v) => sum + v.title.length, 0)) / Math.max(1, ROUTES.length - 1);
  }

  onIndexChange = (index) => {
    const { loaded } = this.state;
    if (index !== 0) {
      this.setState({ index }, () => {
        checkAuth('BottomNavigator').then(() => {
          this.setState({ loaded: Array.from(new Set([...loaded, ROUTES[index].key])) });
        });
      });
    } else {
      this.setState({ index, loaded: Array.from(new Set([...loaded, ROUTES[index].key])) });
    }
  }

  fetchData = () => {
    const { filterType, text } = this.state;
    if (filterType === 'goods') {
      this.freeTradeList && this.freeTradeList.fetchData(null, { goods_name: text });
    } else if (filterType === 'user') {
      this.userList && this.userList.fetchData(null, { user_name: text });
    }
  }

  toSearch = () => {
    const { navigation } = this.props;
    navigation.navigate('AuctionSearch');
  }

  toLogIn = (key) => {
    const { navigation, toLogIn } = this.props;
    const { loaded } = this.state;
    toLogIn(() => {
      this.setState({ loaded: Array.from(new Set([...loaded, key])) });
      navigation.navigate('BottomNavigator');
    }, () => {
      navigation.navigate('BottomNavigator');
    });
  }

  renderScene = ({ route }) => {
    const { navigation, onIndexChange } = this.props;
    const { loaded } = this.state;
    const Wrapper = {
      auctionMyFocus: MyFocusList,
      auctionMyshop: AuctionMyshop,
    }[route.key] || List;
    if (loaded.includes(route.key)) {
      return (
        <Wrapper
          navigation={navigation}
          userId={getUserInfo().id}
          type={route.key}
          propOnIndexChange={onIndexChange}
          onIndexChange={this.onIndexChange}
          paddingTop={0}
        />
      );
    } if (!getUserInfo().user_s_id) {
      return (
        <TouchableOpacity style={styles.btn} onPress={() => this.toLogIn(route.key)}>
          <Text style={{ fontSize: 18, color: '#fff' }}>去登陆</Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  renderTabBar = (props) => {
    const { routes } = this.state;
    return (
      <TabBar
        style={styles.tabBar}
        routes={routes}
        position={props.position}
        itemMargin={this.itemMargin}
        sideMargin={10}
        onIndexChange={this.onIndexChange}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 16 + STATUSBAR_HEIGHT }}>
        <TouchableOpacity style={styles.header} onPress={this.toSearch}>
          <View style={styles.inputWrapper}>
            <Image source={require('../../res/image/search-auction.png')} style={{ height: 16, width: 16 }} />
            <View style={styles.input}>
              <Text style={{ fontSize: 14, color: '#999' }}>搜索</Text>
            </View>
          </View>
        </TouchableOpacity>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 2,
    paddingLeft: 5,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flex: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    justifyContent: 'center',
  },
  tabBar: {
    height: 47,
    flexDirection: 'row',
    paddingTop: 14,
  },
  btn: {
    height: 47,
    width: 202,
    position: 'absolute',
    bottom: '30%',
    backgroundColor: '#FEA702',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default connect(null, mapDispatchToProps)(Auction);
