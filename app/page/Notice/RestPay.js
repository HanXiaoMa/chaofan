import React, { Component } from 'react';
import {
  FlatList, View, StyleSheet, Text,
} from 'react-native';
import RestPayItem from './RestPayItem';
import Colors from '../../res/Colors';
import { YaHei } from '../../res/FontFamily';
import { PADDING_TAB } from '../../common/Constant';
import { wPx2P } from '../../utils/ScreenUtil';
import { showToast, showModalbox, closeModalbox } from '../../utils/MutualUtil';
import { ModalNormal, CountdownCom, BottomPay } from '../../components';
import { request } from '../../http/Axios';

class RestPay extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.order = this.routeParams.order || {};
    this.state = {
      list: [],
      end_time: this.order.end_time,
    };
  }

  componentDidMount() {
    request('/notice/notice_info', { params: { id: this.order.id, image_size_times: 0.35 } }).then((res) => {
      this.setState({ list: res.data.info.map(v => ({ ...v, choosed: true })) });
    });
  }

  changeChoosed = (item) => {
    const { list } = this.state;
    this.setState({
      list: list.map((v) => {
        if (v.order_id === item.order_id) {
          return ({ ...v, choosed: !v.choosed });
        }
        return v;
      }),
    });
  }

  onPress = (payItems, totalPrice) => {
    const { list } = this.state;
    if (payItems.length !== list.filter(v => v.pay_status != 1).length) {
      showModalbox({
        element: (<ModalNormal
          sure={() => {
            closeModalbox();
            this.toPay(payItems, totalPrice);
          }}
          closeModalbox={closeModalbox}
          CustomDom={
            (
              <Text style={styles.hintModal}>
                只选中了
                <Text style={styles.num}>{payItems.length}</Text>
                双鞋，其他未选中的鞋将视为放弃购买，放弃购买的鞋，佣金也会直接发放给抢鞋者。
              </Text>
            )
          }
        />),
        options: {
          style: {
            height: 225,
            width: 265,
            borderRadius: 2,
          },
        },
      });
    } else {
      this.toPay(payItems, totalPrice);
    }
  }

  toPay = (payItems, totalPrice) => {
    const { navigation } = this.props;
    const order_id = payItems.map(v => v.order_id).join(',');
    navigation.navigate('Pay', {
      params: {
        type: '1',
        payData: {
          order_id,
          price: totalPrice,
        },
        payType: 'buyActivityGoods',
        shopInfo: {
          goods: {
            goods_name: payItems[0].activity_name,
            image: payItems[0].image,
            icon: payItems[0].icon,
          },
          order_id: payItems[0].order_id,
        },
      },
    });
  }

  listFooterComponent = () => (
    <View>
      <Text style={styles.hint}>付款后的商品寄存在我的库房，如需发货，请到“我的”&gt;&gt;“我的库房”中选择发货地址</Text>
    </View>
  )

  finish = () => {
    showToast('订单支付已超时，自动退出');
    const { navigation } = this.props;
    navigation.pop();
  }

  renderItem = ({ item }) => <RestPayItem changeChoosed={this.changeChoosed} item={item} />

  render() {
    const { list, end_time } = this.state;
    const payItems = list.filter(v => v.choosed && v.pay_status != 1);
    const totalPrice = payItems.reduce((sum, v) => sum + v.order_price * 1, 0);
    return (
      <View style={{ flex: 1, backgroundColor: Colors.MAIN_BACK }}>
        <View style={styles.top}>
          <CountdownCom
            finish={this.finish}
            style={styles.time}
            time={end_time}
            format="待付款 time"
            extraTextStyle={[styles.time, { color: Colors.RED }]}
          />
          <Text style={styles.time}>请在规定时间内完成支付，错过将失去购买资格</Text>
        </View>
        <FlatList
          data={list}
          style={{ marginBottom: 69 }}
          renderItem={this.renderItem}
          ListFooterComponent={this.listFooterComponent}
          keyExtractor={(item, index) => `payItem-${index}`}
        />
        <BottomPay disabled={payItems.length === 0} price={totalPrice} onPress={() => this.onPress(payItems, totalPrice)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  order: {
    color: '#585858',
    fontSize: 9,
  },
  num: {
    color: '#37B6EB',
    fontFamily: YaHei,
  },
  timeWrapper: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 6,
    alignSelf: 'flex-end',
    marginRight: 9,
    alignItems: 'center',
  },
  hintModal: {
    fontFamily: YaHei,
    textAlign: 'center',
    flex: 1,
    marginTop: 20,
  },
  orderWrapper: {
    marginHorizontal: 9,
    paddingHorizontal: 9,
    backgroundColor: '#fff',
    borderRadius: 2,
    overflow: 'hidden',
    paddingVertical: 5,
  },
  time: {
    fontSize: 11,
    color: Colors.RED,
    textAlign: 'right',
  },
  hint: {
    color: '#B6B6B6',
    fontSize: 10,
    marginHorizontal: 9,
    textAlign: 'justify',
    marginTop: 3,
    marginBottom: 10,
    lineHeight: 12,
  },
  zhifu: {
    width: wPx2P(198),
    height: 44,
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    height: 66 + PADDING_TAB,
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: '#fff',
    paddingBottom: PADDING_TAB,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  priceWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  price: {
    fontSize: 16,
    fontFamily: YaHei,
  },
  top: {
    alignItems: 'flex-end',
    paddingVertical: 5,
    paddingRight: 9,
  },
});

export default RestPay;
