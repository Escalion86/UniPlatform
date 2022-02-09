import { SET_LOADED } from 'state/constants'

const appReducer = (state = false, action) => {
  switch (action.type) {
    case SET_LOADED:
      return true
    default:
      return state
  }
}

export default appReducer
