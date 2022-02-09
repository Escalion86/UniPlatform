import { SET_NOTIFICATIONS, SET_NOTIFICATION_VIEWED } from 'state/constants'

const notificationsReducer = (state = [], action) => {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return action.notifications ?? state
    case SET_NOTIFICATION_VIEWED:
      return state.map((note) => {
        if (note._id === action.id) return { ...note, viewed: true }
        return note
      })
    default:
      return state
  }
}

export default notificationsReducer
