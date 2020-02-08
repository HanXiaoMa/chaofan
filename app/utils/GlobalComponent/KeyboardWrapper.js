import React, { PureComponent } from 'react';
import { Animated } from 'react-native';

const minScrollY = 15;

export default class KeyboardWrapper extends PureComponent {
  constructor(props) {
    super(props);
    const { keyboardHeight, absoluteBottom } = this.props;
    if (keyboardHeight < absoluteBottom - minScrollY) {
      this.translateY = new Animated.Value(-minScrollY);
    } else {
      this.translateY = new Animated.Value(absoluteBottom - keyboardHeight - minScrollY);
    }
  }

  onKeyboardShow = (duration = 0, keyboardHeight, absoluteBottom) => {
    let toValue = 0;
    if (keyboardHeight < absoluteBottom - minScrollY) {
      return;
    } if (keyboardHeight < absoluteBottom) {
      toValue = -minScrollY;
    } else {
      toValue = absoluteBottom - keyboardHeight - minScrollY - absoluteBottom * 30 / keyboardHeight;
    }
    Animated.timing(
      this.translateY,
      {
        toValue,
        duration,
        useNativeDriver: true,
      },
    ).start();
  }

  onKeyboardHide = (duration = 0) => {
    Animated.timing(
      this.translateY,
      {
        toValue: 0,
        duration,
        useNativeDriver: true,
      },
    ).start();
  }

  render() {
    const { children } = this.props;
    return (
      <Animated.View style={{ transform: [{ translateY: this.translateY }] }}>
        {children}
      </Animated.View>
    );
  }
}
