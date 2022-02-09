import { SET_NOTIFICATIONS, SET_NOTIFICATION_VIEWED } from 'state/constants'

export const setNotifications = (notifications) => {
  return {
    type: SET_NOTIFICATIONS,
    notifications,
  }
}

export const setNotificationViewed = (id) => {
  return {
    type: SET_NOTIFICATION_VIEWED,
    id,
  }
}
