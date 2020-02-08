import React, { PureComponent } from 'react';
import {
  StyleSheet, View, Text, Clipboard,
} from 'react-native';
import {
  FadeImage, BtnGroup, Price, Tag,
} from '../../../components';
import { wPx2P } from '../../../utils/ScreenUtil';
import TitleWithTag from './TitleWithTag';
import { formatDate } from '../../../utils/CommonUtils';
import { YaHei } from '../../../res/FontFamily';
import { showToast } from '../../../utils/MutualUtil';

type Props = {
  item: Object,
  showSeal?: Boolean,
  btns?: Array<Object>,
  RightBottom: any,
  timePrefix: String,
  timeText: String,
  priceTag: String,
  price: Number,
  CountdownCom: any,
  Hint: any,
};

export default class ListItem extends PureComponent<Props> {
  static defaultProps = {
    showSeal: false,
    btns: [],
  }

  copy = () => {
    const { item } = this.props;
    Clipboard.setString(item.order_id);
    showToast('订单号已复制');
  }

  render() {
    const {
      item, RightBottom, timePrefix, timeText, btns, price, priceTag, CountdownCom, Hint, showSeal,
    } = this.props;
    const image = (item.goods || item).icon;
    const goods_name = (item.goods || item).goods_name;
    const tagText = {
      0: '待发货',
      1: '运输中',
      2: '鉴定中',
      3: '未通过',
      5: '上架中',
      6: '待买家付款',
    }[item.goods_status];
    const tagColor = {
      0: '#F08700',
      1: '#000000',
      2: '#979797',
      3: '#E84242',
      5: '#F46403',
      6: '#E84242',
    }[item.goods_status] || '#000';
    return (
      <View style={styles.container}>
        <View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <FadeImage source={{ uri: image }} style={styles.shoe} />
          </View>
          <Text style={{ fontSize: 12 }}>{`SIZE：${item.size}`}</Text>
          {item.order_id && <Text onPress={this.copy} style={styles.id}>{`编号: ${item.order_id}`}</Text>}
        </View>
        <View style={styles.right}>
          <TitleWithTag text={goods_name} type={item.is_stock} />
          <View style={[styles.middle, { marginTop: 10 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', flex: 1 }}>
              {price && <Price price={price} offsetBottom={2} /> }
              {price && priceTag && <Tag style={{ marginLeft: 3, marginBottom: 2 }} text={priceTag} />}
            </View>
            {
              timeText ? (
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                  <Text style={{ fontSize: 11, color: '#858585' }}>{timePrefix}</Text>
                  <Text style={{ fontSize: 11, fontFamily: YaHei, marginLeft: 2 }}>
                    {formatDate(timeText, 'yyyy-MM-dd')}
                  </Text>
                </View>
              ) : CountdownCom || null
            }
          </View>
          {Hint}
          <View style={styles.middle}>
            {tagText && showSeal ? <Text style={[styles.iconTag, { color: tagColor }]}>{`[${tagText}]`}</Text> : <View />}
            { btns.length > 0 && <BtnGroup btns={btns} /> }
            { RightBottom }
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 110,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginHorizontal: 9,
    marginBottom: 7,
    flexDirection: 'row',
    borderRadius: 2,
    overflow: 'hidden',
  },
  right: {
    flex: 1,
    marginLeft: 10,
    marginTop: 2,
  },
  shoe: {
    width: wPx2P(129 * 0.87),
    height: wPx2P(80 * 0.87),
  },
  middle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'flex-end',
  },
  id: {
    fontSize: 8,
    letterSpacing: -0.1,
  },
  tag: {
    width: wPx2P(52),
    height: wPx2P(52),
    top: wPx2P(12),
    left: wPx2P(20),
  },
  iconTag: {
    fontSize: 12,
    fontFamily: YaHei,
  },
});
