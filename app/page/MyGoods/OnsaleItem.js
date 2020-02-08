import React, { PureComponent } from 'react';
import ListItem from './component/ListItem';

export default class OnsaleItem extends PureComponent {
  onPress = (type) => {
    const {
      item, route, refresh, itemAction,
    } = this.props;
    itemAction(type, route, item, refresh);
  }

  render() {
    const { item } = this.props;
    const btns = item.goods_status === '6' ? [] : [
      { text: '改价', color: '#000', onPress: () => this.onPress('edit') },
      { text: '下架', color: '#A2A2A2', onPress: () => this.onPress('cancel') },
    ];
    return (
      <ListItem
        item={item}
        btns={btns}
        price={item.price}
        showSeal={item.goods_status === '6'}
        timePrefix="预计入库"
        timeText={item.is_stock === '2' ? item.storage_time : null}
      />
    );
  }
}
