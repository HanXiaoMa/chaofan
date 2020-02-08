import React, { PureComponent } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { PADDING_TAB } from '../../common/Constant';

export default class Toast extends PureComponent {
  opacity = new Animated.Value(0)

  componentDidMount() {
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
          duration: 1500,
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
    ]).start(this.onClosed);
  }

  close = () => {
    Animated.timing(
      this.opacity,
      {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      },
    ).start(this.onClosed);
  }

  onClosed = () => {
    const { onClosed } = this.props;
    onClosed && onClosed();
  }

  render() {
    const { text } = this.props;
    return (
      <Animated.View style={[styles.style, { opacity: this.opacity }]}>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  style: {
    alignSelf: 'center',
    backgroundColor: '#606060',
    width: 243,
    height: 45,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 100 + PADDING_TAB,
    marginTop: 10,
  },
  text: {
    color: '#d3d3d3',
    fontSize: 12,
  },
});
