import { SET_USERS } from 'state/constants'

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case SET_USERS:
      return action.users ?? state
    default:
      return state
  }
}

export default usersReducer
