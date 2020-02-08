import React, { PureComponent } from 'react';
import { Text, StyleSheet } from 'react-native';
import { CountdownCom } from '../../components';
import Colors from '../../res/Colors';
import { YaHei } from '../../res/FontFamily';
import ListItem from './component/ListItem';

export default class UncompleteItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      textState: null,
    };
  }

  onPress = (type) => {
    const {
      item, route, refresh, itemAction,
    } = this.props;
    itemAction(type, route, item, refresh);
  }

  finish = () => {
    this.setState({ textState: '付款已超时' });
  }

  render() {
    const { item } = this.props;
    const { textState } = this.state;
    const text = textState || (item.end_time <= Date.now() / 1000 ? '付款已超时' : null);
    const btns = text ? [] : [
      { text: '付款', onPress: () => this.onPress('pay') },
    ];
    return (
      <ListItem
        item={item}
        showSeal
        price={item.order_price}
        btns={btns}
        CountdownCom={text ? null : (
          <CountdownCom
            finish={this.finish}
            style={styles.time}
            time={item.end_time}
            format="待付款 time"
            extraTextStyle={[styles.time, { color: Colors.RED }]}
          />
        )}
        Hint={<Text style={styles.cuoguo}>{text || '请在规定时间内完成支付，错过将失去购买资格'}</Text>}
      />
    );
  }
}

const styles = StyleSheet.create({
  time: {
    fontSize: 11,
    fontFamily: YaHei,
  },
  cuoguo: {
    color: '#858585',
    fontSize: 10,
    letterSpacing: -0.2,
    lineHeight: 12,
  },
});
