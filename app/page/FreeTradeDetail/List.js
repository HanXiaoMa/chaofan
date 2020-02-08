import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Animated from 'react-native-reanimated';
import { PullToRefresh } from '../../components';
import { getListData } from '../../redux/reselect/listData';
import { fetchListData, resetListData } from '../../redux/actions/listData';
import ListItemHistory from './ListItemHistory';
import ListItemPrice from './ListItemPrice';
import Header from './component/Header';
import { STATUSBAR_AND_NAV_HEIGHT } from '../../common/Constant';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const HEIGHT = SCREEN_HEIGHT - STATUSBAR_AND_NAV_HEIGHT;

function mapStateToProps() {
  return (state, props) => ({
    listData: getListData(state, props.type),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchListData, resetListData,
  }, dispatch);
}

class List extends PureComponent {
  constructor(props) {
    super(props);
    this.filterParams = {};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoaded && !this.isLoaded) {
      this.isLoaded = true;
      this.fetchData();
    }
  }

  componentWillUnmount() {
    const { resetListData, type } = this.props;
    resetListData(type, true);
  }

  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = (fetchType) => {
    const { fetchListData, type, goods: { goods_id } } = this.props;
    fetchListData(type, {
      goods_id,
      ...this.filterParams,
    }, fetchType);
  }

  filter = (params) => {
    this.filterParams = { ...this.filterParams, ...params };
    for (const i in this.filterParams) {
      if (this.filterParams[i] === 'all') {
        delete this.filterParams[i];
      }
    }
    this.fetchData();
  }

  scrollToOffset = (params) => {
    this.list && this.list.scrollToOffset(params);
  }

  renderItem = ({ item }) => {
    const { type, goods, navigation } = this.props;
    if (type === 'freeTradeGoodsPrice') {
      return <ListItemPrice navigation={navigation} goods={goods} item={item} />;
    }
    return <ListItemHistory navigation={navigation} item={item} />;
  }

  render() {
    const {
      listData, type, goods: { id }, onScroll,
    } = this.props;
    return (
      <PullToRefresh
        totalPages={listData.totalPages}
        currentPage={listData.currentPage}
        Wrapper={AnimatedFlatList}
        data={listData.list}
        style={{ height: HEIGHT }}
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: 133, minHeight: HEIGHT + 133 }}
        ListHeaderComponent={<Header count={listData.count || 0} id={id} type={type} filter={this.filter} />}
        refresh={this.fetchData}
        stickyHeaderIndices={[0]}
        ref={(v) => { this.list = v; }}
        renderItem={this.renderItem}
        onEndReached={this.loadMore}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(List);
