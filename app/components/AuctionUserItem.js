/* @flow */
import React, { PureComponent } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import NameAndGender from './NameAndGender';
import AvatarWithShadow from './AvatarWithShadow';
import ScaleView from './ScaleView';
import { hitSlop } from '../common/Constant';
import { YaHei } from '../res/FontFamily';
import { request } from '../http/Axios';
import { showToast, showShare } from '../utils/MutualUtil';
import { removeFocusItem, addFocusItem } from '../utils/Auction';
import { getMyAuctionShop, getUserInfo } from '../utils/CommonUtils';

const appJson = require('../../app.json');

type Props = {
  item: Object,
  marginBottom?: Number,
  marginHorizontal?: Number,
  canToVendor?: Boolean,
  focusChangeNeedRefresh?: Boolean
};

export default class AuctionUserItem extends PureComponent<Props> {
  static defaultProps = {
    marginBottom: 7,
    marginHorizontal: 8,
    canToVendor: true,
    focusChangeNeedRefresh: true,
  }

  constructor(props) {
    super(props);
    const { item } = this.props;
    this.state = {
      item,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { item } = this.props;
    if (item !== nextProps.item) {
      this.setState({ item: nextProps.item });
    }
  }

  toVendor = () => {
    const { canToVendor, item } = this.props;
    canToVendor && window.chanfanNavigation.navigate('AuctionShop', { params: { shopInfo: item } });
  }

  toFocus = () => {
    const { focusChangeNeedRefresh } = this.props;
    const { item } = this.state;
    request(item.is_attention == 0 ? '/auction/attention' : '/auction/del_attention', { params: { user_id: item.user_id } }).then((res) => {
      showToast(res.callbackMsg);
      this.setState({ item: { ...item, is_attention: item.is_attention == 0 ? 1 : 0 } });
      if (focusChangeNeedRefresh) {
        if (item.is_attention == 0) {
          addFocusItem(item);
        } else {
          removeFocusItem(item);
        }
      }
    });
  }

  toShare = () => {
    const { userId } = this.props;
    const data = getMyAuctionShop()?.list?.[0] || {
      title: '我正在炒饭APP上拍卖这些宝贝，快来看看吧',
      image: `${appJson.imageUrl}/tower/other/cf.png?x-oss-process=image/resize,m_lfit,w_60`,
    };
    showShare({
      text: data.title,
      img: data.image,
      url: `${appJson.webUrl}/shareAuctionVendor/${userId}`,
      title: '我正在炒饭APP上拍卖这些宝贝，快来看看吧',
    });
  }

  render() {
    const {
      CustomBtn, marginBottom, marginHorizontal, canToVendor,
    } = this.props;
    const { item } = this.state;
    const Wrapper = canToVendor ? ScaleView : View;
    const isSelf = item.user_id == getUserInfo().id;
    return (
      <Wrapper style={[styles.header, { marginBottom, marginHorizontal }]} onPress={this.toVendor}>
        <View style={{ flexDirection: 'row' }}>
          <AvatarWithShadow size={49} source={{ uri: item.avatar }} />
          <View style={{ marginLeft: 10, marginTop: 12 }}>
            <NameAndGender name={item.user_name} sex={item.sex} />
            <Text style={{ fontSize: 11, color: '#696969' }}>
              累计成交订单：
              <Text style={{ fontSize: 11, color: '#37B6EB', fontFamily: YaHei }}>{item.count}</Text>
            </Text>
          </View>
        </View>
        {
          CustomBtn || (isSelf ? (
            <TouchableOpacity onPress={this.toShare} hitSlop={hitSlop} style={styles.focusBtn}>
              <Text style={{ fontSize: 13, color: '#fff' }}>分享</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={this.toFocus}
              hitSlop={hitSlop}
              style={[styles.focusBtn, { backgroundColor: item.is_attention == 1 ? '#C5C5C5' : '#000' }]}
            >
              <Text style={{ fontSize: 13, color: '#fff' }}>{item.is_attention == 1 ? '已关注' : '+ 关注'}</Text>
            </TouchableOpacity>
          ))
        }
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  header: {
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
    backgroundColor: '#000',
  },
});
