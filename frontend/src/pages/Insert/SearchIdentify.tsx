import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Box, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Header from '../../layouts/header/header';
import { useSelector } from 'react-redux';
import { searchIdentify } from '../../data/services/searchIdentify/searchIdentify_payload';
import searchIdentifyApiService from '../../data/services/searchIdentify/searchIdentify_api_service';

interface Params {
    countryId: string;
    stateId: string;
}

const SearchIdentify: React.FC = () => {

    const [data, setData] = useState<searchIdentify[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const locationState = location.state as Params | null;
    const { countryId, stateId } = locationState || {};

    useEffect(() => {
    }, [userDetails]);

    useEffect(() => {
        fetchData();
    }, [loginDetails.id, countryId, stateId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const apiService = new searchIdentifyApiService();
            const response = await apiService.getSearchIdentify(loginDetails.id);
            setData(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableRowClick = (taskId: number, clickedCountryName: number, clickedStateName: number) => {
        navigate(`/Details/${taskId}`, {
            state: {
                countryName: clickedCountryName,
                stateName: clickedStateName
            }
        });
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={6}>
                        <Container style={{ maxWidth: 'none', backgroundColor: 'white', padding: '52px', margin: '10px' }}>
                            <Card>
                                <CardContent>
                                    {loading ? <p>Loading...</p> : (
                                        <Table className="table search-table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>UserName</TableCell>
                                                    <TableCell>CountryName</TableCell>
                                                    <TableCell>StateName</TableCell>
                                                    <TableCell>Year</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.map((item: searchIdentify, index: number) => (
                                                    <TableRow key={index} onClick={() => handleTableRowClick(Number(item.taskId), item.countryId, item.stateId)}>
                                                        <TableCell>{item.manName}</TableCell>
                                                        <TableCell>{item.countryName}</TableCell>
                                                        <TableCell>{item.stateName}</TableCell>
                                                        <TableCell>{item.year}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </Container>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default SearchIdentify;