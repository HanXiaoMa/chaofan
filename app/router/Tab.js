/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, StyleSheet, TouchableWithoutFeedback, Animated, Text,
} from 'react-native';
import { connect } from 'react-redux';
import Image from '../components/Image';
import Images from '../res/Images';
import { PADDING_TAB } from '../common/Constant';
import Colors from '../res/Colors';
import { wPx2P } from '../utils/ScreenUtil';
import { getUserInfo } from '../redux/reselect/userInfo';

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

const HOME_ICON_WIDTH = wPx2P(70);
const PADDING_HORIZONTAL = wPx2P(30);
const TAB_HEIGHT = 50;

class BottomNavigator extends PureComponent {
  constructor(props) {
    super(props);
    this.opacity = [
      new Animated.Value(1),
      new Animated.Value(1),
      new Animated.Value(1),
      new Animated.Value(1),
      new Animated.Value(1),
    ];
  }

  onPressIn = (i) => {
    Animated.timing(
      this.opacity[i],
      {
        toValue: 0.2,
        duration: 150,
        useNativeDriver: true,
      },
    ).start();
  }

  onPressOut = (i) => {
    Animated.timing(
      this.opacity[i],
      {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      },
    ).start();
  }

  render() {
    const {
      userInfo, onIndexChange, routes, index: indexState, showNotice,
    } = this.props;
    return (
      <View>
        <View style={styles.tabBar}>
          <View style={styles.homeIconPlaceholder} />
          <Animated.View style={{ opacity: this.opacity[2] }}>
            <Image style={styles.homeIcon} source={indexState === 2 ? Images.home : Images.homeInactive} />
          </Animated.View>
          {
            routes.reduce((arr, v) => [...arr, false, false, v], []).slice(2).map((v, i, arr) => {
              const index = (i + 1) / 3 | 0;
              return (
                <TouchableWithoutFeedback
                  key={`v.key${i}`}
                  hitSlop={{ bottom: PADDING_TAB }}
                  onPressIn={() => this.onPressIn(index)}
                  onPressOut={() => this.onPressOut(index)}
                  onPress={() => onIndexChange(index)}
                >
                  {
                    v ? (
                      <Animated.View style={[styles.item, {
                        opacity: this.opacity[index],
                        paddingLeft: i === 0 ? PADDING_HORIZONTAL : 0,
                        paddingRight: i === arr.length - 1 ? PADDING_HORIZONTAL : 0,
                      }]}
                      >
                        {
                          v.key === 'home'
                            ? <View style={styles.homeSize} />
                            : <Image style={styles.otherIcon} source={indexState === index ? Images[v.key] : Images[`${v.key}Inactive`]} />
                        }
                        {v.key !== 'home' && <Text style={{ color: indexState === index ? '#000' : '#A7A7A7', fontSize: 10 }}>{v.title}</Text>}
                        {v.key === 'message' && showNotice && userInfo.notice_number * 1 > 0 ? <View style={styles.hongdian} /> : null}
                      </Animated.View>
                    )
                      : <View style={{ flex: 1, height: '100%' }} />
                  }
                </TouchableWithoutFeedback>
              );
            })
          }
        </View>
        <TouchableWithoutFeedback onPressIn={() => this.onPressIn(2)} onPressOut={() => this.onPressOut(2)} onPress={() => onIndexChange(2)}>
          <View style={styles.placeholder} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    height: TAB_HEIGHT + PADDING_TAB,
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
  },
  placeholder: {
    height: 25,
    width: HOME_ICON_WIDTH - 5,
    position: 'absolute',
    alignSelf: 'center',
    bottom: TAB_HEIGHT + PADDING_TAB,
  },
  hongdian: {
    height: 5,
    width: 5,
    backgroundColor: Colors.RED,
    borderRadius: 5,
    position: 'absolute',
    right: 0,
    top: 6,
  },
  homeSize: {
    width: HOME_ICON_WIDTH,
    height: HOME_ICON_WIDTH,
  },
  otherIcon: {
    width: wPx2P(26), height: wPx2P(26),
  },
  homeIconPlaceholder: {
    width: HOME_ICON_WIDTH - 2,
    height: HOME_ICON_WIDTH - 2,
    position: 'absolute',
    bottom: PADDING_TAB + 7,
    zIndex: -1,
    backgroundColor: '#fff',
    left: (SCREEN_WIDTH - HOME_ICON_WIDTH) / 2 + 1,
    borderRadius: HOME_ICON_WIDTH / 2,
    overflow: 'hidden',
  },
  homeIcon: {
    width: HOME_ICON_WIDTH,
    height: HOME_ICON_WIDTH,
    position: 'absolute',
    bottom: PADDING_TAB + 6,
    zIndex: -1,
    left: (SCREEN_WIDTH - HOME_ICON_WIDTH) / 2,
    borderRadius: HOME_ICON_WIDTH / 2,
    overflow: 'hidden',
  },
  item: {
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 6 + PADDING_TAB,
    justifyContent: 'space-between',
    height: '100%',
  },
});

export default connect(mapStateToProps)(BottomNavigator);
