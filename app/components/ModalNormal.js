import React, { PureComponent } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { YaHei } from '../res/FontFamily';
import Images from '../res/Images';
import Image from './Image';
import Colors from '../res/Colors';
import { closeModalbox } from '../utils/MutualUtil';

export default class ModalNormal extends PureComponent {
  static defaultProps = {
    showCancel: true,
    showClose: true,
  }

  sure = () => {
    const { sure } = this.props;
    sure();
  }

  cancel = () => {
    const { closeModalbox: closeModalboxProps } = this.props;
    if (closeModalboxProps) {
      closeModalboxProps();
    } else {
      closeModalbox();
    }
  }

  render() {
    const {
      title, text, CustomDom, showCancel, sureText, cancelText, justifyContent, alignItems, showClose,
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{`${title || '友情提示'}`}</Text>
        <ScrollView
          centerContent={!justifyContent}
          contentContainerStyle={{
            alignItems: alignItems || 'center',
            paddingHorizontal: 20,
          }}
          style={styles.wrapper}
          alwaysBounceVertical={false}
        >
          {CustomDom || <Text style={styles.text}>{text}</Text>}
        </ScrollView>
        {
          showCancel ? (
            <View style={styles.btn}>
              <TouchableOpacity onPress={this.cancel} style={styles.cancel}>
                <Text style={styles.btnText}>{cancelText || '取消'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.sure} style={styles.cancel}>
                <Text style={styles.btnText}>{sureText || '确定'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={this.sure} style={styles.onlySure}>
              <Text style={styles.btnText}>{sureText || '确定'}</Text>
            </TouchableOpacity>
          )
        }

        {
          showClose && (
          <TouchableOpacity onPress={this.cancel} style={styles.cha}>
            <Image source={Images.chaNew} style={{ width: 9, height: 9 }} />
          </TouchableOpacity>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontFamily: YaHei,
    textAlign: 'center',
    marginTop: 20,
  },
  wrapper: {
    flex: 1,
    marginBottom: 20,
    marginTop: 20,
  },
  text: {
    fontSize: 14,
    fontFamily: YaHei,
    lineHeight: 16,
  },
  container: {
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  btn: {
    height: 45,
    flexDirection: 'row',
  },
  sure: {
    backgroundColor: Colors.YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cancel: {
    flex: 1,
    backgroundColor: Colors.YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cha: {
    position: 'absolute',
    right: 0,
    height: 35,
    width: 35,
    borderBottomLeftRadius: 2,
    paddingLeft: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 16,
    fontFamily: YaHei,
    marginTop: 13,
    textAlign: 'center',
    marginBottom: 27,
  },
  onlySure: {
    backgroundColor: Colors.YELLOW,
    height: 43,
    width: 204,
    borderRadius: 2,
    marginBottom: 38,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
