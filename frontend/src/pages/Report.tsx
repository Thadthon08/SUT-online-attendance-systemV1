import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  alpha,
  Container,
  Typography,
  Grid,
  Tabs,
  Tab,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Divider,
  InputAdornment,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import Swal from "sweetalert2";
import { styled } from "@mui/material/styles";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import QrCodeIcon from "@mui/icons-material/QrCode";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import { DeleteRoom, GetAllSubject, GetRoomFromSubject } from "../services/api";
import { SubjectInterface } from "../interface/ISubject";
import theme from "../config/theme";
import QRCodeModal from "../components/QRCodeModal";
import { UserData } from "../interface/Signinrespone";
import { showToast } from "../utils/toastUtils";

const TabsWrapper = styled(Tabs)(
  ({ theme }) => `
    position: relative;
    @media (max-width: ${theme.breakpoints.values.md}px) {
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }
    }
    .MuiTabs-indicator {
      display: none;
    }
  `
);

const TabBackground = styled("div")(
  ({ theme }) => `
    position: absolute;
    height: 100%;
    z-index: 0;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border-radius: 8px;
    background-color: ${alpha(theme.palette.common.white, 0.08)};
  `
);

const StyledTab = styled(Tab)(
  ({ theme }) => `
    color: ${alpha(theme.palette.common.white, 0.7)};
    &.Mui-selected {
      color: ${theme.palette.common.white};
    }
    &:hover {
      color: ${theme.palette.common.white};
    }
  `
);

export default function Report() {
  const [filters, setFilters] = useState<{ role: string }>({ role: "" });
  const [subjects, setSubjects] = useState<SubjectInterface[]>([]);
  const [room, setRoom] = useState<any[]>([]);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [tabBounds, setTabBounds] = useState({ left: 0, width: 0 });
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>("");
  const [openQRCode, setOpenQRCode] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("data");

    let tid: string = "";
    if (data) {
      const parsedData = JSON.parse(data) as UserData;
      tid = parsedData.id;
    }
    const fetchSubjects = async () => {
      try {
        const result = await GetAllSubject(tid);
        setSubjects(result);

        if (result.length > 0) {
          const firstSubjectId = result[0].sub_id;
          setFilters({ role: firstSubjectId });

          const roomResult = await GetRoomFromSubject(firstSubjectId);
          if (Array.isArray(roomResult)) {
            setRoom(roomResult);
          } else {
            setRoom([]);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    const activeTab = tabsRef.current?.querySelector(
      `button[aria-selected="true"]`
    );
    if (activeTab) {
      setTabBounds({
        left: (activeTab as HTMLElement).offsetLeft,
        width: (activeTab as HTMLElement).offsetWidth,
      });
    }
  }, [filters.role]);

  const handleTabsChange = async (
    _event: React.ChangeEvent<{}>,
    newValue: string
  ) => {
    setFilters({ ...filters, role: newValue });
    setRoom([]);

    try {
      const result = await GetRoomFromSubject(newValue);
      setRoom(result);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLimit(parseInt(event.target.value));
  };

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setQuery(event.target.value);
  };

  const handleViewQRCode = (qrcodeData: string) => {
    setCurrentQRCode(qrcodeData);
    setOpenQRCode(true);
  };

  const handleCloseQRCode = () => {
    setOpenQRCode(false);
  };

  const handleDeleteRoom = async (roomId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await DeleteRoom(roomId);
        const roomResult = await GetRoomFromSubject(filters.role);
        setRoom(roomResult);

        showToast("The room has been deleted.", "success");
      } catch (err) {
        showToast("There was an issue deleting the room.", "error");
      }
    }
  };

  const handleViewAttendees = async (roomId: string) => {
    navigate(`/report/room/${roomId}`);
  };

  const filteredRoom = Array.isArray(room)
    ? room.filter((r: any) =>
        r.ATR_name.toLowerCase().includes(query.toLowerCase())
      )
    : [];
  const paginatedRoom = filteredRoom.slice(page * limit, page * limit + limit);

  return (
    <Container
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        p: 4,
      }}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          maxWidth: 1472,
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          borderRadius: 0,
          p: 2,
          mb: 3,
        }}
      >
        <Grid item>
          <Typography variant="h5" fontWeight="bolder">
            Report Management
          </Typography>
          <Typography variant="subtitle2">
            View and manage rooms, check QR codes, and track attendance reports
            for each room.
          </Typography>
        </Grid>
      </Grid>

      {subjects.length > 0 && (
        <Box
          display="flex"
          alignItems="center"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent={{ xs: "center", sm: "space-between" }}
          pb={3}
        >
          <TabsWrapper
            onChange={handleTabsChange}
            scrollButtons="auto"
            value={filters.role}
            variant="scrollable"
            ref={tabsRef}
          >
            <TabBackground
              style={{
                left: tabBounds.left,
                width: tabBounds.width,
                backgroundColor: "#ffa319",
              }}
            />
            {subjects.map((subject) => (
              <StyledTab
                key={subject.sub_id}
                value={subject.sub_id}
                label={subject.sub_code}
                sx={{ zIndex: 1 }}
              />
            ))}
          </TabsWrapper>
        </Box>
      )}

      <Card>
        <Box p={2}>
          <TextField
            sx={{ m: 0 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleQueryChange}
            placeholder="Search by room name..."
            value={query}
            size="small"
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Box>

        <Divider />

        {room.length === 0 ? (
          <Typography
            sx={{ py: 10 }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            No rooms available for this subject.
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room Name</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>QR Code</TableCell>
                    <TableCell>Attendees</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRoom.map((record) => (
                    <TableRow hover key={record.ATR_id}>
                      <TableCell>{record.ATR_name}</TableCell>
                      <TableCell>
                        {new Date(record.start_time).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(record.end_time).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View QR Code">
                          <IconButton
                            onClick={() => handleViewQRCode(record.qrcode_data)}
                          >
                            <QrCodeIcon sx={{ color: "#ffffff" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Attendees">
                          <IconButton
                            onClick={() => handleViewAttendees(record.ATR_id)}
                          >
                            <PeopleIcon sx={{ color: "#ffffff" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete Room">
                          <IconButton
                            onClick={() => handleDeleteRoom(record.ATR_id)}
                          >
                            <DeleteIcon sx={{ color: "#ffffff" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                count={filteredRoom.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          </>
        )}
      </Card>

      <QRCodeModal
        open={openQRCode}
        onClose={handleCloseQRCode}
        qrcode={currentQRCode}
      />
    </Container>
  );
}
