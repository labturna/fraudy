import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  useTheme,
  TextField,
  TablePagination,
  TableContainer,
  useMediaQuery,
} from "@mui/material";
import Navbar from "../components/Navbar";

type ReportedItem = {
  id: string;
  address: string;
  type: "wallet" | "phishing";
  reportedBy: string;
  reportedAt: string;
  isValid: boolean;
  isPhishingOnline?: boolean;
};

const mockData: ReportedItem[] = [
  {
    id: "1",
    address: "0xF5a...D12",
    type: "wallet",
    reportedBy: "alice@example.com",
    reportedAt: "2025-04-07T12:30:00Z",
    isValid: false,
  },
  {
    id: "2",
    address: "http://fake-defi.io",
    type: "phishing",
    reportedBy: "bob@example.com",
    reportedAt: "2025-04-06T10:15:00Z",
    isValid: true,
    isPhishingOnline: true,
  },
  {
    id: "3",
    address: "http://phish-bank.xyz",
    type: "phishing",
    reportedBy: "john@example.com",
    reportedAt: "2025-04-05T09:10:00Z",
    isValid: false,
    isPhishingOnline: false,
  },
];

const ReportedAddresses: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<ReportedItem[]>([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    setReports(mockData);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(0);
  };

  const filteredReports = reports.filter(
    (item) =>
      item.address.toLowerCase().includes(searchTerm) ||
      item.reportedBy.toLowerCase().includes(searchTerm)
  );

  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(to right, #0f2027, #0f2027, #2c5364)"
          : "linear-gradient(to right, #ffffff, #f0f4f8)",
        transition: "background 0.3s ease",
      }}
    >
      <Navbar />
      <Container sx={{ pt: 15 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Reported Addresses
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by address or reporter..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mt: 2 }}
        />

        <Paper
          sx={{
            mt: 3,
            borderRadius: 3,
            p: 2,
            background: isDark
              ? "linear-gradient(to right, #0f2027, #0f2027, #2c5364)"
              : "linear-gradient(to right, #ffffff, #f0f4f8)",
          }}
        >
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size={isMobile ? "small" : "medium"}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Reporter</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Online</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.id}</TableCell>
                    <TableCell sx={{ maxWidth: 160, wordBreak: "break-word" }}>
                      {report.address}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.type}
                        color={report.type === "phishing" ? "error" : "info"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{report.reportedBy}</TableCell>
                    <TableCell>
                      {new Date(report.reportedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.isValid ? "Valid" : "Not Valid"}
                        color={report.isValid ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {report.type === "phishing" ? (
                        <Chip
                          label={report.isPhishingOnline ? "Online" : "Offline"}
                          color={report.isPhishingOnline ? "success" : "default"}
                          size="small"
                        />
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredReports.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default ReportedAddresses;
