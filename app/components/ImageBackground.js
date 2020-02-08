import React, { PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Image from './Image';
import FadeImage from './FadeImage';

type Props = {
  style: Object,
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center',
  source: any,
  children: any,
  onPress?: Function,
  disabled?: boolean,
  hitSlop?: Object,
  useFadeImage?: boolean,
};

export default class ImageBackgroundCom extends PureComponent<Props> {
  static defaultProps = {
    resizeMode: 'contain',
    onPress: null,
    disabled: false,
    hitSlop: {},
    useFadeImage: false,
  };

  render() {
    const {
      style, resizeMode, source, children, onPress, disabled, hitSlop, useFadeImage,
    } = this.props;
    const Wrapper = onPress ? TouchableOpacity : View;
    const ImageWrapper = useFadeImage ? FadeImage : Image;
    return (
      <Wrapper hitSlop={hitSlop} style={style} onPress={onPress} disabled={disabled}>
        <ImageWrapper resizeMode={resizeMode} source={source} style={{ position: 'absolute', width: style.width, height: style.height }} />
        {children}
      </Wrapper>
    );
  }
}
