import React, { useState } from 'react';
import { TextField, Grid } from '@mui/material';
import './Search.css';
import { SelectChangeEvent } from '@mui/material/Select';
import SearchService from '../../data/services/Search/search-api-service';
import { CreateCaseDetailsRequest } from '../../data/services/Search/search-payload';
import { useSelector } from 'react-redux';
interface PDFFile {
    fileId: string;
    fileName: string;
    documentType: string; // Ensure this matches API response
}

interface Image {
    name: string;
    uploading: boolean;
    uploadSuccess: boolean;
}

function Shiped() {

    const initialImageState: Image = {
        name: '',
        uploading: false,
        uploadSuccess: false,
    };

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const searchService = new SearchService();
    const [caseDetails, setCaseDetails] = useState<CreateCaseDetailsRequest[]>([{ cmsId: 0, recordTypeId: 0, caseDetails: '', uid: loginDetails.id }]);

    const handleCaseDetailsChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { caseDetails: string; value: unknown }> | SelectChangeEvent<string>,
        index: number
    ) => {
        if ('target' in e && e.target) {
            const { value } = e.target as HTMLInputElement | HTMLTextAreaElement;
            const updatedDetails = [...caseDetails];
            updatedDetails[index] = { ...updatedDetails[index], caseDetails: value };
            setCaseDetails(updatedDetails);
        }
    };

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <div className="key">
                        <div className="person-container">
                            <div className="field-group-column">
                                <TextField
                                    id="Case Details"
                                    label="Case Details"
                                    variant="standard"
                                    type="text"
                                    fullWidth
                                    size="small"
                                    name="caseDetails"
                                    value={caseDetails[0].caseDetails}
                                    onChange={(e) => handleCaseDetailsChange(e, 0)}
                                />
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </>
    )
}

export default Shiped;