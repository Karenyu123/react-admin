import { combineReducers } from 'redux'
import types from './action-types'
const initHeader = '首页'
const header = (state = initHeader, action) => {
  switch (action.type) {
    case types.SET_HEADERS:
      return action.preload
    default:
      return state;
  }
}

const initUser = JSON.parse(window.localStorage.getItem('user_key')||'{}')
const user = (state = initUser, action) => {
  switch (action.type) {
    case types.RECEIVE_USER:
      return action.user
    case types.ERROR_MSG:
      const errMsg = action.msg
      return { ...state, errMsg }
    case types.RESET_USER:
      return {}
    default:
      return state;
   }
}

export default combineReducers({
  header,
  user
})
