import { useEffect, useState, useRef } from "react";
import { useNotification } from "@refinedev/core";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import { MatchingRequestorIndicatorProps } from "./types";

enum IndicatorType {
  Countdown,
  Cancel,
  Retry,
}

export const MatchingRequestorIndicator: React.FC<MatchingRequestorIndicatorProps> = ({
  store,
  maxWaitingTime,
  onRetry,
  onCancel,
}) => {
  const initialProgress = store
    ? Math.max(Math.ceil((store.requestedAt.getTime() + maxWaitingTime * 1000 - new Date().getTime()) / 1000), 0)
    : maxWaitingTime;

  const [currentIndicatorType, setCurrentIndicatorType] = useState<IndicatorType>(
    initialProgress !== 0 ? IndicatorType.Countdown : IndicatorType.Retry
  );
  const [progress, setProgress] = useState(initialProgress);
  const timerRef = useRef<number | undefined>(undefined);
  const notificationEnabledRef = useRef<boolean>(false);
  const { open: notify } = useNotification();

  const startTimer = () => {
    stopTimer();
    notificationEnabledRef.current = false;
    timerRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        const progress = Math.max(prevProgress - 1, 0);
        if (progress <= 0) {
          stopTimer();
          setCurrentIndicatorType(IndicatorType.Retry);
          if (!notificationEnabledRef.current) {
            notificationEnabledRef.current = true;
            notify?.({
              type: "error",
              message: "Error",
              description: "No matching found",
            });
          }
        }
        return progress;
      });
    }, 1000) as unknown as number;
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startTimer();

    return () => stopTimer();
  });

  return (
    <Fab
      color="primary"
      onClick={() => {
        if (currentIndicatorType === IndicatorType.Cancel) {
          onCancel();
        } else if (currentIndicatorType === IndicatorType.Retry) {
          setProgress(maxWaitingTime);
          startTimer();
          setCurrentIndicatorType(IndicatorType.Cancel);
          onRetry();
        }
      }}
      onPointerEnter={() => {
        setCurrentIndicatorType(progress > 0 ? IndicatorType.Cancel : IndicatorType.Retry);
      }}
      onPointerLeave={() => {
        setCurrentIndicatorType(progress > 0 ? IndicatorType.Countdown : IndicatorType.Retry);
      }}
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          size={56}
          color="warning"
          variant="determinate"
          value={100 * (maxWaitingTime - progress) / maxWaitingTime}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" component="div" color="inherit" textTransform="none">
            {currentIndicatorType === IndicatorType.Countdown && `${progress}s`}
            {currentIndicatorType === IndicatorType.Cancel && "Cancel"}
            {currentIndicatorType === IndicatorType.Retry && "Retry"}
          </Typography>
        </Box>
      </Box>
    </Fab>
  )
};
