import React, { PureComponent } from 'react';
import { RefreshControl, View, FlatList } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchSimpleData } from '../../redux/actions/simpleData';
import { getSimpleData } from '../../redux/reselect/simpleData';
import ShopBasicInfoCom from './components/ShopBasicInfoCom';
import SelfBottomCom from './components/bottom';
import Colors from '../../res/Colors';
import ShopConstant from '../../common/ShopConstant';
import MemberCom from './components/MemberCom';
import DetailImage from './components/DetailImage';
import { showNoPayment } from '../../utils/CommonUtils';

const TYPE = 'activityInfo';

function mapStateToProps() {
  return state => ({
    activityInfo: getSimpleData(state, TYPE),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData,
  }, dispatch);
}

class ShopDetail extends PureComponent {
  static navigationOptions = () => ({ title: '商品详情' });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.routeParams = navigation.getParam('params') || {};
    this.fetchData();
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.didBlurSubscription = navigation.addListener(
      'willFocus',
      (payload) => {
        if (['Navigation/BACK', 'Navigation/POP'].includes(payload.action.type) && window.waitPay) {
          window.waitPay = null;
          showNoPayment();
        }
      },
    );
  }

  componentWillUnmount() {
    this.didBlurSubscription.remove();
  }

  fetchData = (refresh) => {
    const { fetchSimpleData } = this.props;
    this.params = { id: this.routeParams.shopId };
    fetchSimpleData(TYPE, this.params, refresh);
  }

  onRefresh = () => {
    this.fetchData('refresh');
  };

  setContentOrBottomUI = (shopInfo) => {
    const { navigation } = this.props;
    const type = shopInfo.activity.type;
    if (type === ShopConstant.ORIGIN_CONST || type === ShopConstant.SELF_SUPPORT) {
      return <SelfBottomCom navigation={navigation} />;
    }
    return null;
  };

  renderItem = ({ item }) => {
    const { activityInfo: { data }, navigation } = this.props;
    if (item === 'MemberCom') {
      return <MemberCom navigation={navigation} shopInfo={data} />;
    }
    return <DetailImage item={item} />;
  }

  render() {
    const { activityInfo: { data, fetchedParams } } = this.props;
    if (JSON.stringify(fetchedParams) !== JSON.stringify(this.params) || !fetchedParams) { return <View />; }
    const { is_join, goods_image } = data;
    let list = [];
    if (is_join === ShopConstant.NOT_JOIN) {
      list = [
        ...list,
        { height: 239, source: require('../../res/image/gonggao.jpeg') },
        ...goods_image,
        { height: 192, source: require('../../res/image/rule.jpeg') },
      ];
    } else {
      list = [...list, 'MemberCom'];
    }
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<ShopBasicInfoCom activityInfo={data} />}
          data={list}
          contentContainerStyle={{ paddingBottom: 7 }}
          style={{ flex: 1 }}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `detail-${item}-${index}`}
          maxToRenderPerBatch={3}
          initialNumToRender={1}
          refreshControl={(
            <RefreshControl
              progressViewOffset={20}
              tintColor={Colors.YELLOW}
              onRefresh={this.onRefresh}
              refreshing={false}
            />
          )}
        />
        { this.setContentOrBottomUI(data) }
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopDetail);
