import React, { PureComponent } from 'react';
import { request } from '../../http/Axios';
import { AuctionUserItem } from '../../components';

export default class UserShopInfo extends PureComponent {
  constructor(props) {
    super(props);
    const { shopInfo = {} } = this.props;
    this.state = {
      shopInfo,
    };
  }

  componentDidMount() {
    const { userId } = this.props;
    request('/auction/sale_count', { params: { user_id: userId } }).then((res) => {
      this.setState({
        shopInfo: res.data,
      });
    });
  }

  render() {
    const { shopInfo } = this.state;
    return <AuctionUserItem canToVendor={false} item={shopInfo} />;
  }
}
