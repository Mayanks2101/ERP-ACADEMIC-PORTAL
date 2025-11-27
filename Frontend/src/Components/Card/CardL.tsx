import React, { useState, ChangeEvent, FormEvent } from 'react';
import './CardL.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDepartment, updateDepartment } from '../../store/departmentReducer';
import { AppDispatch, RootState } from '../../store/store';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import {
    TextField,
    Button,
    Grid,
    Modal,
    Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import card1_img from '../../assets/card_2.png';

interface Department {
    id: number;
    name: string;
    capacity: number;
    [key: string]: any;
}

interface CardLProps {
    deptName: Department;
}

interface FormData {
    id: number;
    deptname: string;
    capacity: number | string;
}

interface Errors {
    deptname: string;
    capacity: string;
    [key: string]: string;
}

const CardL = ({ deptName }: CardLProps) => {
    const [open, setOpen] = useState(false); // update modal
    const [confirmOpen, setConfirmOpen] = useState(false); // delete confirmation modal
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const auth = useSelector((s: RootState) => s.auth);
    const isAdmin = auth?.role === 'ROLE_ADMIN' || auth?.role === 'ROLE_ERP_ADMIN';

    const [formData, setFormData] = useState<FormData>({
        id: deptName.id,
        deptname: deptName.name,
        capacity: deptName.capacity,
    });

    const [errors, setErrors] = useState<Errors>({
        deptname: '',
        capacity: '',
    });

    const handleClick = () => navigate(`dept/${deptName.id}`);

    // open confirmation modal (called from delete button)
    const handleDeleteConfirmOpen = (e: React.MouseEvent) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setConfirmOpen(true);
    };

    // user confirmed deletion, perform delete
    const handleConfirmDelete = (e: React.MouseEvent) => {
        if (e && e.stopPropagation) e.stopPropagation();
        dispatch(deleteDepartment({ j: localStorage.getItem('jwt'), id: deptName.id }));
        setConfirmOpen(false);
    };

    // cancel deletion
    const handleConfirmCancel = (e: React.MouseEvent | {}) => {
        if (e && 'stopPropagation' in e && typeof e.stopPropagation === 'function') e.stopPropagation();
        setConfirmOpen(false);
    };

    const validateField = (name: string, value: string | number) => {
        if (name === 'deptname') {
            if (!String(value).trim()) return 'Department name is required';
        }
        if (name === 'capacity') {
            if (!String(value).trim()) return 'Capacity is required';
            if (isNaN(Number(value)) || Number(value) <= 0) {
                return 'Capacity must be a positive number';
            }
        }
        return '';
    };

    const validate = () => {
        const newErrors = {
            deptname: validateField('deptname', formData.deptname),
            capacity: validateField('capacity', formData.capacity),
        };
        setErrors(newErrors);
        return !newErrors.deptname && !newErrors.capacity;
    };

    const handleUpdate = (e?: FormEvent) => {
        if (e) e.stopPropagation();

        if (!validate()) {
            return;
        }

        dispatch(
            updateDepartment({
                j: localStorage.getItem('jwt'),
                obj: {
                    id: deptName.id,
                    name: formData.deptname,
                    capacity: formData.capacity,
                },
            })
        );
        setOpen(false);
        // Clear errors after successful update
        setErrors({ deptname: '', capacity: '' });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors((p) => ({ ...p, [e.target.name]: '' }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((p) => ({ ...p, [name]: error }));
    };

    return (
        <>
            <div
                className="dept-soft-card"
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleClick();
                }}
            >
                {/* IMAGE */}
                <div className="dept-image-container" aria-hidden="true">
                    <img src={card1_img} alt={deptName.name} className="dept-image" />
                </div>

                <div className="dept-content">
                    <div>
                        <h3 className="dept-title">{deptName.name}</h3>

                        <p className="dept-capacity">
                            Capacity: <span>{deptName.capacity}</span>
                        </p>
                    </div>

                    {isAdmin && (
                        <div className="dept-actions" onClick={(e) => e.stopPropagation()}>
                            <button
                                type="button"
                                className="edit-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(true);
                                }}
                                aria-label={`Edit ${deptName.name}`}
                            >
                                <EditIcon className="edit-icon" />
                            </button>

                            <button
                                type="button"
                                className="delete-btn"
                                onClick={handleDeleteConfirmOpen}
                                aria-label={`Delete ${deptName.name}`}
                            >
                                <DeleteIcon className="delete-icon" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Update Modal (centered) */}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={open}>
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 420,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 3,
                            zIndex: 1500,
                            outline: 'none',
                        }}
                        className="modal-box"
                    >
                        <h2 className="modal-title">Update Department</h2>

                        <form
                            className="modal-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleUpdate();
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Department Name"
                                        fullWidth
                                        name="deptname"
                                        value={formData.deptname}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.deptname}
                                        helperText={errors.deptname}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Capacity"
                                        fullWidth
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.capacity}
                                        helperText={errors.capacity}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button className="modal-update-btn" fullWidth type="submit">
                                        Update
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Fade>
            </Modal>

            {/* Delete Confirmation Modal — uses same modal-box css so visuals match */}
            <Modal
                open={confirmOpen}
                onClose={handleConfirmCancel}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 400 }}
            >
                <Fade in={confirmOpen}>
                    <Box
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 380,
                            maxWidth: '92%',
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 3,
                            zIndex: 1500,
                            outline: 'none',
                        }}
                        className="modal-box"
                        role="dialog"
                        aria-labelledby="confirm-delete-title"
                        aria-modal="true"
                    >
                        <h2 id="confirm-delete-title" className="modal-title">Confirm delete</h2>

                        <div style={{ marginBottom: 16, color: '#444', fontSize: 15, lineHeight: 1.45 }}>
                            Are you sure you want to delete the department{" "}
                            <strong style={{ color: '#111' }}>{deptName.name}</strong>? This action cannot be undone.
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <Button
                                onClick={handleConfirmCancel}
                                className="cancel-btn"
                                variant="outlined"
                                sx={{ minWidth: 110 }}
                            >
                                Cancel
                            </Button>

                            {/* Use modal-update-btn to keep same maroon style as Update, but you can change to red if needed */}
                            <Button
                                onClick={handleConfirmDelete}
                                className="modal-update-btn"
                                variant="contained"
                                sx={{ minWidth: 110 }}
                            >
                                Delete
                            </Button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default CardL;
