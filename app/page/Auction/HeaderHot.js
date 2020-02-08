/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
import React, { PureComponent } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Carousel from 'react-native-snap-carousel';
import {
  Banner, Image, Dropdown, Slogan, ScaleView,
} from '../../components';
import { wPx2P } from '../../utils/ScreenUtil';
import { checkAuth } from '../../utils/CommonUtils';
import { YaHei } from '../../res/FontFamily';
import { getSimpleData } from '../../redux/reselect/simpleData';
import { fetchSimpleData } from '../../redux/actions/simpleData';

const bannerWidth = parseInt(SCREEN_WIDTH - 36 - 7 - wPx2P(46));

function mapStateToProps() {
  return state => ({
    simpleData: getSimpleData(state, 'auctionBanner'),
    simpleData1: getSimpleData(state, 'auctionBanner1'),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchSimpleData,
  }, dispatch);
}

const categoryItemWidth = (SCREEN_WIDTH - 18 - wPx2P(36)) / 4;

class Hot extends PureComponent {
  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { fetchSimpleData } = this.props;
    fetchSimpleData('auctionBanner');
    fetchSimpleData('auctionBanner1');
  }

  toPublish = () => {
    checkAuth('BottomNavigator', { routeName: 'AuctionPublish' });
  }

  resetFilter = () => {
    this.dropdown.reset();
  }

  toCategory = (category) => {
    const { navigation } = this.props;
    navigation.navigate('AuctionCategory', {
      title: category.type_name,
      params: {
        category,
      },
    });
  }

  toGoodShops = () => {
    const { navigation } = this.props;
    navigation.navigate('AuctionGoodShops');
  }

  toAuctionOfficial = () => {
    const { propOnIndexChange } = this.props;
    propOnIndexChange(2, 2);
  }

  renderItem = ({ item }) => <Image source={{ uri: item }} style={styles.lingyuanpaiBanner} />

  render() {
    const {
      navigation, filter, simpleData, simpleData1,
    } = this.props;
    const options = [
      { title: '综合', order_type: -1 },
      { title: '最新', order_type: 1 },
      { title: '最多人参与', order_type: 2 },
    ];
    const tags = (simpleData?.data?.goods_type || []).map(v => ({ ...v, source: { uri: v.image } }));
    // const showTags = tags.length > 6 ? [...tags, {
    //   source: require('../../res/image/all.png'), id: 'all', type_name: '全部分类',
    // }] : tags;
    const showTags = tags;
    return (
      <View>
        <Banner
          data={simpleData?.data?.banner}
          navigation={navigation}
          height={138}
          inDotColor="rgba(255,255,255,0.8)"
          dotColor="#FFA700"
        />
        <Slogan />
        <TouchableOpacity onPress={this.toPublish} style={styles.qupaimaiBtn}>
          <Text style={styles.qupaimai}>去拍卖</Text>
        </TouchableOpacity>
        <View style={styles.categoryList}>
          {
            showTags.slice(0, 8).map((v, i) => (
              <ScaleView
                onPress={() => this.toCategory(v)}
                style={[styles.categoryItem, { marginRight: i % 4 === 3 ? 0 : wPx2P(12), marginBottom: 10 }]}
                key={i}
              >
                <Image source={v.source} style={{ height: categoryItemWidth - wPx2P(30), width: categoryItemWidth - wPx2P(30) }} />
                <Text style={{ fontSize: 10, marginTop: 5 }}>{v.type_name}</Text>
              </ScaleView>
            ))
          }
        </View>
        <Image onPress={this.toGoodShops} source={require('../../res/image/youxuanhaodian.png')} style={styles.youxuanhaodian} />

        <TouchableOpacity onPress={this.toAuctionOfficial} style={styles.toAuctionOfficial}>
          <Image source={require('../../res/image/lingyuanpai.png')} style={styles.lingyuanpai} />
          {
            simpleData1?.data && (
              <Carousel
                vertical
                data={simpleData1.data}
                renderItem={this.renderItem}
                sliderHeight={58}
                itemHeight={58}
                enableSnap
                loop
                containerCustomStyle={{ height: 58, marginLeft: 7 }}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                autoplay
                autoplayInterval={3000}
                useScrollView
                removeClippedSubviews={false}
              />
            )
          }
        </TouchableOpacity>

        <View style={styles.filter}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={require('../../res/image/filter-auction.png')} style={{ height: 10.5, width: 12.5, marginRight: 5 }} />
            <Text style={{ fontSize: 12 }}>排序分类</Text>
          </View>
          <Dropdown ref={(v) => { this.dropdown = v; }} filter={filter} index="order_type" options={options} width={90} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  lingyuanpaiBanner: {
    flexDirection: 'row',
    height: bannerWidth / 286 * 58,
    width: bannerWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toAuctionOfficial: {
    height: 58,
    marginHorizontal: 9,
    backgroundColor: '#fff',
    marginBottom: 7,
    borderRadius: 2,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 9,
  },
  lingyuanpai: {
    height: wPx2P(42),
    width: wPx2P(46),
  },
  youxuanhaodian: {
    height: wPx2P(57),
    width: wPx2P(357),
    alignSelf: 'center',
    marginBottom: 7,
  },
  categoryList: {
    backgroundColor: '#fff',
    borderRadius: 2,
    marginHorizontal: 9,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 4,
    marginBottom: 8,
  },
  categoryItem: {
    width: categoryItemWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filter: {
    backgroundColor: '#fff',
    borderRadius: 2,
    marginHorizontal: 9,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 36,
    alignItems: 'center',
    marginBottom: 8,
  },
  qupaimai: {
    color: '#fff',
    fontSize: 15,
    fontFamily: YaHei,
    textAlign: 'center',
  },
  qupaimaiBtn: {
    height: 37,
    borderRadius: 2,
    marginHorizontal: 9,
    marginBottom: 8,
    backgroundColor: '#FFA700',
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Hot);
