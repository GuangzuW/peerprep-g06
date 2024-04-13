import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, FormHelperText, Container, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Email } from '@mui/icons-material';

interface MatchRequest {
  id: string;
  email: string;
  difficulty: string;
  category: string;
  time_limit?: string;
}

const MatchRequestEditForm = () => {
  const { id } = useParams();
  const [matchRequest, setMatchRequest] = useState<MatchRequest | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');

  useEffect(() => {
    const fetchMatchRequest = async () => {
      try {
        console.log(`http://localhost:3002/matching-services/${id}`);
        const response = await axios.get(`http://localhost:3002/matching-services/${id}`);
        setMatchRequest(response.data);
        setIsFetching(false);
      } catch (error) {
        console.error('Failed to fetch match request:', error);
        setIsFetching(false);
      }
    };

    fetchMatchRequest();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      email: matchRequest?.email || '',
      difficulty: matchRequest?.difficulty || '',
      category: matchRequest?.category || '',
      time_limit: matchRequest?.time_limit || ''
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      difficulty: Yup.string().required('Difficulty is required'),
      category: Yup.string().required('Category is required'),
      time_limit: Yup.string()
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        console.log(matchRequest)
        console.log(`http://localhost:3002/matching-services/${id}`);
        const response = await axios.put(`http://localhost:3002/matching-services/${id}`, values);

        setSubmissionMessage('Request updated successfully!');
        console.log(response.data);
      } catch (error) {
        console.error(error);
        setSubmissionMessage('Update failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (isFetching) {
    return <CircularProgress />;
  }


  return (
    <Container maxWidth="sm">
      <h1>Edit Matching Request</h1>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth error={formik.touched.difficulty && Boolean(formik.errors.difficulty)}>
              <InputLabel id="difficulty-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-label"
                id="difficulty"
                name="difficulty"
                label="Difficulty"
                value={formik.values.difficulty}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
              <FormHelperText>{formik.touched.difficulty && formik.errors.difficulty}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="category"
              name="category"
              label="Category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="time_limit"
              name="time_limit"
              label="Time Limit (Optional)"
              value={formik.values.time_limit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
          <Grid item xs={12}>
            {isSubmitting ? (
              <CircularProgress />
            ) : (
              <Button color="primary" variant="contained" fullWidth type="submit" disabled={isSubmitting}>
                Update Matching Request
              </Button>
            )}
            {submissionMessage && <p>{submissionMessage}</p>}
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default MatchRequestEditForm;
