import React, { PureComponent } from 'react';
import { Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { getUserInfo } from '../redux/reselect/userInfo';
import { STATUSBAR_HEIGHT } from '../common/Constant';
import Colors from '../res/Colors';

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

class TestIcon extends PureComponent {
  render() {
    const { userInfo } = this.props;
    if (userInfo.isTestVersion) {
      return <Text style={styles.style}>测试版</Text>;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  style: {
    position: 'absolute',
    top: STATUSBAR_HEIGHT,
    right: 0,
    fontSize: 12,
    color: Colors.YELLOW,
    transform: [{ rotate: '45deg' }],
  },
});

export default connect(mapStateToProps)(TestIcon);
