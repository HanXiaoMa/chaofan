const { NativeModules } = require('react-native');

const Track = (eventId, eventData = {}, eventNum = -1) => {
  NativeModules.UMAnalyticsModule.onEventWithMapAndCount(eventId, eventData, eventNum);
};

export default Track;
