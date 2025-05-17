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
        // Create order on backend
        const response = await axios.post('/api/affiliate/create-order', {
          amount: 49, // Amount in rupees
          currency: 'INR',
          receipt: `affiliate_${Date.now()}`,
          notes: affiliateData
        });

        const { id: orderId, amount, currency } = response.data.order;

        const options = {
          key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
          amount: amount.toString(), // amount in paise as string
          currency,
          name: "Your Company Name",
          description: "Affiliate Program Registration",
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
            contact: affiliateData.phone
          },
          notes: affiliateData,
          theme: {
            color: "#3399cc"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error('Error:', error);
        navigate('/affiliate-failure');
      }
    };

    loadRazorpay();
  }, [navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
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
          Redirecting to Payment Gateway...
        </Typography>
      </Box>
    </Container>
  );
};

export default AffiliatePayment;
