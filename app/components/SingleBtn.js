/* @flow */
import React, { PureComponent } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, View, Platform,
} from 'react-native';
import { PADDING_TAB } from '../common/Constant';

export default class SingleBtn extends PureComponent {
  render() {
    const { onPress, text } = this.props;
    return (
      <View style={styles.bottom}>
        <TouchableOpacity onPress={onPress} style={styles.submitWrapper}>
          <Text style={{ color: '#fff', fontSize: 16 }}>{text}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    height: 66 + PADDING_TAB,
    backgroundColor: '#fff',
    paddingBottom: PADDING_TAB,
    flexDirection: 'row',
    justifyContent: 'center',
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
  submitWrapper: {
    width: 203,
    height: 46,
    borderRadius: 2,
    backgroundColor: '#FFA700',
    alignSelf: 'center',
    position: 'absolute',
    bottom: PADDING_TAB + 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
