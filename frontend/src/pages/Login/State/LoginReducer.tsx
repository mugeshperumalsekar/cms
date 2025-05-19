// const loginReducer = (state = {}, action: { type: any; payload: any; }) => {
//     switch (action.type) {
//         case 'SAVE_USER_DETAILS':
//             return {
//                 ...state,
//                 userData: action.payload
//             };
//         default:
//             return state;
//     }
// };

// export default loginReducer;
  
// loginReducer.tsx
// loginReducer.tsx
// const loginReducer = (
//   state = { userData: {}, loginDetails: {} },
//   action: { type: string; payload: { loginId: string;password:string; uid: number } }
// ) => {
//   switch (action.type) {
//     case 'SAVE_USER_DETAILS':
//       return {
//         ...state,
//         userData: action.payload,
//       };
//     case 'SAVE_LOGIN_DETAILS':
//       return {
//         ...state,
//         loginDetails: action.payload,
//       };
//     default:
//       return state;
//   }
// };

// export default loginReducer;
const storedLoginDetails = localStorage.getItem('loginDetails');
const initialState = {
  userData: {},
  loginDetails: storedLoginDetails ? JSON.parse(storedLoginDetails) : {},
};

const loginReducer = (
  state = initialState,
  action: { type: string; payload: { email: string; password: string; id: number } }
) => {
  switch (action.type) {
    case 'SAVE_USER_DETAILS':
      return {
        ...state,
        userData: action.payload,
      };
    case 'SAVE_LOGIN_DETAILS':
      // Save to localStorage
      localStorage.setItem('loginDetails', JSON.stringify(action.payload));
      
      return {
        ...state,
        loginDetails: action.payload,
      };
    default:
      return state;
  }
};



export default loginReducer;



