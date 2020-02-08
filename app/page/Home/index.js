import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { TabBar, Image } from '../../components';
import { STATUSBAR_HEIGHT } from '../../common/Constant';
import List from './List';
import { getUserInfo } from '../../redux/reselect/userInfo';

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

const getRoutes = isTestVersion => (isTestVersion ? [
  { key: 'indexList1', title: '原价发售', id: '1' },
  { key: 'indexList2', title: '炒饭专区', id: '2' },
  { key: 'chaofanAuction', title: '炒饭拍卖' },
] : [
  { key: 'indexList1', title: '原价发售', id: '1' },
  { key: 'indexList2', title: '炒饭专区', id: '2' },
]);

class HomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  onIndexChange = (index) => {
    this.setState({ index });
  }

  renderScene = ({ route }) => {
    const { navigation } = this.props;
    return <List navigation={navigation} apiType={route.key} id={route.id} />;
  }

  toSearch = () => {
    const { navigation } = this.props;
    navigation.navigate('AuctionSearch', { params: { apiType: 'auctionOfficialSearch' } });
  }

  renderTabBar = (props) => {
    const { userInfo } = this.props;
    const { index } = this.state;
    return (
      <View>
        <TabBar
          style={styles.tabBar}
          routes={getRoutes(userInfo.isTestVersion)}
          position={props.position}
          onIndexChange={this.onIndexChange}
        />
        {
          index === 2 && (
            <Image
              onPress={this.toSearch}
              hitSlop={{
                top: 20, right: 20, left: 50, bottom: 20,
              }}
              source={require('../../res/image/search-index.png')}
              style={styles.search}
            />
          )
        }
      </View>
    );
  }

  render() {
    const { userInfo } = this.props;
    const { index } = this.state;
    const navigationState = {
      index,
      routes: getRoutes(userInfo.isTestVersion),
    };
    return (
      <TabView
        style={styles.tabView}
        navigationState={navigationState}
        renderScene={this.renderScene}
        renderTabBar={this.renderTabBar}
        onIndexChange={this.onIndexChange}
        useNativeDriver
        initialLayout={{ width: SCREEN_WIDTH }}
        lazy
      />
    );
  }
}

const styles = StyleSheet.create({
  tabView: {
    marginTop: STATUSBAR_HEIGHT,
    flex: 1,
  },
  tabBar: {
    height: 50,
    flexDirection: 'row',
    paddingTop: 20,
  },
  search: {
    height: 19,
    width: 19,
    position: 'absolute',
    right: 16,
    top: 20,
  },
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(HomePage);
