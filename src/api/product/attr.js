// 平台管理相关
import request from '@/utils/request'

// 获取一级分类
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'GET' })

// 获取二级分类
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'GET' })

// 获取三级分类
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'GET' })

// 获取平台属性
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'GET' })

// 添加or修改属性
/* {
  "attrName": "string",    属性名
  "attrValueList": [       属性名中属性值
    {
      "attrId": 0,         属性id
      "id": 0,
      "valueName": "string"    属性值
    }
  ],
  "categoryId": 0,         category3Id
  "categoryLevel": 0,      3
  "id": 0
} */
export const reqSaveAttrInfo = (data) => request({ url: `/admin/product/saveAttrInfo`, method: 'POST', data })
