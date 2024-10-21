import { Modal, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

const QRCodePaper = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  outline: "none",
  borderRadius: "16px",
  maxWidth: "90%",
  width: "400px",
  position: "relative",
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  top: theme.spacing(2),
  color: theme.palette.grey[500],
}));

const QRCodeImage = styled("img")({
  maxWidth: "100%",
  height: "auto",
  display: "block",
  margin: "20px auto",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
});

const QRCodeModal = ({
  open,
  onClose,
  qrcode,
}: {
  open: boolean;
  onClose: () => void;
  qrcode: string;
}) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="qr-code-modal-title"
    aria-describedby="qr-code-modal-description"
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <QRCodePaper>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      <Typography
        id="qr-code-modal-title"
        variant="h6"
        component="h2"
        align="center"
        gutterBottom
      >
        QR Code for Room Check-in
      </Typography>
      <QRCodeImage src={qrcode} alt="QR Code" />
      <Typography variant="body2" color="textSecondary" align="center">
        Scan this QR code to check in to the room
      </Typography>
    </QRCodePaper>
  </Modal>
);

export default QRCodeModal;
