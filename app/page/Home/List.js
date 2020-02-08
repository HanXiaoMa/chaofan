import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import { PullToRefresh, Banner } from '../../components';
import ShopListItemCom from './ShopListItemCom';
import { fetchListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';
import AuctionListItem from './AuctionListItem';

function mapStateToProps() {
  return (state, props) => ({
    listData: getListData(state, props.apiType),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchListData,
  }, dispatch);
}

class List extends PureComponent {
  constructor(props) {
    super(props);
    this.fetchData();
  }

  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = (fetchType) => {
    const { fetchListData, apiType } = this.props;
    fetchListData(apiType, {}, fetchType);
  }

  renderItem = ({ item, index }) => {
    const { navigation, apiType } = this.props;
    if (apiType === 'chaofanAuction') {
      return <AuctionListItem index={index} navigation={navigation} item={item} />;
    }
    return <ShopListItemCom index={index} navigation={navigation} item={item} />;
  }

  render() {
    const { listData, navigation, id } = this.props;
    return (
      <PullToRefresh
        totalPages={listData.totalPages}
        currentPage={listData.currentPage}
        Wrapper={FlatList}
        ListHeaderComponent={id ? <Banner navigation={navigation} bannerId={id} /> : null}
        data={listData.list}
        numColumns={1}
        refresh={this.fetchData}
        renderItem={this.renderItem}
        onEndReached={this.loadMore}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
