import React, { PureComponent } from 'react';
import { Text, StyleSheet } from 'react-native';
import { RuiXian, YaHei } from '../../../res/FontFamily';

export default class TitleWithTag extends PureComponent {
  render() {
    const { text, type } = this.props;
    // 1现货 2预售（已鉴定或从平台购买的）
    return (
      <Text style={styles.shopTitle} numberOfLines={2}>
        <Text style={[styles.tag, { color: type === '1' ? '#FFA700' : '#9FCF00' }]}>
          {type === '1' ? '[现货] ' : '[预售] '}
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
  shopTitle: {
    fontSize: 12,
    fontFamily: RuiXian,
    textAlign: 'justify',
    lineHeight: 14,
  },
});
