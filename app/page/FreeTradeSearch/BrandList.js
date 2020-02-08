/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  ScrollView, View, StyleSheet, Text, FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getSimpleData } from '../../redux/reselect/simpleData';
import { fetchSimpleData } from '../../redux/actions/simpleData';
import { ScaleView, Image } from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { YaHei } from '../../res/FontFamily';

const TYPE = 'freeTradeSearchBrand';

function mapStateToProps() {
  return state => ({
    data: getSimpleData(state, TYPE),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData,
  }, dispatch);
}

class BrandList extends PureComponent {
  constructor(props) {
    super(props);
    this.fetchData();
  }

  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = () => {
    const { fetchSimpleData } = this.props;
    fetchSimpleData(TYPE);
  }

  toListPage = (v) => {
    const { navigation } = this.props;
    navigation.navigate('BrandListPage', {
      title: v.brand_name,
      params: { defaultParams: { brand_id: v.id } },
    });
  }

  renderItem = ({ item }) => {
    if (item === 0) {
      return null;
    } if (item.children) {
      return (
        <View style={styles.groupWrapper}>
          <View style={styles.hengxian} />
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.hengxian} />
        </View>
      );
    }
    return (
      <ScaleView onPress={() => this.toListPage(item)} style={styles.item}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={{ fontSize: 10, fontFamily: YaHei }}>{item.brand_name}</Text>
      </ScaleView>
    );
  }

  render() {
    const { data: { data } } = this.props;
    if (!data?.brand) { return null; }
    const list = [].concat(...data.brand.map((v) => {
      const length = 4 - (v.children.length % 4);
      const needLength = length === 4 ? 0 : length;
      return [v, 0, 0, 0, ...v.children.concat(Array(needLength).fill(0))];
    }));
    return (
      <FlatList
        data={list}
        renderItem={this.renderItem}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        numColumns={4}
        removeClippedSubviews={false}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        keyExtractor={(item, index) => `payItem-${index}`}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  hengxian: {
    width: 45,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
  },
  groupWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  item: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: wPx2P(60),
    height: wPx2P(60),
  },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(BrandList);
