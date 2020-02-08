import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PullToRefresh from '../PullToRefresh';
import { getListData } from '../../redux/reselect/listData';
import { fetchListData } from '../../redux/actions/listData';
import ListItem from './ListItem';
import Colors from '../../res/Colors';

function mapStateToProps() {
  return (state, props) => ({
    listData: getListData(state, props.type),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchListData,
  }, dispatch);
}

class FreeTradeList extends PureComponent {
  static defaultProps = {
    autoFetch: true,
  }

  constructor(props) {
    super(props);
    const { autoFetch, navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    if (autoFetch) {
      this.fetchData();
    }
  }

  itemOnPress = (item) => {
    const { navigation } = this.props;
    navigation.navigate('FreeTradeDetail', {
      params: {
        title: '商品详情',
        item,
      },
    });
  }

  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = (fetchType, params) => {
    const {
      fetchListData, type, inputParams,
    } = this.props;
    const defaultParams = this.routeParams.defaultParams || inputParams || {};
    fetchListData(type, { type: 1, ...defaultParams, ...params }, fetchType);
  }

  renderItem = ({ item, index }) => <ListItem index={index} showPrice onPress={this.itemOnPress} item={item} />

  render() {
    const { listData, style } = this.props;
    return (
      <PullToRefresh
        style={{ backgroundColor: Colors.MAIN_BACK, ...style }}
        totalPages={listData.totalPages}
        currentPage={listData.currentPage}
        Wrapper={FlatList}
        data={listData.list}
        refresh={this.fetchData}
        renderItem={this.renderItem}
        numColumns={2}
        onEndReached={this.loadMore}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(FreeTradeList);
