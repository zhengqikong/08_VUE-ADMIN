// 将商品管理四个模块请求接口统一暴露
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'
import * as trademark from './product/tradeMark'

export default {
  attr,
  sku,
  spu,
  trademark
}
