const userReducerDefaultState = {
  userId: ""
}

export default (state = userReducerDefaultState, action) => {
  switch(action.type) {
    case "SET_USER_NAME":
      return {
        ...state,
        userId: action.userId
      }
    default:
      return state;
  }
}