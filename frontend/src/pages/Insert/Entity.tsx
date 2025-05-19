import React from "react";
import { TextField, Button, Grid, Card } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";

interface CreateDetails {
    recordTypeId: number;
    regulatorListId: number;
    regulatorId: number;
    display: number;
    sourceLink: string;
    name: string;
    registrationNum: string;
    genderId: number;
    deadId: number;
    uid: number;
};

interface Company {
    cin: string;
    recordTypeId: number;
    regulatorListId: number;
    regulatorId: number;
    uid: number;
    cmsId: number;
}

interface Director {
    din: string;
    directorName: string;
    cinDetailsId: number;
    cmsId: number;
    uid: number;
}

interface Entity {
    createDetails: CreateDetails;
    company: Company;
    directors: Director[];
}

interface EntityProps {
    entities: Entity[];
    setEntities: React.Dispatch<React.SetStateAction<Entity[]>>;
}

const Entity: React.FC<EntityProps> = ({ entities, setEntities }) => {
    // Handle changes in createDetails
    const handleCreateDetailsChange = (index: number, field: keyof CreateDetails, value: string | number) => {
        const updatedEntities = [...entities];
        updatedEntities[index].createDetails = { ...updatedEntities[index].createDetails, [field]: value };
        setEntities(updatedEntities);
    };

    // Handle changes in company details
    const handleCompanyChange = (index: number, field: keyof Company, value: string | number) => {
        const updatedEntities = [...entities];
        updatedEntities[index].company = { ...updatedEntities[index].company, [field]: value };
        setEntities(updatedEntities);
    };

    // Handle changes in director details
    const handleDirectorChange = (entityIndex: number, directorIndex: number, field: keyof Director, value: string) => {
        const updatedEntities = [...entities];
        updatedEntities[entityIndex].directors[directorIndex] = {
            ...updatedEntities[entityIndex].directors[directorIndex],
            [field]: value,
        };
        setEntities(updatedEntities);
    };

    // Add new entity
    const addMoreEntities = () => {
        setEntities([...entities, {
            createDetails: {
                recordTypeId: 0, regulatorListId: 0, regulatorId: 0, display: 0, sourceLink: "", name: "",
                registrationNum: "", genderId: 0, deadId: 0, uid: 0
            },
            company: { cin: "", recordTypeId: 0, regulatorListId: 0, regulatorId: 0, uid: 0, cmsId: 0 },
            directors: [{ din: "", directorName: "", cinDetailsId: 0, cmsId: 0, uid: 0 }]
        }]);
    };

    // Remove an entity
    const deleteEntity = (index: number) => {
        setEntities(entities.filter((_, i) => i !== index));
    };

    // Add new director to an entity
    const addMoreDirectors = (entityIndex: number) => {
        const updatedEntities = [...entities];
        updatedEntities[entityIndex].directors.push({ din: "", directorName: "", cinDetailsId: 0, cmsId: 0, uid: 0 });
        setEntities(updatedEntities);
    };

    // Remove a director from an entity
    const deleteDirector = (entityIndex: number, directorIndex: number) => {
        const updatedEntities = [...entities];
        updatedEntities[entityIndex].directors.splice(directorIndex, 1);
        setEntities(updatedEntities);
    };


return (

    <Card style={{ marginTop: '3%', padding: "1%", width: "100%" }}>
        <h4>Entity</h4>
        <div className="scrollablebox">
            {entities.map((entity, entityIndex) => (
                <div key={entityIndex} className="person-container">
                    {entities.length > 1 && (
                        <div className="close-button" onClick={() => deleteEntity(entityIndex)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    )}
                    <div className="field-group-column" style={{ marginBottom: '10px' }}>


                        <TextField
                            fullWidth
                            label="Company Name"
                            variant="standard"
                            value={entity.createDetails.name}
                            onChange={(e) => handleCreateDetailsChange(entityIndex, "name", e.target.value)}
                        />

                        <TextField
                            fullWidth
                            label="CIN"
                            variant="standard"
                            value={entity.company.cin}
                            onChange={(e) => handleCompanyChange(entityIndex, "cin", e.target.value)}
                        />

                    </div>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="scrollable-box"></div>
                                        {entity.directors.map((director, directorIndex) => (
                                            <div className="field-group-column">


                                                <TextField
                                                    fullWidth
                                                    label="DIN"
                                                    variant="standard"
                                                    value={director.din}
                                                    onChange={(e) => handleDirectorChange(entityIndex, directorIndex, "din", e.target.value)}
                                                />

                                                <TextField
                                                    fullWidth
                                                    label="DIN Name"
                                                    variant="standard"
                                                    value={director.directorName}
                                                    onChange={(e) => handleDirectorChange(entityIndex, directorIndex, "directorName", e.target.value)}
                                                />

                                                {entity.directors.length > 1 && (
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        className="delete-icon"
                                                        onClick={() => deleteDirector(entityIndex, directorIndex)}
                                                        style={{ cursor: "pointer", marginTop: "15px" }}
                                                    />
                                                )}


                                            </div>
                                        ))}
                                        <div className="field label">
                                            <div className="add-button"  onClick={() => addMoreDirectors(entityIndex)}>
                                                <FontAwesomeIcon icon={faPlusCircle} />   Add Director
                                            </div>
                                        </div>
                                        {/* <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => addMoreDirectors(entityIndex)}
                                            startIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                                            style={{ marginTop: "10px" }}
                                        >
                                            Add Director
                                        </Button> */}
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>


                </div>
            ))}

            <Button
                variant="contained"
                color="primary"
                onClick={addMoreEntities}
                startIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                style={{ marginTop: "10px" }}
            >
                Add More Entity
            </Button>
        </div>
       
    </Card>

);
};

export default Entity;
