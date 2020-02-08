/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PADDING_TAB } from '../../common/Constant';
import { Image, KeyboardScrollView } from '../../components';
import {
  delAddress, editAddress, setChoosedAddress,
} from '../../redux/actions/address';
import { getSimpleData } from '../../redux/reselect/simpleData';
import { copy } from '../../utils/CommonUtils';
import Images from '../../res/Images';
import { getAddress } from '../../redux/reselect/address';
import { request } from '../../http/Axios';
import { showToast } from '../../utils/MutualUtil';
import { fetchSimpleData } from '../../redux/actions/simpleData';

function mapStateToProps() {
  return state => ({
    simpleData: getSimpleData(state, 'appOptions'),
    address: getAddress(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    delAddress, editAddress, setChoosedAddress, fetchSimpleData,
  }, dispatch);
}

class AuctionInputOrder extends PureComponent {
  static navigationOptions = () => ({ title: '发货' });
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.state = {
      inputs: [''],
    };
    this.textInputs = [];
  }

  onChangeText = (text, index) => {
    const { inputs } = this.state;
    this.setState({
      inputs: inputs.map((v, i) => (i === index ? text : v)),
    });
  }

  toAdd = () => {
    const { inputs } = this.state;
    this.setState({ inputs: [...inputs, ''] });
  }

  toDelete = (index) => {
    const { inputs } = this.state;
    this.setState({ inputs: inputs.filter((v, i) => i !== index) });
  }

  toChoose = () => {
    const { navigation } = this.props;
    navigation.navigate('ChooseAddress', {
      title: '选择地址',
      params: {
        onPress: () => navigation.pop(),
      },
    });
  }

  submit = () => {
    const { inputs } = this.state;
    const { address: { current }, navigation, fetchSimpleData } = this.props;
    if (!current) {
      showToast('请先填写寄回地址');
    } else {
      request('/auction/add_mailno', {
        params: {
          order_id: this.routeParams.item.order_id,
          mailnos: inputs.join(','),
          back_link_address: current.address,
          back_link_name: current.link_name,
          back_link_mobile: current.mobile,
        },
      }).then(() => {
        fetchSimpleData('auctionSellerWaitSendOutNum');
        this.routeParams.successCallback && this.routeParams.successCallback();
        navigation.navigate('AuctionGoods', { params: { type: 'auctionSellerSendOut' } });
      });
    }
  }

  render() {
    const { address } = this.props;
    const { inputs } = this.state;
    const defaultAddress = address.current;
    return (
      <View style={{ flex: 1 }}>
        <KeyboardScrollView
          contentContainerStyle={styles.scrollView}
          style={styles.container}
          showsVerticalScrollIndicator={false}
          getInputRefs={() => this.textInputs}
        >
          <TouchableOpacity style={styles.shouhuoren} onPress={this.toChoose}>
            <Text style={{ fontSize: 13, marginBottom: 10 }}>寄回地址</Text>
            <View style={styles.jihuiBtn}>
              {
                defaultAddress ? (
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: '#212121', fontSize: 12 }}>{defaultAddress.link_name}</Text>
                      <Text style={{ color: '#212121', fontSize: 12 }}>{defaultAddress.mobile}</Text>
                    </View>
                    <Text numberOfLines={2} style={{ color: '#858585', fontSize: 11, marginTop: 2 }}>{defaultAddress.address}</Text>
                  </View>
                ) : <Text style={{ color: '#999', fontSize: 12, flex: 1 }}>新增地址</Text>
              }
              <Image source={Images.iconRight} style={{ height: 9, width: 6 }} />
            </View>
          </TouchableOpacity>
          <View style={[styles.shouhuoren, { paddingBottom: 0 }]}>
            <Text style={{ fontSize: 12, color: '#A4A4A4' }}>
            物流公司 :
              <Text style={{ fontSize: 12, color: '#000' }}>顺丰快递</Text>
            </Text>
            {
              inputs.map((v, i) => (
                <View key={i} style={styles.inputWrapper}>
                  <TextInput
                    ref={(ref) => { this.textInputs[i] = ref; }}
                    placeholderTextColor="#DEDEDE"
                    underlineColorAndroid="transparent"
                    style={styles.input}
                    selectionColor="#00AEFF"
                    clearButtonMode="while-editing"
                    placeholder="填写运单号"
                    onChangeText={text => this.onChangeText(text, i)}
                  />
                  <Image onPress={() => this.toDelete(i)} source={Images.chaNew} style={{ height: 10, width: 10 }} />
                </View>
              ))
            }

            <TouchableOpacity style={styles.addWrapper} onPress={this.toAdd}>
              <View style={styles.addIcon}>
                <Text style={styles.plus}>+</Text>
              </View>
              <Text style={{ color: '#8E8D8D' }}>增加运单号</Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity style={styles.shouhuoren} onPress={() => copy('address')}>
            <Text style={{ fontSize: 13, marginBottom: 10 }}>平台收货地址</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#212121', fontSize: 13 }}>{`收货人：${simpleData.data?.link_name}`}</Text>
              <Text style={{ color: '#212121', fontSize: 13 }}>{simpleData.data?.mobile}</Text>
            </View>
            <Text style={{ color: '#858585', fontSize: 12, marginTop: 2 }}>{simpleData.data?.address}</Text>
          </TouchableOpacity> */}
        </KeyboardScrollView>
        <TouchableOpacity onPress={this.submit} style={styles.submitWrapper}>
          <Text style={{ color: '#fff', fontSize: 16 }}>发货</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  submitWrapper: {
    width: 203,
    height: 46,
    borderRadius: 2,
    backgroundColor: '#FFA700',
    alignSelf: 'center',
    position: 'absolute',
    bottom: PADDING_TAB + 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    flex: 1,
    height: '100%',
    marginRight: 10,
    padding: 0,
    color: '#000',
  },
  scrollView: {
    paddingBottom: PADDING_TAB + 100,
  },
  jihuiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: 5,
  },
  shouhuoren: {
    padding: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 5,
  },
  addIcon: {
    backgroundColor: '#BCBCBC',
    width: 13,
    height: 13,
    borderRadius: 6.5,
    overflow: 'hidden',
    alignItems: 'center',
    marginRight: 5,
  },
  plus: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 13.5,
    fontWeight: 'bold',
  },
  addWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    flexDirection: 'row',
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 30,
    marginTop: 20,
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AuctionInputOrder);
