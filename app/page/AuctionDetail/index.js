/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  View, StyleSheet, TouchableOpacity, FlatList, RefreshControl, KeyboardAvoidingView,
} from 'react-native';
import { Image, CustomHeader } from '../../components';
import Colors from '../../res/Colors';
import { showShare, showToast, closeModalbox } from '../../utils/MutualUtil';
import { request } from '../../http/Axios';
import { getUserInfo, checkAuth } from '../../utils/CommonUtils';
import Bottom from './Bottom';
import ListItem from './ListItem';
import ListHeader from './ListHeader';

const appJson = require('../../../app.json');

export default class AuctionDetail extends PureComponent {
  static navigationOptions = () => ({ title: '拍卖详情' });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || { item: { id: navigation.getParam('auctionId') } };
    this.item = this.routeParams.item;
    this.state = {
      data: {},
      isFetched: false,
      text: null,
    };
    this.fetchData();
  }

  fetchData = () => {
    const params = {
      id: this.item.id,
      image_size_times: 1,
    };
    request('/auction/auction_info', { params }).then((res) => {
      this.setState({
        data: res.data,
        isFetched: true,
        text: null,
      });
    });
  }

  toShare = () => {
    const { data } = this.state;
    showShare({
      text: data.title,
      img: data.images[0] || `${appJson.imageUrl}/tower/other/cf.png?x-oss-process=image/resize,m_lfit,w_60`,
      url: `${appJson.webUrl}/shareAuctionDetail/${this.item.id}`,
      title: '我在炒饭APP上发布了一个拍卖，快来看看吧',
    });
  }

  toFocus = () => {
    const { data } = this.state;
    checkAuth('AuctionDetail').then(() => {
      request(data.is_attention == 0 ? '/auction/attention' : '/auction/del_attention', { params: { user_id: data.user_id } }).then((res) => {
        this.setState({ data: { ...data, is_attention: data.is_attention == 0 ? 1 : 0 } });
        showToast(res.callbackMsg);
      });
    });
  }

  toHelp = () => {
    closeModalbox();
    const { navigation } = this.props;
    navigation.navigate('Web', {
      params: {
        url: `${appJson.webUrl}/slogan`,
        showHelp: true,
      },
    });
  }

  toCollection = () => {
    const { data } = this.state;
    checkAuth('AuctionDetail').then(() => {
      request(data.is_collect == 0 ? '/auction/do_collect' : '/auction/del_collect', { params: { id: data.id } }).then((res) => {
        this.setState({ data: { ...data, is_collect: data.is_collect == 0 ? 1 : 0 } });
        showToast(res.callbackMsg);
      });
    });
  }

  finish = () => {
    this.setState({ text: '正在结算本次拍卖结果' });
    setTimeout(() => {
      this.fetchData();
    }, 3000);
  }

  renderRight = () => {
    const { data } = this.state;
    return (
      <View style={styles.nav}>
        {
          [
            {
              icon: data.is_collect == 1 ? require('../../res/image/collectioned.png') : require('../../res/image/collection.png'),
              onPress: this.toCollection,
            },
            { icon: require('../../res/image/share.png'), onPress: this.toShare },
            { icon: require('../../res/image/help-auction.png'), onPress: this.toHelp },
          ].map((v, i) => (
            <TouchableOpacity style={styles.navIconWrapper} key={i} onPress={v.onPress}>
              <Image source={v.icon} style={styles.navIcon} />
            </TouchableOpacity>
          ))
        }
      </View>
    );
  }

  renderItem = ({ item }) => {
    const { data, text } = this.state;
    return <ListItem item={item} data={data} text={text} finish={this.finish} />;
  }

  render() {
    const { navigation } = this.props;
    const { data, isFetched } = this.state;
    const list = ['header'];
    if (data.images?.[0]) {
      list.push({ type: 'image', uri: data.images[0], mask: true });
    }
    list.push({ type: 'middle', data: data.join_user_list });
    const showBottom = getUserInfo().id != data.user_id && isFetched && data.status == 2;
    return (
      <KeyboardAvoidingView behavior="height" style={{ flex: 1, backgroundColor: '#F2F2F2' }}>
        <CustomHeader navigation={navigation} title="拍卖详情" Right={this.renderRight} />
        <FlatList
          data={[...list, ...(data.images || []).slice(1).map(v => ({ type: 'image', uri: v }))]}
          style={{ flex: 1 }}
          ref={(v) => { this.flatList = v; }}
          contentContainerStyle={{ paddingHorizontal: 9, paddingBottom: 10 }}
          renderItem={this.renderItem}
          removeClippedSubviews={false}
          initialNumToRender={1}
          stickyHeaderIndices={[1]}
          maxToRenderPerBatch={1}
          refreshControl={(
            <RefreshControl
              progressViewOffset={20}
              tintColor={Colors.YELLOW}
              onRefresh={this.fetchData}
              refreshing={false}
            />
          )}
          ListHeaderComponent={<ListHeader navigation={navigation} toFocus={this.toFocus} data={data} />}
          keyExtractor={(item, index) => `flatList-${index}`}
        />
        { showBottom && (
          <Bottom
            refresh={this.fetchData}
            toOffer={this.toOffer}
            toHelp={this.toHelp}
            data={data}
            navigation={navigation}
          />
        ) }
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: '#fff',
    marginTop: 7,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: SCREEN_WIDTH - 18,
  },
  nav: {
    flexDirection: 'row',
    height: '100%',
    paddingRight: 13,
  },
  navIcon: {
    height: 18,
    width: 18,
  },
  navIconWrapper: {
    paddingHorizontal: 5,
    height: '100%',
    justifyContent: 'center',
  },
  image: {
    width: SCREEN_WIDTH - 18,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 7,
  },
});
