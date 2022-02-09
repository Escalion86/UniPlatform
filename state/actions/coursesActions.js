import { SET_COURSES } from 'state/constants'

export const setCourses = (courses) => {
  return {
    type: SET_COURSES,
    courses,
  }
}
