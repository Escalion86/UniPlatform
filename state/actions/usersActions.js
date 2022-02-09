import { SET_USERS } from 'state/constants'

export const setUsers = (users) => {
  return {
    type: SET_USERS,
    users,
  }
}
