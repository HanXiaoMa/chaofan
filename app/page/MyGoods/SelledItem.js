import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AvatarWithShadow } from '../../components';
import ListItem from './component/ListItem';

export default class SelledItem extends PureComponent {
  render() {
    const { item } = this.props;
    return (
      <ListItem
        item={item}
        timePrefix="成交时间"
        timeText={item.buy_time}
        price={item.price}
        RightBottom={(
          <View style={styles.bottom}>
            <AvatarWithShadow isCert={item.is_cert} source={{ uri: item.avatar }} size={25} />
            <Text style={styles.name}>{item.user_name}</Text>
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  name: {
    fontSize: 13,
    marginLeft: 6,
    lineHeight: 15.5,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },
});
