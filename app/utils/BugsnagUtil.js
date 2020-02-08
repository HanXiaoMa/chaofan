import { Client, Configuration } from 'bugsnag-react-native';
import { Platform } from 'react-native';
import { store } from '../../App';

let bugsnag = null;
const init = () => {
  if (bugsnag) {
    return;
  }

  const configuration = new Configuration();
  const iosCodeBundleId = '1-5-2-2020-01-14-15-21';
  const androidCodeBundleId = '1-5-2-2020-01-14-15-21';
  const apiKey = '71bd07083d73e6b2db19cd1d8f9557e6';
  configuration.apiKey = apiKey;
  configuration.codeBundleId = Platform.OS === 'ios' ? iosCodeBundleId : androidCodeBundleId;

  configuration.registerBeforeSendCallback((report) => {
    report.metadata = {
      ...report.metadata,
      userInfo: store?.getState()?.userInfo,
    };
    return true;
  });
  bugsnag = new Client(configuration);
};

export default init;
