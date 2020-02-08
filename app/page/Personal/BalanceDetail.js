import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, FlatList,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { YaHei } from '../../res/FontFamily';
import { PullToRefresh } from '../../components';
import { formatDate } from '../../utils/CommonUtils';
import { fetchListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';

const TYPE = 'balanceDetail';

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

class BalanceDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.fetchData();
  }

  fetchData = (fetchType) => {
    const { fetchListData } = this.props;
    fetchListData(TYPE, {}, fetchType);
  }

  loadMore = () => {
    this.fetchData('more');
  }

  renderItem = ({ item }) => (
    <View style={styles.item}>
      <View>
        <Text style={{ fontFamily: YaHei }}>{item.reason}</Text>
        <Text style={{ fontSize: 13, color: '#666' }}>{formatDate(item.add_time)}</Text>
      </View>
      <View>
        <Text style={{ fontSize: 17, fontFamily: YaHei }}>{`${item.type === '1' ? '- ' : '+ '}${item.price / 100}`}</Text>
      </View>
    </View>
  )

  render() {
    const { listData } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <PullToRefresh
          totalPages={listData.totalPages}
          currentPage={listData.currentPage}
          Wrapper={FlatList}
          data={listData.list}
          refresh={this.fetchData}
          renderItem={this.renderItem}
          onEndReached={this.loadMore}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BalanceDetail);
