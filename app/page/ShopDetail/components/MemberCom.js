import React, { PureComponent } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import Colors from '../../../res/Colors';
import { YaHei } from '../../../res/FontFamily';
import { AvatarWithShadow, NameAndGender } from '../../../components';

const baseURL = require('../../../../app.json').webUrl;

export default class MemberCom extends PureComponent {
  toHelp = () => {
    const { navigation, shopInfo } = this.props;
    navigation.navigate('Web', {
      title: '活动规则',
      params: {
        url: `${baseURL}/help/${shopInfo?.activity?.b_type === 1 ? 'draw' : 'panicbuy'}`,
      },
    });
  }

  renderLeader = (item, userActivity, joinUserLength) => (
    <View style={styles.listContainer}>
      <AvatarWithShadow isCert={item.is_cert} source={{ uri: item.avatar }} size={55} />
      <View style={{ flex: 1, marginLeft: 12, paddingTop: 4 }}>
        <NameAndGender name={item.user_name} sex={item.sex} />
        <Text style={{ color: '#111', fontSize: 11, marginTop: 2 }}>已取号</Text>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end', paddingTop: 5 }}>
        <View>
          <Text style={{ color: '#696969', fontSize: 11 }}>{`我的团队：${joinUserLength}人`}</Text>
          <Text style={{ color: '#696969', fontSize: 11 }}>
          助攻佣金：
            <Text style={{ color: Colors.RED, fontSize: 12 }}>{userActivity.pay_price / 100}</Text>
          ￥
          </Text>
        </View>
      </View>
    </View>
  );

  renderMember = (item, index) => (
    <View key={index} style={styles.item}>
      <AvatarWithShadow isCert={item.is_cert} source={{ uri: item.avatar }} size={41} />
      <Text style={{ marginTop: 5, fontSize: 10 }}>{item.user_name}</Text>
    </View>
  )

  render() {
    const { shopInfo } = this.props;
    const joinUser = shopInfo.join_user;
    const userActivity = shopInfo.user_activity;
    const number = userActivity.number;
    return (
      <View style={styles.container}>
        <View style={styles.fengexiancu} />
        <View style={styles.acContainer}>
          <Text style={styles.acNormalMes}>
            预期购买
            <Text style={styles.acImpMes}>{number}</Text>
            双
          </Text>
          <Text style={styles.acNormalMes}>
            团队上限
            <Text style={styles.acImpMes}>{number}</Text>
            人
          </Text>
          <Text style={styles.acNormalMes}>
            参与人数
            <Text style={styles.acImpMes}>{joinUser.length}</Text>
            人
          </Text>
          <Text style={styles.acNormalMes}>
            还差
            <Text style={styles.acImpMes}>{number - joinUser.length}</Text>
            人满额
          </Text>
        </View>
        <View style={styles.fengexianWrapper}>
          <View style={styles.fengexian} />
        </View>
        <Text onPress={this.toHelp} style={styles.rule}>活动规则&gt;</Text>
        {joinUser && this.renderLeader(joinUser[0], userActivity, joinUser.length)}
        <View style={styles.list2Container}>
          {joinUser && joinUser.slice(1).map(this.renderMember) }
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.MAIN_BACK,
    minHeight: '200%',
  },
  fengexianWrapper: {
    backgroundColor: '#fff',
    height: StyleSheet.hairlineWidth,
    width: SCREEN_WIDTH,
  },
  fengexian: {
    backgroundColor: Colors.MAIN_BACK,
    flex: 1,
    marginHorizontal: 17,
  },
  rule: {
    height: 36,
    lineHeight: 36,
    textAlign: 'right',
    fontSize: 12,
    color: '#37B6EB',
    paddingRight: 17,
    backgroundColor: '#fff',
    fontFamily: YaHei,
  },
  fengexiancu: {
    backgroundColor: Colors.MAIN_BACK,
    width: SCREEN_WIDTH,
    height: 7,
  },
  acContainer: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingRight: 17,
    height: 30,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  acNormalMes: {
    fontSize: 11,
    color: '#333',
    fontFamily: YaHei,
    fontWeight: '400',
    marginLeft: 17,
  },
  acImpMes: {
    fontSize: 11,
    color: Colors.RED,
    fontFamily: YaHei,
    fontWeight: '400',
  },
  list2Container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 10,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginTop: 7,
  },
  listContainer: {
    marginHorizontal: 10,
    marginTop: 7,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 7,
    paddingVertical: 6,
  },
  item: {
    width: (SCREEN_WIDTH - 20) / 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});
