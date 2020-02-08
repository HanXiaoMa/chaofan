import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { ScaleView, Image } from '../../components';

const WIDTH = (SCREEN_WIDTH - 26) / 2;
export default class ListItem extends PureComponent {
  onPress = () => {
    const { navigation } = this.props;
    navigation.navigate('AuctionHot');
  }

  render() {
    const { index, item } = this.props;
    return (
      <ScaleView onPress={this.onPress} style={{ ...styles.container, marginLeft: index % 2 === 1 ? 8 : 9 }}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </ScaleView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 7,
    marginBottom: 7,
    width: WIDTH,
    height: 275,
    borderRadius: 2,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  image: {
    width: WIDTH,
    height: 275,
  },
});
