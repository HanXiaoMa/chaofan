/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { hitSlop } from '../../common/Constant';
import { AvatarWithShadow } from '../../components';
import { YaHei } from '../../res/FontFamily';
import { getUserInfo } from '../../utils/CommonUtils';

export default class ListHeader extends PureComponent {
  toVendor = () => {
    const { navigation, data } = this.props;
    navigation.navigate('AuctionShop', { params: { userId: data.user_id } });
  }

  render() {
    const { data, toFocus } = this.props;
    return (
      <View style={styles.header}>
        <Text style={{ fontSize: 18 }}>{data.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={this.toVendor} hitSlop={hitSlop} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <AvatarWithShadow size={20} source={{ uri: data.avatar }} />
            <Text style={styles.name}>{data.user_name}</Text>
            {
              getUserInfo().id != data.user_id && (
                <TouchableOpacity onPress={toFocus} style={[styles.btn, { backgroundColor: data.is_attention == 0 ? '#FFA700' : '#D7D7D7' }]}>
                  <Text style={styles.btnText}>
                    {data.is_attention == 0 ? '+ 关注' : '已关注'}
                  </Text>
                </TouchableOpacity>
              )
            }
          </TouchableOpacity>
          {
            data.join_user_list?.[0] ? (
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={styles.priceWrapper}>当前最高价</Text>
                <Text style={{ fontSize: 10 }}>￥</Text>
                <Text style={styles.price}>{data.join_user_list[0].price / 100}</Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={styles.priceWrapper}>起拍价</Text>
                <Text style={{ fontSize: 10 }}>￥</Text>
                <Text style={styles.price}>{data.min_price / 100}</Text>
              </View>
            )
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: '#fff',
    marginTop: 7,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: SCREEN_WIDTH - 18,
  },
  name: {
    fontSize: 11,
    fontFamily: YaHei,
    marginLeft: 5,
  },
  priceWrapper: {
    fontSize: 12,
    marginLeft: 5,
    fontFamily: YaHei,
    top: 0.5,
    color: '#FFA700',
  },
  price: {
    fontSize: 18,
    fontFamily: YaHei,
    top: 3.5,
  },
  btn: {
    height: 18,
    width: 51,
    borderRadius: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
  },
});
