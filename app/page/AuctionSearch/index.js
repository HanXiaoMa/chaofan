import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  FlatList, StyleSheet, View, TextInput, Text, TouchableOpacity,
} from 'react-native';
import { PullToRefresh, Image } from '../../components';
import ListItem from '../Auction/ListItem';
import { fetchListData } from '../../redux/actions/listData';
import { getListData } from '../../redux/reselect/listData';
import { STATUSBAR_HEIGHT, hitSlop } from '../../common/Constant';
import { debounceDelay, changeVersion } from '../../utils/CommonUtils';
import AuctionListItem from '../Home/AuctionListItem';

const TYPE = 'auctionSearch';

function mapStateToProps() {
  return (state, props) => ({
    listData: getListData(state, props.navigation.getParam('apiType') || TYPE),
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
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.type = this.routeParams.apiType || TYPE;
    this.state = {
      keyword: '',
    };
  }

  loadMore = () => {
    this.fetchData('more');
  }

  fetchData = (fetchType, params) => {
    const { fetchListData } = this.props;
    fetchListData(this.type, params, fetchType);
  }

  filter = (keyword) => {
    changeVersion(keyword);
    this.setState({ keyword });
    this.fetchData(null, { keyword });
  }

  refresh = () => {
    this.fetchData();
    this.headerHot && this.headerHot.resetFilter();
  }

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;
    if (this.type === 'auctionOfficialSearch') {
      return <AuctionListItem index={index} navigation={navigation} item={item} />;
    }
    return <ListItem index={index} navigation={navigation} item={item} />;
  }

  render() {
    const { listData, navigation } = this.props;
    const { keyword } = this.state;
    return (
      <View style={{ flex: 1, paddingTop: 16 + STATUSBAR_HEIGHT, backgroundColor: '#F2F2F2' }}>
        <View style={styles.header}>
          <View style={styles.inputWrapper}>
            <Image source={require('../../res/image/search-auction.png')} style={{ height: 16, width: 16 }} />
            <TextInput
              style={styles.input}
              selectionColor="#00AEFF"
              placeholder="搜索"
              placeholderTextColor="#999"
              underlineColorAndroid="transparent"
              clearButtonMode="while-editing"
              onChangeText={debounceDelay(this.filter)}
            />
          </View>
          <TouchableOpacity style={styles.goBack} hitSlop={hitSlop} onPress={() => navigation.pop()}>
            <Text style={{ color: '#007AFF' }}>取消</Text>
          </TouchableOpacity>
        </View>
        {
          keyword.length > 0 && (
            <PullToRefresh
              totalPages={listData.totalPages}
              currentPage={listData.currentPage}
              Wrapper={FlatList}
              style={{ flex: 1, marginTop: 8 }}
              data={listData.list}
              numColumns={this.type === 'auctionOfficialSearch' ? 1 : 2}
              list={listData.list}
              refresh={this.refresh}
              renderItem={this.renderItem}
              onEndReached={this.loadMore}
            />
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    borderRadius: 2,
    paddingLeft: 5,
    flex: 1,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    height: '100%',
    padding: 0,
    color: '#000',
  },
  goBack: {
    height: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
