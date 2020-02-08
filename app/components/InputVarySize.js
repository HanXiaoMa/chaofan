import React, { PureComponent } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import TextInputMask from 'react-native-text-input-mask';
import { YaHei } from '../res/FontFamily';

export default class InputVarySize extends PureComponent {
  constructor(props) {
    super(props);
    const { defaultValue } = this.props;
    this.state = {
      text: defaultValue || '',
      formatted: defaultValue || '',
    };
  }

  onChangeText = (formatted, text) => {
    const { onChangeText } = this.props;
    onChangeText(formatted, text || formatted);
    this.setState({ formatted, text: text || formatted });
  }

  focus = () => {
    this.input.input.focus();
  }

  render() {
    const { text, formatted } = this.state;
    const { placeholder } = this.props;

    return (
      <View style={styles.inputWrapper}>
        {
          text.length === 0
            ? <Text style={styles.placeholder}>{placeholder}</Text>
            : <Text style={styles.inputValue}>{formatted}</Text>
          }
        <TextInputMask
          style={styles.phoneInput}
          clearButtonMode="while-editing"
          ref={(v) => { this.input = v; }}
          underlineColorAndroid="transparent"
          {...this.props}
          placeholder=""
          defaultValue={formatted}
          onChangeText={this.onChangeText}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  phoneInput: {
    padding: 0,
    includeFontPadding: false,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: YaHei,
    marginBottom: 2,
    color: '#0000',
  },
  inputValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: YaHei,
    position: 'absolute',
    top: -5.5,
  },
  placeholder: {
    color: '#E4E4EE',
    fontSize: 12,
    position: 'absolute',
    top: 7,
  },
  inputWrapper: {
    flex: 1,
    marginLeft: 25,
    height: 24.5,
  },
});
