interface SaveLoginDetailsAction {
  type: 'SAVE_LOGIN_DETAILS';
  payload: {
    username: string;
    password: string;
    id: string;
  };
}

export type LoginActionTypes = SaveLoginDetailsAction;

export const saveLoginDetailsAction = (username: string, password: string, id: string): SaveLoginDetailsAction => {
  const loginDetails = { username, password, id };
  localStorage.setItem('loginDetails', JSON.stringify(loginDetails));

  return {
    type: 'SAVE_LOGIN_DETAILS',
    payload: loginDetails,
  };
};




