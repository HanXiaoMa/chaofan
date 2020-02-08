import React, { PureComponent } from 'react';
import {
  StyleSheet, Text,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { ShoeImageHeader } from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { RuiXian } from '../../res/FontFamily';
import Colors from '../../res/Colors';

const baseURL = require('../../../app.json').webUrl;

export default class Header extends PureComponent {
  toHelp = () => {
    const { navigation } = this.props;
    navigation.navigate('Web', {
      title: '规则说明',
      params: {
        url: `${baseURL}/help/freetrade`,
        showHelp: true,
      },
    });
  }

  render() {
    const { item, scrollY } = this.props;
    return (
      <Animated.View style={[styles.container, { transform: [{ translateY: Animated.max(Animated.multiply(scrollY, -1), -133) }] }]}>
        <ShoeImageHeader priceRight={<Text style={styles.priceRight}>起</Text>} item={item} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: Colors.MAIN_BACK,
    width: wPx2P(375),
    position: 'absolute',
    height: 133,
  },
  title: {
    textAlign: 'justify',
    fontFamily: RuiXian,
    fontSize: 15,
    lineHeight: 17,
  },
  priceRight: {
    fontSize: 9,
    color: Colors.YELLOW,
    marginLeft: 3,
    fontWeight: '500',
  },
});
