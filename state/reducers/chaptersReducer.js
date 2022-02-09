import { SET_CHAPTERS } from 'state/constants'

const chaptersReducer = (state = [], action) => {
  switch (action.type) {
    case SET_CHAPTERS:
      return action.chapters ?? state
    default:
      return state
  }
}

export default chaptersReducer
