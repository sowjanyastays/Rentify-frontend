import React, { useState } from 'react';
import NavbarComponent from '../NavbarComponent/NavbarComponent';
import './LoginComponent.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function LoginComponent() {
  const [activeTab, setActiveTab] = useState('signin');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [signupDetails, setSignUpDetails] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    type: '',
    phoneNumber: ''
  });

  const [signInDetails, setSignInDetails] = useState({
    email: '',
    password: ''
  });
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === 'signin') {
      setSignInDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    } else {
      setSignUpDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (activeTab === 'signin') {
      if (!signInDetails.email) formErrors.signemail = 'Email is required';
      if (!signInDetails.password) formErrors.signpassword = 'Password is required';
    } else {
      if (!signupDetails.email) formErrors.email = 'Email is required';
      if (!signupDetails.password) formErrors.password = 'Password is required';
      if (!signupDetails.firstName) formErrors.firstName = 'First name is required';
      if (!signupDetails.lastName) formErrors.lastName = 'Last name is required';
      if (!signupDetails.phoneNumber) formErrors.phoneNumber = 'Phone number is required';
      if (!signupDetails.type) formErrors.type = 'Please select a type';
    }
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (activeTab === 'signin') {
      try {
        const response = await axios.post(`${apiUrl}/signin`, signInDetails);
        if (response.data.message === "correct") {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('email', signInDetails.email);
          localStorage.setItem('token', response.data.token);
          navigate('/');
        }
        else if(response.data.status === "400 unauthorized"){
          setErrors({ form: response.data.message });
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const response = await axios.post(`${apiUrl}/signup`, signupDetails);
        if (response.data.status === '200 OK') {
          setShowSuccessModal(true);
        }
      } catch (error) {
        setErrors({ form: 'Error creating account. Please try again.' });
      }
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setActiveTab('signin'); // Set active tab to 'signin' when modal is closed
  };

  return (
    <div className='login-container'>
      <NavbarComponent />
      <div className='login-content-container'>
        <div className='login-left-div'>
          <h3>Rentify</h3>
          <p>
            Rentify is an innovative online platform dedicated to transforming the real estate market by seamlessly matching buyers and sellers. Designed with user experience in mind, Rentify provides a streamlined interface where sellers can list their properties and buyers can effortlessly search for their ideal home or investment. The platform employs advanced algorithms to ensure that property listings are shown to the most relevant potential buyers, maximizing the chances of a successful match. Detailed property descriptions, high-quality images, and virtual tours enhance the browsing experience, making it easier for buyers to find exactly what they’re looking for without the need for endless in-person visits.
          </p>
          <p>
            In addition to connecting buyers and sellers, Rentify offers a range of tools to facilitate smooth transactions. Users can access real-time market data, price trends, and neighborhood insights, enabling informed decision-making. For sellers, Rentify provides resources for pricing strategies and staging tips to make properties more appealing. Buyers benefit from mortgage calculators, financial advice, and a network of trusted real estate agents available for consultation. By integrating these features into one cohesive platform, Rentify not only simplifies the real estate process but also makes it more transparent and efficient for all parties involved.
          </p>
        </div>
        <div className='login-right-div'>
          <div className='login-tab-buttons'>
            <button className={activeTab === 'signin' ? 'active' : ''} onClick={() => setActiveTab('signin')}>Sign In</button>
            <button className={activeTab === 'signup' ? 'active' : ''} onClick={() => setActiveTab('signup')}>Sign Up</button>
          </div>
          <div className='login-form-container'>
            {errors.form && <div className="error">{errors.form}</div>}
            {activeTab === 'signin' ? (
              <form onSubmit={handleSubmit}>
                <h3>Login</h3>
                <label>Email:</label>
                <input type='email' name='email' placeholder='Enter your email..' value={signInDetails.email} onChange={handleInputChange} />
                {errors.signemail && <div className="error">{errors.signemail}</div>}
                <label>Password:</label>
                <input type='password' name='password' placeholder='Enter your password..' value={signInDetails.password} onChange={handleInputChange} />
                {errors.signpassword && <div className="error">{errors.signpassword}</div>}
                <button type='submit'>Login</button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3>Sign Up</h3>
                <label>First Name:</label>
                <input type='text' name='firstName' placeholder='Enter your first name..' value={signupDetails.firstName} onChange={handleInputChange} />
                {errors.firstName && <div className="error">{errors.firstName}</div>}
                <label>Last Name:</label>
                <input type='text' name='lastName' placeholder='Enter your last name..' value={signupDetails.lastName} onChange={handleInputChange} />
                {errors.lastName && <div className="error">{errors.lastName}</div>}
                <label>Phone number:</label>
                <input type='text' name='phoneNumber' placeholder='Enter your phone number..' value={signupDetails.phoneNumber} onChange={handleInputChange} />
                {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
                <label>Email:</label>
                <input type='email' name='email' placeholder='Enter your email..' value={signupDetails.email} onChange={handleInputChange} />
                {errors.email && <div className="error">{errors.email}</div>}
                <label>Password:</label>
                <input type='password' name='password' placeholder='Enter your password..' value={signupDetails.password} onChange={handleInputChange} />
                {errors.password && <div className="error">{errors.password}</div>}
                <label>Seller/Buyer</label>
                <select name='type' value={signupDetails.type} onChange={handleInputChange}>
                  <option value='seller'>Seller</option>
                  <option value='buyer'>Buyer</option>
                </select>
                {errors.type && <div className="error">{errors.type}</div>}
                <button type='submit'>Sign Up</button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Modal show={showSuccessModal} onHide={handleSuccessModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your account has been created successfully. Now you can login.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSuccessModalClose}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LoginComponent;
