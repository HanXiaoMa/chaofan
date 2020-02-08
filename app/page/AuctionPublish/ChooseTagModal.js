/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Image } from '../../components';
import { closeModalbox } from '../../utils/MutualUtil';
import { getSimpleData } from '../../redux/reselect/simpleData';

const SIZE = SCREEN_WIDTH / 5;

function mapStateToProps() {
  return state => ({
    simpleData: getSimpleData(state, 'auctionBanner'),
  });
}

class ChooseTagModal extends PureComponent {
  onChoosed = (item) => {
    const { onChoosed } = this.props;
    onChoosed(item);
    closeModalbox();
  }

  render() {
    const { simpleData } = this.props;
    const tags = (simpleData?.data?.goods_type || []).map(v => ({ ...v, source: { uri: v.image } }));
    return (
      <ScrollView style={{ backgroundColor: '#fff' }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        {
          tags.map((item, i) => (
            <TouchableOpacity style={styles.item} key={i} onPress={() => this.onChoosed(item)}>
              <Image source={item.source} style={{ height: SIZE, width: SIZE }} />
              <Text style={{ fontSize: 12, marginTop: 5 }}>{item.type_name}</Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 7,
    flex: 1,
  },
  item: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 15,
  },
});

export default connect(mapStateToProps)(ChooseTagModal);
