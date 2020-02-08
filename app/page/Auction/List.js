import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  FlatList, View, TouchableOpacity, Text, StyleSheet,
} from 'react-native';
import { PullToRefresh, Image } from '../../components';
import ListItem from './ListItem';
import HotItem from './HotItem';
import HeaderHot from './HeaderHot';
import { fetchListData, resetListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';

function mapStateToProps() {
  return (state, props) => ({
    listData: getListData(state, props.type),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchListData, resetListData,
  }, dispatch);
}

class List extends PureComponent {
  constructor(props) {
    super(props);
    this.fetchData();
  }

  componentWillUnmount() {
    const { resetListData, type } = this.props;
    resetListData(type, true);
  }

  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = (fetchType, params) => {
    const { fetchListData, type } = this.props;
    fetchListData(type, params, fetchType);
  }

  filter = (params) => {
    this.fetchData(null, params);
  }

  refresh = () => {
    this.fetchData('refresh');
    this.headerHot && this.headerHot.resetFilter();
  }

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;
    if (item.type === 'hot_auction') {
      return <HotItem index={index} navigation={navigation} item={item} />;
    }
    return <ListItem index={index} navigation={navigation} item={item} />;
  }

  renderNoItem = () => {
    const { onIndexChange } = this.props;
    return (
      <View style={{ alignItems: 'center', height: '100%', paddingTop: '35%' }}>
        <Image style={{ height: SCREEN_WIDTH / 1470 * 638, width: SCREEN_WIDTH }} source={require('../../res/image/no-collection.png')} />
        <TouchableOpacity style={styles.btn} onPress={() => onIndexChange(0)}>
          <Text style={{ fontSize: 18, color: '#fff' }}>热门竞拍</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const {
      listData, navigation, type, propOnIndexChange,
    } = this.props;
    const listHeaderComponent = {
      auctionIndexList: <HeaderHot propOnIndexChange={propOnIndexChange} ref={(v) => { this.headerHot = v; }} navigation={navigation} filter={this.filter} />,
    }[type];
    return (
      <PullToRefresh
        totalPages={listData.totalPages}
        currentPage={listData.currentPage}
        Wrapper={FlatList}
        style={{ flex: 1 }}
        contentContainerStyle={{ minHeight: '100%' }}
        data={listData.list}
        numColumns={2}
        list={listData.list}
        renderNoItem={type === 'auctionIndexList' ? null : this.renderNoItem}
        ListHeaderComponent={listHeaderComponent}
        refresh={this.refresh}
        renderItem={this.renderItem}
        onEndReached={this.loadMore}
      />
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    height: 47,
    width: 202,
    position: 'absolute',
    bottom: 80,
    backgroundColor: '#FEA702',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
