//  WxpayMoudle.h
//
//  Created by zww on 2019/08/20
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>
#import "WXApiObject.h"
#import "WXApi.h"

@interface WxpayMoudle : NSObject <RCTBridgeModule, WXApiDelegate>
@end
