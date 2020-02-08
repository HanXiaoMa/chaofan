import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

export default class Frame extends PureComponent {
  render() {
    const { style, children, containerStyle } = this.props;
    return (
      <View style={[style, { padding: 3 }]}>
        <View style={containerStyle}>
          {children}
        </View>
        <View style={[styles.absolute, styles.dot, { left: 3, top: 3 }]} />
        <View style={[styles.absolute, styles.dot, { right: 3, top: 3 }]} />
        <View style={[styles.absolute, styles.dot, { left: 3, bottom: 3 }]} />
        <View style={[styles.absolute, styles.dot, { right: 3, bottom: 3 }]} />
        <View style={[styles.absolute, styles.barHorizontal, { top: 0 }]} />
        <View style={[styles.absolute, styles.barHorizontal, { bottom: 0 }]} />
        <View style={[styles.absolute, styles.barVertical, { left: 0 }]} />
        <View style={[styles.absolute, styles.barVertical, { right: 0 }]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
    backgroundColor: '#ccc',
  },
  dot: {
    width: 3,
    height: 3,
  },
  barHorizontal: {
    height: 3,
    left: 6,
    right: 6,
  },
  barVertical: {
    width: 3,
    top: 6,
    bottom: 6,
  },
});
