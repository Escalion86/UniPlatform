import { SET_TASKS } from 'state/constants'

const tasksReducer = (state = [], action) => {
  switch (action.type) {
    case SET_TASKS:
      return action.tasks ?? state
    default:
      return state
  }
}

export default tasksReducer
