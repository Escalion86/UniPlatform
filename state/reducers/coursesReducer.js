import { SET_COURSES } from 'state/constants'

const coursesReducer = (state = [], action) => {
  switch (action.type) {
    case SET_COURSES:
      return action.courses ?? state
    default:
      return state
  }
}

export default coursesReducer
