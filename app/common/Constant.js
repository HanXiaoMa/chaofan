import { Dimensions, Platform } from 'react-native';

const isIphoneX = () => {
  if ([812, 896].includes(Dimensions.get('screen').height)) {
    return true;
  }
  return false;
};
const { height, width } = Dimensions.get('screen');
global.SCREEN_HEIGHT = height;
global.SCREEN_WIDTH = width;
const IS_IPHONE_X = isIphoneX();
const iOS = Platform.OS === 'ios';
const Android = Platform.OS === 'android';

const NAV_HEIGHT = 44;
const STATUSBAR_HEIGHT = IS_IPHONE_X ? 40 : iOS ? 20 : 25;
const PADDING_TAB = IS_IPHONE_X ? 20 : 0;
const STATUSBAR_AND_NAV_HEIGHT = STATUSBAR_HEIGHT + NAV_HEIGHT;
const MARGIN_HORIZONTAL = 9;
const MAX_TIME = 72 * 3600;
const BOTTOM_BTN_HEIGHT = 66 + PADDING_TAB;

// 适用于小图标
const hitSlop = {
  top: 12, bottom: 12, left: 8, right: 8,
};
export {
  iOS, Android, IS_IPHONE_X, NAV_HEIGHT, STATUSBAR_HEIGHT,
  STATUSBAR_AND_NAV_HEIGHT, PADDING_TAB, hitSlop, MARGIN_HORIZONTAL, MAX_TIME, BOTTOM_BTN_HEIGHT,
};
