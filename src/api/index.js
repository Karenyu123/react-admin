// import jsonp from 'jsonp'
// import { message } from 'antd'
import request from './request'

export const reqLogin = (username, password) => request('/login', { username, password }, 'POST')

//获取一级分类的接口
export const reqCategorys = (parentId) => request('/manage/category/list',{parentId})

//添加分类
export const reqAddCategory = (parentId, categoryName) => request('/manage/category/add', {parentId, categoryName},"POST")

//更新分类名称
export const reqUpdateCategory = (categoryId, categoryName) => request('/manage/category/update',{categoryId, categoryName},"POST")

//获取商品数据
export const reqProducts = (pageNum, pageSize) => request('/manage/product/list',{pageNum, pageSize})

//搜索商品
export const reqSearchProducts = (pageNum, pageSize, searchName, searchType) => request('/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName
})
//更新商品状态
export const reqUpdateStatus = (productId,status) => request('/manage/product/updateStatus',{ productId,status},'POST')

//删除图片
export const reqDeleteImg = (name) => request('/manage/img/delete', { name }, 'POST')
//更新或添加商品
export const reqAddUpdate = (product) => request(`/manage/product/${product._id ? 'update' : 'add'}`, product, 'POST')
//获取角色
export const reqRoles = () => request('/manage/role/list')
//添加角色
export const reqAddRole = (roleName) => request('/manage/role/add', { roleName }, 'POST')

//设置角色权限
export const reqUpdateRole = (role) => request('/manage/role/update',role,'POST')
//获取所有用户信息
export const reqUserList = () => request('/manage/user/list')
//添加用户
// export const reqAddUser = (user) => request('/manage/user/add', user, 'POST')
//删除用户
export const reqDeleteUser = (userId) => request('/manage/user/delete', { userId }, 'POST')
//修改用户
export const reqAddUpdateUser = (user) => request(`/manage/user/${user._id?'update':'add'}`, user, 'POST')