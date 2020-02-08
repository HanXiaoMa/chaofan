import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  FlatList, View, TouchableOpacity, Text, StyleSheet,
} from 'react-native';
import { PullToRefresh, Image } from '../../components';
import ListItem from '../Auction/ListItem';
import { fetchListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';

const TYPE = 'auctionCategoryList';

function mapStateToProps() {
  return state => ({
    listData: getListData(state, TYPE),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchListData,
  }, dispatch);
}

class AuctionCategory extends PureComponent {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.fetchData();
  }

  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = (fetchType) => {
    const { fetchListData } = this.props;
    fetchListData(TYPE, { gt_id: this.routeParams.category.id }, fetchType);
  }

  refresh = () => {
    this.fetchData();
    this.headerHot && this.headerHot.resetFilter();
  }

  onPress = () => {

  }

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;
    return <ListItem index={index} navigation={navigation} item={item} />;
  }

  renderNoItem = () => (
    <View style={{ alignItems: 'center', height: '100%', paddingTop: '35%' }}>
      <Image style={{ height: SCREEN_WIDTH / 1470 * 638, width: SCREEN_WIDTH }} source={require('../../res/image/no-collection.png')} />
      <TouchableOpacity style={styles.btn} onPress={this.onPress}>
        <Text style={{ fontSize: 18, color: '#fff' }}>热门竞拍</Text>
      </TouchableOpacity>
    </View>
  )

  render() {
    const { listData } = this.props;
    return (
      <PullToRefresh
        totalPages={listData.totalPages}
        currentPage={listData.currentPage}
        Wrapper={FlatList}
        style={{ flex: 1, backgroundColor: '#F2F2F2' }}
        contentContainerStyle={{ minHeight: '100%', paddingTop: 7 }}
        data={listData.list}
        numColumns={2}
        list={listData.list}
        renderNoItem={this.renderNoItem}
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

export default connect(mapStateToProps, mapDispatchToProps)(AuctionCategory);
