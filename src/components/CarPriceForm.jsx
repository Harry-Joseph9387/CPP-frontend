import React, { useState, useEffect } from 'react';
import './CarPriceForm.css';

const CarPriceForm = () => {
  const [formData, setFormData] = useState({
    car_name: '',
    vehicle_age: '',
    km_driven: '',
    seller_type: '',
    fuel_type: '',
    transmission_type: '',
    mileage: '',
    engine: '',
    max_power: '',
    seats: ''
  });

  const [predictedPrice, setPredictedPrice] = useState(null);
  const [uniqueValues, setUniqueValues] = useState({});
  const [defaultValues, setDefaultValues] = useState({});

  useEffect(() => {
    // Fetch both unique values and default values when component mounts
    fetch('https://cpp-backend-xbv0.onrender.com/get-unique-values')
      .then(response => response.json())
      .then(data => {
        setUniqueValues(data.unique_values);
        setDefaultValues(data.default_values);
        // Set the default values as initial form values
        setFormData(data.default_values);
      })
      .catch(error => console.error('Error fetching form data:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new object with default values for any empty fields
      const submissionData = {};
      Object.keys(formData).forEach(key => {
        submissionData[key] = formData[key] || defaultValues[key];
      });

      const response = await fetch('https://cpp-backend-xbv0.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });
      
      const data = await response.json();
      setPredictedPrice(data.predicted_price);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Add this new function to format number in Indian system
  const formatToIndianSystem = (num) => {
    const lakhs = 100000;
    const crores = 10000000;
    
    if (num >= crores) {
      return `₹ ${(num / crores).toFixed(2)} Cr`;
    } else if (num >= lakhs) {
      return `₹ ${(num / lakhs).toFixed(2)} L`;
    } else {
      return `₹ ${num.toLocaleString('en-IN')}`;
    }
  };

  return (
    <div className="form-container">
      <h2>Car Price Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Car Name:</label>
          <select
            name="car_name"
            value={formData.car_name}
            onChange={handleInputChange}
          >
            <option value="">Select Car Name</option>
            {uniqueValues.car_name?.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Vehicle Age:</label>
          <input
            type="number"
            name="vehicle_age"
            value={formData.vehicle_age}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Kilometers Driven:</label>
          <input
            type="number"
            name="km_driven"
            value={formData.km_driven}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Seller Type:</label>
          <select
            name="seller_type"
            value={formData.seller_type}
            onChange={handleInputChange}
          >
            <option value="">Select Seller Type</option>
            {uniqueValues.seller_type?.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fuel Type:</label>
          <select
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleInputChange}
          >
            <option value="">Select Fuel Type</option>
            {uniqueValues.fuel_type?.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Transmission Type:</label>
          <select
            name="transmission_type"
            value={formData.transmission_type}
            onChange={handleInputChange}
          >
            <option value="">Select Transmission</option>
            {uniqueValues.transmission_type?.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Mileage (kmpl):</label>
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Engine (CC):</label>
          <input
            type="number"
            name="engine"
            value={formData.engine}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Max Power (bhp):</label>
          <input
            type="number"
            name="max_power"
            value={formData.max_power}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Seats:</label>
          <input
            type="number"
            name="seats"
            value={formData.seats}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">Predict Price</button>
      </form>

      {predictedPrice && (
        <div className="prediction-result">
          <h3>Predicted Price:</h3>
          <p>{formatToIndianSystem(predictedPrice)}</p>
        </div>
      )}
    </div>
  );
};

export default CarPriceForm; 