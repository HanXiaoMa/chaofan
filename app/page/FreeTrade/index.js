import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { NavigationBarCom, FreeTradeList } from '../../components';
import { STATUSBAR_AND_NAV_HEIGHT } from '../../common/Constant';

export default class FreeTrade extends PureComponent {
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <FreeTradeList
          style={{ marginTop: STATUSBAR_AND_NAV_HEIGHT }}
          type="freeTradeIndex"
          navigation={navigation}
        />
        <NavigationBarCom navigation={navigation} title="交易市集" />
      </View>
    );
  }
}
