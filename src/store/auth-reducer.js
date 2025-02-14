// auth-reducer.js (or similar)
const initialState = {
  isLoggedIn: false,
  // ... other states
};




// auth-actions.js (or similar)
export const setLoginStatus = (status) => {
  return {
    type: 'SET_LOGIN_STATUS',
    payload: status
  }
}

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOGIN_STATUS":
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    // ... other cases
    default:
      return state;
  }
};
