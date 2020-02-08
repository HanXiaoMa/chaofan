/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import { Image } from '../../components';

export default class ImagePage extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        {
          (this.routeParams.images || []).map((v, i) => <Image source={v.source} key={i} style={v.style} />)
        }
      </ScrollView>
    );
  }
}
