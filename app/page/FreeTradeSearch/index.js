import React, { PureComponent } from 'react';
import {
  View, TextInput, StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Image, FreeTradeList, Dropdown } from '../../components';
import UserList from './UserList';
import BrandList from './BrandList';
import { debounceDelay, changeVersion } from '../../utils/CommonUtils';
import { receiveUser } from '../../redux/actions/userInfo';
import { STATUSBAR_HEIGHT } from '../../common/Constant';
import { getUserInfo } from '../../redux/reselect/userInfo';

function mapStateToProps() {
  return state => ({
    userInfo: getUserInfo(state),
  });
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    receiveUser,
  }, dispatch);
}

class FreeTradeSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.options = [
      { id: 'goods', title: '货品' },
      { id: 'user', title: '用户' },
    ];
    this.state = {
      filterType: 'goods',
      text: '',
    };
  }

  filter = ({ filterType }) => {
    this.setState({ filterType }, () => {
      const { text } = this.state;
      if (text !== '') {
        this.fetchData();
      }
    });
  }

  onChangeText = (text) => {
    changeVersion(text);
    this.setState({ text }, this.fetchData);
  }

  fetchData = () => {
    const { filterType, text } = this.state;
    if (filterType === 'goods') {
      this.freeTradeList && this.freeTradeList.fetchData(null, { goods_name: text });
    } else if (filterType === 'user') {
      this.userList && this.userList.fetchData(null, { user_name: text });
    }
  }

  render() {
    const { filterType, text } = this.state;
    const { navigation, userInfo } = this.props;
    const List = {
      goods: <FreeTradeList
        type="freeTradeSearch"
        navigation={navigation}
        inputParams={{ goods_name: text }}
        autoFetch={false}
        ref={(v) => { this.freeTradeList = v; }}
      />,
      user: <UserList
        navigation={navigation}
        inputParams={{ user_name: text }}
        ref={(v) => { this.userList = v; }}
      />,
    }[filterType];
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: !userInfo.isTestVersion ? STATUSBAR_HEIGHT + 15 : 0 }}>
        <View style={styles.header}>
          <View style={styles.inputWrapper}>
            <Image source={require('../../res/image/search.png')} style={{ height: 12, width: 12 }} />
            <TextInput
              style={styles.input}
              placeholder="搜索"
              selectionColor="#00AEFF"
              placeholderTextColor="#D6D6D6"
              underlineColorAndroid="transparent"
              clearButtonMode="while-editing"
              onChangeText={debounceDelay(this.onChangeText)}
            />
          </View>
          <Dropdown filter={this.filter} index="filterType" options={this.options} defaultValue={this.options[0]} width={60} />
        </View>
        { text.length > 0 ? List : <BrandList navigation={navigation} /> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginBottom: 10,
  },
  inputWrapper: {
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    borderRadius: 2,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    paddingLeft: 10,
    flex: 1,
    marginRight: 20,
  },
  input: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    height: '100%',
    includeFontPadding: false,
    padding: 0,
    color: '#000',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FreeTradeSearch);
