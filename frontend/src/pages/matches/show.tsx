import { useEffect, useState } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { useShow } from '@refinedev/core';
import { NumberField, Show } from '@refinedev/mui';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface MatchRequest {
  matching_service_id: string;
  difficulty: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  time_limit?: string;
}

export const MatchShow = () => {
  const { id } = useParams();
  // const [isFetching, setIsFetching] = useState(true);
  const [matchRequest, setMatchRequest] = useState<MatchRequest | null>(null);
  const { queryResult } = useShow({ resource: 'matches' });
  const { isLoading } = queryResult;

  useEffect(() => {
    const fetchMatchRequest = async () => {
      try {
        console.log(`http://localhost:3003/matching-services/${id}`);
        const response = await axios.get(`http://localhost:3003/matching-services/${id}`);
        setMatchRequest(response.data);
        // setIsFetching(false);
      } catch (error) {
        console.error('Failed to fetch match request:', error);
        // setIsFetching(false);
      }
    };

    fetchMatchRequest();
  }, [id]);

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Typography variant="body1" fontWeight="bold">
          ID
        </Typography>
        <NumberField value={matchRequest?.matching_service_id ?? ''} />
        <Typography variant="body1" fontWeight="bold">
          Difficulty
        </Typography>
        <TextField value={matchRequest?.difficulty} />
        <Typography variant="body1" fontWeight="bold">
          Category
        </Typography>
        <TextField value={matchRequest?.category} />
        <Typography variant="body1" fontWeight="bold">
          Created at
        </Typography>
        <TextField value={matchRequest?.createdAt} />
        <Typography variant="body1" fontWeight="bold">
          Updated at
        </Typography>
        <TextField value={matchRequest?.updatedAt} />
      </Stack>
    </Show>
  );
};
