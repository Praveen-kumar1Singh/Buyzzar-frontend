import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassowrd';
import SignUp from '../pages/SignUp';
import AdminPanel from '../pages/AdminPanel';
import AllUsers from '../pages/AllUsers';
import AllProducts from '../pages/AllProducts';
import CategoryProduct from '../pages/CategoryProduct';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import SearchProduct from '../pages/SearchProduct';
import  OrderSuccess  from '../pages/order-success';
import MyOrder from '../pages/MyOrder';

// ✅ Step 1: Create an Admin Route wrapper
const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  
  // Check if user is logged in and is an admin
  return user && user.isAdmin ? children : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'sign-up', element: <SignUp /> },
      { path: 'product-category', element: <CategoryProduct /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: 'cart', element: <Cart /> },
      { path: 'search', element: <SearchProduct /> },
      { path: '/order-success', element: <OrderSuccess /> },
      { path: '/my-orders', element: <MyOrder /> },

      // ✅ Step 2: Protect the Admin Panel Route
      {
        path: 'admin-panel',
        element: <AdminRoute><AdminPanel /></AdminRoute>,
        children: [
          { path: 'all-users', element: <AllUsers /> },
          { path: 'all-products', element: <AllProducts /> },
        ],
      },
    ],
  },
]);

export default router;
