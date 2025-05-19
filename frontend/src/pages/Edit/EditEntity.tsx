import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Card } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom"; // To get entity ID from URL
import axios from "axios";

// Interfaces
interface Company {
    companyName: string;
    cin: string;
}

interface Director {
    din: string;
    directorName: string;
}

interface EditEntity {
    company: Company;
    directors: Director[];
}
interface EntityProps {
    entities: EditEntity[];
    setEntities: React.Dispatch<React.SetStateAction<EditEntity[]>>;
}

const EditEntity: React.FC<EntityProps> = ({ entities, setEntities }) => {
    const { entityId } = useParams<{ entityId: string }>(); // Get ID from URL
  

    // Fetch entity details when page loads
    useEffect(() => {
        axios.get(`/api/entities/${entityId}`)
            .then(response => {
                setEntities([response.data]); // Load data into state
            })
            .catch(error => {
                console.error("Error fetching entity:", error);
            });
    }, [entityId]);

    // Handle changes in company details
    const handleCompanyChange = (index: number, field: keyof Company, value: string) => {
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

    // Add new director
    const addMoreDirectors = (entityIndex: number) => {
        const updatedEntities = [...entities];
        updatedEntities[entityIndex].directors.push({ din: "", directorName: "" });
        setEntities(updatedEntities);
    };

    // Remove a director
    const deleteDirector = (entityIndex: number, directorIndex: number) => {
        const updatedEntities = [...entities];
        updatedEntities[entityIndex].directors = updatedEntities[entityIndex].directors.filter((_, i) => i !== directorIndex);
        setEntities(updatedEntities);
    };

    // Submit updated entity details
    const handleSave = () => {
        axios.put(`/api/entities/${entityId}`, entities[0]) // Assuming only one entity is being edited
            .then(() => {
                alert("Entity updated successfully!");
            })
            .catch(error => {
                console.error("Error updating entity:", error);
            });
    };

    return (
        <Card style={{ marginTop: '3%', padding: "1%", width: "100%" }}>
            <h4>Edit Entity</h4>
            <div className="scrollablebox">
                {entities.map((entity, entityIndex) => (
                    <div key={entityIndex} className="person-container">
                        <div className="field-group-column" style={{ marginBottom: '10px' }}>
                            <TextField
                                fullWidth
                                label="Company Name"
                                variant="standard"
                                value={entity.company.companyName}
                                onChange={(e) => handleCompanyChange(entityIndex, "companyName", e.target.value)}
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
                                    {entity.directors.map((director, directorIndex) => (
                                        <div key={directorIndex} className="field-group-column">
                                            <TextField
                                                fullWidth
                                                label="DIN"
                                                variant="standard"
                                                value={director.din}
                                                onChange={(e) => handleDirectorChange(entityIndex, directorIndex, "din", e.target.value)}
                                            />

                                            <TextField
                                                fullWidth
                                                label="Director Name"
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

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => addMoreDirectors(entityIndex)}
                                        startIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                                        style={{ marginTop: "10px" }}
                                    >
                                        Add Director
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                ))}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    style={{ marginTop: "10px", marginRight: "10px" }}
                >
                    Save Changes
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => window.history.back()}
                    style={{ marginTop: "10px" }}
                >
                    Cancel
                </Button>
            </div>
        </Card>
    );
};

export default EditEntity;
