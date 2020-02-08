import React, { PureComponent } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PullToRefresh } from '../../components';
import { fetchListData, changeListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';
import ListItemBuyerHistory from './ListItemBuyerHistory';
import ListItemWaitpay from './ListItemWaitpay';
import ListItemBuyerWaitHave from './ListItemBuyerWaitHave';
import ListItemComplete from './ListItemComplete';
import ListItemSellerHistory from './ListItemSellerHistory';
import ListItemSellerWaitSend from './ListItemSellerWaitSend';
import ListItemSendOut from './ListItemSendOut';

function mapStateToProps() {
  return (state, props) => ({
    listData: getListData(state, props.type),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchListData, changeListData,
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
    const { fetchListData, type } = this.props;
    fetchListData(type, {}, fetchType);
  }

  renderItem = ({ item }) => {
    const {
      type, navigation, routeType, changeListData,
    } = this.props;
    const Wrapper = {
      auctionBuyerHistory: ListItemBuyerHistory,
      auctionBuyerWaitPay: ListItemWaitpay,
      auctionBuyerWaitHave: ListItemBuyerWaitHave,
      auctionBuyerComplete: ListItemComplete,
      auctionSellerHistory: ListItemSellerHistory,
      auctionSellerWaitSendOut: ListItemSellerWaitSend,
      auctionSellerSendOut: ListItemSendOut,
      auctionSellerComplete: ListItemComplete,
      auctionSellerWaitPay: ListItemWaitpay,
    }[type] || ListItemSellerWaitSend;
    return (
      <Wrapper
        titleStyle={styles.title}
        refresh={this.fetchData}
        navigation={navigation}
        type={type}
        item={item}
        changeListData={changeListData}
        routeType={routeType}
      />
    );
  }

  render() {
    const { listData } = this.props;
    return (
      <PullToRefresh
        totalPages={listData.totalPages}
        currentPage={listData.currentPage}
        Wrapper={FlatList}
        data={listData.list}
        refresh={this.fetchData}
        renderItem={this.renderItem}
        onEndReached={this.loadMore}
      />
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 13.5,
    height: 40,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
