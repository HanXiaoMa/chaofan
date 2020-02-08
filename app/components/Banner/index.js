import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Animated from 'react-native-reanimated';
import Image from '../Image';
import { wPx2P } from '../../utils/ScreenUtil';
import { getBanner } from '../../redux/reselect/banner';
import { fetchBanner } from '../../redux/actions/banner';
import Dot from './Dot';

const AnimatedCarousel = Animated.createAnimatedComponent(Carousel);

function mapStateToProps() {
  return (state, props) => ({
    banner: getBanner(state, `banner${props.bannerId}`),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchBanner,
  }, dispatch);
}

class Banner extends PureComponent {
  constructor(props) {
    super(props);
    const { height } = this.props;
    this.state = {
      scrollX: new Animated.Value(0),
    };
    this.topImage = {
      width: wPx2P(375),
      height: wPx2P(height || 180),
      alignSelf: 'center',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { fetchBanner, bannerId } = this.props;
    if (bannerId) {
      fetchBanner(bannerId);
    }
  }

  refresh = () => {
    this.fetchData();
  }

  onPress = (item) => {
    // 跳转类型 1无跳转 2跳转H5 3跳转拍卖详情 4跳转用户拍卖首页
    const { navigation } = this.props;
    if (item.type == 5) {
      if (item.go_type == 1) {
        navigation.navigate('Web', {
          params: {
            showHelp: true,
            url: item.url,
          },
        });
      } else if (item.go_type == 2) {
        navigation.navigate('AuctionDetail', { params: { item: { id: item.url } } });
      } else if (item.go_type == 3) {
        navigation.navigate('AuctionShop', { params: { userId: item.url } });
      }
    } else {
      navigation.navigate('Web', {
        params: {
          showHelp: true,
          url: item.url,
        },
      });
    }
  }

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => this.onPress(item)}>
      <Image style={this.topImage} source={{ uri: item.image }} />
    </TouchableHighlight>
  )

  render() {
    const {
      banner, dotColor, data, bannerId, height, inDotColor,
    } = this.props;
    const { scrollX } = this.state;
    const list = (bannerId ? banner : data) || [];
    if (!list) {
      return <View style={this.topImage} />;
    } if (list.length === 1) {
      return this.renderItem({ item: banner[0] });
    }
    return (
      <View style={{ position: 'relative', height: wPx2P(height || 180), width: wPx2P(375) }}>
        <AnimatedCarousel
          data={list}
          slideStyle={{ alignItems: 'center', justifyContent: 'center' }}
          renderItem={this.renderItem}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH}
          enableSnap
          loop
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
          autoplay
          autoplayInterval={4000}
          removeClippedSubviews={false}
        />
        { scrollX && list.length > 1 && (
          <Dot
            dotColor={dotColor}
            inDotColor={inDotColor}
            position={scrollX}
            style={[styles.dot, { width: 12.5 * list.length }]}
            list={list}
          />
        ) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    height: 5,
    right: 7,
    bottom: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Banner);
