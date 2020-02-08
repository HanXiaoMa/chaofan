import React, { PureComponent } from 'react';
import Modalbox from 'react-native-modalbox';
import { StyleSheet } from 'react-native';

export default class Modal extends PureComponent {
  componentDidMount() {
    this.modalbox && this.modalbox.open();
  }

  close = () => {
    this.modalbox.close();
  }

  onClosed = () => {
    const { options = {}, onClosed } = this.props;
    options.onClosed && options.onClosed();
    onClosed && onClosed();
  }

  render() {
    const { element, options = {} } = this.props;
    return (
      <Modalbox
        swipeToClose={false}
        backButtonClose
        entry="bottom"
        ref={(v) => { this.modalbox = v; }}
        style={styles.style}
        {...options}
        onClosed={this.onClosed}
      >
        {element}
      </Modalbox>
    );
  }
}

const styles = StyleSheet.create({
  style: {
    height: 185,
    width: 265,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
