import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Switch from 'react-native-switch-pro';
import {
  FadeImage, CountdownCom, ScaleView, BtnGroup, AvatarWithShadow,
} from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { YaHei } from '../../res/FontFamily';
import { formatDate } from '../../utils/CommonUtils';
import { btnOnPress, itemOnPress } from '../../utils/Auction';
import TitleWithTag from './TitleWithTag';
import { request } from '../../http/Axios';

type Props = {
  item: Object,
};

export default class ListItemSellerHistory extends PureComponent<Props> {
  constructor(props) {
    super(props);
    const { item } = this.props;
    this.state = {
      finished: false,
      autoPutOn: item.auto_put_on,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { item } = this.props;
    if (item.end_time !== nextProps.item.end_time) {
      this.setState({ finished: item.status == 3 });
    }
  }

  toAuctionDetail = () => {
    const { item } = this.props;
    itemOnPress(item);
  }

  finish = () => {
    const { changeListData, type, item } = this.props;
    this.setState({ text: '正在结算本次拍卖结果' });
    setTimeout(() => {
      request('/auction/get_auction_info', { params: { id: item.id } }).then((res) => {
        changeListData(type, data => ({
          ...data,
          list: data.list.map((v) => {
            if (v.id == item.id) {
              return res.data;
            }
            return v;
          }),
        }));
        setTimeout(() => { this.setState({ text: null }); });
      });
    }, 3000);
  }

  setAutoPutOn = () => {
    const { autoPutOn } = this.state;
    const { item } = this.props;
    this.setState({ autoPutOn: autoPutOn == 0 ? 1 : 0 }, () => {
      request('/auction/auto_put_on', { params: { id: item.id, auto_put_on: autoPutOn == 0 ? 1 : 0 } }).catch(() => {
        this.setState({ autoPutOn });
      });
    });
  }

  render() {
    const { item, titleStyle } = this.props;
    const { finished, autoPutOn, text } = this.state;
    // -1-审核未通过 1-审核中，2-拍卖中，3-已结束，4-已流拍，5-手动下架
    // 订单状态 -1买家逾期付款订单关闭 0买家未付款，1买家已付款卖家未发货 2卖家已发货  3平台已收货鉴定中，4鉴定失败退回，5发往买家中，6交易完成，7卖家发货逾期
    let btns = [];
    if (item.status == -1) {
      btns = [
        { text: '编辑', onPress: () => btnOnPress(item, 'edit'), color: '#000' },
        { text: '删除', onPress: () => btnOnPress(item, 'delete') },
      ];
    } else if (item.status == 1) {
      btns = [
        { text: '下架', onPress: () => btnOnPress(item, 'cancel') },
      ];
    } else if (['4', '5'].includes(item.status) || ['-1', '7'].includes(item.order_status)) {
      btns = [
        { text: '编辑', onPress: () => btnOnPress(item, 'edit'), color: '#000' },
        { text: '上架', onPress: () => btnOnPress(item, 'putOn'), color: '#0A8CCF' },
      ];
    }
    return (
      <ScaleView style={styles.container} onPress={this.toAuctionDetail}>
        <FadeImage source={{ uri: item.images[0]?.url }} style={styles.shoe} />
        <View style={styles.right}>
          <TitleWithTag style={titleStyle} text={item.title} type={item.status} />
          { item.status == -1 && <Text style={{ color: '#EF4444', fontSize: 11 }}>{item.reason}</Text>}
          {
            ['2', '3', '4'].includes(item.status) && !text && (
              <CountdownCom
                style={styles.time}
                time={item.end_time}
                format="竞拍结束 time"
                finish={this.finish}
                endTimerText={`竞拍结束 ${formatDate(item.end_time)}`}
                endStyle={{ fontSize: 11, color: '#C1C1C1' }}
              />
            )
          }
          { text && <Text style={[styles.time, { bottom: -1 }]}>{text}</Text> }
          {
            ['2', '3'].includes(item.status) && (
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  {
                    item.max_buy?.price ? (
                      <View style={styles.priceWrapper}>
                        <AvatarWithShadow size={20} source={{ uri: item.max_buy.avatar }} />
                        <Text style={styles.maxPrice}>{item.max_buy.order_type == 1 ? '一口价' : '最高出价'}</Text>
                        <Text style={{ fontSize: 10 }}>￥</Text>
                        <Text style={styles.price}>{item.max_buy.price / 100}</Text>
                      </View>
                    ) : <Text style={styles.wuchujia}>暂无出价</Text>
                  }

                  {
                    !finished && item.status == 2 && (
                      <Switch
                        width={34}
                        height={18}
                        backgroundActive="#FFA700"
                        backgroundInactive="#B3B3B3"
                        value={autoPutOn == 1}
                        onAsyncPress={this.setAutoPutOn}
                      />
                    )
                  }
                </View>
                { !finished && item.status == 2 && <Text style={styles.liupai}>{`流拍自动上架(已${autoPutOn == 1 ? '开启' : '关闭'})`}</Text> }
              </View>
            )
          }
          <View style={styles.btn}>
            {
              ['4', '5'].includes(item.status)
                ? <Text style={styles.wuchujia}>暂无出价</Text>
                : item.order_status == 7
                  ? <Text style={[styles.wuchujia, { color: '#EF4444' }]}>发货逾期</Text>
                  : item.order_status == -1
                    ? <Text style={[styles.wuchujia, { color: '#EF4444' }]}>买家未付款</Text>
                    : <View />
            }
            { btns.length > 0 && <BtnGroup btns={btns} /> }
          </View>
        </View>
      </ScaleView>
    );
  }
}

const styles = StyleSheet.create({
  wuchujia: {
    color: '#BFBFBF',
    fontSize: 12,
    fontFamily: YaHei,
  },
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 9,
    marginBottom: 7,
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
    paddingRight: 8,
  },
  maxPrice: {
    fontSize: 11,
    color: '#FFA700',
    fontFamily: YaHei,
    marginLeft: 4,
    marginRight: 2,
  },
  right: {
    flex: 1,
    marginLeft: 10,
    marginTop: 2,
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 8,
  },
  shoe: {
    width: wPx2P(129.5),
    height: wPx2P(125),
  },
  time: {
    color: '#FFA700',
    fontSize: 11,
  },
  priceWrapper: {
    marginLeft: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 19,
    fontFamily: YaHei,
    top: 4,
  },
  btn: {
    alignItems: 'flex-end',
    paddingRight: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  liupai: {
    textAlign: 'right',
    color: '#BFBFBF',
    fontSize: 10.5,
    marginTop: 4,
  },
});
