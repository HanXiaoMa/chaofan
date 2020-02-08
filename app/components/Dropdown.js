/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ScrollView, View,
} from 'react-native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import Colors from '../res/Colors';

export default class Dropdown extends PureComponent {
  static defaultProps = {
    titleField: 'title',
    showChoosedTitle: true,
    offsetRight: 0,
  }

  constructor(props) {
    super(props);
    const { defaultValue, titleField, options } = this.props;
    this.state = {
      text: defaultValue?.[titleField] || options[0]?.[titleField],
    };
  }

  open = () => {
    this.menu.open();
  }

  reset = () => {
    const { defaultValue, titleField, options } = this.props;
    this.setState({ text: defaultValue?.[titleField] || options[0]?.[titleField] });
  }

  onSelect = (v) => {
    const {
      filter, index, titleField, returnFullItem,
    } = this.props;
    this.setState({ text: v[titleField] });
    this.menu.close();
    if (returnFullItem) {
      filter(v);
    } else {
      filter({ [index]: v.id || v?.[index] });
    }
  }

  render() {
    const { text } = this.state;
    const {
      options, width, titleField, showChoosedTitle, offsetRight,
    } = this.props;
    return (
      <Menu ref={(v) => { this.menu = v; }} style={{ alignItems: 'flex-end' }}>
        <TouchableOpacity
          hitSlop={{
            top: 8, right: 10, bottom: 8, left: 10,
          }}
          onPress={this.open}
          style={styles.touch}
        >
          {showChoosedTitle && <Text style={styles.outPrice}>{text}</Text>}
          <View style={styles.btn}>
            <View style={styles.arrowDown} />
          </View>
        </TouchableOpacity>
        <MenuTrigger customStyles={{ triggerOuterWrapper: { position: 'relative', top: 6, right: offsetRight } }} />
        <MenuOptions
          renderOptionsContainer={() => (
            <ScrollView style={{ maxHeight: 216 }} showsVerticalScrollIndicator>
              {
                options.map((v, i) => (
                  <TouchableOpacity
                    key={v + i}
                    onPress={() => this.onSelect(v)}
                    style={[styles.title, { borderBottomWidth: i === options.length - 1 ? 0 : StyleSheet.hairlineWidth }]}
                  >
                    <Text style={{ fontSize: 13, color: '#333' }}>{v[titleField]}</Text>
                  </TouchableOpacity>
                ))
              }
            </ScrollView>
          )}
          customStyles={{ optionsContainer: { width: width || 53 } }}
        />
      </Menu>
    );
  }
}

const styles = StyleSheet.create({
  arrowDownRed: {
    height: 17,
    width: 17,
    marginLeft: 13,
  },
  outPrice: {
    fontSize: 12,
    color: '#272727',
  },
  title: {
    height: 36,
    marginHorizontal: 12,
    borderBottomColor: '#E3E3E3',
    justifyContent: 'center',
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arrowDown: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 5,
    borderBottomWidth: 0,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: '#fff',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
  },
  btn: {
    height: 17,
    width: 17,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: Colors.YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
});
