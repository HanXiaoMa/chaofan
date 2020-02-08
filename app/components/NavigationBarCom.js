import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { STATUSBAR_AND_NAV_HEIGHT, STATUSBAR_HEIGHT } from '../common/Constant';
import { YaHei } from '../res/FontFamily';
import Image from './Image';
import { getUserInfo } from '../redux/reselect/userInfo';

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

class NavigationBarCom extends PureComponent {
  render() {
    const { title, navigation, userInfo } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {
          navigation && userInfo.isTestVersion && (
            <Image
              onPress={() => navigation.navigate('FreeTradeSearch', { title: '搜索' })}
              hitSlop={{
                top: 20, right: 20, left: 50, bottom: 20,
              }}
              source={require('../res/image/search-index.png')}
              style={styles.search}
            />
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: STATUSBAR_AND_NAV_HEIGHT,
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
    top: 0,
    position: 'absolute',
  },
  title: {
    color: '#010101',
    fontSize: 16,
    fontFamily: YaHei,
  },
  search: {
    height: 19,
    width: 19,
    position: 'absolute',
    right: 16,
    top: 12 + STATUSBAR_HEIGHT,
  },
});

export default connect(mapStateToProps)(NavigationBarCom);
