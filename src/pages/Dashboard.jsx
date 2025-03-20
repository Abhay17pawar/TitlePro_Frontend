import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChartsDashboard = () => {
  const navigate = useNavigate(); // Initialize navigation
  const token = localStorage.getItem('token'); // Check for token (authentication)

  // If no token, redirect to home page ("/")
  useEffect(() => {
    if (!token) {
      toast.error("No token found, redirecting to login.", { autoClose: 1500 });
      navigate("/"); // Redirect to home page if user is not registered
    }
  }, [token, navigate]);

  const chartData = {
    labels: [
      "ATO Report",
      "ATO Report and Typing",
      "Document Retrieval",
      "Property Search",
      "Tax Search",
      "Title Opinion",
      "Title Services",
      "Typing",
    ],
    datasets: [
      {
        data: [176417, 9236, 6698, 356, 5000, 7000, 8000, 6000],
        backgroundColor: [
          "#f4a261",
          "#e76f51",
          "#f4d35e",
          "#e9a12e",
          "#2a9d8f",
          "#74c3c1",
          "#d8a382",
          "#e65a4c",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 10,
          padding: 10,
        },
      },
    },
  };

  const geoJsonData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "California", orders: 55749 },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-124.4096, 32.5343],
              [-114.1312, 32.5343],
              [-114.1312, 42.0095],
              [-124.4096, 42.0095],
              [-124.4096, 32.5343],
            ],
          ],
        },
      },
    ],
  };

  return (
    <div className="container-fluid p-3">
      {/* Header Section */}
      <div className="row align-items-center mb-3">
        <div className="col text-start">
          <h5>Charts</h5>
        </div>
        <div className="col-auto text-end">
          <button style={{background: 'linear-gradient(180deg, rgba(90,192,242,1) 5%, rgba(14,153,223,1) 99%)' }} className="btn text-white">+ Manage Charts</button>
        </div>
      </div>

      {/* Chart and Map Section */}
      <div className="row g-3">
        {/* Chart Section */}
        <div className="col-lg-6 col-md-12">
          <div className="border rounded p-3 h-100">
            <h5 className="text-start text-info">Orders By Product Type</h5>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
              <div style={{ width: "80%", height: "80%" }}>
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="col-lg-6 col-md-12">
          <div className="border rounded p-3 h-100">
            <h5 className="text-start text-info">Orders By State</h5>
            <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
              <MapContainer center={[37.8, -96]} zoom={4} style={{ width: "100%", height: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <GeoJSON data={geoJsonData} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsDashboard;
