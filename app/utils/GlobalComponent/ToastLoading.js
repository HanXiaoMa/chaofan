import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Animated,
} from 'react-native';

const height = 80;

export default class ToastLoading extends PureComponent {
  opacity = new Animated.Value(0)

  componentDidMount() {
    const { onClosed, duration } = this.props;
    Animated.sequence([
      Animated.timing(
        this.opacity,
        {
          toValue: 0.98,
          duration: 250,
          useNativeDriver: true,
        },
      ),
      Animated.timing(
        this.opacity,
        {
          toValue: 0.95,
          duration: duration - 500,
          useNativeDriver: true,
        },
      ),
      Animated.timing(
        this.opacity,
        {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        },
      ),
    ]).start(onClosed);
  }

  componentWillUnmount() {
    this.timeout && clearTimeout(this.timeout);
  }

  close = () => {
    const { onClosed } = this.props;
    Animated.timing(
      this.opacity,
      {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      },
    ).start(onClosed);
  }

  render() {
    const { text } = this.props;
    return (
      <View style={styles.wrapper}>
        <ActivityIndicator />
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: (SCREEN_HEIGHT - height) / 2,
    alignSelf: 'center',
    zIndex: 100,
    height,
    width: height,
    backgroundColor: '#666666f9',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '20%',
  },
  text: {
    color: '#d3d3d3',
    fontSize: 12,
    marginTop: 5,
  },
});
