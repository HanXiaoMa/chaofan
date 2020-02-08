/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  ScrollView, View, StyleSheet,
} from 'react-native';
import { ExpressItem } from '../../components';

export default class Express extends PureComponent {
  static navigationOptions = () => ({ title: '物流详情' });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F0F0F0' }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          { (this.routeParams.list || []).map((v, i) => (
            <ExpressItem key={i} index={i} item={v} />
          )) }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    margin: 10,
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
});
