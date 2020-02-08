import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AvatarWithShadow, Price, NameAndGender } from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { formatTimeAgo } from '../../utils/CommonUtils';

export default class ListItem extends PureComponent {
  render() {
    const { item } = this.props;
    return (
      <View style={styles.container}>
        <AvatarWithShadow isCert={item.is_cert} source={{ uri: item.avatar }} size={wPx2P(55)} />
        <View style={{ marginLeft: 10, paddingTop: 5 }}>
          <NameAndGender name={item.user_name} sex={item.sex} />
          <Text style={styles.time}>
            交易时间：
            <Text style={{ color: '#696969', fontSize: 11 }}>{formatTimeAgo(item.add_time)}</Text>
          </Text>

        </View>
        <View style={styles.right}>
          <Text style={styles.size}>{`SIZE：${item.size}`}</Text>
          <Price price={item.order_price} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 9,
    marginTop: 7,
    backgroundColor: '#fff',
    borderRadius: 2,
    overflow: 'hidden',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  time: {
    fontSize: 11,
  },
  right: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end',
  },
  size: {
    color: '#696969',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 10,
  },
});
