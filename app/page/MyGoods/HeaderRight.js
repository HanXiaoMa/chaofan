import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { YaHei } from '../../res/FontFamily';
import { getPartData } from '../../redux/reselect/listData';

function mapStateToProps() {
  return (state, props) => ({
    partData: getPartData(state, props.apiType, 'count'),
  });
}

class HeaderRight extends PureComponent {
  render() {
    const { partData, color, prefix } = this.props;
    return (
      <View style={styles.textWrapper}>
        <Text style={styles.text1}>{prefix}</Text>
        <Text style={[styles.text2, { color }]}>{partData}</Text>
        <Text style={styles.text1}> 双</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text1: {
    color: '#272727',
    fontSize: 12,
    fontFamily: YaHei,
    marginBottom: 3.5,
  },
  text2: {
    fontSize: 20,
    fontFamily: YaHei,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 8,
  },
});

export default connect(mapStateToProps)(HeaderRight);
