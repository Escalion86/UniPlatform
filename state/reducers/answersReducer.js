import { SET_ANSWERS } from 'state/constants'

const answersReducer = (state = [], action) => {
  switch (action.type) {
    case SET_ANSWERS:
      return action.answers ?? state
    default:
      return state
  }
}

export default answersReducer
