import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FlatList } from 'react-native';
import { PullToRefresh } from '../../components';
import { fetchListData, changeListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';
import ListItem from './ListItem';

const TYPE = 'auctionHotList';

function mapStateToProps() {
  return state => ({
    listData: getListData(state, TYPE),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchListData, changeListData,
  }, dispatch);
}

class AuctionGoodShops extends PureComponent {
  static navigationOptions = () => ({ title: '最新发售' });

  constructor(props) {
    super(props);
    this.fetchData();
  }

  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = (fetchType) => {
    const { fetchListData } = this.props;
    fetchListData(TYPE, {}, fetchType);
  }

  renderItem = ({ item, index }) => {
    const { navigation, changeListData } = this.props;
    return (
      <ListItem
        type={TYPE}
        index={index}
        navigation={navigation}
        item={item}
        refresh={this.fetchData}
        changeListData={changeListData}
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
