import React from "react";
import { Container, Typography } from "@mui/material";

const Transactions: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4">📂 Transactions</Typography>
      <Typography variant="body1">List of blockchain transactions will be displayed here.</Typography>
    </Container>
  );
};

export default Transactions;
