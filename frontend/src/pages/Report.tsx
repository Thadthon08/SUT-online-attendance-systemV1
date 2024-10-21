import React, { useState, useRef, useEffect } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { GetAllSubject, GetRoomFromSubject } from "../services/api";
import { SubjectInterface } from "../interface/ISubject";
import theme from "../config/theme";

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
  const [loading, setLoading] = useState(false);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [tabBounds, setTabBounds] = useState({ left: 0, width: 0 });
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const result = await GetAllSubject();
        setSubjects(result);

        if (result.length > 0) {
          const firstSubjectId = result[0].sub_id;
          setFilters({ role: firstSubjectId });
          const roomResult = await GetRoomFromSubject(firstSubjectId);
          setRoom(roomResult);
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
    setRoom([]); // Clear the room data before fetching new one
    setLoading(true);

    try {
      const result = await GetRoomFromSubject(newValue);
      setRoom(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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

  const filteredRoom = room.filter((r: any) =>
    r.ATR_name.toLowerCase().includes(query.toLowerCase())
  );
  const paginatedRoom = filteredRoom.slice(page * limit, page * limit + limit);

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setQuery(event.target.value);
  };

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
            All aspects related to the app users can be managed from this page.
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
              style={{ left: tabBounds.left, width: tabBounds.width }}
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
        ) : paginatedRoom.length === 0 ? (
          <Typography
            sx={{ py: 10 }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            No room data matching your search.
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room ID</TableCell>
                    <TableCell>Room Name</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRoom.map((record) => (
                    <TableRow hover key={record.ATR_id}>
                      <TableCell>{record.ATR_id}</TableCell>
                      <TableCell>{record.ATR_name}</TableCell>
                      <TableCell>
                        {new Date(record.start_time).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(record.end_time).toLocaleString()}
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
    </Container>
  );
}
