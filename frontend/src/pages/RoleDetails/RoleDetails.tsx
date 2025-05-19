import React, { useState, useEffect, useRef, RefObject } from 'react';
import Header from '../../layouts/header/header';
import { Container, Box, TextField, Button, Grid, } from '@mui/material';
import { Card } from 'react-bootstrap';
import AuthConfigModuleModuleDetApiService from '../../data/services/configmodulemoduledet/authu-configmodulemoduledet-api-service';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';
import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl } from '@mui/material';
import RoleDetailsService from '../../data/services/Role/roleDetails-api-service';
import { RoleDetailsPayload } from '../../data/services/Role/roleDetails-payload';

interface ConfigModuleModuleDet {
    modid: number;
    moddetid: number;
    modname: string;
    moddetname: string;
}

interface RolesName {
    id: string;
    roleName: string;
}

interface RoleInputRefType extends HTMLSelectElement { }
interface ValidationMessageRefType extends HTMLParagraphElement { }

const RoleDetails = () => {

    const authConfigModuleModuleDetService = new AuthConfigModuleModuleDetApiService();
    const [configModuleModuleDet, setConfigModuleModuleDet] = useState<ConfigModuleModuleDet[]>([]);
    const [selectedModIds, setSelectedModIds] = useState<string[]>([]);
    const [selectedModDetIds, setSelectedModDetIds] = useState<string[]>([]);
    const userDetails = useSelector((state: any) => state.loginReducer);
    const userFirstName = userDetails.userData?.firstName;
    const loginDetails = userDetails.loginDetails;
    const roleDetailsService = new RoleDetailsService();
    const [rolesName, setRolesName] = useState<RolesName[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [validationMessage, setValidationMessage] = useState<string>('');
    const roleInputRef = useRef<RoleInputRefType>(null);
    const validationMessageRef = useRef<ValidationMessageRefType>(null);

    useEffect(() => {
        fetchConfigModuleModuleDet();
        fetchRole();
    }, []);

    const handleRoleChange = (event: SelectChangeEvent<string>) => {
        setSelectedRole(event.target.value);
        setValidationMessage('');
    };

    const fetchConfigModuleModuleDet = async () => {
        try {
            const response = await authConfigModuleModuleDetService.getConfigModuleModuleDet();
            setConfigModuleModuleDet(response);
            return response;
        } catch (error) {
            console.error("Error fetching config modules:", error);
        }
    };

    const fetchRole = async () => {
        try {
            const rolesName = await roleDetailsService.getRole();
            setRolesName(rolesName);
        } catch (error) {
            console.error("Error fetching Role Name:", error);
        }
    };

    const modIdSet = new Set<number>();
    let snCount = 0;

    const handleCheckboxChange = (modId: string, modDetId: string, checked: boolean): void => {
        if (checked) {
            setSelectedModIds((prevModIds) => [...prevModIds, modId]);
            setSelectedModDetIds((prevModDetIds) => [...prevModDetIds, modDetId]);
        } else {
            setSelectedModIds((prevModIds) => prevModIds.filter((id) => id !== modId));
            setSelectedModDetIds((prevModDetIds) => prevModDetIds.filter((id) => id !== modDetId));
        }
        setValidationMessage('');
    };

    const handleSubmit = async () => {
        try {
            if (!selectedRole) {
                setValidationMessage('Please select a role.');
                if (roleInputRef.current) {
                    roleInputRef.current.focus();
                }
            } else if (selectedModIds.length === 0 || selectedModDetIds.length === 0) {
                setValidationMessage('Please select at least one checkbox.');
                if (roleInputRef.current) {
                    roleInputRef.current.focus();
                }
            } else {
                setValidationMessage('');
                const payload: RoleDetailsPayload = {
                    roleId: parseInt(selectedRole),
                    modId: parseInt(selectedModIds[0]),
                    modDetId: parseInt(selectedModDetIds[0]),
                    uid: loginDetails.id,
                };
                const response = await roleDetailsService.saveRole(payload);
                window.location.reload();
            }
        } catch (error) {
            console.error('Error submitting role details:', error);
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
                        }}>
                        <Container
                            style={{
                                maxWidth: 'none',
                                backgroundColor: 'white',
                                margin: '10px',
                            }}
                        >
                            <Box m={4}>
                                <Grid> <h3 style={{ marginBottom: '1%' }}>ROLE DETAILS :</h3></Grid>
                                <form>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={4} md={4}>
                                            <FormControl fullWidth variant="outlined" style={{ marginBottom: '10px' }}>
                                                <InputLabel htmlFor="role-select">Roles</InputLabel>
                                                <Select
                                                    id="role-select"
                                                    value={selectedRole}
                                                    onChange={handleRoleChange}
                                                    inputRef={roleInputRef}
                                                    autoFocus
                                                    label="Role"
                                                >
                                                    {rolesName.map((role) => (
                                                        <MenuItem key={role.id} value={role.id}>
                                                            {role.roleName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {validationMessage && (
                                                    <p ref={validationMessageRef} style={{ color: 'red', marginTop: '1px' }}>
                                                        {validationMessage}
                                                    </p>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <TableContainer style={{ marginTop: '2%' }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ borderBottom: '1px solid #ddd' }}>S.No</TableCell>
                                                        <TableCell style={{ borderBottom: '1px solid #ddd', borderLeft: '1px solid #ddd' }}>
                                                            Group
                                                        </TableCell>
                                                        <TableCell style={{ borderBottom: '1px solid #ddd', borderLeft: '1px solid #ddd' }}>
                                                            SubGroup
                                                        </TableCell>
                                                        <TableCell style={{ borderBottom: '1px solid #ddd' }}>Permissions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {configModuleModuleDet.length > 0 ? (
                                                        configModuleModuleDet.map((moduleDet, index) => {
                                                            const isFirstInGroup =
                                                                index === 0 || moduleDet.modname !== configModuleModuleDet[index - 1].modname;
                                                            const groupSize = configModuleModuleDet.filter((m) => m.modname === moduleDet.modname).length;
                                                            const isNewModId = !modIdSet.has(moduleDet.modid);
                                                            if (isNewModId) {
                                                                snCount += 1;
                                                                modIdSet.add(moduleDet.modid);
                                                            }
                                                            return (
                                                                <TableRow
                                                                    key={moduleDet.modid ? moduleDet.moddetid.toString() : ''}
                                                                    style={{
                                                                        borderBottom: '1px solid #ddd',
                                                                        transition: 'background 0.3s',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    {isFirstInGroup ? (
                                                                        <TableCell
                                                                            rowSpan={groupSize}
                                                                            style={{ borderRight: '1px solid #ddd' }}
                                                                        >
                                                                            {snCount}
                                                                        </TableCell>
                                                                    ) : null}
                                                                    {isFirstInGroup ? (
                                                                        <TableCell
                                                                            rowSpan={groupSize}
                                                                            style={{ borderRight: '1px solid #ddd' }}
                                                                        >
                                                                            {moduleDet.modname}
                                                                        </TableCell>
                                                                    ) : null}
                                                                    <TableCell>{moduleDet.moddetname}</TableCell>
                                                                    <TableCell>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedModDetIds.includes(moduleDet.moddetid.toString())}
                                                                            onChange={(e) =>
                                                                                handleCheckboxChange(moduleDet.modid.toString(), moduleDet.moddetid.toString(), e.target.checked)
                                                                            }
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={4}>Loading...</TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        <Grid item xs={12}>
                                            <Grid container justifyContent="flex-end">
                                                <Grid item>
                                                    <Button variant="contained" color="primary">
                                                        Edit
                                                    </Button>
                                                    <Button variant="contained" color="primary" style={{ marginLeft: '48%', marginTop: '-44%' }} onClick={handleSubmit}>
                                                        Submit
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>
                        </Container>
                    </Card>
                </Box>
                </Box>
            </>
        </div>
    );
};

export default RoleDetails;
