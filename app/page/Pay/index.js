import React, { PureComponent } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, AppState,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Image from '../../components/Image';
import { BottomPay } from '../../components';
import Images from '../../res/Images';
import Colors from '../../res/Colors';
import { debounce } from '../../utils/CommonUtils';
import { showToast } from '../../utils/MutualUtil';
import { toPay, getPayStatus } from '../../redux/actions/pay';
import ShopConstant from '../../common/ShopConstant';

const PAY_WAYS = [{
  type: ShopConstant.ALIPAY,
  subImage: Images.pay_zfb,
  name: '支付宝',
  isSelect: false,
  bgColor: Colors.PAY_ZFB_BG,
},
{
  type: ShopConstant.WECHATPAY,
  subImage: Images.pay_wx,
  name: '微信',
  isSelect: false,
  bgColor: Colors.PAY_WX_BG,
}];

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getPayStatus,
  }, dispatch);
}

class Pay extends PureComponent {
  static navigationOptions = () => ({ title: '选择支付方式' });
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.state = {
      choosedIndex: 0,
    };
    this.appState = '';
    this.shopInfo = this.routeParams.shopInfo;
    this.data = this.routeParams.payData;
    this.successCallback = this.routeParams.successCallback;
    this.payType = this.routeParams.payType;
    this.type = this.routeParams.type || {
      PB: 6,
      PD: 7,
      PO: 8,
    }[this.data.order_id.slice(0, 2)];
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (this.appState === 'background' && nextAppState === 'active' && this.outTime) {
      setTimeout(() => {
        if (!this.isCheck && Date.now() - this.outTime > 1500) {
          this.getPayStatus();
        }
      }, 500);
    }
    this.appState = nextAppState;
  }

  changePayStatus = (index) => {
    const { choosedIndex } = this.state;
    this.setState({ choosedIndex: choosedIndex === index ? -1 : index });
  };

  getPayStatus = () => {
    const { getPayStatus, navigation } = this.props;
    getPayStatus(this.type, this.data.order_id, navigation, this.shopInfo, this.payType, this.successCallback);
  }

  pay = async () => {
    const { choosedIndex } = this.state;
    if (choosedIndex < 0) {
      return showToast('请选择付款方式');
    }
    this.outTime = Date.now();
    toPay(this.type, PAY_WAYS[choosedIndex].type, this.data.order_id).then(() => {
      this.isCheck = true;
      this.outTime = null;
      this.getPayStatus();
    });
  };

  render() {
    const { choosedIndex } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.alSel}>请选择付款方式:</Text>
        <View style={{ flex: 1 }}>
          {
            PAY_WAYS.map((item, index) => (
              <TouchableOpacity
                style={[styles.wrapper, { backgroundColor: item.bgColor }]}
                onPress={() => this.changePayStatus(index)}
                key={item.name}
              >
                <View style={{ alignItems: 'center', flexDirection: 'row', paddingVertical: 10 }}>
                  <Image style={styles.payImage} source={item.subImage} />
                  <Text style={styles.payTitle}>{item.name}</Text>
                </View>
                <Image
                  style={styles.paySel}
                  source={choosedIndex === index ? Images.sel : Images.unSel}
                />
              </TouchableOpacity>
            ))
          }
        </View>
        <BottomPay management={this.data.management} price={this.data.price} onPress={debounce(this.pay)} text="立即支付" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE_COLOR,
  },
  alSel: {
    color: '#333',
    marginLeft: 10,
    marginTop: 10,
  },
  payImage: {
    width: 56,
    height: 56,
    marginLeft: 15,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  payTitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,1)',
    marginLeft: 10,
  },
  paySel: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
});

export default connect(null, mapDispatchToProps)(Pay);
