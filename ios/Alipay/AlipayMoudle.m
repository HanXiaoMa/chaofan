//  AlipayMoudle.m
//
//  Created by zww on 2019/08/20
//

#import "AlipayMoudle.h"



@implementation AlipayMoudle

RCTPromiseResolveBlock resolveBlock2 = nil;

- (instancetype)init
{
  self = [super init];
  if (self) {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleAlipay:) name:@"Alipay" object:nil];
  }
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)handleAlipay:(NSNotification *)aNotification
{
  resolveBlock2([aNotification userInfo]);
}




RCT_EXPORT_METHOD(pay:(NSString *)orderString
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){

  resolveBlock2 = resolve;

  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    dispatch_async(dispatch_get_main_queue(), ^{
      // NOTE: 调用支付结果开始支付
      [[AlipaySDK defaultService] payOrder:orderString fromScheme:@"jiangbaochaofan" callback:^(NSDictionary *resultDic) {
        resolveBlock2(resultDic);
      }];
    });
  });

}



RCT_EXPORT_MODULE(Alipay);

@end
