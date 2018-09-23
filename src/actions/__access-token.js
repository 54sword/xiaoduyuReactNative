export const saveAccessToken = ({ expires, access_token }) => {
  return { type: 'ADD_ACCESS_TOKEN', expires, access_token }
}

export const removeAccessToken = () => {
  return dispatch => {
    dispatch({ type: 'REMOVE_ACCESS_TOKEN' })
  }
}
