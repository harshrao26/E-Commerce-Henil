import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';

const AffiliateSuccess = () => {
  const whatsappGroupLink = "https://chat.whatsapp.com/YOUR_GROUP_LINK";

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Box sx={{ 
        bgcolor: 'background.paper', 
        p: 4, 
        borderRadius: 2, 
        boxShadow: 1,
        textAlign: 'center'
      }}>
        <Typography variant="h4" gutterBottom color="success.main">
          Payment Successful!
        </Typography>
        <Typography variant="body1" paragraph>
          Thank you for joining our Affiliate Program.
        </Typography>
        <Typography variant="body1" paragraph>
          You will receive an email with all the details shortly.
        </Typography>
        
        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Join our WhatsApp Group
          </Typography>
          <Typography variant="body2" paragraph>
            Connect with other affiliates and get updates:
          </Typography>
          <Button
            variant="contained"
            color="success"
            startIcon={<FaWhatsapp />}
            href={whatsappGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 2 }}
          >
            Join WhatsApp Group
          </Button>
        </Box>
        
        <Button
          variant="outlined"
          component={Link}
          to="/"
          sx={{ mt: 4 }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default AffiliateSuccess;