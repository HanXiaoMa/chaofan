import React, { PureComponent } from 'react';
import {
  StyleSheet, TouchableOpacity, Text,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { TabBar } from '../../components';
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
    const {
      routes, onIndexChange, indexScrollPosition, scrollY,
    } = this.props;
    return (
      <Animated.View style={[styles.container, {
        transform: [{ translateY: Animated.max(Animated.add(Animated.multiply(scrollY, -1), 133), 0) }],
      }]}
      >
        <TabBar
          style={styles.tabBar}
          routes={routes}
          position={indexScrollPosition}
          onIndexChange={onIndexChange}
        />
        <TouchableOpacity onPress={this.toHelp}>
          <Text style={styles.rule}>规则说明&gt;</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.MAIN_BACK,
    width: wPx2P(375),
    position: 'absolute',
    height: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rule: {
    marginRight: 10,
    fontSize: 12,
    color: '#37B6EB',
    marginTop: 5,
  },
  title: {
    textAlign: 'justify',
    fontFamily: RuiXian,
    fontSize: 15,
    lineHeight: 17,
  },
  tabBar: {
    height: 42,
    flexDirection: 'row',
    paddingTop: 14,
  },
});
