
// export const saveUserDetailsAction = (data: any) => {
//     return {
//       type: 'SAVE_USER_DETAILS',
//       payload: data,
//     };
//   };

  // loginAction.tsx
// loginAction.tsx
// export const saveLoginDetailsAction = (loginId: string, password: string,uid:number) => {
//   return {
//     type: 'SAVE_LOGIN_DETAILS',
//     payload: { loginId, password,uid },
//   };
// };

interface SaveLoginDetailsAction {
  type: 'SAVE_LOGIN_DETAILS';
  payload: {
      username: string;
      password: string;
      id: string; 
  };
}

export type LoginActionTypes = SaveLoginDetailsAction;

// export const saveLoginDetailsAction = (username: string, password: string,id:string): SaveLoginDetailsAction => ({
//   type: 'SAVE_LOGIN_DETAILS',
//   payload: { username, password ,id},
// });

export const saveLoginDetailsAction = (username: string, password: string, id: string): SaveLoginDetailsAction => {
  const loginDetails = { username, password, id };
  localStorage.setItem('loginDetails', JSON.stringify(loginDetails));

  return {
    type: 'SAVE_LOGIN_DETAILS',
    payload: loginDetails,
  };
};




