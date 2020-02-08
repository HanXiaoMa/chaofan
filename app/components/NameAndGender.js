import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import Image from './Image';
import Images from '../res/Images';

export default class NameAndGender extends PureComponent {
  render() {
    const { name, sex } = this.props;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 15 }}>{name}</Text>
        {
          ['1', '2'].includes(sex) && (
            <Image
              style={{ height: 12, width: 12, marginLeft: 5 }}
              source={sex === '2' ? Images.littleGirl : Images.littleBoy}
            />
          )
        }
      </View>
    );
  }
}
