import { SET_ANSWERS } from 'state/constants'

export const setAnswers = (answers) => {
  return {
    type: SET_ANSWERS,
    answers,
  }
}
