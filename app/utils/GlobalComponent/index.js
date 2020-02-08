import React, { PureComponent } from 'react';
import RootSiblings from 'react-native-root-siblings';
import { Keyboard, Platform } from 'react-native';
import KeyboardWrapper from './KeyboardWrapper';
import Modalbox from './Modalbox';
import Toast from './Toast';
import { PADDING_TAB } from '../../common/Constant';

const components = [
  { Component: Modalbox },
  { Component: Toast, keyboardAdjust: true },
].map(v => ({
  ...v,
  refs: [],
  siblings: [],
  keyboardRefs: [],
}));

let keyboardHeight = 0;
let keyboardWillShowListener = null;
let keyboardWillHideListener = null;
if (!keyboardWillShowListener && Platform.OS === 'ios') {
  keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
    if (e.isEventFromThisApp) {
      keyboardHeight = e.endCoordinates.height;
      components.filter(v => v.keyboardAdjust).forEach((v) => {
        v.keyboardRefs.forEach((v) => {
          v.ref.current?.onKeyboardShow(e.duration, keyboardHeight, v.absoluteBottom);
        });
      });
    }
  });
}

if (!keyboardWillHideListener && Platform.OS === 'ios') {
  keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', (e) => {
    keyboardHeight = 0;
    components.filter(v => v.keyboardAdjust).forEach((v) => {
      v.keyboardRefs.forEach((v) => {
        v.ref.current?.onKeyboardHide(e.duration);
      });
    });
  });
}

const show = (index, props) => {
  const { Component, keyboardAdjust } = components[index];
  const ref = React.createRef();
  const keyboardRef = React.createRef();
  let sibling;
  if (keyboardAdjust) {
    sibling = new RootSiblings(
      <KeyboardWrapper ref={keyboardRef} keyboardHeight={keyboardHeight} absoluteBottom={props.absoluteBottom || 100 + PADDING_TAB}>
        <Component {...props} ref={ref} onClosed={() => { removeRef(index, sibling); }} />
      </KeyboardWrapper>,
    );
  } else {
    sibling = new RootSiblings(<Component {...props} ref={ref} onClosed={() => { removeRef(index, sibling); }} />);
  }
  components[index]?.refs.push({ ref, id: sibling?.id });
  components[index]?.siblings.push(sibling);
  keyboardAdjust && components[index]?.keyboardRefs.push({ ref: keyboardRef, absoluteBottom: props.absoluteBottom || 100 + PADDING_TAB });
  return sibling;
};

const close = (index, sibling, immediately) => {
  if (sibling) {
    if (immediately) {
      removeRef(index, sibling);
    } else {
      findOne(components[index].refs, v => v.id === sibling.id)?.current?.close();
    }
  } else {
    if (immediately) {
      components[index].siblings.forEach((v) => { v.manager?.destroy(v.id); });
    } else {
      components[index].refs.forEach((v) => { v.ref?.current?.close(); });
    }
    components[index].refs = [];
    components[index].siblings = [];
    components[index].keyboardRefs = [];
  }
};

const removeRef = (index, sibling) => {
  sibling.manager?.destroy(sibling.id);
  components[index].refs = components[index].refs.filter(v => v.id !== sibling.id);
  components[index].siblings = components[index].siblings.filter(v => v.id !== sibling.id);
  components[index].keyboardRefs = components[index].keyboardRefs.filter(v => v.id !== sibling.id);
};

const findOne = (arr, fn) => {
  for (const i in arr) {
    if (fn(arr[i])) {
      return arr[i];
    }
  }
  return null;
};

export default class GlobalComponent extends PureComponent {
  static showModalbox = props => show(0, props)
  static closeModalbox = (sibling, immediately) => close(0, sibling, immediately);

  static showToast = props => show(1, props)

  render() {
    return null;
  }
}
