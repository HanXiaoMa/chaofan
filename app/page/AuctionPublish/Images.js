const images = {
  shoe: [
    {
      icon: require('../../res/image/shoe_shi_side_wai.png'),
      example: require('../../res/image/shoe_shi_side_wai.png'),
      mask: require('../../res/image/shoe_side_wai.png'),
      title: '请拍摄球鞋外侧照',
    },
    {
      icon: require('../../res/image/shoe_shi_side_nei.png'),
      example: require('../../res/image/shoe_shi_side_nei.png'),
      mask: require('../../res/image/shoe_side_nei.png'),
      title: '请拍摄球鞋内侧照',
    },
    {
      icon: require('../../res/image/shoe_shi_top.png'),
      example: require('../../res/image/shoe_shi_top.png'),
      mask: require('../../res/image/shoe_top.png'),
      title: '请拍摄球鞋正面俯视照',
    },
    {
      icon: require('../../res/image/shoe_shi_back.png'),
      example: require('../../res/image/shoe_shi_back.png'),
      mask: require('../../res/image/shoe_back.png'),
      title: '请拍摄球鞋背面照片',
    },
    {
      icon: require('../../res/image/shoe_shi_bottom.png'),
      example: require('../../res/image/shoe_shi_bottom.png'),
      mask: require('../../res/image/shoe_bottom.png'),
      title: '请拍摄球鞋鞋底照片',
    },
    {
      icon: require('../../res/image/shoe_shi_biaoqian.png'),
      example: require('../../res/image/shoe_shi_biaoqian.png'),
      mask: require('../../res/image/shoe_biaoqian.png'),
      title: '请拍摄球鞋标签照片',
    },
    {
      icon: require('../../res/image/shoe_shi_box.png'),
      example: require('../../res/image/shoe_shi_box.png'),
      mask: require('../../res/image/shoe_box.png'),
      title: '请拍摄球鞋鞋盒照片',
    },
  ],
  clothes: [
    {
      icon: require('../../res/image/yi_shi_zheng.png'),
      example: require('../../res/image/shoe_shi_side_wai.png'),
      mask: require('../../res/image/yi_zhengbei.png'),
      title: '请拍摄衣服正面照片',
    },
    {
      icon: require('../../res/image/yi_shi_bei.png'),
      example: require('../../res/image/shoe_shi_side_wai.png'),
      mask: require('../../res/image/yi_zhengbei.png'),
      title: '请拍摄衣服背面照片',
    },
    {
      icon: require('../../res/image/ku_shi_biaoqian.png'),
      example: require('../../res/image/shoe_shi_side_wai.png'),
      mask: require('../../res/image/ku_biaoqian.png'),
      title: '请拍摄衣服标签照片',
    },
  ],
  trousers: [
    {
      icon: require('../../res/image/ku_shi_zheng.png'),
      example: require('../../res/image/shoe_shi_side_wai.png'),
      mask: require('../../res/image/ku_zheng.png'),
      title: '请拍摄裤子正面照片',
    },
    {
      icon: require('../../res/image/ku_shi_bei.png'),
      example: require('../../res/image/shoe_shi_side_wai.png'),
      mask: require('../../res/image/ku_bei.png'),
      title: '请拍摄裤子背面照片',
    },
    {
      icon: require('../../res/image/ku_shi_biaoqian.png'),
      example: require('../../res/image/shoe_shi_side_wai.png'),
      mask: require('../../res/image/ku_biaoqian.png'),
      title: '请拍摄裤子标签照片',
    },
  ],
  common: [
    {
      icon: require('../../res/image/tongyong_shi.png'),
      example: require('../../res/image/shoe_shi_side_wai.png'),
      mask: require('../../res/image/tongyong.png'),
      title: '请将商品放在虚线框内拍摄',
    },
  ],
};
const getPhotoImages = type => (images[type] || images.common);

export { getPhotoImages };
