import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Verify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      axios.post('http://localhost:8080/api/user/verify', { token })
        .then(res => {
          alert(res.data.message);  // You can remove this alert if not needed
          navigate('/login');       
        })
        .catch(err => {
          alert("Verification failed. Link may be expired.");
          navigate('/');
        });
    } else {
      alert("Invalid verification link.");
      navigate('/');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      Verifying your email...
    </div>
  );
}

export default Verify;