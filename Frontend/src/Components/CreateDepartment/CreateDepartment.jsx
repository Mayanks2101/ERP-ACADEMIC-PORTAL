import React, { useState, useEffect } from "react";
import {
  Modal,
  Backdrop,
  Fade,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDispatch } from "react-redux";
import { createDepartment, getDepartment } from "../../store/departmentReducer";
import "./CreateDepartment.css";

/**
 * CreateDepartmentModal
 * Props:
 *  - open: boolean
 *  - onClose: fn
 *
 * Usage:
 *  <CreateDepartmentModal open={open} onClose={() => setOpen(false)} />
 */
export default function CreateDepartmentModal({ open, onClose }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    deptname: "",
    capacity: "",
  });

  const [errors, setErrors] = useState({
    deptname: "",
    capacity: "",
  });

  // image upload is commented out for now
  // const [imageFile, setImageFile] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  // default preview image (uploaded file) — local path from your upload
  const DEFAULT_IMG = "/mnt/data/64b843d6-0cc9-44dd-badb-deead5fb70d1.png";

  useEffect(() => {
    if (!open) {
      // reset when modal closes
      setFormData({ deptname: "", capacity: "" });
      setErrors({ deptname: "", capacity: "" });
      // setImageFile(null);
      // setImagePreview(null);
      setSubmitting(false);
    }
  }, [open]);

  const validateField = (name, value) => {
    if (name === "deptname") {
      if (!value.trim()) return "Department name is required";
    }
    if (name === "capacity") {
      if (!value.toString().trim()) return "Capacity is required";
      if (isNaN(Number(value)) || Number(value) <= 0) {
        return "Capacity must be a positive number";
      }
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((p) => ({ ...p, [name]: error }));
  };

  // image upload handler commented out
  // const handleImage = (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   setImageFile(file);
  //   const reader = new FileReader();
  //   reader.onload = (ev) => setImagePreview(ev.target.result);
  //   reader.readAsDataURL(file);
  // };

  const validate = () => {
    const newErrors = {
      deptname: validateField("deptname", formData.deptname),
      capacity: validateField("capacity", formData.capacity),
    };
    setErrors(newErrors);
    return !newErrors.deptname && !newErrors.capacity;
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    const obj = {
      name: formData.deptname.trim(),
      capacity: Number(formData.capacity),
      // image: (if you upload, pass filename or url)
    };

    try {
      // create on backend
      await dispatch(createDepartment({ j: localStorage.getItem("jwt"), obj }));

      // re-fetch departments so Home shows the new one immediately
      await dispatch(getDepartment({ j: localStorage.getItem("jwt") }));

      // success -> close modal
      onClose();
    } catch (err) {
      console.error("Create department failed", err);
      // Show error in capacity field as a general error location
      setErrors((p) => ({
        ...p,
        capacity: "Failed to create department. Please try again."
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 400 }}
    >
      <Fade in={open}>
        <Box
          className="create-modal-box"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 560 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            zIndex: 1500,
            outline: "none",
          }}
        >
          <div className="create-modal-header">
            <Typography variant="h6" className="create-modal-title">
              Add Department
            </Typography>
            <IconButton aria-label="close" onClick={() => onClose()}>
              <CloseIcon />
            </IconButton>
          </div>

          <form className="create-form" onSubmit={handleCreate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}>
                <TextField
                  label="Department Name"
                  name="deptname"
                  value={formData.deptname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.deptname}
                  helperText={errors.deptname}
                  fullWidth
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={5}>
                <TextField
                  label="Capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.capacity}
                  helperText={errors.capacity}
                  fullWidth
                  variant="outlined"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                />
              </Grid>

              {/* IMAGE UPLOAD - COMMENTED OUT FOR NOW */}
              {/*
              <Grid item xs={12} sm={6}>
                <label className="upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    style={{ display: "none" }}
                  />
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadFileIcon />}
                    className="upload-btn"
                  >
                    Upload image
                  </Button>
                </label>
              </Grid>

              <Grid item xs={12} sm={6} className="image-preview-col">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="preview" />
                  </div>
                ) : (
                  <div className="image-placeholder">No image selected</div>
                )}
              </Grid>
              */}

              {/* Instead show a small default image preview (optional) */}
              {/* <Grid item xs={12}>
                <div className="image-preview">
                  <img src={DEFAULT_IMG} alt="default dept" />
                </div>
              </Grid> */}

              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  className="create-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Department"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
}
