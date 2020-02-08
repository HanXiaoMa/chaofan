/* eslint-disable import/no-unresolved */
import React from 'react';
import { createAppContainer } from 'react-navigation';
import {
  Platform, Animated, Easing, TouchableOpacity, StyleSheet,
} from 'react-native';
import { createStackNavigator, StackViewStyleInterpolator } from 'react-navigation-stack';
import BottomNavigator from './BottomNavigator';
import {
  NAV_HEIGHT, STATUSBAR_AND_NAV_HEIGHT, STATUSBAR_HEIGHT, IS_IPHONE_X,
} from '../common/Constant';
import Image from '../components/Image';
import Colors from '../res/Colors';
import { YaHei } from '../res/FontFamily';
import Images from '../res/Images';
import Web from '../page/Web';

import Auth from '../page/Auth';
import NameAge from '../page/Auth/NameAge';
import GenderSize from '../page/Auth/GenderSize';
import PhoneNum from '../page/Auth/PhoneNum';

import ShopDetail from '../page/ShopDetail';
import Pay from '../page/Pay';
import PaySuccess from '../page/Pay/PaySuccess';
import Commission from '../page/Commission';
import Panicstatus from '../page/Panicstatus';

import AddressEdit from '../page/Address/AddressEdit';
import ChooseAddress from '../page/Address/ChooseAddress';

import Setting from '../page/Personal/Setting';
import Safesetting from '../page/Personal/Safesetting';
import Message from '../page/Notice/Message';
import BalanceExtract from '../page/Personal/BalanceExtract';
import BalanceDetail from '../page/Personal/BalanceDetail';
import Password from '../page/Password';
import MyGoods from '../page/MyGoods';
import PickUp from '../page/PickUp';
import RestPay from '../page/Notice/RestPay';

import FreeTradeDetail from '../page/FreeTradeDetail';
import FreeTradePublish from '../page/FreeTradePublish';
import ChooseSize from '../page/FreeTradePublish/ChooseSize';
import FreeTradeBuy from '../page/FreeTradeBuy';
import PutOnSale from '../page/FreeTradePublish/PutOnSale';
import ImagePage from '../page/ImagePage';
import FreeTradeSearch from '../page/FreeTradeSearch';
import BrandListPage from '../page/FreeTradeSearch/BrandListPage';
import PayDetail from '../page/Pay/PayDetail';

import AuctionPublish from '../page/AuctionPublish';
import AuctionGoods from '../page/AuctionGoods';
import AuctionInputOrder from '../page/AuctionInputOrder';
import AuctionShop from '../page/AuctionShop';
import AuctionDetail from '../page/AuctionDetail';
import AuctionOrderDetail from '../page/AuctionOrderDetail';
import AuctionCategory from '../page/AuctionCategory';
import AuctionSearch from '../page/AuctionSearch';
import AuctionBuyOutOrderDetail from '../page/AuctionBuyOutOrderDetail';
import AuctionGoodShops from '../page/AuctionGoodShops';
import AuctionHot from '../page/AuctionHot';

import Express from '../page/Express';

const styles = {
  btnWrapper: {
    height: NAV_HEIGHT,
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 40,
  },
  headerStyle: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#fff',
    borderBottomColor: '#fff',
    ...Platform.select({
      android: {
        height: STATUSBAR_AND_NAV_HEIGHT,
        paddingTop: STATUSBAR_HEIGHT,
        elevation: 0,
      },
      ios: {
        marginTop: IS_IPHONE_X ? -4 : 0,
        height: NAV_HEIGHT,
      },
    }),
  },
  headerTitleStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#010101',
    fontSize: 16,
    fontFamily: YaHei,
  },
};

const defaultNavigationOptions = ({ navigation }) => ({
  headerStyle: styles.headerStyle,
  headerTintColor: Colors.WHITE_COLOR,
  headerTitleStyle: styles.headerTitleStyle,
  headerBackTitle: null,
  headerTitleContainerStyle: { left: 56, right: 56 },
  headerLeft: (
    <TouchableOpacity
      style={styles.btnWrapper}
      onPress={() => {
        const customBack = navigation.getParam('customBack');
        customBack ? customBack() : navigation.pop();
      }}
    >
      <Image style={{ height: 18, width: 11 }} source={Images.back} />
    </TouchableOpacity>
  ),
  headerRight: navigation.getParam('headerRight'),
  title: navigation.getParam('title'),
});

const transition = {
  ...Platform.select({
    android: {
      transitionConfig: () => ({
        transitionSpec: {
          duration: 500,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing,
        },
        screenInterpolator: StackViewStyleInterpolator.forHorizontal,
      }),
    },
  }),
};

const navigationOptionsWithBorderBottom = { navigationOptions: { headerStyle: { ...styles.headerStyle, borderBottomColor: '#ddd' } } };

const routesWithHeader = {
  Pay,
  Message,
  AddressEdit,
  Web: { ...navigationOptionsWithBorderBottom, screen: Web },
  Safesetting: { ...navigationOptionsWithBorderBottom, screen: Safesetting },
  BalanceDetail: { ...navigationOptionsWithBorderBottom, screen: BalanceDetail },
  ShopDetail: { ...navigationOptionsWithBorderBottom, screen: ShopDetail },
  Setting: { ...navigationOptionsWithBorderBottom, screen: Setting },
  PickUp: { ...navigationOptionsWithBorderBottom, screen: PickUp },
  ChooseAddress: { ...navigationOptionsWithBorderBottom, screen: ChooseAddress },
  ImagePage: { ...navigationOptionsWithBorderBottom, screen: ImagePage },
  Panicstatus: { ...navigationOptionsWithBorderBottom, screen: Panicstatus },
  Commission: { ...navigationOptionsWithBorderBottom, screen: Commission },
  BalanceExtract,
  Password,
  RestPay,
  FreeTradeDetail,
  FreeTradePublish,
  ChooseSize: { screen: ChooseSize, navigationOptions: { headerTitle: '选择鞋码' } },
  FreeTradeBuy: { path: 'app/freetradebuy/:userId/:freeId', screen: FreeTradeBuy },
  PayDetail,
  PutOnSale,
  BrandListPage,
  FreeTradeSearch,
  NameAge: { screen: NameAge, navigationOptions: { headerTitle: '个人信息' } },
  GenderSize: { screen: GenderSize, navigationOptions: { headerTitle: '个人信息' } },
  PhoneNum: { screen: PhoneNum, navigationOptions: { headerTitle: '个人信息' } },
  AuctionPublish: { ...navigationOptionsWithBorderBottom, screen: AuctionPublish },
  AuctionGoods,
  AuctionInputOrder: { ...navigationOptionsWithBorderBottom, screen: AuctionInputOrder },
  AuctionOrderDetail: { ...navigationOptionsWithBorderBottom, screen: AuctionOrderDetail },
  AuctionShop: { path: 'app/auctionvendor/:userId', screen: AuctionShop },
  AuctionCategory: { ...navigationOptionsWithBorderBottom, screen: AuctionCategory },
  AuctionBuyOutOrderDetail,
  Express,
  AuctionGoodShops,
  AuctionHot,
  MyGoods: { screen: MyGoods, navigationOptions: { header: null } },
  BottomNavigator: { screen: BottomNavigator, navigationOptions: { header: null } },
  PaySuccess: { screen: PaySuccess, navigationOptions: { header: null, gesturesEnabled: false } },
  Auth: { screen: Auth, navigationOptions: { header: null, gesturesEnabled: false } },
  AuctionDetail: { path: 'app/auctiondetail/:auctionId', screen: AuctionDetail, navigationOptions: { header: null } },
  AuctionSearch: { screen: AuctionSearch, navigationOptions: { header: null } },
};

const MainStack = createStackNavigator(routesWithHeader, {
  initialRouteName: 'BottomNavigator', defaultNavigationOptions, ...transition,
});

const Router = createAppContainer(MainStack);

export { Router };
