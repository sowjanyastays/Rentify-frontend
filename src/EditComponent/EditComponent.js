import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './EditComponent.css';
import NavbarComponent from '../NavbarComponent/NavbarComponent';
import { useNavigate } from 'react-router-dom';

function EditComponent() {
  const [rentals, setRentals] = useState([]);
  const [userType, setUserType] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedRental, setEditedRental] = useState({});
  const [newRental, setnewRental] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showNewRentalModal, setShowNewRentalModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchUserType() {
      try {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          };
        const response = await axios.post(`${apiUrl}/checkUser`, { email: email }, {headers});
        setUserType(response.data.details.type);
        if (response.data.details.type === 'seller') {
          fetchUserRentals();
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    }
    fetchUserType();
  }, [email, apiUrl]);
  
  async function fetchUserRentals() {
    try {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          };
      const response = await axios.post(`${apiUrl}/getRentalByEmail`, { email: email }, {headers});
      setRentals(response.data);
    } catch (error) {
      console.error('Error fetching user rentals:', error);
    }
  }

  const handleEdit = (rentalId) => {
    const rentalToEdit = rentals.find(rental => rental.rentalId === rentalId);
    setEditedRental(rentalToEdit);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditedRental({});
    setSuccessMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRental(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setnewRental(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          };
      await axios.post(`${apiUrl}/updateRental`, editedRental, {headers});
      setSuccessMessage('Edit details updated successfully');
      fetchUserRentals();
    } catch (error) {
      console.error('Error updating rental details:', error);
    }
  };

  const handlePostSubmit = async () => {
    try {
        const newRentalBody= {
            ...newRental,
            postedBy: email
          };
          const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          };
      await axios.post(`${apiUrl}/postRental`, newRentalBody, {headers});
      setSuccessMessage('New rental posted successfully');
      setShowNewRentalModal(false);
      fetchUserRentals();
    } catch (error) {
      console.error('Error updating rental details:', error);
    }
  };


  const handleDelete = async (rentalId) => {
    setItemToDeleteId(rentalId);
    setShowConfirmationModal(true);
  };
  const handleDeleteConfirmed = async () => {
    try {
      await axios.post(`${apiUrl}/deleteRental`, { rentalId: itemToDeleteId });
      setRentals(rentals.filter(rental => rental.rentalId !== itemToDeleteId));
      handleCloseConfirmationModal();
    } catch (error) {
      console.error('Error deleting rental:', error);
    }
  };
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setItemToDeleteId(null);
  };

  const handleShowNewRentalModal = () => {
    setShowNewRentalModal(true);
  };

  const handleCloseNewRentalModal = () => {
    setShowNewRentalModal(false);
  };

  if (userType !== 'seller') return <div>Loading...</div>;

  return (
    <React.Fragment>
      <NavbarComponent />
      <Button className='post-rental' variant="primary" onClick={handleShowNewRentalModal}>Post New Rental</Button>
      <Container className='card-container'>
        <Row>
          {rentals.map((rental) => (
            <Col key={rental.rentalId} xs={12} md={6} lg={4} xl={3}>
              <Card className="mb-3">
                <Card.Img variant="top" src={rental.imageUrl || '/apartment_photo_1.jpg'} />
                <Card.Body>
                  <Card.Title>{rental.place}</Card.Title>
                  <Card.Text>
                    Area: {rental.area}
                    <br />
                    Address: {rental.address}
                    <div className="action-icons">
                      <i className="bi bi-pencil-square" onClick={() => handleEdit(rental.rentalId)}></i>
                      <i className="bi bi-trash" onClick={() => handleDelete(rental.rentalId)}></i>
                    </div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Rental</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group className="mb-3" controlId="formPlace">
  <Form.Label>Name</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter name"
    name="place"
    value={editedRental.place}
    onChange={handleInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formArea">
  <Form.Label>Area</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter area"
    name="area"
    value={editedRental.area || ''}
    onChange={handleInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formAddress">
  <Form.Label>Address</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter address"
    name="address"
    value={editedRental.address || ''}
    onChange={handleInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formNearTo">
  <Form.Label>Near To</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter nearTo"
    name="nearTo"
    value={editedRental.nearTo || ''}
    onChange={handleInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formFurnishing">
  <Form.Label>Furnishing</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter furshining"
    name="furshining"
    value={editedRental.furshining || ''}
    onChange={handleInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formNoOfRooms">
  <Form.Label>No of Rooms</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter noOfRooms"
    name="noOfRooms"
    value={editedRental.noOfRooms || ''}
    onChange={handleInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formAvailableFrom">
  <Form.Label>Available From</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter Available From"
    name="availableFrom"
    value={editedRental.availableFrom || ''}
    onChange={handleInputChange}
  />
</Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          {successMessage && <span className="success-message">{successMessage}</span>}
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showNewRentalModal} onHide={handleCloseNewRentalModal}>
        <Modal.Header closeButton>
          <Modal.Title>Post New Rental</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formPlace">
  <Form.Label>Name</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter name"
    name="place"
    value={newRental.place || ''}
    onChange={handleNewInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formArea">
  <Form.Label>Area</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter area"
    name="area"
    value={newRental.area || ''}
    onChange={handleNewInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formAddress">
  <Form.Label>Address</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter address"
    name="address"
    value={newRental.address || ''}
    onChange={handleNewInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formNearTo">
  <Form.Label>Near To</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter Near To"
    name="nearTo"
    value={newRental.nearTo || ''}
    onChange={handleNewInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formFurnishing">
  <Form.Label>Furnishing</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter furshining"
    name="furshining"
    value={newRental.furshining || ''}
    onChange={handleNewInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formNoOfRooms">
  <Form.Label>No of Rooms</Form.Label>
  <Form.Control
    type="number"
    placeholder="Enter no of rooms"
    name="noOfRooms"
    value={newRental.noOfRooms || ''}
    onChange={handleNewInputChange}
  />
</Form.Group>
<Form.Group className="mb-3" controlId="formAvailableFrom">
  <Form.Label>Available From</Form.Label>
  <Form.Control
    type="text"
    placeholder="Enter Available From"
    name="availableFrom"
    value={newRental.availableFrom || ''}
    onChange={handleNewInputChange}
  />
</Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNewRentalModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePostSubmit}>
            Post
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmationModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default EditComponent;
