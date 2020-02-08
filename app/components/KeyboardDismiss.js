import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';

export default class KeyboardDismiss extends PureComponent {
  render() {
    const { children, style } = this.props;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={style}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
