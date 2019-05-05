import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import tokenReducer from "../reducers/token";
import userReducer from "../reducers/user";
import thunk from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(combineReducers({
    userId: userReducer,
    token: tokenReducer
  }),
  composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};