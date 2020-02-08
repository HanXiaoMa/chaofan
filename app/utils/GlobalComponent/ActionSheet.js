/* ActionSheet组件，解决第三方插件在安卓某些机型上显示位置不对 */
import React, { PureComponent } from 'react';
import {
  ActionSheetIOS, Platform, TouchableOpacity, Text, StyleSheet, TouchableWithoutFeedback, Animated, View,
} from 'react-native';

const DURATION = 200;
const ITEM_HEIGHT = 56;
const MARGIN_TOP = 8;
const MARGIN_BOTTOM = 15;

class ActionSheet extends PureComponent {
  translateY = new Animated.Value(100)
  opacity = new Animated.Value(0)

  constructor(props) {
    super(props);
    const { options } = this.props;
    this.height = options.length * ITEM_HEIGHT + MARGIN_TOP + MARGIN_BOTTOM;
    this.translateY = new Animated.Value(this.height);
  }

  componentDidMount() {
    this.show();
  }

  show = () => {
    if (Platform.OS === 'ios') {
      const { cancelButtonIndex, onPress, options } = this.props;
      ActionSheetIOS.showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      }, onPress);
    } else {
      Animated.parallel([
        Animated.timing(
          this.translateY,
          {
            toValue: 0,
            duration: DURATION,
            useNativeDriver: true,
          },
        ),
        Animated.timing(
          this.opacity,
          {
            toValue: 1,
            duration: DURATION,
            useNativeDriver: true,
          },
        ),
      ]).start();
    }
  }

  onPress = (index) => {
    const { onPress } = this.props;
    onPress(index);
    this.close();
  }

  close = () => {
    const { onClosed } = this.props;
    Animated.parallel([
      Animated.timing(
        this.translateY,
        {
          toValue: this.height,
          duration: DURATION,
          useNativeDriver: true,
        },
      ),
      Animated.timing(
        this.opacity,
        {
          toValue: 0,
          duration: DURATION,
          useNativeDriver: true,
        },
      ),
    ]).start(onClosed);
  }

  render() {
    const { cancelButtonIndex, options } = this.props;
    if (Platform.OS === 'ios') { return null; }
    const optionsTop = options.filter((v, i) => i !== cancelButtonIndex);
    return (
      <TouchableWithoutFeedback onPress={this.close}>
        <View style={[styles.container, { height: SCREEN_HEIGHT, width: SCREEN_WIDTH }]}>
          <Animated.View style={[styles.wrapper, { height: SCREEN_HEIGHT, width: SCREEN_WIDTH, opacity: this.opacity }]} />
          <Animated.View style={{ transform: [{ translateY: this.translateY }] }}>
            <View style={styles.topWrapper}>
              {
                optionsTop.map((v, i) => (
                  <TouchableOpacity
                    onPress={() => this.onPress(i)}
                    key={v}
                    style={[styles.item, { borderBottomWidth: i !== optionsTop.length - 1 ? StyleSheet.hairlineWidth : 0 }]}
                  >
                    <Text style={styles.text}>{v}</Text>
                  </TouchableOpacity>
                ))
              }
            </View>
            {
              options[cancelButtonIndex] && (
                <TouchableOpacity onPress={() => this.onPress(cancelButtonIndex)} style={styles.cancel}>
                  <Text style={styles.cancelText}>{options[cancelButtonIndex]}</Text>
                </TouchableOpacity>
              )
            }
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'flex-end',
    bottom: 0,
  },
  wrapper: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    position: 'absolute',
  },
  cancelText: {
    fontSize: 17,
    color: '#007aff',
    height: ITEM_HEIGHT,
    lineHeight: ITEM_HEIGHT,
    textAlign: 'center',
    fontFamily: 'PingFangSC-Medium',
  },
  text: {
    fontSize: 17,
    color: '#007aff',
    height: ITEM_HEIGHT,
    lineHeight: ITEM_HEIGHT,
    textAlign: 'center',
  },
  item: {
    borderBottomColor: '#eee',
  },
  cancel: {
    borderRadius: 12,
    width: SCREEN_WIDTH - 16,
    backgroundColor: '#fff',
    marginBottom: MARGIN_BOTTOM,
    marginTop: MARGIN_TOP,
    alignSelf: 'center',
  },
  topWrapper: {
    borderRadius: 12,
    width: SCREEN_WIDTH - 16,
    backgroundColor: 'rgba(255,255,255,0.98)',
    alignSelf: 'center',
    overflow: 'hidden',
  },
});

export default ActionSheet;
