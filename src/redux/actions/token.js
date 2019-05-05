export const setToken = (token = "") => ({
  type: "SET_TOKEN",
  token
});

export const updateToken = (token = null) => ({
  type: "UPDATE_TOKEN",
  token
})