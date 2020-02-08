import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Image, Price, ScaleView, AvatarWithShadow,
} from '../../components';
import Images from '../../res/Images';
import { YaHei } from '../../res/FontFamily';
import { wPx2P } from '../../utils/ScreenUtil';
import Colors from '../../res/Colors';
import Styles from '../../res/style';

export default class RestPayItem extends PureComponent {
  changeChoosed = () => {
    const { item, changeChoosed } = this.props;
    changeChoosed(item);
  }

  render() {
    const { item } = this.props;
    const Wrapper = item.pay_status == 1 ? View : ScaleView;
    return (
      <Wrapper style={styles.container} onPress={this.changeChoosed}>
        <View style={styles.left}>
          <View style={{ justifyContent: 'space-between', marginRight: 15 }}>
            <Image source={{ uri: item.icon }} style={styles.shoe} />
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <AvatarWithShadow showShadow={false} isCert={item.is_cert} source={{ uri: item.avatar }} size={27} />
              <Text numberOfLines={1} style={styles.user_name}>
                {item.user_name}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <Text numberOfLines={2} style={Styles.listTitle}>{item.activity_name}</Text>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <Price price={item.order_price} />
                <Text style={styles.size}>{`SIZE：${item.size}`}</Text>
              </View>
              <Text style={styles.order}>{`订单编号：${item.order_id}`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.btn}>
          {
            item.pay_status == 1
              ? <Text style={styles.yizhifu}>已支付</Text>
              : <Image source={item.choosed ? require('../../res/image/choose.png') : Images.unchoose} style={{ width: 19, height: 19 }} />
          }
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 9,
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 7,
  },
  left: {
    paddingLeft: 10,
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 7,
  },
  title: {
    fontSize: 12,
    color: 'rgba(0,0,0,1)',
    fontFamily: YaHei,
    textAlign: 'justify',
  },
  user_name: {
    fontSize: 13, flex: 1, marginBottom: 2, marginLeft: 5,
  },
  btn: {
    width: 41,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#ddd',
    marginLeft: 10,
  },
  shoe: {
    width: wPx2P(113),
    height: wPx2P(65),
    justifyContent: 'center',
    marginBottom: 5,
  },
  size: {
    fontSize: 12,
    fontFamily: YaHei,
  },
  yizhifu: {
    color: Colors.YELLOW,
    fontSize: 11,
  },
  order: {
    color: '#585858',
    fontSize: 9,
    marginTop: 5,
  },
});
