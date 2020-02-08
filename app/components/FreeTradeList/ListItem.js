import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FadeImage from '../FadeImage';
import ScaleView from '../ScaleView';
import Price from '../Price';
import Image from '../Image';
import { wPx2P } from '../../utils/ScreenUtil';
import Colors from '../../res/Colors';
import Styles from '../../res/style';

export default class ListItem extends PureComponent {
  onPress = () => {
    const { item, onPress } = this.props;
    onPress(item);
  }

  render() {
    const {
      item, notShowCount, showPrice, index, isCurrentItem, showSize,
    } = this.props;
    return (
      <ScaleView onPress={this.onPress} style={{ ...styles.container, marginLeft: index % 2 === 1 ? 8 : 9 }}>
        <View style={styles.shoeWrapper}>
          <FadeImage source={{ uri: item.icon }} style={styles.shoe} />
        </View>
        <View>
          {showSize && <Text style={{ fontSize: 11, color: '#333' }}>{`SIZE:${item.size}`}</Text>}
          <Text numberOfLines={2} style={[Styles.listTitle, { height: 30 }]}>{item.goods_name}</Text>
          {
            showPrice && (
              <View style={styles.bottom}>
                {
                  item.price > 0 ? (
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                      <Price offsetBottom={2} price={item.price} />
                      <Text style={styles.qi}>起</Text>
                    </View>
                  ) : <Text style={{ fontSize: 11, color: '#666' }}>暂无报价</Text>
                }
                {
                  !notShowCount && <Text style={{ fontSize: 11 }}>{`${item.buy_num}人已购买`}</Text>
                }
              </View>
            )
          }
        </View>
        { isCurrentItem && <Image style={styles.chooseIcon} source={require('../../res/image/chooseIcon.png')} /> }
      </ScaleView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 7,
    width: (SCREEN_WIDTH - 26) / 2,
    borderRadius: 2,
    overflow: 'hidden',
    height: 200,
    justifyContent: 'space-between',
  },
  shoe: {
    width: wPx2P(129),
    height: wPx2P(80),
    alignSelf: 'center',
  },
  qi: {
    fontSize: 9,
    color: Colors.YELLOW,
    marginLeft: 3,
    fontWeight: '500',
  },
  shoeWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 25,
  },
  chooseIcon: {
    height: 17,
    width: 17,
    position: 'absolute',
    right: 0,
  },
});
