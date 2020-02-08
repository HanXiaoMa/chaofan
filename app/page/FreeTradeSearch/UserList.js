import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PullToRefresh } from '../../components';
import { getListData } from '../../redux/reselect/listData';
import { fetchListData } from '../../redux/actions/listData';
import UserListItem from './UserListItem';
import Colors from '../../res/Colors';

const TYPE = 'freeTradeSearchUser';

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

class UserList extends PureComponent {
  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = (fetchType, params) => {
    const { fetchListData, inputParams } = this.props;
    fetchListData(TYPE, params || inputParams, fetchType);
  }

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    return <UserListItem navigation={navigation} item={item} />;
  }

  render() {
    const { listData } = this.props;
    return (
      <PullToRefresh
        totalPages={listData.totalPages}
        currentPage={listData.currentPage}
        Wrapper={FlatList}
        style={{ backgroundColor: Colors.MAIN_BACK, flex: 1 }}
        data={listData.list}
        refresh={this.fetchData}
        renderItem={this.renderItem}
        onEndReached={this.loadMore}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(UserList);
