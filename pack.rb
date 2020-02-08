#!/usr/bin/env ruby
action = ARGV[0] || 'pack'
channel = ARGV[1]
extras = ARGV[2]

# ./pack.rb update_code_bundle_id 
def update_code_bundle_id() 
  codeBundleId = Time.new.strftime("%Y-%m-%d-%H-%M")
  iosInfo = File.read('ios/chaofan/Info.plist')
  androidInfo = File.read('android/app/build.gradle')
  iosVersion = "#{iosInfo.match(/<key>CFBundleShortVersionString<\/key>\s+<string>(.*?)<\/string>/)[1]}".gsub(/\./, '-')
  androidVersion = "#{androidInfo.match(/(?<=versionName\s")\d+\.\d+.\d+/)}".gsub(/\./, '-')
  result = File.read('./app/utils/BugsnagUtil.js')
  result1 = result.gsub(/const iosCodeBundleId = *.+?;/, "const iosCodeBundleId = '#{iosVersion}-#{codeBundleId}';")
  result2 = result1.gsub(/const androidCodeBundleId = *.+?;/, "const androidCodeBundleId = '#{androidVersion}-#{codeBundleId}';")
  File.write('./app/utils/BugsnagUtil.js', result2)
end

# ./pack.rb sourcemap ios 
# ./pack.rb sourcemap android 
def bundle_sourcemap(platform)
  result = File.read('./app/utils/BugsnagUtil.js')
  puts `react-native bundle \
      --platform #{platform} \
      --dev false \
      --entry-file index.js \
      --bundle-output #{platform}-release.bundle \
      --sourcemap-output #{platform}-release.bundle.map`
  if platform == 'ios'
    puts `curl https://upload.bugsnag.com/react-native-source-map \
      -F apiKey=#{result.match(/apiKey = *.+?;/)[0].gsub(/apiKey = '/, '').gsub(/';/, '')} \
      -F codeBundleId=#{result.match(/iosCodeBundleId = *.+?;/)[0].gsub(/iosCodeBundleId = '/, '').gsub(/';/, '')} \
      -F dev=false \
      -F platform=ios \
      -F sourceMap=@ios-release.bundle.map \
      -F bundle=@ios-release.bundle `
    end
  if platform == 'android'
    puts `curl https://upload.bugsnag.com/react-native-source-map \
      -F apiKey=#{result.match(/apiKey = *.+?;/)[0].gsub(/apiKey = '/, '').gsub(/';/, '')} \
      -F codeBundleId=#{result.match(/androidCodeBundleId = *.+?;/)[0].gsub(/androidCodeBundleId = '/, '').gsub(/';/, '')} \
      -F dev=false \
      -F platform=android \
      -F sourceMap=@android-release.bundle.map \
      -F bundle=@android-release.bundle `
    end
end

# ./pack.rb update_version ios 1.0.0 1
def update_ios_version()
  version = ARGV[2]
  bundle_version = ARGV[3]
  new_content = File.read("ios/chaofan/Info.plist")
  new_content.gsub!(/<key>CFBundleShortVersionString<\/key>\s+<string>(.*?)<\/string>/m,
    "<key>CFBundleShortVersionString<\/key>\n       <string>#{version}<\/string>")
  new_content.gsub!(/<key>CFBundleVersion<\/key>\s+<string>(\d+)<\/string>/m,
    "<key>CFBundleVersion<\/key>\n       <string>#{bundle_version}<\/string>")
  File.open("ios/chaofan/Info.plist", "w") { |f| f.write new_content }
end

# ./pack.rb update_version android 1.0.0 1
def update_android_version()
  version = ARGV[2]
  result = File.read('android/app/build.gradle')
  result = result.gsub(/(?<=versionCode\s)\d+/, version.gsub(/\./, ''))
  result = result.gsub(/(?<=versionName\s")\d+\.\d+.\d+/, version)
  File.write('android/app/build.gradle', result)
end

# ./pack.rb pnu android
def upload(path)
  puts "curl -F 'file=@#{path}' -F 'uKey=4e45feb8976a5ae625c779f71b84c8b1' -F '_api_key=de51f4ca847c0ba629d3080b8cfc7ab9' https://www.pgyer.com/apiv1/app/upload"
  puts "uploading #{path}........"
  puts `curl -F "file=@#{path}" -F "uKey=4e45feb8976a5ae625c779f71b84c8b1" -F "_api_key=de51f4ca847c0ba629d3080b8cfc7ab9" https://www.pgyer.com/apiv1/app/upload`
  puts "finish uploading #{path}........"
end

# ./pack.rb ios pnu_test
# ./pack.rb android pnu_test
def upload_test(path)
  puts "curl -F 'file=@#{path}' -F 'uKey=fc462b86df69a3373a1c657c68fa78ca' -F '_api_key=3a9cf2ef36199832fc96d03c4d870c42' https://www.pgyer.com/apiv1/app/upload"
  puts "uploading #{path}........"
  puts `curl -F "file=@#{path}" -F "uKey=fc462b86df69a3373a1c657c68fa78ca" -F "_api_key=3a9cf2ef36199832fc96d03c4d870c42" https://www.pgyer.com/apiv1/app/upload`
  puts "finish uploading #{path}........"
end

def export_ios
  puts "---------- packing ios ------------"
  puts `yarn i`
  new_content = File.read("ios/chaofan/Info.plist")
  new_content = new_content.gsub(/<key>CFBundleDevelopmentRegion<\/key>/,
    "<key>method<\/key>\n  <string>ad-hoc<\/string>\n  <key>CFBundleDevelopmentRegion<\/key>")
  File.write("ios/adhoc.plist", new_content)
  puts `cd ios &&
    rm -rf build/* &&
    xcodebuild clean -workspace chaofan.xcworkspace -scheme chaofan -configuration Release &&
    xcodebuild archive -workspace chaofan.xcworkspace -scheme chaofan -archivePath build/chaofan.xcarchive &&
    rvm use system &&
    xcodebuild -exportArchive -archivePath build/chaofan.xcarchive -exportPath build -exportOptionsPlist adhoc.plist
  `
  puts "---------- finish packing ios ------------"
  return true
end

def edit_modules
  puts "---------- finish install and edit node_modules ------------"
end

def export_android(channel)
  puts "---------- packing android: #{channel} ------------"
  result1 = File.read('./android/app/build.gradle')
  new_result1 = result1.gsub(/abiFilters \"armeabi-v7a\", \"x86\"/,
    "abiFilters \"armeabi-v7a\"")
  File.write('./android/app/build.gradle', new_result1)
  puts `cd android &&
    rm -f app/build/outputs/apk/release/app-release.apk &&
    ./gradlew assembleRelease &&
    mv app/build/outputs/apk/release/app-release.apk app/build/outputs/apk/#{channel}.apk
  `
  File.write('./android/app/build.gradle', result1)
  puts "---------- finish packing android: #{channel} ------------"
  result = File.read('./app/utils/BugsnagUtil.js')
  puts `bugsnag-sourcemaps upload \
      --api-key=#{result.match(/apiKey = *.+?;/)[0].gsub(/apiKey = '/, '').gsub(/';/, '')} \
      --code-bundle-id=#{result.match(/androidCodeBundleId = *.+?;/)[0].gsub(/androidCodeBundleId = '/, '').gsub(/';/, '')} \
      --minifiedFile=android/app/build/generated/assets/react/release/index.android.bundle \
      --source-map=android/app/build/generated/sourcemaps/react/release/index.android.bundle.map \
      --minified-url=index.android.bundle \
      --upload-sources \
      --add-wildcard-prefix`
  return true
end

if action == 'pack'
  case channel
  when "ios" then export_ios()
  when "android" then export_android('chaofan')
  end
elsif action == 'pnu'
  case channel
  when "ios" then export_ios() && upload(File.absolute_path('./ios/build/chaofan.ipa'))
  when "android" then export_android('chaofan') && upload(File.absolute_path('./android/app/build/outputs/apk/chaofan.apk'))
  end
elsif action == 'pnu_test'
  case channel
  when "ios" then export_ios() && upload_test(File.absolute_path('./ios/build/chaofan.ipa'))
  when "android" then export_android('chaofan') && upload_test(File.absolute_path('./android/app/build/outputs/apk/chaofan.apk'))
  end
elsif action == 'update_version'
  case channel
  when "ios" then update_ios_version()
  when "android" then update_android_version()
  when "all" then update_ios_version() && update_android_version()
  end
elsif action == 'sourcemap'
  case channel
  when "ios" then bundle_sourcemap('ios')
  when "android" then bundle_sourcemap('android')
  when "all" then bundle_sourcemap('android') && bundle_sourcemap('ios')
  end
elsif action == 'edit'
  case channel
  when channel then edit_modules()
  end
elsif action == 'update_code_bundle_id'
  case channel
  when channel then update_code_bundle_id()
  end
end
