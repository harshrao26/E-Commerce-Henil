import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const AffiliateSuccess = () => {
  const whatsappGroupLink = "https://chat.whatsapp.com/EGXJWqqAp7s3ODEVLNMYzB";
  const bgColor = '#f6e8d1';
  const btnColor = '#d3a762'; // Complementary shade
  const btnHover = '#c99c56'; // Slightly darker for hover

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Box sx={{ 
        backgroundColor: bgColor, 
        p: 4, 
        borderRadius: 2, 
        boxShadow: 1,
        textAlign: 'center'
      }}>
        <Typography variant="h4" gutterBottom sx={{ color: btnColor }}>
          Payment Successful!
        </Typography>
        <Typography variant="body1" paragraph>
          Thank you for joining our Affiliate Program.
        </Typography>
        <Typography variant="body1" paragraph>
          You will receive an email with all the details shortly.
        </Typography>
        
        <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Join our WhatsApp Group
          </Typography>
          <Typography variant="body2" paragraph>
            Connect with other affiliates and get updates:
          </Typography>
          <Button
            variant="contained"
            startIcon={<FaWhatsapp />}
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              mt: 2,
              backgroundColor: btnColor,
              '&:hover': {
                backgroundColor: btnHover,
              }
            }}
          >
            Join WhatsApp Group
          </Button>
        </Box>
        
        <Button
          variant="outlined"
          component={Link}
          to="/"
          sx={{
            mt: 4,
            color: btnColor,
            borderColor: btnColor,
            '&:hover': {
              backgroundColor: btnColor,
              color: '#fff',
              borderColor: btnHover,
            }
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default AffiliateSuccess;
