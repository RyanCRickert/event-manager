const tokenReducerDefaultState = {
  token: null
}

export default (state = tokenReducerDefaultState, action) => {
  switch(action.type) {
    case "SET_TOKEN":
      return {
        ...state,
        token: action.token
      }
    case "UPDATE_TOKEN":
      return {
        ...state,
        token: action.token
    }
    default:
      return state;
  }
}