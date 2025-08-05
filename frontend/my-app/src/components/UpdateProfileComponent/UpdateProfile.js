import './UpdateProfile.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function UpdateProfile() {
  const [userDetails, setUserDetails] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get("http://localhost:8080/api/user/fetch", {
        params: { email: user.email }
      })
      .then((res) => {
        if (res.data.users?.length) {
          setUserDetails([res.data.users[0]]);
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, [user]);

  const handleChange = (e, userId, field) => {
    setUserDetails((prevDetails) =>
      prevDetails.map((detail) =>
        detail._id === userId ? { ...detail, [field]: e.target.value } : detail
      )
    );
  };

  const handleSubmit = (e, user) => {
    e.preventDefault();

    axios
      .patch("http://localhost:8080/api/user/update", {
        condition_obj: { _id: user._id },
        content_obj: {
          name: user.name,
          mobile: user.mobile,
          address: user.address,
        },
      })
      .then(() => {
        alert(" Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err.response?.data || err.message);
      });
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Edit Profile</h2>

        {userDetails.map((user) => (
          <form key={user._id} onSubmit={(e) => handleSubmit(e, user)} className="profile-form">
            <label>Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => handleChange(e, user._id, "name")}
              required
            />

            <label>Email</label>
            <input type="email" value={user.email} readOnly />

            <label>Mobile</label>
            <input
              type="text"
              value={user.mobile}
              onChange={(e) => handleChange(e, user._id, "mobile")}
            />

            <label>Address</label>
            <input
              type="text"
              value={user.address}
              onChange={(e) => handleChange(e, user._id, "address")}
            />

            <button type="submit">Save Changes</button>
          </form>
        ))}
      </div>
    </div>
  );
}

export default UpdateProfile;