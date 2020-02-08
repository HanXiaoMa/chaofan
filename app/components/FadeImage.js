/* @flow */
import React, { PureComponent } from 'react';
import {
  Animated, View, Platform, Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';

type Props = {
  style: Object,
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center',
  source: any,
  children?: any,
};

type State = {
  source: any,
};

export default class FadeImage extends PureComponent<Props, State> {
  opacity: any
  static defaultProps = {
    children: null,
    resizeMode: 'cover',
  }

  constructor(props: Props) {
    super(props);
    this.opacity = new Animated.Value(0.1);
  }

  changeOpacity = () => {
    Animated.timing(
      this.opacity,
      {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      },
    ).start();
  }

  render() {
    const {
      style, resizeMode, children, source,
    } = this.props;

    if (!source || (source.constructor === Object && typeof source.uri !== 'string')) {
      return null;
    } if (Platform.OS === 'ios') {
      const Wrapper = source.constructor !== Object ? FastImage : Image;
      return (
        <Animated.View style={[style, { opacity: this.opacity, borderWidth: 0 }]}>
          <Wrapper
            onLoad={this.changeOpacity}
            resizeMode={resizeMode}
            // defaultSource={Images.loadingIndicatorSource}
            style={{
              width: style.width,
              height: style.height,
              borderWidth: style.borderWidth,
              borderColor: style.borderColor,
              borderRadius: style.borderRadius,
              backgroundColor: style.backgroundColor || '#FFFFFF',
              position: 'absolute',
            }}
            source={source}
          />
          {children}
        </Animated.View>
      );
    }
    return (
      <View style={[style, { borderWidth: 0 }]}>
        <FastImage
          resizeMode={resizeMode}
          style={{
            width: style.width,
            height: style.height,
            borderWidth: style.borderWidth,
            borderColor: style.borderColor,
            borderRadius: style.borderRadius,
            backgroundColor: style.backgroundColor || '#FFFFFF',
            position: 'absolute',
          }}
          fadeDuration={300}
          source={source}
        />
        {children}
      </View>
    );
  }
}
