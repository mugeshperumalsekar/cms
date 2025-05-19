import React, { useEffect, useState } from 'react';
import Header from '../../layouts/header/header';
import { Container, Box, TextField, Button, Grid, FormControl, Select, InputLabel, MenuItem, Snackbar } from '@mui/material';
import CountryApiService from '../../data/services/master/Country/country_api_service';
import StateApiService from '../../data/services/master/State/state_api_service';
import AuthAdminApiService from '../../data/services/authadminuser/authu-admin-api-service';
import { useSelector } from 'react-redux';
import MuiAlert from '@mui/material/Alert';
import { TaskAssignPayload } from '../../data/services/TaskAssign/taskAssign-payload';
import TaskAssignApiService from '../../data/services/TaskAssign/taskAssign-api-service';
import { Card } from 'react-bootstrap';

interface Country {
    id: string;
    name: string;
}

interface State {
    id: string;
    countryId: string;
    stateName: string;
}

interface AdminUser {
    id: string;
    userName: string;
}

interface TaskAssignData {
    country: string;
    state: string;
    year: string;
    uid: string;
}

const TaskAssign = () => {

    const calculateWeekRange = (date: Date): [Date, Date] => {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - dayOfWeek);
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
        return [startDate, endDate];
    };

    const [selectedCountry, setSelectedCountry] = useState('');
    const [adminusers, setAdminusers] = useState<AdminUser[]>([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedadminuser, setSelectedadminuser] = useState('');
    const [countries, setCountries] = useState<Country[]>([]);
    const countryService = new CountryApiService();
    const StateService = new StateApiService();
    const authService = new AuthAdminApiService();
    const [serialNumber, setSerialNumber] = useState(1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [states, setStates] = useState<State[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | ''>('');
    const [countryError, setCountryError] = useState<string>('');
    const [stateError, setStateError] = useState<string>('');
    const [yearError, setYearError] = useState<string>('');
    const [adminUserError, setAdminUserError] = useState<string>('');
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const taskAssignService = new TaskAssignApiService();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [taskAssignData, setTaskAssignData] = useState<TaskAssignData[]>([]);
    const [taskAssignSuccess, setTaskAssignSuccess] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string>('daily');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [highlightedWeek, setHighlightedWeek] = useState(calculateWeekRange(new Date()));
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    useEffect(() => {
        fetchCountries();
        fetchStates();
        fetchAdminusers();
        fetchTaskAssignData();
    }, []);

    const fetchCountries = async () => {
        try {
            const Countries = await countryService.getCountryOptions();
            setCountries(Countries);
            setSerialNumber(page * rowsPerPage + 1);
        } catch (error) {
            console.error("Error fetching Country:", error);
        }
    };

    const fetchStates = async () => {
        try {
            const fetchedStates = await StateService.getStateDataByCountryId();
            setStates(fetchedStates);
        } catch (error) {
            console.error("Error fetching states:", error);
        }
    };

    const fetchAdminusers = async () => {
        try {
            const adminusers = await authService.getadminuser();
            setAdminusers(adminusers);
        } catch (error) {
            console.error("Error fetching admin users:", error);
        }
    };

    const fetchTaskAssignData = async () => {
        try {
            const latestTaskAssignData = await taskAssignService.getTaskAssign();
            setTaskAssignData([...latestTaskAssignData].reverse());
        } catch (error) {
            console.error("Error fetching task assign data:", error);
        }
    };

    const handleCountryChange = (value: string) => {
        setSelectedCountry(value);
        setCountryError('');
    };

    const handleStateChange = (value: string) => {
        setSelectedState(value);
        setStateError('');
    };

    const handleYearChange = (value: number | '') => {
        setSelectedYear(value);
        setYearError('');
    };

    const handleAdminUserChange = (value: string) => {
        setSelectedadminuser(value);
        setAdminUserError('');
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCountry) {
            setCountryError('Please select a country');
        } else {
            setCountryError('');
        }
        if (!selectedState) {
            setStateError('Please select a state');
        } else {
            setStateError('');
        }
        if (!selectedYear) {
            setYearError('Please select a year');
        } else {
            setYearError('');
        }
        if (!selectedadminuser) {
            setAdminUserError('Please select an assignTo');
        } else {
            setAdminUserError('');
        }
        if (selectedCountry && selectedState && selectedYear && selectedadminuser) {
            try {
                const payload: TaskAssignPayload = {
                    countryId: Number(selectedCountry),
                    stateId: Number(selectedState),
                    year: selectedYear,
                    assignTo: Number(selectedadminuser),
                    assignBy: loginDetails.id,
                    uid: loginDetails.id,
                };
                await taskAssignService.saveTaskAssign(payload);
                const latestTaskAssignData = await taskAssignService.getTaskAssign();
                setTaskAssignData([...latestTaskAssignData]);
                setSelectedCountry('');
                setSelectedState('');
                setSelectedYear('');
                setSelectedadminuser('');
                setSnackbarSeverity('success');
                setSnackbarMessage('Save successful!');
                setSnackbarOpen(true);
                setTaskAssignSuccess(true);
                window.location.reload();
            } catch (error) {
                console.error('Error assigning task:', error);
                setSnackbarSeverity('error');
                setSnackbarMessage('Save failed. Please try again.');
                setSnackbarOpen(true);
            }
        }
    };

    const handleStartChange = (date: Date) => {
        let newStartDate = new Date(date);
        if (selectedOption === 'weekly') {
            const [weekStart, weekEnd] = calculateWeekRange(newStartDate);
            setHighlightedWeek([weekStart, weekEnd]);
        } else if (selectedOption === 'monthly') {
            const firstDayOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth(), 1);
            const lastDayOfMonth = new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 0);
            setHighlightedWeek([firstDayOfMonth, lastDayOfMonth]);
        }
        setCurrentDate(newStartDate);
        setStartDate(newStartDate);
    };

    const handleEndChange = (date: Date) => {
        let newEndDate = new Date(date);
        if (selectedOption === 'weekly') {
            const [weekStart, weekEnd] = calculateWeekRange(newEndDate);
            setHighlightedWeek([weekStart, weekEnd]);
        } else if (selectedOption === 'monthly') {
            const firstDayOfMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth(), 1);
            const lastDayOfMonth = new Date(newEndDate.getFullYear(), newEndDate.getMonth() + 1, 0);
            setHighlightedWeek([firstDayOfMonth, lastDayOfMonth]);
        }
        setEndDate(newEndDate);
    };

    const years = Array.from({ length: 50 }, (_, index) => new Date().getFullYear() - index);

    const tableContainerStyle: React.CSSProperties = {
        maxHeight: '500px',
        overflowY: 'auto',
        marginTop: '1%'
    };

    const tableStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
    };

    const thStyle: React.CSSProperties = {
        border: '1px solid #dddddd',
        padding: '8px',
        textAlign: 'left',
        backgroundColor: '#f2f2f2',
        position: 'sticky',
        top: '0',
        zIndex: 1,
    };

    const tdStyle: React.CSSProperties = {
        border: '1px solid #dddddd',
        padding: '8px',
        textAlign: 'left',
    };

    return (
        <>
         <Box sx={{display:'flex'}}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Box m={6}>
                <Card style={{
                    // margin: '6%',
                    padding: '1%',
                    boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                    // marginLeft: '10%',
                    width: '100%',
                }}>
                    <Container style={{ maxWidth: 'none', backgroundColor: 'white', margin: '10px' }}>
                        <Box m={4}>
                            <h3>TaskAssign</h3>
                            <form>
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                        <FormControl fullWidth variant="outlined" margin="dense" className="text-field">
                                            <InputLabel htmlFor="country">Country</InputLabel>
                                            <Select
                                                label="Country"
                                                value={selectedCountry}
                                                onChange={(e) => handleCountryChange(e.target.value as string)}
                                                name="country"
                                                variant="outlined"
                                                className="text-field"
                                                fullWidth
                                            >
                                                <MenuItem value="" disabled>
                                                    Select Country
                                                </MenuItem>
                                                {countries.map((country) => (
                                                    <MenuItem key={country.id} value={country.id}>
                                                        {country.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <div className="text-danger">{countryError}</div>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormControl fullWidth variant="outlined" margin="dense" className="text-field">
                                            <InputLabel htmlFor="state">State</InputLabel>
                                            <Select
                                                label="State"
                                                value={selectedState}
                                                onChange={(e) => handleStateChange(e.target.value as string)}
                                                name="State"
                                                variant="outlined"
                                                className="text-field"
                                            >
                                                <MenuItem value="" disabled>
                                                    Select State
                                                </MenuItem>
                                                {states.map((state) => (
                                                    <MenuItem key={state.id} value={state.id}>
                                                        {state.stateName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <div className="text-danger">{stateError}</div>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormControl fullWidth variant="outlined" margin="dense" className="text-field">
                                            <InputLabel htmlFor="year">Year</InputLabel>
                                            <Select
                                                label="Year"
                                                value={selectedYear}
                                                onChange={(e) => handleYearChange(e.target.value as number)}
                                                name="year"
                                                variant="outlined"
                                                className="text-field"
                                            >
                                                <MenuItem value="" disabled>
                                                    Select Year
                                                </MenuItem>
                                                {years.map((year) => (
                                                    <MenuItem key={year} value={year}>
                                                        {year}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <div className="text-danger">{yearError}</div>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormControl fullWidth variant="outlined" margin="dense" className="text-field">
                                            <InputLabel htmlFor="year">Assign To</InputLabel>
                                            <Select
                                                label="AssignTo"
                                                value={selectedadminuser}
                                                onChange={(e) => handleAdminUserChange(e.target.value as string)}
                                                name="AssignTo"
                                                variant="outlined"
                                                className="text-field"
                                            >
                                                <MenuItem value="" disabled>
                                                    Select User
                                                </MenuItem>
                                                {adminusers.map((adminuser) => (
                                                    <MenuItem key={adminuser.id} value={adminuser.id}>
                                                        {adminuser.userName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <div className="text-danger">{adminUserError}</div>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button variant="contained" color="primary" type="button" onClick={handleAssignTask} style={{ marginLeft: "10%", marginBottom: "-14%" }}>
                                            Assign Task
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                            <div>
                                {taskAssignSuccess && (
                                    <div style={tableContainerStyle}>
                                        <table style={tableStyle}>
                                            <thead>
                                                <tr>
                                                    <th style={thStyle}>Sl no</th>
                                                    <th style={thStyle}>Country</th>
                                                    <th style={thStyle}>State</th>
                                                    <th style={thStyle}>Year</th>
                                                    <th style={thStyle}>Assign To</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {taskAssignData.map((taskAssignItem, index) => (
                                                    <tr key={index}>
                                                        <td style={tdStyle}>{index + 1}</td>
                                                        <td style={tdStyle}>{taskAssignItem.country}</td>
                                                        <td style={tdStyle}>{taskAssignItem.state}</td>
                                                        <td style={tdStyle}>{taskAssignItem.year}</td>
                                                        <td style={tdStyle}>{taskAssignItem.uid}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </Box>
                    </Container>
                </Card>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={1000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        severity={snackbarSeverity}
                        onClose={handleSnackbarClose}
                    >
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
            </Box>
            </Box>
            </Box>
        </>
    );
};


export default TaskAssign;
