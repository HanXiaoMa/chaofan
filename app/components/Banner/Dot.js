/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

export default class TopCom extends PureComponent {
  render() {
    const {
      list, position: positionProps, style, dotColor, inDotColor,
    } = this.props;
    const inputRange = Array(list.length * 3).fill('').map((v, i) => i);
    const position = Animated.multiply(positionProps, 1 / SCREEN_WIDTH);
    return (
      <View style={style}>
        {
          list.map((v, i) => {
            const scale = Animated.interpolate(position, {
              inputRange,
              outputRange: inputRange.map(v => ((v + 1) % list.length === i ? 1 : 0.66)),
              extrapolate: 'clamp',
            });
            const opacity = Animated.interpolate(position, {
              inputRange,
              outputRange: inputRange.map(v => ((v + 1) % list.length === i ? 1 : 0)),
              extrapolate: 'clamp',
            });
            const inOpacity = Animated.interpolate(position, {
              inputRange,
              outputRange: inputRange.map(v => ((v + 1) % list.length === i ? 0 : 1)),
              extrapolate: 'clamp',
            });
            return (
              <View key={i}>
                <Animated.View style={[styles.item, { transform: [{ scale }], opacity, backgroundColor: dotColor }]} />
                <Animated.View style={[styles.item, { transform: [{ scale }], opacity: inOpacity, backgroundColor: inDotColor }]} />
              </View>
            );
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    height: 5,
    width: 5,
    borderRadius: 2.5,
    position: 'absolute',
  },
});
