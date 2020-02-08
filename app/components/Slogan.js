/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import Image from './Image';
import appJson from '../../app.json';

export default class Tag extends PureComponent {
  static defaultProps = {
    marginHorizontal: 9,
  }

  onPress = () => {
    window.chanfanNavigation.navigate('Web', {
      params: {
        url: `${appJson.webUrl}/slogan`,
        showHelp: true,
      },
    });
  }

  render() {
    const { marginHorizontal } = this.props;
    const tagList = [
      { title: '正品保障', icon: require('../res/image/zhengpin.png') },
      { title: '专业鉴定', icon: require('../res/image/zhuanye.png') },
      { title: '安全无优', icon: require('../res/image/wuyou.png') },
    ];
    return (
      <TouchableOpacity onPress={this.onPress} style={[styles.tagList, { marginHorizontal }]}>
        {
          tagList.map((v, i) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }} key={i}>
              <Image source={v.icon} style={{ height: 18, width: 18 }} />
              <Text style={{ fontSize: 10, marginLeft: 2 }}>{v.title}</Text>
            </View>
          ))
        }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tagList: {
    backgroundColor: '#fff',
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 36,
    alignItems: 'center',
  },
});
