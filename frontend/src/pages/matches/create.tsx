import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, FormHelperText, Container, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useGetIdentity } from "@refinedev/core";
import { IUser } from '../../components/layout/types';
import { useNavigate } from 'react-router-dom';

interface FormValues {
  email: string
  difficulty: string;
  category: string;
  time_limit?: string;
}

const MatchRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const { data: user } = useGetIdentity<IUser>();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: '',
      difficulty: '',
      category: '',
      time_limit: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      difficulty: Yup.string().required('Difficulty is required'),
      category: Yup.string().required('Category is required'),
      time_limit: Yup.string()
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const response = await axios.post("http://localhost:3003/matching-services", values);
        console.log(values);
        setSubmissionMessage('Request submitted successfully!');
        // Handle response
        console.log(response.data);
        navigate('/matches/pair', { state: { timeLimit: values.time_limit || '60' } });
      } catch (error) {
        // Handle error
        console.error(error);
        setSubmissionMessage('Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });


  useEffect(() => {
    if (user?.email) {
      formik.setFieldValue('email', user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, formik.setFieldValue]);

  return (
    <Container maxWidth="sm">
      <h1>New Matching Request</h1>
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
                Start Matching
              </Button>
            )}
            {submissionMessage && <p>{submissionMessage}</p>}
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default MatchRequestForm;



