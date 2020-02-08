import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import { PullToRefresh } from '../../components';
import { fetchListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';
import ListItem from './ListItem';

const MINE = 'auctionGoodShopList';

function mapStateToProps() {
  return state => ({
    listData: getListData(state, MINE),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchListData,
  }, dispatch);
}

class AuctionGoodShops extends PureComponent {
  static navigationOptions = () => ({ title: '优选好店' });

  constructor(props) {
    super(props);
    this.fetchData();
  }

  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = (fetchType) => {
    const { fetchListData } = this.props;
    fetchListData(MINE, { user_id: 54 }, fetchType);
  }

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;
    return <ListItem index={index} navigation={navigation} item={item} />;
  }

  render() {
    const { listData } = this.props;
    return (
      <PullToRefresh
        totalPages={listData.totalPages}
        currentPage={listData.currentPage}
        Wrapper={FlatList}
        data={listData.list}
        list={listData.list}
        style={{ backgroundColor: '#F2F2F2', flex: 1 }}
        refresh={this.fetchData}
        renderItem={this.renderItem}
        onEndReached={this.loadMore}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuctionGoodShops);
