import types from './action-types'
import { reqLogin } from '../api'
export const setHeaders = (header) => ({ type: types.SET_HEADERS, preload: header })
const getUser = (user) => ({ type: types.RECEIVE_USER, user })
const handleErr = (msg) => ({ type: types.ERROR_MSG, msg})
// 退出登录
export const logout = () => {
  window.localStorage.removeItem('user_key')
  return {type: types.RESET_USER}
}
// 登录
export const login = (username, password) => {
  return async dispatch => {
    const res = await reqLogin(username, password)
    if (res.status === 0) {
      window.localStorage.setItem('user_key',JSON.stringify(res.data))
      dispatch(getUser(res.data))
    } else {
      dispatch(handleErr('用户名或密码不正确'))
    }
  }
}
