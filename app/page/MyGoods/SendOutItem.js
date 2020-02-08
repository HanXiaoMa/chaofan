import React, { PureComponent } from 'react';
import { Text, Clipboard, StyleSheet } from 'react-native';
import { showToast } from '../../utils/MutualUtil';
import ListItem from './component/ListItem';

export default class SendOutItem extends PureComponent {
  copy = () => {
    const { item } = this.props;
    Clipboard.setString(item.yundanhao);
    showToast('运单号已复制');
  }

  render() {
    const { item } = this.props;
    return (
      <ListItem
        item={item}
        timePrefix="出库时间"
        timeText={item.out_stock_time}
        price={item.buy_price}
        priceTag="买入价"
        RightBottom={item.express_id
          ? <Text onPress={this.copy} style={[styles.yundanhao, { textDecorationLine: 'underline' }]}>{`运单号：${item.express_id}`}</Text>
          : <Text style={[styles.yundanhao, { color: '#858585' }]}>等待寄出</Text>}
      />
    );
  }
}

const styles = StyleSheet.create({
  yundanhao: {
    color: '#0A8CCF',
    fontSize: 10,
    textAlign: 'right',
  },
});
