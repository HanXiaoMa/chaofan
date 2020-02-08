import React, { PureComponent } from 'react';
import {
  FlatList, View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { PullToRefresh, Image } from '../../components';
import ListItem from '../Auction/ListItem';
import { request } from '../../http/Axios';
import UserShopInfo from './UserShopInfo';

export default class AuctionShop extends PureComponent {
  static navigationOptions = () => ({ title: '店铺详情' });
  static defaultProps = {
    paddingTop: 7,
  }

  constructor(props) {
    super(props);
    const { navigation, userId } = this.props;
    this.routeParams = navigation.getParam('params') || { shopInfo: { user_id: this.routeParams.userId } };
    this.userId = this.routeParams.shopInfo?.user_id || userId;
    this.state = {
      list: [],
      totalPages: -1,
      currentPage: 1,
    };
    this.lastFetchTime = null;
    this.fetchData();
  }

  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = (fetchType) => {
    const { currentPage, totalPages, list } = this.state;
    if ((Date.now() - this.lastFetchTime < 500) || (currentPage >= totalPages && fetchType === 'more')) {
      return;
    }
    if (fetchType !== 'more') {
      this.lastFetchTime = null;
      this.setState({
        list: fetchType ? list : [],
        totalPages: -1,
        currentPage: 1,
      });
    }
    const page = fetchType === 'more' ? currentPage + 1 : 1;
    const params = {
      pn: page,
      image_size_times: 0.5,
      user_id: this.userId,
    };
    this.lastFetchTime = Date.now();
    request('/auction/myshop', { params }).then((res) => {
      this.lastFetchTime = null;
      this.setState({
        list: page === 1 ? res.data.list : [...list, ...res.data.list],
        totalPages: res.data.number,
        currentPage: page,
      });
    });
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
    const { paddingTop } = this.props;
    const { list, totalPages, currentPage } = this.state;
    return (
      <PullToRefresh
        totalPages={totalPages}
        currentPage={currentPage}
        Wrapper={FlatList}
        data={list}
        list={list}
        numColumns={2}
        renderNoItem={this.renderNoItem}
        contentContainerStyle={{ minHeight: '100%', position: 'relative', paddingTop }}
        style={{ backgroundColor: '#F2F2F2', flex: 1 }}
        ListHeaderComponent={<UserShopInfo shopInfo={this.routeParams.shopInfo} userId={this.userId} />}
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
