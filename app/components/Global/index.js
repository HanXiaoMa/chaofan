import React, { PureComponent } from 'react';
import {
  DeviceEventEmitter, View, StyleSheet, Platform,
} from 'react-native';
import ShareCom from './ShareCom';

const callback = (chaoFunEventType, type, data) => {
  DeviceEventEmitter.emit('chaoFunCallback', {
    chaoFunEventType,
    type,
    data,
  });
};

const successCallback = (chaoFunEventType, data) => {
  callback(chaoFunEventType, 'success', data);
};

const failCallback = (chaoFunEventType, data) => {
  callback(chaoFunEventType, 'failed', data);
};

export default class Global extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      share: { show: false, data: {} },
      modalbox: { show: false, data: {} },
      toastLoading: { show: false, data: {} },
      actionSheet: { show: false, data: {} },
    };
  }

  show = (type, data) => {
    this.setState({ [type]: { show: false } }, () => {
      this.setState({ [type]: { show: true, data } });
    });
  }

  hide = (type, immediately) => {
    if (immediately) {
      this.setState({ [type]: { show: false } });
    } else {
      this[type] && this[type].close();
    }
  }

  onClosed = (type) => {
    this.setState({ [type]: { show: false } });
  }

  render() {
    const {
      share, modalbox, toastLoading, actionSheet,
    } = this.state;
    const height = (modalbox.show || share.show || (actionSheet.show && Platform.OS === 'android')) ? SCREEN_HEIGHT : null;
    return (
      <View style={[styles.wrapper, { height }]}>
        {
          share.show && (
            <ShareCom
              onClosed={() => this.onClosed('share')}
              data={share.data}
              ref={(v) => { this.share = v; }}
              successCallback={data => successCallback('share', data)}
              failCallback={data => failCallback('share', data)}
            />
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    zIndex: 100,
    width: SCREEN_WIDTH,
  },
});
