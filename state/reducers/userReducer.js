const userReducer = (state = [], action) => {
  switch (action.type) {
    case 'SIGN_IN':
      return (state = { ...state, logged_in: true })
    case 'SIGN_OUT':
      return (state = { ...state, logged_in: false })
    default:
      return state
  }
}

export default userReducer
