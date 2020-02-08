import React, { PureComponent } from 'react';
import {
  FlatList, View, Text, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Animated from 'react-native-reanimated';
import { ImageNetUnkoneSize, PullToRefresh } from '../../components';
import { STATUSBAR_AND_NAV_HEIGHT } from '../../common/Constant';
import { getSimpleData } from '../../redux/reselect/simpleData';
import { fetchSimpleData, resetSimpleData } from '../../redux/actions/simpleData';


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const HEIGHT = SCREEN_HEIGHT - STATUSBAR_AND_NAV_HEIGHT;
const TYPE = 'freeTradeGoodsDetail';

function mapStateToProps() {
  return state => ({
    data: getSimpleData(state, TYPE),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData, resetSimpleData,
  }, dispatch);
}

class ListItemDetail extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const { fetchSimpleData, id } = this.props;
    if (nextProps.isLoaded && !this.isLoaded) {
      this.isLoaded = true;
      fetchSimpleData(TYPE, { id });
    }
  }

  componentWillUnmount() {
    const { resetSimpleData } = this.props;
    resetSimpleData(TYPE);
  }

  scrollToOffset = (params) => {
    this.list && this.list.scrollToOffset(params);
  }

  renderItem = ({ item }) => (
    <ImageNetUnkoneSize
      key={item.image}
      style={{ width: SCREEN_WIDTH }}
      source={{ uri: item.image }}
    />
  );

  renderFooter = () => {
    const { data } = this.props;
    if ((data.data || []).length === 0) {
      return (
        <View style={styles.loadingFooter}>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      );
    }
    return null;
  }


  render() {
    const { data, onScroll } = this.props;
    return (
      <PullToRefresh
        totalPages={1}
        currentPage={1}
        Wrapper={AnimatedFlatList}
        data={data.data || []}
        style={{ height: HEIGHT }}
        onScroll={onScroll}
        ListHeaderComponent={<View style={{ height: 42 }} />}
        contentContainerStyle={{ paddingTop: 133, minHeight: HEIGHT + 133 }}
        ref={(v) => { this.list = v; }}
        renderItem={this.renderItem}
        renderFooter={this.renderFooter}
      />
    );
  }
}

const styles = StyleSheet.create({
  loadingFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 60,
    paddingBottom: 20,
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
  },
  loadingGif: {
    width: 23,
    height: 5,
    marginLeft: 6,
  },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ListItemDetail);
