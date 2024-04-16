import React, { useState, useEffect } from 'react';
import { CircularProgress, Container, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const MatchingInProgress: React.FC = () => {
  const location = useLocation();
  const timeLimit = location.state?.timeLimit || '60';
  const [countdown, setCountdown] = useState(parseInt(timeLimit, 10)); // 30 seconds countdown
  const navigate = useNavigate();
  const [matchInfo, setMatchInfo] = useState(null);
  // const [showError, setShowError] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:3003');

    socket.on('matchFound', (data) => {
      setMatchInfo(data);
      setCountdown(10);
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [countdown]);

  useEffect(() => {
    if (matchInfo) {
      const timerId = setTimeout(() => {
        navigate(`/collaboration`);
      }, 10000);
      return () => clearTimeout(timerId);
    } else if (countdown === 0) {
      // setShowError(true);
      const timerId = setTimeout(() => {
        navigate('/matches/create', { state: { error: 'Matching process failed. Please try again.' } });
      }, 5000);
      return () => clearTimeout(timerId);
    }
  }, [countdown, matchInfo, navigate]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
        Matching in Progress
      </Typography>
      <CircularProgress size={70} sx={{ display: 'block', margin: 'auto' }} />
      <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
        Please wait, we are processing your request...
      </Typography>
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
        Redirecting in {countdown} seconds...
      </Typography>
    </Container>
  );
};

export default MatchingInProgress;
