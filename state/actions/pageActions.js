import { SET_PAGE } from 'state/constants'

export const setPage = (page) => {
  return {
    type: SET_PAGE,
    page,
  }
}
