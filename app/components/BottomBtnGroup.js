/* eslint-disable react/no-array-index-key */
/* @flow */
import React, { PureComponent } from 'react';
import {
  StyleSheet, View, Platform, TouchableOpacity, Text,
} from 'react-native';
import { PADDING_TAB } from '../common/Constant';
import { wPx2P } from '../utils/ScreenUtil';
import Colors from '../res/Colors';

type Props = {
  btns: Array<{
    onPress: Function,
    backgroundColor?: String,
    disabled: Boolean,
    text: String
  }>,
  customLeft: any,
  customRight: any,
  showShadow?: Boolean
};

export default class BottomBtnGroup extends PureComponent<Props> {
  static defaultProps = {
    showShadow: true,
  }

  render() {
    const {
      btns, customLeft, showShadow, customRight,
    } = this.props;
    const shadow = showShadow ? Platform.select({
      ios: {
        shadowColor: 'rgb(188, 188, 188)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 5,
      },
      android: {
        elevation: 30,
        position: 'relative',
      },
    }) : {};
    return (
      <View style={[styles.container, {
        justifyContent: (btns.length === 2 || customLeft || customRight) ? 'space-between' : 'flex-end',
        ...shadow,
      }]}
      >
        {customLeft}
        {
          btns.map(((v, i) => (
            <TouchableOpacity
              key={v.text + i}
              disabled={v.disabled}
              style={[styles.item, { backgroundColor: v.disabled ? '#C7C7C7' : v.backgroundColor || (i === 0 ? '#FFA700' : Colors.YELLOW) }]}
              onPress={v.onPress}
            >
              <Text style={styles.text}>{v.text}</Text>
            </TouchableOpacity>
          )))
        }
        {typeof customRight === 'function' ? customRight() : customRight}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 66 + PADDING_TAB,
    paddingBottom: PADDING_TAB,
    alignItems: 'center',
    width: SCREEN_WIDTH,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  item: {
    width: wPx2P(168),
    height: 46,
    overflow: 'hidden',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
