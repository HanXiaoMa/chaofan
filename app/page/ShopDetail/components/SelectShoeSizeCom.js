/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hitSlop } from '../../../common/Constant';
import { BottomBtnGroup, Image } from '../../../components';
import Colors from '../../../res/Colors';
import { YaHei } from '../../../res/FontFamily';
import { debounce } from '../../../utils/CommonUtils';
import { getShoesList } from '../../../redux/actions/shopDetailInfo';
import { showToast } from '../../../utils/MutualUtil';
import { wPx2P } from '../../../utils/ScreenUtil';
import { getReShoesList } from '../../../redux/reselect/shopDetailInfo';
import { request } from '../../../http/Axios';
import { fetchSimpleData } from '../../../redux/actions/simpleData';

function mapStateToProps() {
  return state => ({
    shoesInfo: getReShoesList(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getShoesList,
    fetchSimpleData,
  }, dispatch);
}

class SelectShoeSizeCom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCount: 0,
      shoesList: [],
    };
  }

  componentDidMount() {
    const { shopId, getShoesList } = this.props;
    getShoesList(shopId).then((shoesList) => {
      this.setState({ shoesList: shoesList.map(v => ({ ...v, num: 0 })) });
    });
  }

  changeChooseCount = (item, isAdd) => {
    const { shoesList } = this.state;
    let { totalCount } = this.state;
    shoesList.map((v) => {
      if (v.id === item.id) {
        if (isAdd) {
          if (item.num < v.limit_num) {
            v.num += 1;
            totalCount++;
          } else {
            showToast('选择数量不能大于限购数量');
          }
        } else if (item.num >= 1) {
          item.num--;
          totalCount--;
        }
      }
      return v;
    });
    this.setState({ shoesList, totalCount });
  };

  confirmChoose = () => {
    const {
      shopId, closeBox, navigation, fetchSimpleData,
    } = this.props;
    const { shoesList } = this.state;
    const toServerSizeList = [];
    for (let i = 0; i < shoesList.length; i++) {
      const sizeData = shoesList[i];
      if (sizeData.num !== 0) {
        toServerSizeList.push({
          id: sizeData.id,
          num: sizeData.num,
        });
      }
    }
    const params = {
      activity_id: shopId,
      size_list: JSON.stringify(toServerSizeList),
    };
    closeBox();
    request('/activity/do_add_user_activity', { params }).then(() => {
      fetchSimpleData('activityInfo', { id: shopId }, 'refresh').then((data) => {
        if (data.user_activity.want_number > 0) {
          navigation.navigate('Commission', { title: '助攻佣金设定' });
        }
      });
    });
  };

  render() {
    const { shoesList, totalCount } = this.state;
    const { closeBox } = this.props;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={styles.mainView}>
            <View style={styles.header}>
              <Text style={styles.title}>鞋码选择</Text>
              <Text style={{ color: '#666', fontSize: 12 }}>每选一双鞋，团队可增加一人</Text>
            </View>

            <Image onPress={() => closeBox()} style={styles.close} source={require('../../../res/image/close-x.png')} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              shoesList.map((item, index) => (
                <View key={index} style={styles.item}>
                  <View style={styles.itemLeft}>
                    <Text style={styles.sizeAndCount}>{item.size}</Text>
                    <Text style={styles.price}>{`${item.price / 100}￥`}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                    <TouchableOpacity
                      style={[styles.add, { backgroundColor: item.num < 1 ? '#fff' : Colors.YELLOW }]}
                      hitSlop={hitSlop}
                      disabled={item.num < 1}
                      onPress={() => this.changeChooseCount(item)}
                    >
                      <Text style={styles.addText}>-</Text>
                    </TouchableOpacity>
                    <Text style={[styles.sizeAndCount, { width: 40, fontSize: 20 }]}>{item.num}</Text>
                    <TouchableOpacity
                      style={[styles.add, { backgroundColor: item.num >= item.limit_num ? Colors.DISABLE : Colors.YELLOW }]}
                      hitSlop={hitSlop}
                      onPress={() => this.changeChooseCount(item, true)}
                    >
                      <Text style={styles.addText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            }
          </ScrollView>
        </View>
        <BottomBtnGroup
          customLeft={<Text style={styles.alreadyChoose}>{`已选数量：${totalCount}`}</Text>}
          btns={[{ text: '确认', onPress: debounce(this.confirmChoose), disabled: totalCount === 0 }]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 17,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingRight: 10,
  },
  add: {
    height: 17,
    width: 17,
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    borderBottomColor: '#ddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginRight: wPx2P(30),
    height: '100%',
  },
  close: {
    height: 12,
    width: 12,
  },
  container: {
    backgroundColor: Colors.WHITE_COLOR,
    height: 400,
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    paddingBottom: 11,
    marginHorizontal: 24,
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wPx2P(30),
    height: 74,
    paddingHorizontal: wPx2P(15),
  },
  title: {
    color: 'rgba(0,0,0,1)',
    fontFamily: YaHei,
    fontWeight: 'bold',
    fontSize: 15,
  },
  alreadyChoose: {
    fontSize: 13,
    color: Colors.NORMAL_TEXT_0,
    fontFamily: YaHei,
    fontWeight: '300',
    marginLeft: wPx2P(20),
  },
  sizeAndCount: {
    fontFamily: YaHei,
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
  },
  price: {
    color: '#4F4F4F',
  },
  lrImage: {
    width: 6,
    height: 8,
  },
  line: {
    width: 340,
    height: 1,
    marginTop: 12,
    marginBottom: 19,
    marginLeft: 26,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectShoeSizeCom);
