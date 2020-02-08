import React, { PureComponent } from 'react';
import { View } from 'react-native';
import TabBarItem from './TabBarItem';
import TabBarIndicator from './TabBarIndicator';

const fontSize = 14;
const sidePadding = 20;
const middlePadding = 25;

export default class TabBar extends PureComponent {
  constructor(props) {
    super(props);
    const { routes, itemMargin, sideMargin } = this.props;
    this.sideMargin = sideMargin || sidePadding;
    this.itemMargin = itemMargin || middlePadding;
    this.inputRange = routes.map((v, i) => i);
    this.outputRangeIndicatorWidth = routes.map(v => (v.width || v.title.length * fontSize));
    this.outputRangeTitleWidth = this.outputRangeIndicatorWidth.map((v, i) => {
      if (i === 0 || i === this.outputRangeIndicatorWidth.length - 1) {
        return v + this.sideMargin + this.itemMargin / 2;
      }
      return v + this.itemMargin;
    });
    this.outputRangeIndicatorTranslateX = this.outputRangeIndicatorWidth
      .reduce((arr, value, index) => [...arr, arr[index] + value + this.itemMargin], [this.sideMargin]);
    this.outputRangeIndicatorTranslateX.pop();
  }

  renderItem = ({ item, index }: { item: Object, index: number }) => {
    const {
      onIndexChange, position, routes,
    } = this.props;
    return (
      <TabBarItem
        item={item}
        width={this.outputRangeTitleWidth[index]}
        index={index}
        itemMargin={this.itemMargin}
        key={item.key}
        isLastItem={routes.length - 1 === index}
        position={position}
        fontSize={fontSize}
        sidePadding={this.sideMargin}
        onPress={onIndexChange}
        isFirst={index === 0}
      />
    );
  }

  render() {
    const { style, routes, position } = this.props;
    return (
      <View style={style}>
        { routes.map((item, index) => this.renderItem({ item, index })) }
        {
          routes.length > 0 && (
            <TabBarIndicator
              inputRange={this.inputRange}
              position={position}
              style={{
                height: 5,
                backgroundColor: '#FFA700',
                position: 'absolute',
                bottom: 0,
              }}
              outputRangeWidth={this.outputRangeIndicatorWidth}
              outputRangeTranslateX={this.outputRangeIndicatorTranslateX}
            />
          )
        }
      </View>
    );
  }
}
