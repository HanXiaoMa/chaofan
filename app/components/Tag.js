import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Tag extends PureComponent {
  render() {
    const { text, backgroundColor, style } = this.props;
    return (
      <View style={[styles.wrapper, style, { backgroundColor: backgroundColor || '#FFA700' }]}>
        <Text style={styles.tagText}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 1,
    borderRadius: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    height: 13,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
  },
});
