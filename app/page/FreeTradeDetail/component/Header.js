/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { YaHei } from '../../../res/FontFamily';
import { Dropdown } from '../../../components';
import Colors from '../../../res/Colors';
import { getSimpleData } from '../../../redux/reselect/simpleData';
import { fetchSimpleData } from '../../../redux/actions/simpleData';

const TYPE = 'freeTradeGoodsSizes';

function mapStateToProps() {
  return state => ({
    sizes: getSimpleData(state, TYPE),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData,
  }, dispatch);
}


class Header extends PureComponent {
  constructor(props) {
    super(props);
    const { type, id, fetchSimpleData } = this.props;
    this.state = {
      filterType: 'all',
    };
    if (type === 'freeTradeGoodsPrice') {
      fetchSimpleData(TYPE, { id });
    }
  }

  filterOnPress = (v) => {
    const { filter } = this.props;
    this.setState({ filterType: v.id });
    filter({ order_by: v.id });
  }

  render() {
    const {
      type, filter, sizes, count,
    } = this.props;
    const { filterType } = this.state;
    const options1 = [{ size: '全部尺码', id: 'all' }, ...(sizes.data || [])];
    const options2 = [
      { id: 'all', title: '全部' },
      { id: '1', title: '现货' },
      { id: '2', title: '预售' },
    ];
    const btns = [
      { id: 'all', title: '综合' },
      { id: 'price_asc', title: '价格' },
    ];
    return (
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Text style={styles.outPrice}>
            共 :
            <Text style={{ fontSize: 12, color: '#37B6EB', fontFamily: YaHei }}>{count}</Text>
            {` 人${type === 'freeTradeGoodsPrice' ? '出售' : '购买'}`}
          </Text>
          {
            type === 'freeTradeGoodsPrice' && (
              <Dropdown
                filter={filter}
                titleField="size"
                index="size_id"
                options={options1}
                defaultValue={options1[0]}
                width={80}
              />
            )
          }
        </View>
        {
          type === 'freeTradeGoodsPrice' && (
            <View style={styles.bottom}>
              <View style={{ flexDirection: 'row' }}>
                {
                  btns.map((v, i) => (
                    <TouchableOpacity
                      onPress={() => this.filterOnPress(v)}
                      key={`btns-${i}`}
                      style={{
                        width: 50,
                        alignItems: i === btns.length - 1 ? 'flex-end' : 'flex-start',
                        borderRightColor: '#E3E3E3',
                        borderRightWidth: i === btns.length - 1 ? 0 : StyleSheet.hairlineWidth,
                      }}
                    >
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ color: v.id === filterType ? Colors.YELLOW : '#000', fontSize: 12 }}>{v.title}</Text>
                        <View style={[styles.zhishiqi, { backgroundColor: v.id === filterType ? Colors.YELLOW : 'transparent' }]} />
                      </View>
                    </TouchableOpacity>
                  ))
                }
              </View>
              <View style={styles.shuxian}>
                <Dropdown filter={filter} index="is_stock" options={options2} defaultValue={options2[0]} width={60} />
              </View>
            </View>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: 2,
    marginHorizontal: 9,
    marginTop: 42,
  },
  shuxian: {
    paddingLeft: 40,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#E3E3E3',
  },
  header: {
    paddingHorizontal: 10,
    borderBottomColor: '#E3E3E3',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 36,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  outPrice: {
    fontSize: 12,
    color: '#272727',
  },
  bottom: {
    height: 36,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  zhishiqi: {
    width: 29,
    height: 1,
    borderRadius: 0.5,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
