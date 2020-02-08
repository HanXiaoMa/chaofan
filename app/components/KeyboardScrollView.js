import React, { PureComponent } from 'react';
import ReactNative, { Keyboard, ScrollView, Platform } from 'react-native';

export default class KeyboardScrollView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bottom: 0,
    };
  }

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillHide = () => {
    this.setState({ bottom: null }, () => {
      setTimeout(() => {
        this.scrollView.scrollTo({ y: this.lastScrollY });
      });
    });
  }

  keyboardWillShow = (e) => {
    if ((e.isEventFromThisApp && Platform.OS === 'ios') || Platform.OS === 'android') {
      const { getInputRefs } = this.props;
      getInputRefs().some(((input) => {
        if (input.isFocused()) {
          this.setState({ bottom: e.endCoordinates.height });
          this.lastScrollY = this.scrollY;
          this.scrollView.getScrollResponder().scrollResponderScrollNativeHandleToKeyboard(ReactNative.findNodeHandle(input), 100, true);
          return true;
        }
        return false;
      }));
    }
  }

  onScroll = (e) => {
    this.scrollY = e.nativeEvent.contentOffset.y;
  }

  render() {
    const { children, contentContainerStyle } = this.props;
    const { bottom } = this.state;
    return (
      <ScrollView
        {...this.props}
        onScroll={this.onScroll}
        scrollEventThrottle={1}
        ref={(v) => { this.scrollView = v; }}
        contentContainerStyle={{ ...contentContainerStyle, paddingBottom: bottom || contentContainerStyle.paddingBottom }}
      >
        { children }
      </ScrollView>
    );
  }
}
