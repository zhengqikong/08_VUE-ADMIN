// 品牌管理相关
import request from '@/utils/request'

// 分页列表
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'GET' })

// 添加品牌or添修改品牌
export const reqSaveOrUpdataTradeMark = (trademark) => {
  // 参数有id：修改
  if (trademark.id) {
    return request({ url: `/admin/product/baseTrademark/update`, method: 'PUT', data: trademark })
  } else {
    return request({ url: `/admin/product/baseTrademark/save`, method: 'POST', data: trademark })
  }
}

// /admin/product/baseTrademark/remove/{id}
export const reqDeleteMarkList = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'DELETE' })
