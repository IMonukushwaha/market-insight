import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import "../../Style/Errorpagecss/Errorpage.css";

export default function Errorpage({ status = 404, message = "Page not found" }) {
  return (
    <div className="error-page">
      <div className="error-status">{status}</div>

      <Stack sx={{ width: '100%' }} spacing={2} className="error-box">
        <Alert severity="error">{message}</Alert>
      </Stack>
    </div>
  );
}