import React from 'react'
import Container from 'react-bootstrap/Container';
import Header from '../../layouts/header/header';
import { Box } from '@mui/material';

const Dashboard = () => {

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: "70px", margin: "10px" }}>
                        <Box m={4}>
                            <h3>Dashboard</h3>
                            <div className="d-flex justify-content-center">
                                <div className="card" style={{ boxShadow: '1px 1px 1px grey', width: '100%' }}>
                                    <div className="card-body">
                                        Welcome Dashboard !
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </>
    )
}

export default Dashboard;