import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import { MatchingNotificationProps } from "./types";

export const MatchingNotification: React.FC<MatchingNotificationProps> = ({
  onGo
}) => {
  return (
    <Snackbar open={true} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} >
      <Alert
        severity="success"
        variant="filled"
        action={
          <Button onClick={onGo} color="inherit" variant="outlined" size="small" >
            Go
          </Button>
        }
      >
        Request matched!
      </Alert>
    </Snackbar >
  );
}
