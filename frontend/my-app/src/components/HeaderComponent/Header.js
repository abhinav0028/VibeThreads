import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                {/* Logo */}
                <Link to="/" className="logo">
                  <img src="/assets/images/logo.png" className="logo-img" alt="Logo" />
                </Link>

                {/* Navigation Links */}
                <ul className="nav">
                  <li className="scroll-to-section">
                    <Link to="/" className="active">Home</Link>
                  </li>

                  {user && user.role === 'admin' && (
                    <>
                      <li className="scroll-to-section">
                        <Link to="/admin/dashboard">Admin Dashboard</Link>
                      </li>
                      <li className="scroll-to-section">
                        <Link to="/login" className="logout-button" onClick={handleLogout}>Logout</Link>
                      </li>
                    </>
                  )}

                  {user && user.role === 'user' && (
                    <>
                      <li className="scroll-to-section">
                        <Link to="/cart">Cart</Link>
                      </li>
                      <li className="scroll-to-section dropdown">
                        <span className="dropdown-toggle">Profile</span>
                        <ul className="dropdown-menu">  
                        <li><Link to="/updateprofile" >Profile update</Link></li>

                          <li><Link to="/changepassword"> Change Password </Link></li>
                        </ul>
                      </li>
                      <li className="scroll-to-section">
                        <Link to="/login" className="logout-button" onClick={handleLogout}>Logout</Link>
                      </li>
                    </>
                  )}

                  {!user && (
                    <li className="scroll-to-section">
                      <Link to="/login">Login</Link>
                    </li>
                  )}
                </ul>

                <a className="menu-trigger">
                  <span>Menu</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;