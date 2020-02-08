import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { YaHei } from '../res/FontFamily';
import { updateUser } from '../redux/actions/userInfo';
import { getUserInfo } from '../redux/reselect/userInfo';
import { getAddress } from '../redux/reselect/address';
import { getSimpleData } from '../redux/reselect/simpleData';

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
    simpleData: getSimpleData(state, 'appOptions'),
    address: getAddress(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUser,
  }, dispatch);
}

class Address extends PureComponent {
  static defaultProps = {
    showBottom: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      isChoose: false,
    };
  }

  changeAddress = () => {
    const { navigation, backRoute } = this.props;
    navigation.navigate('ChooseAddress', {
      title: '选择收货地址',
      params: {
        onPress: () => {
          navigation.navigate(backRoute);
          this.setState({ isChoose: true });
        },
      },
    });
  }

  toAdd = () => {
    const { navigation } = this.props;
    navigation.navigate('AddressEdit', {
      title: '添加收货地址',
      params: {
        address: {
          is_default: true,
        },
      },
    });
  }

  render() {
    const { address: { current: address = {} } } = this.props;
    const { isChoose } = this.state;
    if (address.link_name) {
      return (
        <TouchableOpacity onPress={this.changeAddress} style={{ flex: 1 }}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={styles.shouhuoren}>{`收货人：${address.link_name}`}</Text>
            <Text style={styles.shouhuoren}>{address.mobile}</Text>
          </View>
          <Text style={styles.address}>{address.address}</Text>
          <View style={styles.bottom}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.yuandian}>
                <View style={styles.yuandian1} />
              </View>
              <Text style={{ fontSize: 12, color: '#212121' }}>{isChoose ? '已选' : '默认' }</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.addWrapper} onPress={this.toAdd}>
        <View style={styles.addIcon}>
          <Text style={styles.plus}>+</Text>
        </View>
        <Text style={styles.add}>添加收货地址</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  shouhuoren: {
    fontFamily: YaHei,
    color: '#212121',
    fontSize: 13,
  },
  address: {
    fontSize: 12,
    marginTop: 2,
    color: '#858585',
  },
  yuandian: {
    height: 12,
    width: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    marginRight: 5,
    borderColor: '#0097C2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yuandian1: {
    backgroundColor: '#0097C2',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    width: 4,
  },
  addWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 85,
    overflow: 'hidden',
    marginTop: 7,
    flexDirection: 'row',
    flex: 1,
  },
  add: {
    color: '#8E8D8D',
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
    fontSize: 12,
    color: '#fff',
    lineHeight: 13.5,
    fontWeight: 'bold',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Address);
