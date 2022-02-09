import { SET_TASKS } from 'state/constants'

export const setTasks = (tasks) => {
  return {
    type: SET_TASKS,
    tasks,
  }
}
