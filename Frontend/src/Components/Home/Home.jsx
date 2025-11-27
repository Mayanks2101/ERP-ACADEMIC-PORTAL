import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Navbar/Navbar";
import CardL from "../Card/CardL";
import { getDepartment } from "../../store/departmentReducer";
import { Box, Grid, Typography } from "@mui/material";

import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const dispatch = useDispatch();
  const dept = useSelector((state) => state.dept || { department: [] });

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwt");
    if (jwtToken) {
      dispatch(getDepartment({ j: jwtToken }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const departments = dept?.department || [];
  const hasDepartments = departments.length > 0;

  return (
    <>
      <Navbar />
      <Box
        className="home-main"
        sx={{
          mt: 3,
          px: 2,
          minHeight: "100vh",
          backgroundColor: "#f4f7fc",
          borderRadius: "10px",
        }}
      >
        {hasDepartments ? (
          <Grid container spacing={3} justifyContent="flex-start">
            {departments.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CardL deptName={item} />
                </div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 3,
              background: "#fff",
              border: "2px solid #ddd",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.01)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <Typography variant="h6" color="textSecondary">
              Nothing to show...
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Home;
