/* @flow */
import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback, Animated } from 'react-native';

type Props = {
  scale?: number,
  onPress: Function,
  style?: Object,
  children: any,
};

export default class ScaleView extends PureComponent<Props> {
  static defaultProps = {
    scale: 0.95,
    style: {},
  }

  scale: any
  constructor(props: Props) {
    super(props);
    this.scale = new Animated.Value(1);
  }

  scaleBigger = () => {
    Animated.timing(
      this.scale,
      {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      },
    ).start();
  }

  scaleSmaller = () => {
    const { scale } = this.props;
    Animated.timing(
      this.scale,
      {
        toValue: scale,
        duration: 100,
        useNativeDriver: true,
      },
    ).start();
  }

  render() {
    const { onPress, style, children } = this.props;
    return (
      <TouchableWithoutFeedback onPressIn={this.scaleSmaller} onPressOut={this.scaleBigger} onPress={onPress}>
        <Animated.View style={[style, { transform: [{ scale: this.scale }] }]}>
          {children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
