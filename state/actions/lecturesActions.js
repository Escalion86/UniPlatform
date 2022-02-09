import { SET_LECTURES } from 'state/constants'

export const setLectures = (lectures) => {
  return {
    type: SET_LECTURES,
    lectures,
  }
}
