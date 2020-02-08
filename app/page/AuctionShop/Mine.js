import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  FlatList, View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import {
  PullToRefresh, Image,
} from '../../components';
import { fetchListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';
import ListItem from '../Auction/ListItem';
import { getScreenWidth } from '../../common/Constant';
import MyShopInfo from './MyShopInfo';

const TYPE = 'auctionMyshop';

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

class AuctionShop extends PureComponent {
  static navigationOptions = () => ({ title: '店铺详情' });
  static defaultProps = {
    paddingTop: 7,
  }

  constructor(props) {
    super(props);
    const { navigation, userId } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.userId = this.routeParams.userId || userId;
    this.fetchData();
  }

  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = (fetchType) => {
    const { fetchListData } = this.props;
    fetchListData(TYPE, { user_id: this.userId }, fetchType);
  }

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;
    return <ListItem index={index} navigation={navigation} item={item} />;
  }

  toPublish = () => {
    const { navigation } = this.props;
    navigation.navigate('AuctionPublish');
  }

  renderNoItem = () => (
    <View style={{ alignItems: 'center', height: '100%', paddingTop: '25%' }}>
      <Image style={{ height: SCREEN_WIDTH / 1470 * 638, width: SCREEN_WIDTH }} source={require('../../res/image/no-collection.png')} />
      <TouchableOpacity style={styles.btn} onPress={this.toPublish}>
        <Text style={{ fontSize: 18, color: '#fff' }}>发布商品</Text>
      </TouchableOpacity>
    </View>
  )

  render() {
    const { listData, paddingTop } = this.props;
    return (
      <PullToRefresh
        totalPages={listData.totalPages}
        currentPage={listData.currentPage}
        Wrapper={FlatList}
        data={listData.list}
        list={listData.list}
        numColumns={2}
        renderNoItem={this.renderNoItem}
        contentContainerStyle={{ minHeight: '100%', position: 'relative', paddingTop }}
        style={{ backgroundColor: '#F2F2F2', flex: 1 }}
        ListHeaderComponent={<MyShopInfo userId={this.userId} />}
        refresh={this.fetchData}
        renderItem={this.renderItem}
        onEndReached={this.loadMore}
      />
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 7,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 2,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },
  focusBtn: {
    height: 24,
    width: 51,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    height: 47,
    width: 202,
    position: 'absolute',
    bottom: 160,
    backgroundColor: '#FEA702',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AuctionShop);
