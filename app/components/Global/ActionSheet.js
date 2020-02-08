/* @flow */
/* ActionSheet组件，解决第三方插件在安卓某些机型上显示位置不对 */
import React, { PureComponent } from 'react';
import {
  ActionSheetIOS, Platform, TouchableOpacity, Text, StyleSheet, View, TouchableWithoutFeedback,
} from 'react-native';

type Props = {
  options: Object,
  cancelButtonIndex: number,
  onPress: Function,
}

type State = {
  isShow: boolean,
}

class ActionSheet extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isShow: false,
    };
  }

  componentDidMount() {
    this.show();
  }

  show = () => {
    if (Platform.OS === 'ios') {
      const { data: { cancelButtonIndex, onPress, options } } = this.props;
      ActionSheetIOS.showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      }, onPress);
    } else {
      this.setState({ isShow: true });
    }
  }

  cancel = () => {
    const { onClosed } = this.props;
    this.setState({ isShow: false });
    onClosed('actionSheet');
  }

  onPress = (index: number) => {
    const { data: { onPress } } = this.props;
    this.cancel();
    onPress(index);
  }

  render() {
    const { data: { cancelButtonIndex, options = [] } } = this.props;
    const { isShow } = this.state;
    if (Platform.OS === 'ios' || !isShow) { return null; }
    return (
      <TouchableWithoutFeedback onPress={this.cancel}>
        <View style={[styles.wrapper, { height: SCREEN_HEIGHT }]}>
          <View style={{ backgroundColor: '#eee' }}>
            {
              options.map((v, i) => {
                const cancelButton = i === cancelButtonIndex;
                return (
                  <TouchableOpacity
                    onPress={() => this.onPress(i)}
                    key={v}
                    style={{ backgroundColor: '#eee', paddingTop: cancelButton ? 5 : StyleSheet.hairlineWidth }}
                  >
                    <Text style={styles.text} key={v}>{v}</Text>
                  </TouchableOpacity>
                );
              })
            }
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    width: SCREEN_WIDTH,
  },
  text: {
    fontSize: 16,
    color: '#007aff',
    height: 48,
    lineHeight: 48,
    backgroundColor: '#fff',
    width: SCREEN_WIDTH,
    textAlign: 'center',
  },
});

export default ActionSheet;
