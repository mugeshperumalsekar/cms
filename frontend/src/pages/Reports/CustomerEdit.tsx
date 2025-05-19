import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TextField, Button, Paper, TableContainer, Select, MenuItem, FormControl, InputLabel, Box, Grid } from "@mui/material";
import CustomerApiService from "../../data/services/customerEdit/customeredit_api_service";
import SearchService from "../../data/services/Search/search-api-service";
import GenderApiService from "../../data/services/master/Gender/gender_api_service";
import AuthAdminApiService from "../../data/services/authadminuser/authu-admin-api-service";
import "./customeredit.css";
import { useParams } from "react-router-dom";
import Header from "../../layouts/header/header";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import { useRef } from "react";

type RecordType = { id: number; name: string };
type Gender = { id: number; gender: string };
type Customer = {
    uid: number;
    cmsId: number;
    userName: string;
    created_at: string;
    name: string;
    recordTypeId: number;
    genderId: number;
};

const customerApiService = new CustomerApiService();
const recordTypeService = new SearchService();
const genderService = new GenderApiService();
const authService = new AuthAdminApiService();

const CustomerTable = () => {

    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [selectedAdminUser, setSelectedAdminUser] = useState<string>("");
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [searchName, setSearchName] = useState<string>("");
    const { cmsId } = useParams<{ cmsId: string }>();
    const listRef = useRef<VariableSizeList>(null);

    const { data: customers = [], refetch } = useQuery<Customer[]>({
        queryKey: ["customers"],
        queryFn: () => customerApiService.getAll(),
    });

    const { data: adminUsers = [] } = useQuery<any[]>({
        queryKey: ["adminUsers"],
        queryFn: () => authService.getadminuser(),
    });

    const { data: recordTypes = [] } = useQuery<RecordType[]>({
        queryKey: ["recordTypes"],
        queryFn: () => recordTypeService.getRecoredType(),
    });

    const { data: genders = [] } = useQuery<Gender[]>({
        queryKey: ["genders"],
        queryFn: () => genderService.getGender(),
    });

    const fetchFilteredData = async () => {
        let filteredData = customers;
        if (fromDate && toDate) {
            const response = await customerApiService.getCustomDate(new Date(fromDate), new Date(toDate));
            filteredData = response.map((item) => ({
                uid: item.uid ?? 0,
                cmsId: item.cmsId ?? 0,
                userName: item.userName ?? "",
                created_at: item.created_at ?? "",
                name: item.name ?? "",
                recordTypeId: item.recordTypeId ?? 0,
                genderId: item.genderId ?? 0,
            }));
        }
        if (searchName.trim()) {
            filteredData = filteredData.filter((item) =>
                item.name.toLowerCase().includes(searchName.toLowerCase())
            );
        }
        if (selectedAdminUser) {
            filteredData = filteredData.filter((item) => item.userName === selectedAdminUser);
        }
        if (filteredData.length === 0) {
            setFilteredCustomers([]);
        } else {
            setFilteredCustomers(filteredData);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            fetchFilteredData();
        }
    };

    const handleShowAll = () => {
        setFromDate("");
        setToDate("");
        setSelectedAdminUser("");
        setSearchName("");
        setFilteredCustomers(customers);
    };

    const displayedCustomers = filteredCustomers.length > 0 ? filteredCustomers : customers;
    const totalRecords = displayedCustomers.length;

    const Row = ({ index, style }: ListChildComponentProps) => {
        const customer = displayedCustomers[index];
        const handleTableRowClick = (uid: string, cmsId: string, recordTypeId: number) => {
            let route: string;
            switch (recordTypeId) {
                case 1:
                    route = 'Entityview';
                    break;
                case 2:
                    route = 'Individualview';
                    break;
                case 3:
                    route = 'Shipview';
                    break;
                case 4:
                    route = 'Aircraftview';
                    break;
                case 5:
                    route = 'Organizationview';
                    break;
                default:
                    route = '';
            }
            const url = `/View/${route}/${cmsId}/${uid}/${recordTypeId}?hideHeader=true`;
            window.open(url, '_blank');
        };

        return (
            <div className="table-row" style={style}>
                <div className="table-cell" style={{ flex: 5, wordWrap: 'break-word' }}>{index + 1}</div>
                <a
                    href="#"
                    className="table-cell clickable"
                    style={{ flex: 10, wordWrap: 'break-word' }}
                    onClick={(e) => {
                        e.preventDefault();
                        handleTableRowClick(
                            customer.uid.toString(),
                            customer.cmsId.toString(),
                            customer.recordTypeId
                        );
                    }}
                >
                    {customer.userName || "-"}
                </a>
                <div className="table-cell" style={{ flex: 10, wordWrap: 'break-word' }}>
                    {customer.created_at
                        ? new Date(customer.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })
                        : "-"}
                </div>
                <div className="table-cell" style={{ flex: 55, wordWrap: 'break-word' }}>{customer.name || "-"}</div>
                <div className="table-cell" style={{ flex: 10, wordWrap: 'break-word' }}>
                    {recordTypes.find((r) => r.id === customer.recordTypeId)?.name || "-"}
                </div>
                <div className="table-cell" style={{ flex: 10, wordWrap: 'break-word' }}>
                    {genders.find((g) => g.id === customer.genderId)?.gender || "-"}
                </div>
            </div>
        );
    };

    const getRowHeight = (index: number) => {
        const customer = displayedCustomers[index];
        if (!customer) return 40;
        const nameLength = customer.name.length;
        if (nameLength > 100) return 80;
        if (nameLength > 50) return 60;
        return 40;
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '5%' }}>
                <div className="customer-table-container">
                    <div className="filter-container" style={{ padding: "1rem" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={2} md={2}>
                                <TextField
                                    label="From Date"
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ width: "100%", height: "35px", "& .MuiInputBase-root": { height: "35px" } }}
                                    defaultValue="Small"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} md={2}>
                                <TextField
                                    label="To Date"
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ width: "100%", height: "35px", "& .MuiInputBase-root": { height: "35px" } }}
                                    defaultValue="Small"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} md={2}>
                                <TextField
                                    label="Search Name"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    sx={{ width: "100%", height: "35px", "& .MuiInputBase-root": { height: "35px" } }}
                                    defaultValue="Small"
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="admin-user-label">Admin User</InputLabel>
                                    <Select
                                        labelId="admin-user-label"
                                        id="admin-user-select"
                                        value={selectedAdminUser}
                                        onChange={(e) => setSelectedAdminUser(e.target.value)}
                                        label="Admin User"
                                        sx={{ width: "100%", height: "35px", "& .MuiInputBase-root": { height: "35px" } }}
                                    >
                                        {adminUsers.map((user) => (
                                            <MenuItem key={user.id} value={user.userName}>
                                                {user.userName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={2} md={2} display="flex" justifyContent="center" gap={2} style={{ marginLeft: '-2%' }}>
                                <Button variant="contained" color="primary" size="small" onClick={fetchFilteredData}>
                                    Search
                                </Button>
                                <Button variant="contained" color="secondary" size="small" onClick={handleShowAll}>
                                    Reset
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                    {customers.length === 0 ? (
                        <p className="loading-text">Loading...</p>
                    ) : filteredCustomers.length === 0 && (fromDate || toDate || searchName || selectedAdminUser) ? (
                        <p className="no-data-text">No data available</p>
                    ) : (
                        <TableContainer component={Paper} className="table-container">
                            <div className="table-header">
                                <div className="table-cell" style={{ flex: 5 }}>S.No</div>
                                <div className="table-cell" style={{ flex: 10 }}>User Name</div>
                                <div className="table-cell" style={{ flex: 10 }}>Created At</div>
                                <div className="table-cell" style={{ flex: 55 }}>Name</div>
                                <div className="table-cell" style={{ flex: 11 }}>Record Type</div>
                                <div className="table-cell" style={{ flex: 11 }}>Gender</div>
                            </div>
                            <VariableSizeList
                                ref={listRef}
                                height={400}
                                itemCount={displayedCustomers.length}
                                itemSize={getRowHeight}
                                width="100%"
                            >
                                {Row}
                            </VariableSizeList>
                        </TableContainer>
                    )}
                </div>
            </Box>
        </Box>
    );
};

export default CustomerTable;