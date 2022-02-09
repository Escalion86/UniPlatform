import { ADD_MODAL, REMOVE_MODAL, REMOVE_ALL_MODALS } from 'state/constants'
import { v4 as uuid } from 'uuid'

const modalsReducer = (state = {}, action) => {
  switch (action.type) {
    case REMOVE_ALL_MODALS:
      return []
    case REMOVE_MODAL:
      // return state.filter((modal, index) => index < state.length - 1)
      if (!action.id) return []
      const tempState = { ...state }
      delete tempState[action.id]
      return tempState
    case ADD_MODAL:
      // state[uuid()] = action.modal
      const modalId = uuid()
      return { ...state, [modalId]: () => action.modal(modalId) }
    default:
      return state
  }
}

export default modalsReducer
