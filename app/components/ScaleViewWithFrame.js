import React, { PureComponent } from 'react';
import ScaleView from './ScaleView';
import Frame from './Frame';

export default class ScaleViewWithFrame extends PureComponent {
  render() {
    const {
      style, children, containerStyle, onPress,
    } = this.props;
    return (
      <ScaleView onPress={onPress}>
        <Frame style={style} containerStyle={containerStyle}>
          {children}
        </Frame>
      </ScaleView>
    );
  }
}
