import {
  AppRegistry, YellowBox, Text, TextInput,
} from 'react-native';
import 'react-native-gesture-handler';
import App from './App';
import { name as appName } from './app.json';
import { Normal } from './app/res/FontFamily';
import Bugsnag from './app/utils/BugsnagUtil';

TextInput.defaultProps = { ...TextInput.defaultProps, allowFontScaling: false };
if (!__DEV__) {
  Bugsnag();
}
const TextRender = Text.render;
Text.render = function render(props) {
  /* eslint-disable */
  const oldProps = props;
  props = { ...props, allowFontScaling: false, style: [{ fontFamily: Normal, fontSize: 14, color: '#000' }, props.style] };
  try {
    return TextRender.apply(this, arguments);
  } finally {
    props = oldProps;
  }
};


YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
AppRegistry.registerComponent(appName, () => App);
