import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://kmd.cpsharetxt.com/api";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/get_suppliers.php`)
      .then(res => setSuppliers(res.data))
      .catch(err => console.error("Error fetching suppliers:", err));
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-4">🏭 Our Suppliers</h2>
      <div className="row">
        {suppliers.map((s) => (
          <div className="col-md-4 col-sm-6 mb-4" key={s.id}>
            <div className="card shadow-sm p-3 text-center">
              <h5>{s.name}</h5>
              <p className="text-muted">{s.contact}</p>
              <p>{s.address}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Suppliers;
