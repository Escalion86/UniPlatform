import { ADD_MODAL, REMOVE_MODAL, REMOVE_ALL_MODALS } from 'state/constants'

export const addModal = (modal) => {
  return {
    type: ADD_MODAL,
    modal,
  }
}

export const removeModal = (id) => {
  return {
    type: REMOVE_MODAL,
    id,
  }
}

export const removeAllModals = () => {
  return {
    type: REMOVE_ALL_MODALS,
  }
}
