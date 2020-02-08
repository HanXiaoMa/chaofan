import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import SelectShoeSizeCom from '../SelectShoeSizeCom';
import BuyBottomCom from './BuyBottomCom';
import ShopConstant from '../../../../common/ShopConstant';
import { getSimpleData } from '../../../../redux/reselect/simpleData';
import { debounce, shareAcyivity, checkAuth } from '../../../../utils/CommonUtils';
import { showToast, closeModalbox, showModalbox } from '../../../../utils/MutualUtil';
import { BottomBtnGroup } from '../../../../components';
import SelectShoeSizeByUnJoinsCom from '../SelectShoeSizeByUnJoinsCom';

function mapStateToProps() {
  return state => ({
    shopDetailInfo: getSimpleData(state, 'activityInfo'),
  });
}

class SelfBottomCom extends PureComponent {
  _toCommissionPage = () => {
    const { navigation } = this.props;
    navigation.navigate('Commission', { title: '助攻佣金设定' });
  };

  /**
   * 显示选鞋浮层
   */
  showOver = () => {
    checkAuth('ShopDetail').then(() => {
      const { shopDetailInfo, navigation } = this.props;
      const shopId = shopDetailInfo.data.activity.id;
      const Wrapper = shopDetailInfo.data.is_join === 0 ? SelectShoeSizeByUnJoinsCom : SelectShoeSizeCom;
      showModalbox({
        element: (<Wrapper
          shopId={shopId}
          navigation={navigation}
          closeBox={this.closeBox}
          shopInfo={shopDetailInfo.data}
          notStart
        />),
        options: {
          style: {
            height: 400,
            backgroundColor: 'transparent',
          },
          position: 'bottom',
        },
      });
    });
  };

  closeBox = (immediately) => {
    closeModalbox(immediately);
  };

  /**
   * @param shopInfo 商品信息
   * @param isStart 活动是否开始
   * @returns {*}
   * @private
   */
  _normalDOM = (shopInfo, isStart) => {
    const isJoin = shopInfo.is_join;
    const joinUser = shopInfo.join_user;
    // 活动未开始且是参团人员
    if (isJoin === ShopConstant.MEMBER && !isStart) {
      if (shopInfo.activity.b_type === ShopConstant.DRAW) {
        return null;
      }
      return <BottomBtnGroup btns={[{ text: '助攻抢购', onPress: () => showToast('活动未开始') }]} />;
    }
    const btns = [];
    if (joinUser.length !== 0) {
      btns.push({ text: '分享', onPress: debounce(this._showShare) });
    } else {
      btns.push({ text: '通知我', onPress: () => checkAuth('ShopDetail').then(() => showToast('已添加到通知')) });
    }
    btns.push(this.setRightDOM(shopInfo));
    return <BottomBtnGroup btns={btns} />;
  };

  setRightDOM = (shopInfo) => {
    const is_join = shopInfo.is_join;
    // 未参加活动
    const text = is_join === ShopConstant.NOT_JOIN ? (
      shopInfo.activity.b_type === '1' ? '我要抽签' : '我要抢购'
    ) : '招兵买码';
    return ({ text, onPress: debounce(this.showOver) });
  };

  _showShare = () => {
    const { shopDetailInfo } = this.props;
    const shopInfo = shopDetailInfo.data;
    shareAcyivity(shopInfo);
  };

  render() {
    const { shopDetailInfo: { data: shopInfo }, navigation } = this.props;
    // 活动子类型:1、抽签；2、抢购
    const b_type = shopInfo.activity.b_type;
    // 活动未开始
    if (shopInfo.activity.start_time - Date.now() / 1000 > 0) {
      return this._normalDOM(shopInfo, false);
    }
    if (b_type === ShopConstant.DRAW) {
      return null;
    }
    return (
      <BuyBottomCom
        navigation={navigation}
        shopInfo={shopInfo}
        showModalbox={showModalbox}
        closeModalbox={closeModalbox}
      />
    );
  }
}

export default connect(mapStateToProps)(SelfBottomCom);
