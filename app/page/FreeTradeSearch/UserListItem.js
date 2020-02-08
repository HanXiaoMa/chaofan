import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScaleView, AvatarWithShadow, NameAndGender } from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { showToast } from '../../utils/MutualUtil';

export default class UserListItem extends PureComponent {
  onPress = () => {
    const { item, navigation } = this.props;
    if (item.sell_num < 1) {
      showToast('该用户暂无商品出售');
    } else {
      navigation.navigate('FreeTradeBuy', {
        title: '购买',
        params: {
          item,
          goods: {},
        },
      });
    }
  }

  render() {
    const { item } = this.props;
    return (
      <ScaleView style={styles.container} onPress={this.onPress}>
        <AvatarWithShadow isCert={item.is_cert} source={{ uri: item.avatar }} size={wPx2P(55)} />
        <View style={{ marginLeft: 10, paddingTop: 5 }}>
          <NameAndGender name={item.user_name} sex={item.sex} />
        </View>
        <View style={styles.right}>
          <Text style={styles.size}>{`在售: ${item.sell_num}`}</Text>
        </View>
      </ScaleView>
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
  name: {
    fontSize: 15,
  },
  size: {
    fontSize: 11,
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
