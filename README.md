# 预览地址
## ios
```js
// 应用商店搜索下载炒饭，进去会闪一下，因为我热更了你们，让你们用到测试版
```
## android
```js
`https://image.chaofun.co/tower/chaofan.apk` // 最新版懒得审核了，直接网址下载吧，
```

# 打包命令
## ios
```js
./pack.rb ios
```
`安装包输出地址: chaofun/ios/build`
## android
```js
./pack.rb android // 注意：打包会将sourcemap上传，可手动注释，原因为增量热更新和Hermes冲突，app内没有进行热更新时需要采用Hermes上传的方式，app内进行了热更新时需要采用普通上传方式，即./pack.rb sourcemap android
```
`安装包输出地址: chaofun/android/app/build/outputs/apk`

# 打包并上传到测试地址
## ios
```js
rvm use system && ./pack.rb ios pnu
```
## android

```js
./pack.rb android pnu
```

# 热更新
## 注意：更新前先执行下面语句，更新错误收集的id
```ruby
./pack.rb update_code_bundle_id 
```
## 强制热更新并立即启动生效
```js
code-push release-react ios ios -m
code-push release-react test_ios ios -m
code-push release-react all_test_ios ios -m

code-push release-react android android -m          // 普通用户
code-push release-react test_android android -m     // 内部测试人员
code-push release-react all_test_android android -m // 全部测试人员
```
## 静默更新
```js
code-push release-react ios ios
```
## 弹窗显示更新内容并让用户选择下次启动生效还是立即生效
```js
code-push release-react ios ios --des "1.修复bug\n2.新增拍卖功能"
```

## 第三方私有库说明
```js
aliyun-oss-react-native // 增加多文件上传进度
jcore-react-native // 明确使用静态库，防止与swift项目冲突
jpush-react-native // 明确使用静态库，防止与swift项目冲突
react-native-camera // 增加clean方法，增加安卓自定义相机比例
react-native-clear-cache // 增加自动连接
react-native-code-push // 增加对0.60+版本的支持
react-native-modalbox // 解决0.60+版本组件外使用Dimensions.get('window')结果为0的问题
react-native-tab-view // 解决嵌套时子组件滚动到尽头时，不会使父组件发送滚动
react-native-text-input-mask // 增加对0.61+版本的支持
```

## 注释掉的密钥说明
需要运行进行测试的话可以跟我要



