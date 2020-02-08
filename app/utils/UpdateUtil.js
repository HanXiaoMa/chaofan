import React from 'react';
import { Text, Linking, Platform } from 'react-native';
import CodePush from 'react-native-code-push';
import ModalNormal from '../components/ModalNormal';
import { showModalbox, closeModalbox } from './MutualUtil';
import { store } from '../../App';
import { receiveUser } from '../redux/actions/userInfo';
import { request } from '../http/Axios';

// 后端太懒，最好是直接通过/user/check_test_user接口获取deploymentKey
const deploymentKeys = {
  '-1ios': 'WJUNKXGDDXXmX9eNPZAEUkD3R8qA4ksvOXqog', // 不是ios测试人员
  '1ios': 'yNMwRLowL3DW172R4IwxjidlARmU4ksvOXqog', // ios全部测试人员
  '2ios': '9N8cjy04O9T3r2vG7Af04DMGo0yx4ksvOXqog', // ios内部测试人员
  '-1android': 'A57M3pUGWACAfTjYLBS8hgmyLmTu4ksvOXqog', // 不是安卓测试人员
  '1android': 'RIFVWeHwZVPZIcLn5Rg2ZiwXtKzD4ksvOXqog', // 安卓全部测试人员
  '2android': 'nLMZyzeJ65jd0up3FNBv5VYRqy9z4ksvOXqog', // 安卓内部测试人员
};

export const update = async () => {
  // CodePush.getUpdateMetadata().then((update) => {
  //   console.log(update);
  // });

  try {
    const result = await request('/user/check_test_user');
    const deploymentKey = deploymentKeys[result.is_test + Platform.OS];
    const obj = { isTestMember: result.is_test > 0, currentMember: result.is_test };
    if (result.is_test == -1) {
      obj.isTestVersion = true;
    }
    const currentMember = store.getState()?.userInfo?.currentMember;
    if (currentMember && currentMember != result.is_test) {
      CodePush.clearUpdates();
    }
    store.dispatch(receiveUser(obj));
    if (result.is_must == -1) {
      CodePush.checkForUpdate(deploymentKey).then((info) => {
        if (!info) { return; }
        CodePush.sync({ deploymentKey }, (status) => {
          if (typeof info.description === 'string' && info.description.length > 0) {
            if (status === 1) {
              showModalbox({
                element: (<ModalNormal
                  sure={() => { CodePush.restartApp(true); }}
                  cancelText="下次启动生效"
                  sureText="立即更新"
                  title="更新提示"
                  alignItems="flex-start"
                  closeModalbox={closeModalbox}
                  CustomDom={(
                    <Text style={{ fontSize: 13, color: '#333' }}>{info.description}</Text>
                  )}
                />),
                options: {
                  backdropPressToClose: false,
                },
              });
            }
          }
        });
      });
    } else {
      const notForce = result.is_must == 1;
      const text = notForce ? '应用商店有新的版本，是否前往更新' : '版本太老，请前往更新到最新版本';
      showModalbox({
        element: (<ModalNormal
          sure={() => {
            const url = Platform.OS === 'ios' ? 'https://itunes.apple.com/cn/app/id1489124031' : 'market://details?id=com.chaofan.jiangbao';
            Linking.openURL(url);
          }}
          showClose={false}
          cancelText="忽略此更新"
          sureText="前往更新"
          title="更新提示"
          alignItems="center"
          showCancel={notForce}
          closeModalbox={closeModalbox}
          CustomDom={<Text style={{ fontSize: 13, color: '#333' }}>{text}</Text>}
        />),
        options: {
          backButtonClose: notForce,
          backdropPressToClose: notForce,
          style: {
            height: 197,
            width: 265,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          },
        },
      });
    }
  } catch (err) {
    CodePush.sync({ deploymentKey: deploymentKeys[`-1${Platform.OS}`] });
  }
};
