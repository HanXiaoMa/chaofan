/* @flow */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AuctionUserItem } from '../../components';
import { getSimpleData } from '../../redux/reselect/simpleData';
import { fetchSimpleData, changeSimpleData } from '../../redux/actions/simpleData';


const TYPE = 'auctionMyShopInfo';

function mapStateToProps() {
  return state => ({
    simpleData: getSimpleData(state, TYPE),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData, changeSimpleData,
  }, dispatch);
}

type Props = {
  userId: String,
};

class MyShopInfo extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const { userId, fetchSimpleData } = this.props;
    fetchSimpleData(TYPE, { user_id: userId }, null, {});
  }

  render() {
    const {
      simpleData: { data = {} },
    } = this.props;
    return <AuctionUserItem item={data} canToVendor={false} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyShopInfo);
