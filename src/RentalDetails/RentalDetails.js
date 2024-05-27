import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './RentalDetails.css';
import NavbarComponent from '../NavbarComponent/NavbarComponent';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function RentalDetails() {
  const { rentalId } = useParams();
  const [rental, setRental] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState(null)
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchRentalDetails() {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      try {
        const response = await axios.post(`${apiUrl}/getRentalById`, 
            {rentalId:rentalId}, 
            {headers}
        );
        setRental(response.data.details);
        setOwnerDetails(response.data.ownerDetails);
      } catch (error) {
        console.error('Error fetching rental details:', error);
      }
    }

    fetchRentalDetails();
  }, [rentalId, apiUrl]);

  const handleContactOwner = () => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (isLoggedIn &&  token) {
      setShowOwnerDetails(true);
    } else {
      setShowModal(true);
    }
  };
  
  const handleInterested= async() => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    if (isLoggedIn &&  token) {
      try {
        const response = await axios.post(`${apiUrl}/interested`, 
            {rentalId:rentalId, email:localStorage.getItem('email')}, 
            {headers}
        );
        console.log(response);
        if(response.data.message === "Interest shown successfully"){
          alert("The owner has been notified about your intesrest");
        }
        if(response.data.message === "Email already exists in the interested list"){
          alert("Youve alreadt shown interest. Your interest has been notified to the owner");
        }
      } catch (error) {
        console.error('Error fetching rental details:', error);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleSignIn = () => navigate('/login');

  if (!rental) return <div>Loading...</div>;

  return (
    <React.Fragment>
      <NavbarComponent />
      <div className="rental-details-container">
        <div className="image-container">
          <img src={'/apartment_photo_1.jpg'} alt="Rental" />
        </div>
        <div className="details-container">
          <h1>{rental.place}</h1>
          <div className="details-table">
            <div className="row">
              <div className="col-6 detail-item">
                <i className="bi bi-geo-alt-fill"></i>
                <span>Area:</span>
                <span>{rental.area}</span>
              </div>
              <div className="col-6 detail-item">
                <i className="bi bi-house-door-fill"></i>
                <span>Address:</span>
                <span>{rental.address}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-6 detail-item">
                <i className="bi bi-map"></i>
                <span>Near To:</span>
                <span>{rental.nearTo}</span>
              </div>
              <div className="col-6 detail-item">
                <i className="bi bi-sofa-fill"></i>
                <span>Furnishing:</span>
                <span>{rental.furshining}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-6 detail-item">
                <i className="bi bi-door-closed-fill"></i>
                <span>No of Rooms:</span>
                <span>{rental.noOfRooms}</span>
              </div>
              <div className="col-6 detail-item">
                <i className="bi bi-calendar-event-fill"></i>
                <span>Available From:</span>
                <span>{new Date(rental.availableFrom).toLocaleDateString()}</span>
              </div>
            </div>
            {showOwnerDetails && (
                <div className="row">
                  <div className="col-6 detail-item owner-details">
                    <i className="bi bi-person-fill"></i>
                    <span className="label">Posted By:</span>
                    <span className="value">{rental.postedBy}</span>
                    <span className="label">Name:</span>
                    <span className="value">{ownerDetails.firstName + ' ' + ownerDetails.lastName}</span>
                    <span className="label">Contact:</span>
                    <span className="value">{ownerDetails.phoneNumber}</span>
                  </div>
                </div>
              )}
          </div>
          <button className="contact-button btn btn-primary mt-3" onClick={handleContactOwner}>
            Show Owner Details
          </button>
          <button className="contact-email-button btn btn-primary mt-3" onClick={handleInterested}>
            I am interested
          </button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Not Logged In</Modal.Title>
        </Modal.Header>
        <Modal.Body>You are not logged in. Please log in to view owner details.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSignIn}>
            Sign In
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default RentalDetails;
