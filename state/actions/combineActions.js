import { batch } from 'react-redux'
import {
  setCourses,
  setChapters,
  setLectures,
  setUsers,
  setNotifications,
  setLoaded,
} from '.'

export const setAllData = (data) => {
  return (dispatch) => {
    batch(() => {
      dispatch(setCourses(data.courses))
      dispatch(setChapters(data.chapters))
      dispatch(setLectures(data.lectures))
      dispatch(setUsers(data.users))
      dispatch(setNotifications(data.notifications))
      dispatch(setLoaded())
    })
  }
}
