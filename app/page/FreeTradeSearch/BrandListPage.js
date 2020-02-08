import React, { PureComponent } from 'react';
import { FreeTradeList } from '../../components';

export default class BrandListPage extends PureComponent {
  render() {
    const { navigation } = this.props;
    return (
      <FreeTradeList
        style={{ flex: 1 }}
        type="freeTradeSearchBrandList"
        navigation={navigation}
      />
    );
  }
}
