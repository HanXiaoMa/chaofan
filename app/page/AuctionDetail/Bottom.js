import React, { PureComponent } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, View, Platform, TextInput, Alert, Keyboard,
} from 'react-native';
import { PADDING_TAB } from '../../common/Constant';
import { wPx2P } from '../../utils/ScreenUtil';
import { Image, ModalNormal } from '../../components';
import { showModalbox, closeModalbox, showToast } from '../../utils/MutualUtil';
import Images from '../../res/Images';
import { YaHei } from '../../res/FontFamily';
import { request } from '../../http/Axios';
import { checkAuth, formatDate } from '../../utils/CommonUtils';

export default class Bottom extends PureComponent {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      isPay: data.is_pay_deposit == 1,
    };
  }

  onChangeText = (price) => {
    this.setState({ price });
  }

  toPayDeposit = () => {
    const { data, navigation } = this.props;
    request('/auction/join_auction', { params: { id: data.id } }).then((res) => {
      closeModalbox();
      navigation.navigate('Pay', {
        params: {
          payData: res.data,
          successCallback: () => {
            navigation.navigate('AuctionDetail');
            this.setState({ isPay: true });
          },
        },
      });
    });
  }

  toOffer = () => {
    Keyboard.dismiss();
    const { price } = this.state;
    const { data, refresh } = this.props;
    if (!price) {
      showToast('请填写价格');
      return;
    } if (`${price}`.includes('.')) {
      showToast('请填写整数价格');
      return;
    } if (data.buyout_price > 0 && price >= data.buyout_price / 100) {
      showModalbox({
        element: (<ModalNormal
          sure={() => {
            closeModalbox();
            this.toBuy();
          }}
          closeModalbox={closeModalbox}
          text="出价高于一口价，直接购买？"
        />),
      });
      return;
    } if (price <= (data.join_user_list[0]?.price || 0) / 100) {
      showToast('出价必须高于当前最高价，请重新填写');
      return;
    } if (price <= data.min_price / 100) {
      showToast('出价必须高于起拍价，请重新填写');
      return;
    }
    Alert.alert(
      '',
      `确认出价${price}？`,
      [
        { text: '取消', onPress: () => {} },
        {
          text: '确定',
          onPress: () => {
            request('/auction/join_auction', { params: { id: data.id, price } }).then(() => {
              showToast('出价成功');
              refresh();
            });
          },
        },
      ],
    );
  }

  toBuy = () => {
    const { data } = this.props;
    checkAuth('AuctionDetail', {
      routeName: 'AuctionBuyOutOrderDetail',
      params: {
        params: {
          item: data,
          isBuyOut: true,
        },
      },
    });
  }

  toJoin = () => {
    const { data, toHelp } = this.props;
    checkAuth('AuctionDetail').then(() => {
      showModalbox({
        element: (
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>参加拍卖需先支付保证金</Text>
            <View style={styles.priceWrapper}>
              <Text style={{ fontSize: 11, color: '#8F8F8F' }}>保证金：</Text>
              <Text style={[styles.modalTitle, { fontSize: 13, top: 2 }]}>￥</Text>
              <Text style={[styles.modalTitle, { fontSize: 20, top: 4.5 }]}>{data.deposit_buy / 100}</Text>
            </View>
            <Text style={styles.hint}>{`注意：若中拍，请于${formatDate(data.end_time, 'MM月dd日hh:mm')}前往我的-拍卖中心(买家)-待付款中付款，缴纳的保证金将退回到原账户`}</Text>
            <TouchableOpacity onPress={this.toPayDeposit} style={styles.payBtn}>
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: YaHei }}>支付</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toHelp} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../res/image/tanhao.png')} style={{ width: 9, height: 9 }} />
              <Text style={{ color: '#AAAAAA', fontSize: 10 }}>竞拍不成功时，缴纳的保证金将退回到原账户</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => closeModalbox()} style={styles.cha}>
              <Image source={Images.chaNew} style={{ width: 9, height: 9 }} />
            </TouchableOpacity>
          </View>
        ),
        options: {
          style: {
            height: 240,
            width: 265,
            backgroundColor: 'transparent',
          },
        },
      });
    });
  }

  render() {
    const { data } = this.props;
    const { isPay, price } = this.state;
    return (
      <View style={styles.wrapper}>
        {
          isPay && (
            <View style={styles.inputWrapper}>
              <View style={styles.input1}>
                <Text style={styles.qianIcon}>￥</Text>
                { price ? null : <Text style={styles.placeholder}>填写竞拍金额</Text> }
                <TextInput
                  style={styles.input}
                  maxLength={13}
                  keyboardType="number-pad"
                  selectionColor="#00AEFF"
                  placeholder=""
                  placeholderTextColor="rgba(162,162,162,1)"
                  underlineColorAndroid="transparent"
                  clearButtonMode="while-editing"
                  returnKeyType="done"
                  onSubmitEditing={this.toOffer}
                  ref={(v) => { this.valueInput = v; }}
                  onChangeText={this.onChangeText}
                />
              </View>
            </View>
          )
        }
        <View style={{ flexDirection: 'row', justifyContent: data.buyout_price > 0 ? 'space-between' : 'center' }}>
          {
            isPay ? (
              <TouchableOpacity style={[styles.item, { backgroundColor: price || price * 1 < data ? '#FFA700' : '#DEDEDE' }]} onPress={this.toOffer}>
                <Text style={styles.buyout_price}>出价</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.item} onPress={this.toJoin}>
                <Text style={styles.buyout_price}>参与竞拍</Text>
              </TouchableOpacity>
            )
          }
          {
            data.buyout_price > 0 && (
              <TouchableOpacity style={styles.item} onPress={this.toBuy}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.buyout_price}>{`￥${data.buyout_price / 100}`}</Text>
                </View>
                <View style={styles.shuxian} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={styles.buyout_price}>一口价</Text>
                </View>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  priceWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    // width: 205,
  },
  hint: {
    color: '#EF4444',
    fontSize: 12,
    marginHorizontal: 30,
    marginVertical: 10,
    textAlign: 'justify',
  },
  qianIcon: {
    fontSize: 15,
    fontFamily: YaHei,
    bottom: 5,
  },
  input: {
    flex: 1,
    fontSize: 30,
    padding: 0,
    color: '#000',
    fontFamily: YaHei,
  },
  placeholder: {
    color: '#DEDEDE',
    fontSize: 30,
    position: 'absolute',
    fontFamily: YaHei,
    left: 17,
  },
  input1: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomColor: '#C5C5CD',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    height: 52,
    paddingHorizontal: 2,
  },
  wrapper: {
    backgroundColor: '#fff',
    paddingBottom: PADDING_TAB + 10,
    paddingTop: 10,
    paddingHorizontal: 15,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(188, 188, 188)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
      },
      android: {
        elevation: 50,
        position: 'relative',
      },
    }),
  },
  item: {
    width: wPx2P(168),
    height: 46,
    overflow: 'hidden',
    borderRadius: 2,
    alignItems: 'center',
    backgroundColor: '#FFA700',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buyout_price: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  shuxian: {
    height: 33,
    backgroundColor: '#eee',
    width: StyleSheet.hairlineWidth,
  },
  payBtn: {
    backgroundColor: '#FFA700',
    borderRadius: 2,
    overflow: 'hidden',
    alignItems: 'center',
    height: 43,
    justifyContent: 'center',
    width: 205,
    marginTop: 1,
    marginBottom: 10,
  },
  modal: {
    backgroundColor: '#fff',
    flex: 1,
    borderRadius: 2,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 35,
  },
  modalTitle: {
    fontFamily: YaHei,
    fontSize: 15,
  },
  cha: {
    position: 'absolute',
    right: 0,
    height: 35,
    width: 35,
    borderBottomLeftRadius: 2,
    paddingLeft: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
