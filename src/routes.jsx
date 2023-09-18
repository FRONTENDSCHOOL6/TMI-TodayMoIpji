import { createHashRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Post from './pages/Post/Post';
import Writing from './pages/Writing';
// import ProtectRoute from './components/ProtectRoute';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Welcome from './pages/Welcome';
import { Mypage } from './pages/Mypage';
import UserProfileEdit from './pages/UserProfileEdit';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: ':postId', element: <Post /> },
      { path: 'writing', element: <Writing /> },
      // {
      //   path: 'writing',
      //   element: (
      //     <ProtectRoute>
      //       <Writing />
      //     </ProtectRoute>
      //   ),
      // },
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'welcome', element: <Welcome /> },
      { path: 'mypage', element: <Mypage /> },
      { path: 'userprofileedit', element: <UserProfileEdit /> },
    ],
  },
]);

export default router;
