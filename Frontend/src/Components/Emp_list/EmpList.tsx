import React, { useEffect, useState, ChangeEvent } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    TablePagination,
    Typography,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployee } from '../../store/departmentReducer';
import Navbar from '../Navbar/Navbar';
import { AppDispatch, RootState } from '../../store/store';
// import { Department } from '../../store/departmentReducer';

const EmpList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // read dept slice
    const dept = useSelector((store: RootState) => store.dept || { department: [] });

    // Defensive: ensure we always work with an array
    const departmentsRaw = dept?.department;
    const departments = Array.isArray(departmentsRaw) ? departmentsRaw : (departmentsRaw ? [departmentsRaw] : []);
    // employees array from reducer (defensive)
    const employees = Array.isArray(dept?.employee) ? dept.employee : [];

    // try to find department name safely
    const deptObj = departments.find((d) => String(d.id) === String(id)) || departments[0] || null;
    const departmentName = deptObj?.name || (dept as any)?.currentDepartmentName || '';

    // pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (id) {
            dispatch(getEmployee({ j: localStorage.getItem('jwt'), id }));
        }
    }, [dispatch, id]);

    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleBack = () => navigate('/');

    return (
        <>
            <Navbar />

            <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, minHeight: 'calc(100vh - 80px)', backgroundColor: '#f4f7fc' }}>
                <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Employees
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {departmentName}
                            </Typography>
                        </Box>

                        <Box>
                            <Button className="add-btn" variant="outlined" onClick={handleBack}>Back</Button>
                        </Box>
                    </Box>

                    {employees.length > 0 ? (
                        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <TableContainer component={Paper} sx={{ background: '#fff', borderRadius: 2, overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#fafafa' }}>
                                            <TableCell sx={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Employee Name</TableCell>
                                            <TableCell sx={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Email</TableCell>
                                            <TableCell sx={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Title</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((emp) => (
                                            <TableRow key={emp.id} hover sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#fbfbfd' } }}>
                                                <TableCell>{emp.name}</TableCell>
                                                <TableCell>{emp.email}</TableCell>
                                                <TableCell>{emp.title || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                component="div"
                                count={employees.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 20]}
                            />
                        </Paper>
                    ) : (
                        <Box sx={{ mt: 6, textAlign: 'center', p: 6, background: '#fff', borderRadius: 2, boxShadow: '0 6px 18px rgba(16,24,40,0.06)' }}>
                            <Typography variant="h6" color="text.secondary">No employees exist</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>This department currently has no employees assigned.</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default EmpList;
