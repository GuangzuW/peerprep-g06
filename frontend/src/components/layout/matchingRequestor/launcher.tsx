import React, { useEffect, useState, useRef } from "react";
import Collapse from "@mui/material/Collapse";
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import Fab from "@mui/material/Fab";
import { MatchingRequestorLauncherProps } from "./types";

export const MatchingRequestorLauncher: React.FC<MatchingRequestorLauncherProps> = ({
  onClick,
}) => {
  const [requestorExtended, setRequestorExtended] = useState(false);
  const requestorExtendedTimerRef = useRef<number | undefined>(undefined);

  const startRequestorExtendedTimer = () => {
    stopRequestorExtendedTimer();
    requestorExtendedTimerRef.current = setInterval(() => {
      setRequestorExtended((requestorExtended) => !requestorExtended);
    }, 5000) as unknown as number
  };

  const stopRequestorExtendedTimer = () => {
    const timerId = requestorExtendedTimerRef.current;
    if (timerId) {
      clearInterval(timerId);
    }
  };

  useEffect(() => {
    startRequestorExtendedTimer();

    return () => stopRequestorExtendedTimer();
  });

  return (
    <Fab
      {...(requestorExtended ? { variant: "extended" } : {})}
      color="primary"
      aria-label="add"
      onClick={() => {
        setRequestorExtended(false);
        onClick();
      }}
      onPointerEnter={() => {
        setRequestorExtended(true);
        stopRequestorExtendedTimer();
      }}
      onPointerLeave={() => {
        setRequestorExtended(false);
      }}
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        textTransform: "none",
      }}>
      <ConnectWithoutContactIcon
        sx={{
          ... (requestorExtended ? { mr: 1 } : {})
        }}
      />
      <Collapse in={requestorExtended}>
        {requestorExtended ? "Request a match" : ""}
      </Collapse>
    </Fab >
  );
};
