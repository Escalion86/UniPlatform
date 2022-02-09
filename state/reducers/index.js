import { combineReducers } from 'redux'
import coursesReducer from './coursesReducer'
import chaptersReducer from './chaptersReducer'
import lecturesReducer from './lecturesReducer'
import modalsReducer from './modalsReducer'
import pageReducer from './pageReducer'
import appReducer from './appReducer '
import usersReducer from './usersReducer'
import notificationsReducer from './notificationsReducer'

const allReducers = combineReducers({
  courses: coursesReducer,
  chapters: chaptersReducer,
  lectures: lecturesReducer,
  users: usersReducer,
  modals: modalsReducer,
  page: pageReducer,
  loaded: appReducer,
  notifications: notificationsReducer,
})

export default allReducers
