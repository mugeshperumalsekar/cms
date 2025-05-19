import React, { ReactNode, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../../layouts/header/header';
import { CardContent ,Box} from '@mui/material';
import DataEntryApiService from '../../data/services/Reports/DataEntry/dataentry-api-service';
import { DataEntryData } from '../../data/services/Reports/DataEntry/dataentry-payload';

interface DataEntryPayload {
    fromDate: string;
    toDate: string;
    name: string;
    count: string;
}

function DataEntry() {

    const calculateWeekRange = (date: Date): [Date, Date] => {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - dayOfWeek);
        const endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
        return [startDate, endDate];
    };

    const [selectedOption, setSelectedOption] = useState<string>('daily');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [highlightedWeek, setHighlightedWeek] = useState(calculateWeekRange(new Date()));
    const dataEntryApiService = new DataEntryApiService();
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [data, setData] = useState<DataEntryPayload[]>([]);

    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
        setCurrentDate(new Date());
        setStartDate(new Date());
        setEndDate(new Date());
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return new Date(year, month, day);
    };

    function convert(str: string | number | Date) {
        const date = new Date(str);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleSearch = () => {
        const formattedStartDate = convert(startDate);
        const formattedEndDate = convert(endDate);
        const startDateAsDate = new Date(formattedStartDate);
        const endDateAsDate = new Date(formattedEndDate);
        dataEntryApiService.getCustomDate(startDateAsDate, endDateAsDate)
            .then((fetchedData: DataEntryData[]) => {
                setSearchPerformed(true);
                const transformedData: DataEntryPayload[] = fetchedData.map(entry => {
                    return {
                        fromDate: entry.frmDate,
                        toDate: entry.toDate,
                        name: entry.name,
                        count: entry.count,
                    };
                });
                setData(transformedData);
            })
            .catch((error) => {
                console.error('API request error:', error);
                if (error.response) {
                    console.error('Request failed with status code:', error.response.status);
                    console.error('Response data:', error.response.data);
                } else if (error.request) {
                    console.error('No response received. Request made but no response.');
                } else {
                    console.error('Error setting up the request:', error.message);
                }
            });
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

    const getDisabledDates = (): [Date | null, Date | null] => {
        const today = new Date();
        let minDate: Date | null = new Date(today);
        let maxDate: Date | null = new Date(today);
        return [minDate, maxDate];
    };

    const disabledDates = getDisabledDates();

    return (
        <>
         <Box sx={{display:'flex'}}>
           
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <h4 style={{ marginTop: '5%', marginLeft: '2%' }}>Data Entry</h4>
            <Card border='10px' style={{ margin: '2%' }}>
                <Container className="alertreport-container">
                    <CardContent>
                        <Form>
                            <Row>
                                <Col xs={4}>
                                    <Form.Group>
                                        <Row>
                                            <Col>
                                                <Form.Label>Start Date:</Form.Label>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={handleStartChange}
                                                    dateFormat="MMMM d, yyyy"
                                                    className="form-control"
                                                    disabledKeyboardNavigation
                                                    minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
                                                    maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
                                                    highlightDates={highlightedWeek}
                                                />
                                            </Col>
                                            <Col>
                                                <Form.Label>End Date:</Form.Label>
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={handleEndChange}
                                                    dateFormat="MMMM d, yyyy"
                                                    className="form-control"
                                                    disabledKeyboardNavigation
                                                    minDate={selectedOption === 'custom' ? null : new Date(1900, 0, 1)}
                                                    maxDate={selectedOption === 'custom' ? null : new Date(2100, 11, 31)}
                                                    highlightDates={highlightedWeek}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                                <Col xs={4}>
                                    <Button variant="primary" style={{ marginTop: '8%' }} onClick={handleSearch}>
                                        Apply Dates
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        <div className="current-date"></div>
                        {data.length === 0 && searchPerformed && (
                            <p>No data available</p>
                        )}
                        {data.length > 0 && (
                            <table className="table report-table">
                                <thead>
                                    <tr>
                                        <th>Sl no</th>
                                        <th>User Name</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item: DataEntryPayload, index: number) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Container>
            </Card>
            </Box>
            </Box>
        </>
    );
}

export default DataEntry;
