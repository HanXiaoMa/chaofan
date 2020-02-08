import React, { PureComponent } from 'react';
import {
  StyleSheet, Text, TextInput, View, ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { BottomPay, Image } from '../../components';
import { PADDING_TAB } from '../../common/Constant';
import { Normal, YaHei, BrowalliaNew } from '../../res/FontFamily';
import { getSimpleData } from '../../redux/reselect/simpleData';
import ShopConstant from '../../common/ShopConstant';
import { wPx2P } from '../../utils/ScreenUtil';
import { showToast } from '../../utils/MutualUtil';
import { getAppOptions } from '../../utils/CommonUtils';
import { request } from '../../http/Axios';

const getPayMes = (activity_id, u_a_id) => {
  const params = {
    activity_id,
    u_a_id,
  };
  return request('/activity/pay_activity', { params });
};

const setCommission = (activity_id, u_a_id, commission) => {
  const params = {
    activity_id,
    u_a_id,
    commission,
  };
  return request('/activity/set_commission', { params });
};

function mapStateToProps() {
  return state => ({
    activityInfo: getSimpleData(state, 'activityInfo'),
  });
}

class Commission extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      totalPrice: 0,
      number: 0,
      commission: 0, // 服务器返回的已设置的单双佣金
      inputCommission: 0, // 输入的单双佣金
    };
  }

  componentDidMount() {
    const { activityInfo: { data } } = this.props;
    getPayMes(data.activity.id, data.user_activity.id).then((res) => {
      if (res.data) {
        const number = res.data.number;
        const commission = res.data.commission / 100;
        this.setState({ number, commission, totalPrice: number * commission });
      }
    });
  }

  _toPay = () => {
    const { inputCommission, commission } = this.state;
    const { activityInfo: { data: shopInfo }, navigation } = this.props;
    const min = getAppOptions().min_commission / 100;
    if (inputCommission < min && commission < min) {
      return showToast(`单人佣金不能低于${min}元`);
    }
    const acId = shopInfo.user_activity.id;
    setCommission(shopInfo.activity.id, acId, inputCommission).then((res) => {
      navigation.navigate('Pay', {
        params: {
          type: ShopConstant.PAY_COMMISSION,
          payData: res.data,
          shopInfo,
          payType: 'commission',
        },
      });
    });
  };

  onChange = (event) => {
    const { number } = this.state;
    const singlePrice = event.nativeEvent.text;
    this.setState({ inputCommission: singlePrice, totalPrice: singlePrice * number });
  };

  render() {
    const { commission, totalPrice, number } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.countTitle}>
            合计数量 :
            <Text style={styles.count}>{` ${number} `}</Text>
            双
          </Text>
          <TextInput
            maxLength={13}
            editable={commission == 0}
            keyboardType="numeric"
            selectionColor="#00AEFF"
            placeholder={commission != 0 ? commission.toString() : '填写佣金...'}
            placeholderTextColor="rgba(162,162,162,1)"
            underlineColorAndroid="transparent"
            style={styles.pricePh}
            clearButtonMode="while-editing"
            returnKeyType="next"
            onSubmitEditing={this._toPay}
            ref={(v) => { this.valueInput = v; }}
            onChange={this.onChange}
          />
          <Text style={styles.tip}>{commission != 0 ? `已填写单双佣金${commission}` : '请填写单双佣金'}</Text>
          <Image style={{ height: wPx2P(647.5), width: wPx2P(375), marginVertical: 25 }} source={require('../../res/image/zhugongrule.png')} />
        </ScrollView>
        <BottomPay disabled={totalPrice * 1 <= 0} price={totalPrice * 100} onPress={this._toPay} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  countTitle: {
    fontSize: 11,
    color: '#A4A4A4',
    marginLeft: 22,
    marginTop: 25,
  },
  count: {
    fontSize: 11,
    fontFamily: YaHei,
    fontWeight: 'bold',
    color: '#37B6EB',
  },
  payTitle: {
    fontSize: 13,
    color: 'rgba(0,0,0,1)',
    marginLeft: 10,
  },
  inputBg: {
    width: 259,
    height: 60,
  },
  pricePh: {
    fontSize: 20,
    fontFamily: BrowalliaNew,
    marginHorizontal: 22,
    borderBottomColor: '#C5C5CD',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
    marginBottom: 6,
    includeFontPadding: false,
    padding: 0,
    color: '#000',
  },
  tip: {
    fontSize: 10,
    color: '#8F8F8F',
    textAlign: 'right',
    marginRight: 22,
  },
  bottomView: {
    width: SCREEN_WIDTH,
    height: 61 + PADDING_TAB,
    paddingBottom: PADDING_TAB,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(215, 215, 215, 1)',
  },
  bottomLeftView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonOnlyOneChildView: {
    width: 178,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  price: {
    fontSize: 29,
    fontFamily: YaHei,
    fontWeight: '400',
    color: 'rgba(0,0,0,1)',
    marginLeft: 10,
  },
  bottomRightView: {
    width: 178,
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    marginRight: 7,
    marginLeft: 23,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: Normal,
    color: 'rgba(255,255,255,1)',
  },
});

export default connect(mapStateToProps)(Commission);
