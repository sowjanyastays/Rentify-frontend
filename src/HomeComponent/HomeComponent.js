import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavbarComponent from '../NavbarComponent/NavbarComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeComponent.css';
import { useNavigate } from 'react-router-dom';

function HomeComponent() {
  const [rentals, setRentals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate(); 

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${apiUrl}/getAllRentals`);
        setRentals(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [apiUrl]);

  const handleViewDetails = (rentalId) => {
    navigate(`/rentalDetails/${rentalId}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRentals = rentals.filter((rental) =>
    Object.values(rental).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <React.Fragment>
      <NavbarComponent />
      <Container>
        <h3 className='home-heading'>All properties</h3>
      <div className="home-search-container">
  <input
    className="home-input"
    type="text"
    placeholder="Search..."
    value={searchTerm}
    onChange={handleSearch}
  />
  <span className="home-search-icon bi bi-search" onClick={() => setSearchTerm('')}></span>
</div>
<Row>
  {filteredRentals.map((rental) => (
    <Col key={rental.rentalId} xs={12} md={6} lg={4} xl={3}>
      <Card className="home-card mb-3">
        <Card.Img variant="top" src={'/apartment_photo_1.jpg'} />
        <Card.Body className="home-card-body">
          <Card.Title>{rental.place}</Card.Title>
          <Card.Text>
            Area: {rental.area}
            <br />
            Address: {rental.address}
          </Card.Text>
        </Card.Body>
        <button className="home-card-button view-details-btn" onClick={() => handleViewDetails(rental.rentalId)}>View more details</button>
      </Card>
    </Col>
  ))}
</Row>

      </Container>
    </React.Fragment>
  );
}

export default HomeComponent;
