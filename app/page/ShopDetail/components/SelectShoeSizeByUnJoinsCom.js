import React, { Component } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BottomBtnGroup } from '../../../components';
import Colors from '../../../res/Colors';
import { YaHei } from '../../../res/FontFamily';
import { debounce } from '../../../utils/CommonUtils';
import { fetchSimpleData } from '../../../redux/actions/simpleData';
import { getSimpleData } from '../../../redux/reselect/simpleData';
import { requestApi } from '../../../http/Axios';
import { showToast } from '../../../utils/MutualUtil';

const SIZE = (SCREEN_WIDTH - 45) / 4;
const TYPE = 'activitySize';

function mapStateToProps() {
  return state => ({
    shoesInfo: getSimpleData(state, TYPE),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData,
  }, dispatch);
}

class SelectShoeSizeByUnJoinsCom extends Component {
  constructor(props) {
    super(props);
    const { shopId, fetchSimpleData } = this.props;
    fetchSimpleData(TYPE, { id: shopId });
    this.state = {
      chooseId: '',
    };
  }

  changeChooseStatus = (item) => {
    const { chooseId } = this.state;
    if (item.stock < 1) {
      showToast('库存不足');
      return;
    }
    this.setState({ chooseId: item.id === chooseId ? '' : item.id });
  };

  confirmChoose = () => {
    const {
      shopId, closeBox, navigation, shopInfo, notStart, fetchSimpleData,
    } = this.props;
    const { chooseId } = this.state;
    closeBox();
    if (notStart) {
      const params = {
        activity_id: shopId,
        size_list: JSON.stringify([{ id: chooseId, num: 1 }]),
      };
      requestApi('startTuan', { params }).then(() => {
        fetchSimpleData('activityInfo', { id: shopId }, 'refresh');
      });
    } else {
      const params = {
        activity_id: shopId,
        size_id: chooseId,
      };
      requestApi('doBuyNow', { params }).then((res) => {
        navigation.navigate('Panicstatus', {
          params: {
            shopInfo, payData: res.data, isSuccess: true,
          },
          title: '抢购成功',
        });
      });
    }
  };

  render() {
    const { shoesInfo: { data: shoesList = [] } } = this.props;
    const { chooseId } = this.state;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>鞋码选择</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView} style={{ backgroundColor: Colors.MAIN_BACK }}>
            {
              shoesList.map((item) => {
                const isSelect = chooseId === item.id;
                return (
                  <TouchableOpacity
                    style={[styles.item, { borderWidth: isSelect ? StyleSheet.hairlineWidth : 0 }]}
                    key={item.id}
                    onPress={() => this.changeChooseStatus(item)}
                  >
                    <Text style={[styles.sizeAndCount, { color: isSelect ? Colors.YELLOW : item.stock < 1 ? '#aaa' : '#000' }]}>{item.size}</Text>
                    <Text style={[styles.price, { color: isSelect ? Colors.YELLOW : '#A4A4A4' }]}>{`￥${item.price / 100}`}</Text>
                  </TouchableOpacity>
                );
              })
            }
          </ScrollView>
        </View>
        <BottomBtnGroup btns={[{ text: '确认', onPress: debounce(this.confirmChoose), disabled: chooseId === '' }]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE_COLOR,
    height: 400,
  },
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 7,
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
  titleWrapper: {
    height: 50,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  title: {
    fontFamily: YaHei,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sizeAndCount: {
    fontFamily: YaHei,
    fontWeight: 'bold',
    fontSize: 18,
  },
  price: {
    fontSize: 15,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectShoeSizeByUnJoinsCom);
