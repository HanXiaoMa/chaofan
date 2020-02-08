import React, { Component } from 'react';
import {
  FlatList, View, Text, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PullToRefresh } from '../../components';
import { fetchListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';
import Colors from '../../res/Colors';
import { formatDate } from '../../utils/CommonUtils';

const TYPE = 'noticeMessage';

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

class Message extends Component {
  constructor(props) {
    super(props);
    this.fetchData();
  }

  fetchData = (fetchType) => {
    const { fetchListData } = this.props;
    fetchListData(TYPE, { type: 1 }, fetchType);
  }

  loadMore = () => {
    this.fetchData('more');
  }

  renderItem = ({ item }) => (
    <View>
      <Text style={styles.date}>{formatDate(item.add_time)}</Text>
      <Text style={styles.text}>{item.content}</Text>
    </View>
  )

  render() {
    const { listData } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: Colors.MAIN_BACK }}>
        <PullToRefresh
          Wrapper={FlatList}
          totalPages={listData.totalPages}
          currentPage={listData.currentPage}
          refresh={this.fetchData}
          data={listData.list}
          renderItem={this.renderItem}
          onEndReached={this.loadMore}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    color: '#B6B6B6',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 2,
  },
  text: {
    backgroundColor: '#fff',
    marginHorizontal: 9,
    paddingHorizontal: 10,
    textAlign: 'justify',
    borderRadius: 2,
    overflow: 'hidden',
    fontSize: 12,
    lineHeight: 14,
    color: '#333',
    paddingVertical: 6,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Message);
