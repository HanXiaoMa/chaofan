/* @flow */
import React, { PureComponent } from 'react';
import Animated from 'react-native-reanimated';

type Props = {
  inputRange: Array<number>,
  position: any,
  style?: any,
  outputRangeWidth: Array<number>,
  outputRangeTranslateX: Array<number>,
};

class TabBarIndicator extends PureComponent<Props> {
  static defaultProps = {
    style: {},
  }

  render() {
    const {
      inputRange, position, style, outputRangeWidth, outputRangeTranslateX,
    } = this.props;
    const translateX = inputRange.length > 1 ? Animated.interpolate(position, {
      inputRange,
      outputRange: outputRangeTranslateX,
      extrapolate: 'clamp',
    }) : outputRangeTranslateX[0];
    const width = inputRange.length > 1 ? Animated.interpolate(position, {
      inputRange,
      outputRange: outputRangeWidth,
      extrapolate: 'clamp',
    }) : outputRangeWidth[0];
    return <Animated.View style={[style, { transform: [{ translateX }], width }]} />;
  }
}

module.exports = TabBarIndicator;
