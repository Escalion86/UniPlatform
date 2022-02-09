import { SET_LECTURES } from 'state/constants'

const lecturesReducer = (state = [], action) => {
  switch (action.type) {
    case SET_LECTURES:
      return action.lectures ?? state
    default:
      return state
  }
}

export default lecturesReducer
