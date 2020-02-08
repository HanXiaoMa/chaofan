import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  FlatList, View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { PullToRefresh, Image, AuctionUserItem } from '../../components';
import { fetchListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';

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

  renderNoItem = () => {
    const { onIndexChange } = this.props;
    return (
      <View style={{ alignItems: 'center', height: '100%', paddingTop: '35%' }}>
        <Image style={{ height: SCREEN_WIDTH / 1470 * 548, width: SCREEN_WIDTH }} source={require('../../res/image/no-focus.png')} />
        <TouchableOpacity style={styles.btn} onPress={() => onIndexChange(0)}>
          <Text style={{ fontSize: 18, color: '#fff' }}>热门竞拍</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderItem = ({ item }) => <AuctionUserItem item={item} focusChangeNeedRefresh={false} />

  render() {
    const { listData } = this.props;
    return (
      <PullToRefresh
        totalPages={listData.totalPages}
        currentPage={listData.currentPage}
        Wrapper={FlatList}
        data={listData.list}
        contentContainerStyle={{ height: '100%' }}
        refresh={this.fetchData}
        renderNoItem={this.renderNoItem}
        list={listData.list}
        renderItem={this.renderItem}
        onEndReached={this.loadMore}
        keyExtractor={item => `${item.user_id}`}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
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
    bottom: 80,
    backgroundColor: '#FEA702',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
