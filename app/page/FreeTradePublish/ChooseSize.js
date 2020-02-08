/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  Text, ScrollView, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { wPx2P } from '../../utils/ScreenUtil';
import Colors from '../../res/Colors';
import { YaHei } from '../../res/FontFamily';
import { getSimpleData } from '../../redux/reselect/simpleData';
import { fetchSimpleData } from '../../redux/actions/simpleData';
import { ShoeImageHeader } from '../../components';

const SIZE = (SCREEN_WIDTH - 45) / 4;
const TYPE = 'getShoeSizeList';

function mapStateToProps() {
  return state => ({
    shoeSizeList: getSimpleData(state, TYPE),
  });
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData,
  }, dispatch);
}

class ChooseSize extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation, fetchSimpleData } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    fetchSimpleData(TYPE, { goods_id: this.routeParams.item.id });
  }

  changeChooseStatus = (size) => {
    const { navigation } = this.props;
    navigation.navigate('PayDetail', {
      title: '支付库管费',
      params: {
        api: {
          type: 'getManagementPrice',
          params: { goods_id: this.routeParams.item.id, size_id: size.id },
        },
        payType: 'management',
        type: 1,
        goodsInfo: {
          ...this.routeParams.item,
          size: size.size,
        },
      },
    });
  }

  render() {
    const { shoeSizeList: { data = [] } } = this.props;
    return (
      <ScrollView showsVerticalScrollIndicator={false} alwaysBounceVertical={false} style={styles.choseSizeContainer}>
        <ShoeImageHeader showPrice={false} item={this.routeParams.item} />
        <Text style={styles.choseYourShoeText}>选择你要出售的鞋码</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1 }}>
          {
            data.map((item, index) => (
              <TouchableOpacity style={styles.item} key={index} onPress={() => { this.changeChooseStatus(item); }}>
                <Text style={styles.sizeNumber}>{item.size}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  choseSizeContainer: {
    backgroundColor: '#efefef',
  },
  title: {
    fontSize: 15,
    fontFamily: YaHei,
    marginLeft: 10,
    flex: 1,
    textAlign: 'justify',
  },
  item: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE_COLOR,
    borderRadius: 2,
    overflow: 'hidden',
    borderColor: Colors.YELLOW,
    marginLeft: 9,
    marginTop: 7,
  },
  shoseName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 13,
    marginTop: 7,
  },
  shoseImage: {
    width: wPx2P(166),
    height: wPx2P(97),
  },
  sizeItem: {
    textAlign: 'center',
    width: '90%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE_COLOR,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sizeNumber: {
    fontFamily: YaHei,
    fontWeight: 'bold',
    fontSize: 18,
  },
  itemViwe: {
    width: SCREEN_WIDTH / 4.3,
    height: wPx2P(83),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.NORMAL_TEXT_F2,
  },
  choseYourShoe: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 22,
  },
  choseYourShoeText: {
    fontSize: 13,
    fontFamily: YaHei,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 13,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(ChooseSize);
