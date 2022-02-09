import { SET_CHAPTERS } from 'state/constants'

export const setChapters = (chapters) => {
  return {
    type: SET_CHAPTERS,
    chapters,
  }
}
