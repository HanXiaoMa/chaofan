/* eslint-disable react/no-array-index-key */
/* @flow */
import React, { PureComponent } from 'react';
import {
  StyleSheet, View, TouchableOpacity, Text,
} from 'react-native';
import Colors from '../res/Colors';
import { YaHei } from '../res/FontFamily';

type Props = {
  btns: Array<{
    onPress: Function,
    color?: String,
    disabled: Boolean,
    text: String
  }>,
};

export default class BottomBtnGroup extends PureComponent<Props> {
  render() {
    const { btns } = this.props;
    const left = btns[0];
    const right = btns[1] || btns[0];
    if (btns.length === 0) {
      return null;
    }
    const leftDisabled = left.disabled || !left.onPress;
    const rightDisabled = right.disabled || !right.onPress;
    return (
      <View style={styles.container}>
        {
          btns[1] && (
          <TouchableOpacity
            disabled={leftDisabled}
            style={styles.item}
            onPress={left.onPress}
            hitSlop={{
              top: 20, left: 20, right: 10, bottom: 20,
            }}
          >
            <Text style={[styles.text, { color: leftDisabled ? '#BABABA' : (left.color || Colors.RED) }]}>{left.text}</Text>
          </TouchableOpacity>
          )
        }

        <View style={styles.shuxian} />
        <TouchableOpacity
          disabled={rightDisabled}
          style={styles.item}
          onPress={right.onPress}
          hitSlop={{
            top: 20, left: 10, right: 20, bottom: 20,
          }}
        >
          <Text style={[styles.text, { color: rightDisabled ? '#BABABA' : (right.color || Colors.RED) }]}>{right.text}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    fontFamily: YaHei,
  },
  shuxian: {
    height: 14.5,
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#C0C0C0',
    marginHorizontal: 13,
  },
});
