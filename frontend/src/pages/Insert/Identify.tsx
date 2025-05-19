import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import Header from '../../layouts/header/header';
import { CardContent, Grid, TextField, Box } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Identifieds } from '../../data/services/Identify/Identify_payload';
import IdentifyApiService from '../../data/services/Identify/Identify_api_service';
import { RecordTypeData } from '../../data/services/Search/search-payload';
import SearchService from '../../data/services/Search/search-api-service';
import { SelectChangeEvent } from '@mui/material';

interface CategoryName {
    name: string;
    id: string;
}

function Identify() {

    const navigate = useNavigate();
    const { cmsId } = useParams<{ cmsId: string }>();
    const [identifies, setIdentifies] = useState<Identifieds[]>([]);
    const [name, setName] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const identifyApiService = new IdentifyApiService();
    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState<boolean>(false);
    const [RecordType, setRecordType] = useState<RecordTypeData[]>([]);
    const [selectedRecordType, setSelectedRecordType] = useState<string>('');
    const recordtype = new SearchService();
    const location = useLocation();
    const { countryName, stateName } = location.state || { countryName: '', stateName: '' };

    useEffect(() => {
        fetchRecordType();
    }, []);

    const fetchRecordType = async () => {
        try {
            const recordtypes = await recordtype.getRecoredType();
            setRecordType(recordtypes);
        } catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const handleRecordTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setSelectedRecordType(value);
    };

    const handleAddClick = () => {
        sessionStorage.setItem('countryName', countryName);
        sessionStorage.setItem('stateName', stateName);
        navigate('/Details');
    };

    const search = async (cmsName: string) => {
        try {
            setLoading(true);
            const apiService = new IdentifyApiService();
            const response = await apiService.getmanger(cmsName);
            setIdentifies(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchClick = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!name.trim()) {
                setNameError('Please enter a valid Name before searching.');
                return;
            } else {
                setNameError('');
            }
            sessionStorage.setItem('countryName', countryName);
            sessionStorage.setItem('stateName', stateName);
            await search(name);
            setSearchPerformed(true);
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    function getgenderrecoredtype(recordTypeId: number) {
        switch (recordTypeId) {
            case 1:
                return 'Entity';
            case 2:
                return 'Individual';
            case 3:
                return 'Ship';
            case 4:
                return 'Aircraft';
            default:
                return '';
        }
    };

    function getgenderName(genderId: number) {
        switch (genderId) {
            case 1:
                return 'Male';
            case 2:
                return 'Female';
            case 3:
                return 'Others';
        }
    };

    const handleEditClick = (cmsId: string, recordTypeId: number) => {
        const uid = loginDetails.id;
        navigate(`/Edited/${cmsId}/${uid}/${recordTypeId}`);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <h4 style={{ marginTop: '6%', marginLeft: '2%' }}></h4>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Box m={8}>
                        <Card border='10px' style={{ margin: '2%' }}>
                            <CardContent>
                                <Form onSubmit={handleSearchClick}>
                                    <Row>
                                        <Col xs={2}>
                                            <Form.Group>
                                                <Row>
                                                    <Col>
                                                        <TextField
                                                            id="outlined-basic"
                                                            label="Name"
                                                            variant="outlined"
                                                            value={name}
                                                            onChange={(e) => {
                                                                setName(e.target.value);
                                                                setNameError('');
                                                            }}
                                                        />
                                                        {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={4}>
                                            <Grid item xs={12}>
                                                <Grid xs={3}>
                                                    <Button type="submit" variant="primary" style={{ marginTop: '2%' }}>
                                                        Search
                                                    </Button>
                                                    <Button variant="primary" style={{ marginTop: '2%', marginLeft: '3%' }} onClick={handleAddClick}>
                                                        Add
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Col>
                                    </Row>
                                </Form>
                                {searchPerformed && (
                                    <table className="table report-table">
                                        <thead>
                                            <tr>
                                                <th>Sl no</th>
                                                <th>User Name</th>
                                                <th>CMS Name</th>
                                                <th>Source Link</th>
                                                <th>RecordType</th>
                                                <th>Gender</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {identifies.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} style={{ textAlign: 'center' }}>
                                                        No data available
                                                    </td>
                                                </tr>
                                            ) : (
                                                identifies.map((item, index) => (
                                                    <tr key={index} onClick={() => handleEditClick(String(item.cmsId), item.recordTypeId)}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.userName}</td>
                                                        <td>{item.cmsName}</td>
                                                        <td>
                                                            <a href={item.sourceLink} target="_blank" rel="noopener noreferrer">
                                                                {item.sourceLink}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            {item.recordTypeId ? getgenderrecoredtype(item.recordTypeId) : '-'}
                                                        </td>
                                                        <td>
                                                            {item.genderId ? getgenderName(item.genderId) : '-'}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </CardContent>
                        </Card >
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Identify;