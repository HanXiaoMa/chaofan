/* @flow */
import React, { PureComponent } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, View, Platform,
} from 'react-native';
import { connect } from 'react-redux';
import Colors from '../res/Colors';
import { YaHei } from '../res/FontFamily';
import { PADDING_TAB } from '../common/Constant';
import { wPx2P } from '../utils/ScreenUtil';
import { getSimpleData } from '../redux/reselect/simpleData';

function mapStateToProps() {
  return state => ({
    appOptions: getSimpleData(state, 'appOptions'),
  });
}

type Props = {
  onPress: Function,
  price: number,
  disabled: Boolean,
  text?: String,
  management?: number | null,
  needManagementNum?: number
};

class BottomPay extends PureComponent<Props> {
  static defaultProps = {
    text: '确认支付',
    management: null,
    needManagementNum: 0,
  }

  onPress = () => {
    const { onPress, price } = this.props;
    onPress(price);
  }

  render() {
    const {
      price, disabled, text, management, needManagementNum, appOptions,
    } = this.props;
    const extra = management || appOptions?.data?.management * needManagementNum || 0;
    return (
      <View style={styles.bottom}>
        <View style={styles.priceWrapper}>
          <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
            <Text style={styles.price}>合计：</Text>
            <Text style={[styles.price, { color: Colors.YELLOW }]}>
              {(Math.ceil(price) / 100 + extra / 100).toFixed(2)}
            </Text>
            <Text style={styles.price}>￥</Text>
          </View>
          {
            (management || needManagementNum > 0) && (
              <Text style={{ fontSize: 11, color: '#333' }}>
                {`(含库管费${extra / 100})`}
              </Text>
            )
          }
        </View>
        <TouchableOpacity
          disabled={disabled}
          style={[styles.zhifu, { backgroundColor: disabled ? '#e2e2e2' : Colors.YELLOW }]}
          onPress={this.onPress}
        >
          <Text style={styles.queren}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    backgroundColor: '#fff',
    paddingBottom: PADDING_TAB,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
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
  priceWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontFamily: YaHei,
  },
  queren: {
    color: '#fff',
    fontSize: 16,
    fontFamily: YaHei,
  },
});
export default connect(mapStateToProps)(BottomPay);
