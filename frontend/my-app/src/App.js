import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Components
import Banner from './components/BannerComponent/Banner';
import Footer from './components/FooterComponent/Footer';
import Header from './components/HeaderComponent/Header';
import CategorySlider from './components/CategorySliderComponent/CategorySlider';
import NewArrivals from './components/NewArrivalComponent/NewArrival';
import Login from './components/LoginComponent/Login';
import Register from './components/RegisterComponent/Register';
import Verify from './components/VerifyComponent/Verify';
import Cart from './components/CartComponent/CartComponent';
import UpdateProfile from './components/UpdateProfileComponent/UpdateProfile';
import ChangePassword from './components/ChangePasswordComponent/ChangePassword';
import CategoryPages from './components/CategoryComponent/CategoryPage';
import ProductDetail from './components/ProductDetailsComponent/ProductDetails';
import Section from './components/SectionComponent/Section';
import Checkout from './components/CheckoutComponent/Checkout';
import Order from './components/OrderComponent/Order';

// Admin Panel Components
import AdminDashboard from './components/AdminComponent/AdminDashboard/AdminDashboard';
import ProductList from './components/AdminComponent/ProductList/ProductList';
import AddProduct from './components/AdminComponent/AddProduct/AddProduct';
import OrderList from './components/AdminComponent/OrderList/OrderList';
import UserList from './components/AdminComponent/UserList/UserList';
import CategoryList from './components/AdminComponent/CategoryList/CategoryList';


function App() {
  const location = useLocation();
  const { user } = useAuth();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/register', '/verify'].includes(location.pathname);
  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Header - shown on all public pages, fixed at the top */}
      {!isAdminRoute && <Header />}

      {/* Main Content Wrapper - this will contain all dynamic page content */}
      {/* It will have padding to account for the fixed header and footer */}
      <div className="main-content-wrapper">
        {/* Show homepage components only on '/' */}
        {!isAdminRoute && !isAuthRoute && isHomePage && (
          <>
            <Banner />
            <CategorySlider />
            <Section />
            <NewArrivals />
          </>
        )}

        {/* Main Routes - components rendered here will appear within the main-content-wrapper */}
        <Routes>
          {/* Public Routes */}
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/updateprofile" element={<UpdateProfile />} />
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/category/:categoryName" element={<CategoryPages />} />
          <Route path="/category/:categoryName" element={<CategoryPages />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order" element={<Order/>}/>


          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/categories" element={<CategoryList />} />
          
        </Routes>
      </div>

      {/* Footer - shown on all public pages, fixed at the bottom */}
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </>
  );
}

export default App;