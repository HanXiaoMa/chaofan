import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ListItem from './ListItem';
import NoticeItem from './NoticeItem';
import { NavigationBarCom, PullToRefresh } from '../../components';
import { STATUSBAR_AND_NAV_HEIGHT } from '../../common/Constant';
import { fetchListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';

const TYPE = 'activityNotice';

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

class List extends Component {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = (fetchType) => {
    const { fetchListData } = this.props;
    fetchListData(TYPE, { type: 1 }, fetchType);
  }

  loadMore = () => {
    this.fetchData('more');
  }

  renderItem = ({ item }) => {
    const { navigation } = this.props;
    if (item.type < 20) {
      return <ListItem navigation={navigation} item={item} />;
    }
    return <NoticeItem navigation={navigation} item={item} />;
  }

  render() {
    const { listData } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <NavigationBarCom title="活动通知" />
        <PullToRefresh
          Wrapper={FlatList}
          totalPages={listData.totalPages}
          currentPage={listData.currentPage}
          refresh={() => this.fetchData('refresh')}
          style={{ marginTop: STATUSBAR_AND_NAV_HEIGHT }}
          data={listData.list}
          renderItem={this.renderItem}
          onEndReached={this.loadMore}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
