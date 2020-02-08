/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TabView } from 'react-native-tab-view';
import SplashScreen from 'react-native-splash-screen';
import Colors from '../res/Colors';
import Personal from '../page/Personal';
import Auction from '../page/Auction';
import HomePage from '../page/Home';
import FreeTrade from '../page/FreeTrade';
import Activity from '../page/Notice';
import Tab from './Tab';
import Auth from '../page/Auth/index';
import { fetchListData } from '../redux/actions/listData';
import { getUser, toLogIn } from '../redux/actions/userInfo';
import FreeTradeSearch from '../page/FreeTradeSearch';
import { update } from '../utils/UpdateUtil';
import { fetchOptions } from '../utils/CommonUtils';
import { getUserInfo } from '../redux/reselect/userInfo';
import JPush, { init } from '../utils/JPush';

const getRoutes = isTestVersion => (isTestVersion ? [
  { screen: FreeTrade, key: 'freeTrade', title: '交易' },
  { screen: Auction, key: 'identify', title: '竞拍' },
  { screen: HomePage, key: 'home' },
  { screen: Activity, key: 'message', title: '消息' },
  { screen: Personal, key: 'personal', title: '我的' },
] : [
  { screen: FreeTrade, key: 'freeTrade', title: '交易' },
  { screen: FreeTradeSearch, key: 'search0', title: '搜索' },
  { screen: HomePage, key: 'home' },
  { screen: Activity, key: 'message', title: '消息' },
  { screen: Personal, key: 'personal', title: '我的' },
]);

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchListData,
    getUser,
    toLogIn,
  }, dispatch);
}

class BottomNavigator extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation, userInfo } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    const ROUTES = getRoutes(userInfo.isTestVersion);
    const initIndex = this.routeParams.index === 0 ? 0 : (this.routeParams.index || (userInfo.isTestVersion ? 1 : 2));
    this.state = {
      index: initIndex,
      loaded: [ROUTES[initIndex].key],
      showNotice: true,
      showAuth: !userInfo.user_s_id,
    };
    window.chaofunNavigation = navigation;
    update();
    fetchOptions();
  }

  componentDidMount() {
    const { navigation, getUser } = this.props;
    window.chanfanNavigation = navigation;
    SplashScreen.hide();
    init(this.onIndexChange);
    this.didBlurSubscription = navigation.addListener(
      'willFocus',
      (payload) => {
        if (payload.action.type === 'Navigation/NAVIGATE') {
          const nextIndex = payload?.state?.params?.index;
          typeof nextIndex === 'number' && this.onIndexChange(nextIndex);
        }
      },
    );
    getUser();
  }

  componentWillUnmount() {
    this.didBlurSubscription && this.didBlurSubscription.remove();
  }

  onIndexChange = (index, childIndex) => {
    const {
      fetchListData, getUser, toLogIn, navigation, userInfo,
    } = this.props;
    const { loaded } = this.state;
    const routes = getRoutes(userInfo.isTestVersion);
    if ([3, 4].includes(index) && !userInfo.user_s_id) {
      toLogIn(() => {
        this.setState({ index, loaded: Array.from(new Set([...loaded, routes[index].key])) });
        navigation.navigate('BottomNavigator');
      }, () => {
        navigation.navigate('BottomNavigator');
      });
      return;
    }
    if (index === 3) {
      JPush.setBadge({ badge: 0, appBadge: 0 });
      // fetchListData('activityNotice', { type: 1 }, 'refresh');
      this.setState({ index, showNotice: false, loaded: Array.from(new Set([...loaded, routes[index].key])) });
    } else {
      this.setState({ index, loaded: Array.from(new Set([...loaded, routes[index].key])) });
      setTimeout(() => {
        const ref = this[getRoutes(userInfo.isTestVersion)[index]?.key];
        if (childIndex && ref) {
          ref.onIndexChange(childIndex);
        }
      }, 350);
    }
  }

  closeAuth = () => {
    this.setState({ showAuth: false });
  }

  renderScene = ({ route }) => {
    const { navigation } = this.props;
    const { loaded } = this.state;
    const Screen = route.screen;
    const props = ['home'].includes(route.key) ? {
      ref: (v) => { this[route.key] = v; },
    } : {};
    if (loaded.includes(route.key)) {
      return <Screen {...props} navigation={navigation} onIndexChange={this.onIndexChange} />;
    }
    return null;
  };

  renderTabBar = () => null;

  render() {
    const { index, showNotice, showAuth } = this.state;
    const { navigation, userInfo } = this.props;
    const navigationState = {
      index,
      routes: getRoutes(userInfo.isTestVersion),
    };
    return (
      <View style={styles.container}>
        <TabView
          navigationState={navigationState}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={this.onIndexChange}
          useNativeDriver
          initialLayout={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
          lazy
        />
        <Tab
          routes={navigationState.routes}
          index={index}
          showNotice={showNotice}
          onIndexChange={this.onIndexChange}
        />
        { showAuth && <Auth navigation={navigation} closeAuth={this.closeAuth} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACK,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomNavigator);
