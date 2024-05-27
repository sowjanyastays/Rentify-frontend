import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './NavbarComponent.css';
import { useNavigate, useLocation } from 'react-router-dom';

function NavbarComponent() {
  const [userType, setUserType] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const email = localStorage.getItem('email');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchUserType() {
      try {
        if (token) {
          const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          };
          const response = await axios.post(`${apiUrl}/checkUser`, { email: email }, { headers });
          console.log(response)
          if (response.status === 401) {
            setShowSessionExpiredModal(true);
          } else {
            setUserType(response.data.details.type);
          }
        }
      } catch (error) {
        setShowSessionExpiredModal(true);
        console.error('Error fetching user type:', error);
      }
    }

    fetchUserType();
  }, [email, apiUrl, token]);

  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/login')
  };

  const handleEditMyRentals = () => {
    navigate('/editRentalDetails');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="all-navbar-container">
  <div className="navbar-logo-container">
    <img src="/logo.jpg" alt="Logo" />
  </div>
  <div className="navbar-profile-container">
    {isLoggedIn ? (
      <div className="profile-icon-container" onClick={() => setShowDropdown(!showDropdown)}>
        <i className="bi bi-person-circle"></i>
        {showDropdown && (
          <div className="dropdown-content-container">
            <button onClick={handleSignOut}>Sign Out</button>
            {userType === 'seller' && (
              <button onClick={handleEditMyRentals}>My Rentals</button>
            )}
          </div>
        )}
      </div>
    ) : (
      <button className="signin-button-container" onClick={handleSignIn}>
        Sign In
      </button>
    )}
  </div>
  {!isLoginPage && (
        <Modal show={showSessionExpiredModal} backdrop="static" keyboard={false}>
          <Modal.Body>
            <p>Your session has expired. Please sign in again.</p>
            <Button variant="primary" onClick={handleSignIn}>
              Sign In
            </Button>
          </Modal.Body>
        </Modal>
      )}
</div>

  );
}

export default NavbarComponent;
