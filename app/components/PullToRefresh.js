import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, RefreshControl,
} from 'react-native';
import Image from './Image';
import Colors from '../res/Colors';
import Images from '../res/Images';

export default class PullToRefresh extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { totalPages, refresh } = this.props;
    if (!refresh) { return; }
    if (totalPages === -1 && nextProps.totalPages > -1) {
      this.setState({ refreshing: false });
    }
  }

  renderFooter = () => {
    const {
      totalPages, currentPage, renderNoItem, list,
    } = this.props;
    if (totalPages === currentPage || totalPages === 0) {
      if (renderNoItem && (list || []).length === 0) {
        return renderNoItem();
      }
      return (
        <View style={styles.loadingFooter}>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      );
    }
    return (
      <View style={styles.loadingFooter}>
        <Text style={styles.loadingText}>加载中</Text>
        <Image source={Images.loading} style={styles.loadingGif} />
      </View>
    );
  }

  onRefresh = () => {
    const { refresh } = this.props;
    this.setState({ refreshing: true });
    refresh('refresh');
  }

  scrollToOffset = (params) => {
    this.list && this.list._component.scrollToOffset(params);
  }

  render() {
    const {
      renderFooter, Wrapper, refresh,
    } = this.props;
    const { refreshing } = this.state;
    return (
      <Wrapper
        ListFooterComponent={renderFooter || this.renderFooter}
        refreshControl={refresh ? (
          <RefreshControl
            tintColor={Colors.YELLOW}
            refreshing={refreshing}
            onRefresh={this.onRefresh}
          />
        ) : null}
        ref={(v) => { this.list = v; }}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        removeClippedSubviews={false}
        onEndReachedThreshold={1}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={6}
        scrollEventThrottle={1}
        {...this.props}
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
    color: Colors.NORMAL_TEXT_6,
  },
  loadingGif: {
    width: 23,
    height: 5,
    marginLeft: 6,
  },
});
