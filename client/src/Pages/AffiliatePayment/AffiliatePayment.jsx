// src/pages/AffiliatePayment.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import axios from 'axios';

const AffiliatePayment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loadRazorpay = async () => {
      const affiliateData = JSON.parse(localStorage.getItem('affiliateData'));
      if (!affiliateData) {
        navigate('/affiliate-program');
        return;
      }

      try {
        const { data } = await axios.post('/api/affiliate/create-order', {
          amount: 100,
          currency: 'INR',
          notes: affiliateData
        });

        const { id: orderId, amount, currency } = data.order;

        const options = {
          key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
          amount: amount.toString(),
          currency,
          name: 'Spark n stitch',
          description: 'Affiliate Program Payment',
          order_id: orderId,
          handler: async function (response) {
            try {
              await axios.post('/api/affiliate/verify-payment', {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
              navigate('/affiliate-success');
            } catch (error) {
              console.error('Payment verification failed:', error);
              navigate('/affiliate-failure');
            }
          },
          prefill: {
            name: affiliateData.name,
            email: affiliateData.email,
            contact: affiliateData.phone,
            method: "upi" // this helps suggest UPI apps
          },
          theme: { color: "#3399cc" },
          modal: {
            ondismiss: function () {
              navigate('/affiliate-failure');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error('Order creation failed:', error);
        navigate('/affiliate-failure');
      }
    };

    loadRazorpay();
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 2,
        boxShadow: 1
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Redirecting to Razorpay...
        </Typography>
      </Box>
    </Container>
  );
};

export default AffiliatePayment;
