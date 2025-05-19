// import './App.css';
// import AppRouter from './router/app-route';
// import "bootstrap/dist/css/bootstrap.min.css";
// import 'react-toastify/dist/ReactToastify.css';



// function App() {
//   return (
//     <>
//       <AppRouter />
//     </>
//   );
// }

// export default App;



import './App.css';
import AppRouter from './router/app-route';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>

        <AppRouter />
      </QueryClientProvider>

    </>
  );
}

export default App;
