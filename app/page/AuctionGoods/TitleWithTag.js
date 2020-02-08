import React, { PureComponent } from 'react';
import { Text, StyleSheet } from 'react-native';
import { YaHei } from '../../res/FontFamily';

export default class TitleWithTag extends PureComponent {
  render() {
    const { text, type, style } = this.props;
    const color = {
      '-1': '#9B9B9B',
      1: '#9B9B9B',
      2: '#FF7800',
      3: '#2B97D3',
      4: '#9B9B9B',
      5: '#9B9B9B',
    }[type];
    return (
      <Text style={style} numberOfLines={2}>
        <Text style={[styles.tag, { color }]}>
          {
            {
              '-1': '[审核未通过] ',
              1: '[审核中] ',
              2: '[拍卖中] ',
              3: '[已结束] ',
              4: '[已流拍] ',
              5: '[已下架] ',
            }[type]
          }
        </Text>
        {text}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  tag: {
    fontSize: 12,
    fontFamily: YaHei,
  },
});
