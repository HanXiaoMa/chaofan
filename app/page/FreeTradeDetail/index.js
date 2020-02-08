import React, { PureComponent } from 'react';
import {
  StyleSheet, TouchableOpacity, Text, View,
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import List from './List';
import Colors from '../../res/Colors';
import ListItemDetail from './ListItemDetail';
import {
  STATUSBAR_AND_NAV_HEIGHT, PADDING_TAB,
} from '../../common/Constant';
import Header from './Header';
import Tab from './Tab';
import { Image } from '../../components';
import { toServer, checkAuth } from '../../utils/CommonUtils';
import { YaHei } from '../../res/FontFamily';

export default class FreeTradeDetail extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <TouchableOpacity onPress={() => checkAuth('FreeTradeDetail', {
        routeName: 'ChooseSize',
        params: {
          params: { item: navigation.getParam('params').item },
        },
      })}
      >
        <Text style={{ marginRight: 12, color: '#FFA700', fontFamily: YaHei }}>我要寄售</Text>
      </TouchableOpacity>
    ),
  });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    const routes = [
      { key: 'freeTradeGoodsPrice', title: '询价', index: 0 },
      { key: 'freeTradeGoodsDetail', title: '概述', index: 1 },
      { key: 'freeTradeHistory', title: '交易历史', index: 2 },
    ];
    this.state = {
      routes,
      index: 0,
      loaded: [routes[0].key],
      position: null,
    };
    this.scrollY = routes.map(() => new Animated.Value(0));
  }

  onIndexChange = (index) => {
    const { loaded, routes } = this.state;
    this.setState({ index, loaded: Array.from(new Set([...loaded, routes[index].key])) });
  }

  toHelp = () => {
    toServer();
  }

  scrollListener = (e) => {
    const { routes, index } = this.state;
    if (e[index] <= 200) {
      routes.forEach((v, i) => {
        if (this[v.key] && i !== index) {
          this[v.key].scrollToOffset({ offset: Math.min(e[index], 133), animated: false });
        }
      });
    }
  }

  renderScene = ({ route }) => {
    const { navigation } = this.props;
    const { loaded } = this.state;
    if (route.key === 'freeTradeGoodsDetail') {
      return (
        <ListItemDetail
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollY[route.index] } } }], { useNativeDriver: true })}
          navigation={navigation}
          id={this.routeParams.item.id}
          isLoaded={loaded.includes(route.key)}
          ref={(v) => { this[route.key] = v; }}
        />
      );
    }
    return (
      <List
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollY[route.index] } } }], { useNativeDriver: true })}
        navigation={navigation}
        type={route.key}
        goods={this.routeParams.item}
        isLoaded={loaded.includes(route.key)}
        ref={(v) => { this[route.key] = v; }}
      />
    );
  }

  renderTabBar = (props) => {
    const { index } = this.state;
    const { navigation } = this.props;
    this.setState({ position: props.position });
    return (
      <Header
        item={this.routeParams.item}
        navigation={navigation}
        scrollY={this.scrollY[index]}
      />
    );
  }

  render() {
    const { routes, index, position } = this.state;
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <TabView
          style={styles.tabView}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderTabBar={this.renderTabBar}
          onIndexChange={this.onIndexChange}
          useNativeDriver
          initialLayout={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - STATUSBAR_AND_NAV_HEIGHT }}
        />
        {
          position && (
            <Tab
              onIndexChange={this.onIndexChange}
              routes={routes}
              scrollY={this.scrollY[index]}
              indexScrollPosition={position}
              navigation={navigation}
            />
          )
        }
        <Animated.Code>
          {() => Animated.call(this.scrollY, this.scrollListener)}
        </Animated.Code>
        <Image onPress={this.toHelp} source={require('../../res/image/helpIcon.png')} style={styles.help} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabView: {
    backgroundColor: Colors.MAIN_BACK,
  },
  help: {
    height: 52,
    width: 52,
    position: 'absolute',
    bottom: 18 + PADDING_TAB,
    right: 18,
  },
});
