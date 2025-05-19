import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../layouts/header/header';
import { Container, Box, TextField, Button, Grid } from '@mui/material';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import RoleApiService from '../../data/services/Role/role-api-service';

const Role = () => {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const [roleName, setRoleName] = useState('');
    const [showToaster, setShowToaster] = useState(false);

    const handleRoleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoleName(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const apiService = new RoleApiService();
            const payload = {
                roleName: roleName,
                uid: userDetails.loginDetails.id,
            };
            const response = await apiService.saveRole(payload);
            toast.success('Role saved successfully!', { position: 'top-right', autoClose: 3000 });
            setShowToaster(true);
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error('Error calling API:', error);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div>
            
            <>
            <Box sx={{display:'flex'}}>
                <Header />
                <Box m={6}>
                    <Card
                        style={{
                            margin: '6%',
                            padding: '1%',
                            boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                            marginLeft: '10%',
                            width: '80%',
                        }}
                    >
                        <Container
                            style={{
                                maxWidth: 'none',
                                backgroundColor: 'white',
                                margin: '10px',
                            }}
                        >
                            <Box m={4}>
                                <Grid>
                                    <h3 style={{ marginBottom: '1%' }}>ROLE :</h3>
                                </Grid>
                                <form>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Role"
                                                variant="outlined"
                                                style={{ marginBottom: '10px' }}
                                                value={roleName}
                                                onChange={handleRoleNameChange}
                                                onKeyPress={handleKeyPress}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid item style={{ marginTop: '2%' }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSubmit}
                                                    fullWidth
                                                    size="small"
                                                    style={{ width: '80px', fontSize: '12px' }}
                                                >
                                                    Submit
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSubmit}
                                                    fullWidth
                                                    size="small"
                                                    style={{ width: '80px', fontSize: '12px', marginLeft: '2%' }}
                                                >
                                                    Edit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} sm={4} md={4}></Grid>
                                    </Grid>
                                </form>
                            </Box>
                        </Container>
                    </Card>
                </Box>
                </Box>
                <ToastContainer />
            </>
        </div>
    );
};

export default Role;


