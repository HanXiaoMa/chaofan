import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ShopConstant from '../../../../common/ShopConstant';
import { getSimpleData } from '../../../../redux/reselect/simpleData';
import SelectShoeSizeByUnJoinsCom from '../SelectShoeSizeByUnJoinsCom';
import { debounce } from '../../../../utils/CommonUtils';
import { closeModalbox, showModalbox } from '../../../../utils/MutualUtil';
import { request } from '../../../../http/Axios';
import { BottomBtnGroup } from '../../../../components';

function mapStateToProps() {
  return state => ({
    shopDetailInfo: getSimpleData(state, 'activityInfo'),
  });
}

class BuyBottomCom extends PureComponent {
  onPress = () => {
    const { shopInfo, navigation } = this.props;
    const activityId = shopInfo.activity.id;
    const is_join = shopInfo.is_join;
    if (is_join === ShopConstant.NOT_JOIN) {
      this.showOver();
    } else if (is_join === ShopConstant.LEADING) {
      this.doBuy(true, activityId, navigation, shopInfo);
    } else if (is_join === ShopConstant.MEMBER) {
      this.doBuy(false, activityId, navigation, shopInfo);
    }
  }

  doBuy = (isLeading, activity_id, navigation, shopInfo) => {
    const url = isLeading ? '/order/do_buy' : '/order/do_help_buy';
    const params = { activity_id };
    request(url, { params }).then((res) => {
      navigation.navigate('Panicstatus', {
        title: '抢购成功',
        params: {
          shopInfo,
          payData: res.data,
          isSuccess: true,
          needHintPay: isLeading,
        },
      });
    }).catch(() => {
      navigation.navigate('Panicstatus', {
        title: '抢购失败',
        params: {
          shopInfo, isSuccess: false,
        },
      });
    });
  }

  buyBottomText = () => {
    const { shopInfo } = this.props;
    const is_join = shopInfo.is_join;
    if (is_join === ShopConstant.NOT_JOIN) {
      return '选择尺码';
    } if (is_join === ShopConstant.LEADING) {
      return '立即抢购';
    } if (is_join === ShopConstant.MEMBER) {
      return '助攻抢购';
    }
  };

  showOver = () => {
    const { shopInfo, navigation } = this.props;
    const shopId = shopInfo.activity.id;
    showModalbox({
      element: (<SelectShoeSizeByUnJoinsCom
        shopId={shopId}
        navigation={navigation}
        shopInfo={shopInfo}
        closeBox={this.closeBox}
      />),
      options: {
        style: {
          height: 400,
          backgroundColor: 'transparent',
        },
        position: 'bottom',
      },
    });
  };

  closeBox = () => {
    closeModalbox();
  };

  render() {
    return <BottomBtnGroup btns={[{ text: this.buyBottomText(), onPress: debounce(this.onPress) }]} />;
  }
}

export default connect(mapStateToProps)(BuyBottomCom);
