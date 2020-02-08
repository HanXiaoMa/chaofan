import { wPx2P } from '../utils/ScreenUtil';

export default {
  // 配置参数
  appOptions: {
    url: '/user/get_constant',
  },

  // 首页原价发售列表
  indexList1: {
    url: '/activity/activity_list',
    initParams: {
      limit: 10,
      image_size_times: 300 / 375,
      type: '1',
    },
  },
  // 首页炒饭专区列表
  indexList2: {
    url: '/activity/activity_list',
    initParams: {
      limit: 10,
      image_size_times: 1,
      type: '2',
    },
  },
  // 首页炒饭拍卖列表
  chaofanAuction: {
    url: '/auction/auction_cf',
    initParams: {
      image_size_times: 1,
    },
  },

  // 自由交易首页列表
  freeTradeIndex: {
    url: '/free/index',
    initParams: {
      limit: 10,
      image_size_times: 0.5,
    },
  },
  // 自由交易搜索列表
  freeTradeSearch: {
    url: '/free/index',
    initParams: {
      limit: 10,
      image_size_times: 0.5,
    },
  },
  // 自由交易搜索用户列表
  freeTradeSearchUser: {
    url: '/user/user_list',
    initParams: {
      limit: 10,
    },
  },
  // 自由交易搜索品牌
  freeTradeSearchBrand: {
    url: '/goods/goods_brand',
    initParams: {
      limit: 1000,
    },
  },
  // 自由交易搜索品牌列表
  freeTradeSearchBrandList: {
    url: '/free/index',
    initParams: {
      limit: 10,
      image_size_times: 0.5,
    },
  },
  // 自由交易某商品价格列表
  freeTradeGoodsPrice: {
    url: '/free/info',
    initParams: {
      limit: 10,
    },
  },
  // 自由交易商品鞋码
  freeTradeGoodsSizes: {
    url: '/free/goods_size',
  },
  // 自由交易某商品详情图
  freeTradeGoodsDetail: {
    url: '/goods/goods_image',
    initParams: {
      image_size_times: 1,
    },
  },
  // 自由交易某商品交易历史
  freeTradeHistory: {
    url: '/free/free_historic',
  },
  // 自由交易发布列表
  freeTradePublishList: {
    url: '/goods/goods_list',
    initParams: {
      limit: 10,
      image_size_times: 0.5,
    },
  },
  // 自由交易商品购买详情
  freeTradeBuyInfo: {
    url: '/free/free_trade_info',
  },
  // 自由交易卖家还在卖列表
  freeTradeUserRecommend: {
    url: '/free/get_user_goods',
    initParams: {
      image_size_times: 0.5,
    },
  },
  // 自由交易下单
  freeTradeToOrder: { url: '/order/buy_free' },
  // 自由交易上架
  freeTradeToRelease: { url: '/free/do_release' },


  // 活动通知列表
  activityNotice: {
    url: '/notice/notice_list',
    initParams: {
      limit: 10,
      image_size_times: 0.35,
    },
  },
  // 用户消息列表
  noticeMessage: {
    url: '/message/message_list',
    initParams: {
      limit: 10,
    },
  },


  // 我的库房列表
  warehouse: {
    url: '/order/order_goods_list',
    initParams: {
      limit: 10,
      image_size_times: 0.35,
      goods_status: 1,
    },
  },
  // 已出库列表
  sendOut: {
    url: '/order/order_goods_list',
    initParams: {
      limit: 10,
      image_size_times: 0.35,
      goods_status: 2,
    },
  },
  // 未完成列表
  uncomplete: {
    url: '/order/order_list',
    initParams: {
      limit: 10,
      image_size_times: 0.35,
      status: 0,
    },
  },
  // 仓库商品上架
  warehousePutOnSale: { url: '/free/release_goods' },
  // 我的商品销售中的列表
  goodsOnSale: {
    url: '/free/goods_list',
    initParams: {
      limit: 10,
      image_size_times: 0.35,
      status: 0,
    },
  },
  // 我的商品上架中的列表
  goodsSelled: {
    url: '/free/goods_list',
    initParams: {
      limit: 10,
      image_size_times: 0.35,
      status: 1,
    },
  },


  // 余额流水明细
  balanceDetail: {
    url: '/user/user_balance',
    initParams: {
      limit: 10,
    },
  },


  // 活动详情
  activityInfo: {
    url: '/activity/activity_info',
    initParams: {
      image_size_times: 1,
    },
  },
  // 抢购后的推荐活动
  recommendActivityList: {
    url: '/activity/recommend_activity_list',
    initParams: {
      image_size_times: 0.5,
    },
  },
  // 获取活动鞋码信息
  activitySize: { url: '/activity/activity_size' },


  // 拍卖-首页banner+分类
  auctionBanner: {
    url: '/auction/banner_gt',
    initParams: {
      image_size_times: 1,
    },
  },
  // 拍卖-首页炒饭0元拍banner
  auctionBanner1: {
    url: '/auction/loop_img',
    initParams: {
      image_size_times: 1,
    },
  },
  // 拍卖-卖家拍卖历史
  auctionSellerHistory: {
    url: '/auction/auction_sale_list',
    initParams: {
      image_size_times: 0.5,
    },
  },
  // 拍卖-卖家等待付款
  auctionSellerWaitPay: {
    url: '/auction/waiting_pay_sale',
    initParams: {
      image_size_times: 0.5,
      flag: 0,
    },
  },
  // 拍卖-卖家待发货
  auctionSellerWaitSendOut: {
    url: '/auction/waiting_send',
    initParams: {
      image_size_times: 0.5,
      type: 0,
    },
  },
  // 拍卖-卖家已完成
  auctionSellerComplete: {
    url: '/auction/waiting_send',
    initParams: {
      image_size_times: 0.5,
      type: 1,
    },
  },
  // 拍卖-卖家已发货
  auctionSellerSendOut: {
    url: '/auction/waiting_send',
    initParams: {
      image_size_times: 0.5,
      type: 2,
    },
  },
  // 拍卖-买家拍卖历史
  auctionBuyerHistory: {
    url: '/auction/collectList',
    initParams: {
      image_size_times: 0.5,
      type: 3,
    },
  },
  // 拍卖-买家待付款
  auctionBuyerWaitPay: {
    url: '/auction/waiting_pay_sale',
    initParams: {
      image_size_times: 0.5,
      flag: 1,
    },
  },
  // 拍卖-买家待收货
  auctionBuyerWaitHave: {
    url: '/auction/waiting_receive',
    initParams: {
      image_size_times: 0.5,
      type: 0,
    },
  },
  // 拍卖-买家已完成
  auctionBuyerComplete: {
    url: '/auction/waiting_receive',
    initParams: {
      image_size_times: 0.5,
      type: 1,
    },
  },
  // 拍卖-首页列表
  auctionIndexList: {
    url: '/auction/index',
    initParams: {
      image_size_times: 0.5,
    },
  },
  // 拍卖-我的收藏
  auctionCollectList: {
    url: '/auction/collectList',
    initParams: {
      image_size_times: 0.5,
      type: 1,
    },
  },
  // 拍卖-首页我的参拍
  auctionIndexJoinList: {
    url: '/auction/collectList',
    initParams: {
      image_size_times: 0.5,
      type: 2,
    },
  },
  // 拍卖-我的店铺列表
  auctionMyshop: {
    url: '/auction/myshop',
    initParams: {
      image_size_times: 0.5,
    },
  },
  // 拍卖-我的店铺信息
  auctionMyShopInfo: { url: '/auction/sale_count' },
  // 拍卖-我的关注
  auctionMyFocus: { url: '/auction/my_attention' },
  // 拍卖-分类列表
  auctionCategoryList: {
    url: '/auction/index',
    initParams: {
      image_size_times: 0.5,
    },
  },
  // 拍卖-搜索列表
  auctionSearch: {
    url: '/auction/index',
    initParams: {
      image_size_times: 0.5,
    },
  },
  // 拍卖-官方搜索列表
  auctionOfficialSearch: {
    url: '/auction/auction_cf',
    initParams: {
      image_size_times: 1,
    },
  },
  // 拍卖-订单详情
  auctionOrderInfo: {
    url: '/auction/order_info',
    initParams: {
      image_size_times: 0.5,
    },
  },
  // 拍卖-订单详情
  auctionHotList: {
    url: '/auction/get_auction_hot',
    initParams: {
      image_size_times: 0.2,
    },
  },
  // 拍卖-优选好店列表
  auctionGoodShopList: {
    url: '/auction/hot_shop',
    initParams: {
      image_size_times: 0.75,
    },
  },
  // 拍卖-买家待支付数量
  auctionBuyerWaitPayNum: { url: '/auction/waiting_pay_sale_count' },
  // 拍卖-卖家待发货数量
  auctionSellerWaitSendOutNum: { url: '/auction/waiting_send_count' },

  getShoeSizeList: { url: '/free/get_all_size' },
  getManagementPrice: { url: '/order/do_add_free_trade' },
  doBuyNow: { url: '/order/do_buy_now' },
  startTuan: { url: '/activity/do_add_user_activity' },
};
