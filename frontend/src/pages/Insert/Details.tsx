import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle, faTrash, faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { SelectChangeEvent } from '@mui/material/Select';
import { createBankDetailsRequests, createDetailsRequest, Regulator, RegulatorListData, Gender, RecordTypeData, Dead, InorgPayload, AliasesDTO, AddressDTO, DateOfBirthDTO, DetailsCombineDTO, CreateCountryRegistrationRequest, IdNumberData, CountryHqData, Country, CreateCaseDetailsRequest, bank, createIndPositionsRequests, createIndCaseDetailsRequests, State, ContactDetails, createCompanyAliasesRequests, CompanyPayload, CreateorganizationDetailsRequest } from '../../data/services/Search/search-payload';
import SearchService from '../../data/services/Search/search-api-service';
import GenderApiService from '../../data/services/master/Gender/gender_api_service';
import DeadApiService from '../../data/services/master/Dead/dead_api_service';
import IdNumberApiService from '../../data/services/master/IdNumber/idnumber_api_service';
import CountryApiService from '../../data/services/master/Country/country_api_service';
import AddressApiService from '../../data/services/insert/address-api-service';
import RelativeApiService from '../../data/services/master/relative/relative-api-serivces';
import { Relative } from '../../data/services/viewpage/viewpagedetails-payload';
import { useSelector } from 'react-redux';
import Header from '../../layouts/header/header';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Search.css';



interface Image {
    name: string;
    uploading: boolean;
    uploadSuccess: boolean;
}

function Search() {
    

    const navigate = useNavigate();

    const initialImageState: Image = {
        name: '',
        uploading: false,
        uploadSuccess: false,
    };

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;

    const [DetailsData, setDetailsData] = useState<createDetailsRequest>({
        recordTypeId: 0,
        regulatorListId: 0,
        regulatorId: 0,
        display: 0,
        sourceLink: '',
        name: '',
        registrationNum: '',
        genderId: 0,
        deadId: 0,
        uid: loginDetails.id,
    });

    const [selectedContact, setSelectedContact] = useState("");

    const handleSelectChange = (event: { target: { value: React.SetStateAction<string>; } }) => {
        setSelectedContact(event.target.value);
    };

    const nameRef = useRef<HTMLInputElement | null>(null);
    const deadRef = useRef<HTMLInputElement | null>(null);
    const genderRef = useRef<HTMLInputElement | null>(null);
    const [nameError, setNameError] = useState(false);
    const [caseError, setcasError] = useState(false);
    const [RecordType, setRecordType] = useState<RecordTypeData[]>([]);
    const [bank, setbank] = useState<bank[]>([]);
    const [state, setstate] = useState<State[]>([]);
    const [contactDetails, setcontactDetails] = useState<ContactDetails[]>([]);
    const [Dead, setDead] = useState<Dead[]>([]);
    const [Idnumber, setIdnumber] = useState<IdNumberData[]>([]);
    const [Idnumbers, setIdnumbers] = useState<IdNumberData[]>([]);
    const [CountryHqData, setCountryHqData] = useState<CountryHqData[]>([]);
    const [Country, setCountry] = useState<Country[]>([]);
    const [gender, setgender] = useState<Gender[]>([]);
    const [relative, setRelative] = useState<Relative[]>([]);
    const [selectedRecordType, setSelectedRecordType] = useState<string>('');
    const [countryid, setcountryid] = useState<string>('');
    const [caseDetails, setCaseDetails] = useState<CreateCaseDetailsRequest[]>([{ cmsId: 0, recordTypeId: 0, caseDetails: '', uid: loginDetails.id }]);
    const [AliasesData, setAliasesData] = useState<AliasesDTO[]>([{ cmsId: 0, recordTypeId: 0, aliasesName: '', uid: loginDetails.id }]);
    const [companyAliasesformData, setAliasesCompanyFormData] = useState<createCompanyAliasesRequests[]>([{ cmsId: 0, recordTypeId: 0, companyId: 0, aliasesName: '', uid: loginDetails.id }]);
    const [organization, setorganizationDetails] = useState<CreateorganizationDetailsRequest[]>([{ cmsId: 0, recordTypeId: 0, organizationDetails: '', uid: loginDetails.id }]);
    const [PositionsData, setPositionsData] = useState<createIndPositionsRequests[]>([{ cmsId: 0, recordTypeId: 0, position: '', uid: loginDetails.id }]);
    const [caseData, setcaseData] = useState<createIndCaseDetailsRequests[]>([{ cmsId: 0, recordTypeId: 0, caseDetails: '', uid: loginDetails.id }]);
    const [regulatorId, setRegulatorId] = useState<string>("");
    const [regulatorListId, setRegulatorListId] = useState<string>("");
    const [Regulator, setRegulator] = useState<Regulator[]>([]);
    const [Regulatorlist, setRegulatorlist] = useState<RegulatorListData[]>([]);

    const [PartyformData, setPartyFormData] = useState<DateOfBirthDTO[]>([
        {
            cmsId: 0, recordTypeId: 0, dob: '', birthYearAlone: '', placeOfBirth: '', uid: loginDetails.id
        },
    ]);

    const [Address, setAddress] = useState<AddressDTO[]>([{ cmsId: 0, recordTypeId: 0, address: '', uid: loginDetails.id }]);

    const detailsCombine: DetailsCombineDTO = {
        addressDTOS: Address,
        dateOfBirthDTOS: PartyformData,
        aliasesDTOS: AliasesData
    };

    const [images, setImages] = useState<Image[]>([initialImageState]);
    const [isFileSelected, setIsFileSelected] = useState<boolean>(false);

    const [indOrgformData, setindOrgFormData] = useState<InorgPayload>({
        indOrgCommonDTO: [
            {
                positionsDTO: {
                    cmsId: 0,
                    recordTypeId: 0,
                    position: '',
                    linIndName: '',
                },
                indAliasesNameDTOS: [
                    {
                        cmsId: 0,
                        recordTypeId: 0,
                        positionId: 0,
                        linIndAliasesName: '',
                    },
                ],
                relationDTOS: [
                    {
                        cmsId: 0,
                        recordTypeId: 0,
                        positionId: 0,
                        relationship: '',
                        relativeMasterId: 0,
                    },
                ],
                identificationDTOS: [
                    {
                        cmsId: 0,
                        recordTypeId: 0,
                        positionId: 0,
                        relativeMasterId:0,
                        identificationNumId: 0,
                        identification: '',
                    },
                ],
                relationAliasesDTOS: [
                    {
                        cmsId: 0,
                        recordTypeId: 0,
                        positionId: 0,
                        relationAliasesName: '',
                    },
                ],
                detailsAboutRelationDTOS: [
                    {
                        cmsId: 0,
                        recordTypeId: 0,
                        positionId: 0,
                        detailsAboutRelation: '',
                    },
                ],
            },
        ],
    });

    const [FamilyformData, setFamilyFormData] = useState<CreateCountryRegistrationRequest[]>([
        {
            countryId: 0,
            recordTypeId: 0,
            cmsId: 0,
            countryHqId: 0,
            identificationNumberId: 0,
            identificationNum: '',
            identificationDetails: '',
            contactId: 0,
            contactName: '',
        }
    ]);

    const [BankformData, setBankFormData] = useState<createBankDetailsRequests[]>([
        {
            bankId: 0,
            recordTypeId: 0,
            cmsId: 0,
            acc_no: '',
            name: '',
            uid: loginDetails.id,
        }
    ]);

    const [companyformData, setCompanyFormData] = useState<CompanyPayload>({
        companyCombineDTO: [
            {
                companyDetailsDTOS: {
                    cmsId: 0,
                    recordTypeId: 0,
                    identificationNumberId: '',
                    stateId: 0,
                    role: '',
                    companyName: '',
                    address: '',
                    idDetails: '',
                },
                companyAliasesDTOS: [
                    {
                        cmsId: 0,
                        recordTypeId: 0,
                        companyId: 0,
                        aliasesName: '',
                    },
                ],
            },
        ],
    });

    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const resetNameError = () => {
        setNameError(false);
    };

    const resetCaseError = () => {
        setcasError(false);
    };

    const resetAllErrors = () => {
        setNameError(false);
        setcasError(false);
    };

    const handleFileChange4 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFiles = Array.from(event.target.files) as File[];
            const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
            const fileType = selectedFiles[0].name.split('.').pop();
            setImages(prevFields => {
                const updatedFields = [...prevFields];
                updatedFields[index] = {
                    ...updatedFields[index],
                    name: nameWithoutExtension,
                    uploading: false,
                    uploadSuccess: false,
                };
                return updatedFields;
            });
            setIsFileSelected(true);
        } else {
            setIsFileSelected(false);
        }
    };

    const handleChooseImagesClick1 = (index1: number) => {
        document.getElementById(`image-upload-input1-${index1}`)?.click();
    };

    const handleAddAliasesNameField = () => {
        setAliasesData([...AliasesData, { cmsId: 0, recordTypeId: 0, aliasesName: '', uid: loginDetails.id }]);
    };

    const handleAliasesNameChange = (value: string, index: number) => {
        const updatedAliasesData = [...AliasesData];
        updatedAliasesData[index].aliasesName = value;
        setAliasesData(updatedAliasesData);
    };

    const handleAddressChange = (value: string, index: number) => {
        const updatedaAddress = [...Address];
        updatedaAddress[index].address = value;
        setAddress(updatedaAddress);
    };

    const handlepstiotionChange = (value: string, index: number) => {
        const updatedaAddress = [...PositionsData];
        updatedaAddress[index].position = value;
        setPositionsData(updatedaAddress);
    };

    const handlecasaeChange = (value: string, index: number) => {
        const updatedaAddress = [...caseData];
        updatedaAddress[index].caseDetails = value;
        setcaseData(updatedaAddress);
    };

    const handlecasaecomapnyaliase = (value: string, index: number) => {
        const updatedaAddress = [...companyAliasesformData];
        updatedaAddress[index].aliasesName = value;
        setAliasesCompanyFormData(updatedaAddress);
    };

    const handlePartyformDataChange = (value: string, index: number) => {
        const updatedFormData = [...PartyformData];
        updatedFormData[index].dob = value;
        setPartyFormData(updatedFormData);
    };

    const handlePartyformDatasChanges = (value: string, index: number) => {
        const updatedFormData = [...PartyformData];
        updatedFormData[index].birthYearAlone = value;
        setPartyFormData(updatedFormData);
    };

    const handlePartyformData = (value: string, index: number) => {
        const updatedFormData = [...PartyformData];
        updatedFormData[index].placeOfBirth = value;
        setPartyFormData(updatedFormData);
    };

    const handlecountry = (personIndex: number, value: number) => {
        const updatedFormData = [...FamilyformData];
        updatedFormData[personIndex].countryId = value;
        setFamilyFormData(updatedFormData);
    };

    const handlerelativeChange = (personIndex: number, value: number) => {
        const updatedFormData = [...FamilyformData];
        updatedFormData[personIndex].countryHqId = value;
        setFamilyFormData(updatedFormData);
    };

    const handlerelative = (personIndex: number, value: number) => {
        const updatedFormData = [...FamilyformData];
        updatedFormData[personIndex].identificationNumberId = value;
        setFamilyFormData(updatedFormData);
    };
    const handlerelativecompany = (personIndex: number, value: number) => {
        setindOrgFormData((prevData) => {
            // Copy the existing data
            const updatedFormData = { ...prevData };

            // Ensure we are modifying a copy of the array inside the object
            updatedFormData.indOrgCommonDTO = [...prevData.indOrgCommonDTO];

            // Ensure the index is within bounds
            if (updatedFormData.indOrgCommonDTO[personIndex]) {
                updatedFormData.indOrgCommonDTO[personIndex] = {
                    ...updatedFormData.indOrgCommonDTO[personIndex],
                    identificationDTOS: updatedFormData.indOrgCommonDTO[personIndex].identificationDTOS.map(
                        (company: any, index: any) => ({
                            ...company,
                            identificationNumId: value, // Updating only the needed field
                        })
                    ),
                };
            }

            return updatedFormData;
        });
    };


    const handleContactDetails = (personIndex: number, value: number) => {
        const updatedFormData = [...FamilyformData];
        updatedFormData[personIndex].contactId = value;
        setFamilyFormData(updatedFormData);
    };

    const handlebank = (personIndex: number, value: number) => {
        const updatedFormData = [...BankformData];
        updatedFormData[personIndex].bankId = value;
        setBankFormData(updatedFormData);
    };

    const handlecompany = (personIndex: number, value: number) => {
        const newCompanyCombineDTO = [...companyformData.companyCombineDTO];
        newCompanyCombineDTO[personIndex].companyDetailsDTOS.stateId = value;
        setCompanyFormData({ companyCombineDTO: newCompanyCombineDTO });
    };

    const handleidentificationNumberId = (personIndex: number, value: string) => {
        const newCompanyCombineDTO = [...companyformData.companyCombineDTO];
        newCompanyCombineDTO[personIndex].companyDetailsDTOS.identificationNumberId = value;
        setCompanyFormData({ companyCombineDTO: newCompanyCombineDTO });
    };

    const handleInputChangfatherpan = (personIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedFormData = [...FamilyformData];
        updatedFormData[personIndex].identificationNum = event.target.value;
        setFamilyFormData(updatedFormData);
    };
    const handleInputChangcompany = (personIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        setindOrgFormData((prevData) => {
            // Create a new copy of the state object
            const updatedFormData = { ...prevData };

            // Ensure `indOrgCommonDTO` is copied properly
            updatedFormData.indOrgCommonDTO = [...prevData.indOrgCommonDTO];

            // Check if `personIndex` is within bounds
            if (updatedFormData.indOrgCommonDTO[personIndex]) {
                updatedFormData.indOrgCommonDTO[personIndex] = {
                    ...updatedFormData.indOrgCommonDTO[personIndex],
                    identificationDTOS: updatedFormData.indOrgCommonDTO[personIndex].identificationDTOS.map((company: any) => ({
                        ...company,
                        identification: event.target.value, // Update the value
                    })),
                };
            }

            return updatedFormData;
        });
    };


    const handleInputChageidentificationDetails = (personIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedFormData = [...FamilyformData];
        updatedFormData[personIndex].identificationDetails = event.target.value;
        setFamilyFormData(updatedFormData);
    };

    const handleInputContactDetails = (personIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedFormData = [...FamilyformData];
        updatedFormData[personIndex].contactName = event.target.value;
        setFamilyFormData(updatedFormData);
    };

    const handleInputChangbank = (personIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedFormData = [...BankformData];
        updatedFormData[personIndex].acc_no = event.target.value;
        setBankFormData(updatedFormData);
    };

    const handleInputChagebankDetails = (personIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedFormData = [...BankformData];
        updatedFormData[personIndex].name = event.target.value;
        setBankFormData(updatedFormData);
    };

    const handleCancelImage = (index: number) => {
        let updatedFileSet = [...fileSetd];
        updatedFileSet[index].files = [];
        setFileSetd(updatedFileSet);
    };

    const handleInputChange = (personIndex: number, field: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const newCompanyCombineDTO = [...companyformData.companyCombineDTO];
        newCompanyCombineDTO[personIndex].companyDetailsDTOS[field] = event.target.value;
        setCompanyFormData({ companyCombineDTO: newCompanyCombineDTO });
    };

    const handleInputChageidDetailsDetails = (personIndex: number, value: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const newCompanyCombineDTO = [...companyformData.companyCombineDTO];
        newCompanyCombineDTO[personIndex].companyDetailsDTOS.idDetails = event.target.value;
        setCompanyFormData({ companyCombineDTO: newCompanyCombineDTO });
    };

    const handleAliasChange = (personIndex: number, aliasIndex: number, field: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const newCompanyCombineDTO = [...companyformData.companyCombineDTO];
        newCompanyCombineDTO[personIndex].companyAliasesDTOS[aliasIndex][field] = event.target.value;
        setCompanyFormData({ companyCombineDTO: newCompanyCombineDTO });
    };

    const handleRemoveBoxAliasesName = (index: number) => {
        const updatedaAliase = [...AliasesData];
        updatedaAliase.splice(index, 1);
        setAliasesData(updatedaAliase);
    };

    const handleRemoveBoxAddress = (index: number) => {
        const updatedaAddress = [...Address];
        updatedaAddress.splice(index, 1);
        setAddress(updatedaAddress);
    };

    const handleRemovepositionAddress = (index: number) => {
        const updatedaAddress = [...PositionsData];
        updatedaAddress.splice(index, 1);
        setPositionsData(updatedaAddress);
    };

    const handleRemovecaseAddress = (index: number) => {
        const updatedaAddress = [...caseData];
        updatedaAddress.splice(index, 1);
        setcaseData(updatedaAddress);
    };

    const handleRemoveCompanyAlias = (index: number) => {
        const updatedAddress = [...companyAliasesformData];
        updatedAddress.splice(index, 1);
        setAliasesCompanyFormData(updatedAddress);
    };

    const handleRemovePartyformData = (index: number) => {
        const updatedFormData = [...PartyformData];
        updatedFormData.splice(index, 1);
        setPartyFormData(updatedFormData);
    };

    const handleRemoveCompany = (personIndex: number) => {
        const newCompanyCombineDTO = [...companyformData.companyCombineDTO];
        newCompanyCombineDTO.splice(personIndex, 1);
        setCompanyFormData({ companyCombineDTO: newCompanyCombineDTO });
    };

    const handleRemoveBoxSpouseFamily = (personIndex: number) => {
        setindOrgFormData((prevData) => {
            const updatedPeople = [...prevData.indOrgCommonDTO];
            updatedPeople.splice(personIndex, 1);
            return { indOrgCommonDTO: updatedPeople };
        });
    };

    const handleRemoveBoxFamilydetails = (personIndex: number) => {
        const updatedFormData = [...FamilyformData];
        updatedFormData.splice(personIndex, 1);
        setFamilyFormData(updatedFormData);
    };

    const handleRemoveBoxbankdetails = (personIndex: number) => {
        const updatedFormData = [...BankformData];
        updatedFormData.splice(personIndex, 1);
        setBankFormData(updatedFormData);
    };

    const handleDeleteAlias = (personIndex: number, aliasIndex: number) => {
        const newCompanyCombineDTO = [...companyformData.companyCombineDTO];
        newCompanyCombineDTO[personIndex].companyAliasesDTOS.splice(aliasIndex, 1);
        setCompanyFormData({ companyCombineDTO: newCompanyCombineDTO });
    };

    const handleAddCompany = () => {
        const newCompanyCombineDTO = [...companyformData.companyCombineDTO, {
            companyDetailsDTOS: {
                cmsId: 0,
                recordTypeId: 0,
                identificationNumberId: '',
                stateId: 0,
                role: '',
                companyName: '',
                address: '',
                idDetails: '',
            },
            companyAliasesDTOS: [
                {
                    cmsId: 0,
                    recordTypeId: 0,
                    companyId: 0,
                    aliasesName: '',
                },
            ],
        }];
        setCompanyFormData({ companyCombineDTO: newCompanyCombineDTO });
    };

    const handleAddAlias = (personIndex: number) => {
        const newCompanyCombineDTO = [...companyformData.companyCombineDTO];
        newCompanyCombineDTO[personIndex].companyAliasesDTOS.push({
            cmsId: 0,
            recordTypeId: 0,
            companyId: 0,
            aliasesName: '',
        });
        setCompanyFormData({ companyCombineDTO: newCompanyCombineDTO });
    };

    const handleAddPAddressField = () => {
        setAddress([...Address, { cmsId: 0, recordTypeId: 0, address: '', uid: loginDetails.id }]);
    };

    const handleAddPsotionsField = () => {
        setPositionsData([...PositionsData, { cmsId: 0, recordTypeId: 0, position: '', uid: loginDetails.id }]);
    };

    const handleAddcaseField = () => {
        setcaseData([...caseData, { cmsId: 0, recordTypeId: 0, caseDetails: '', uid: loginDetails.id }]);
    };

    const handleAddcomapnyalise = () => {
        setAliasesCompanyFormData([...companyAliasesformData, { cmsId: 0, recordTypeId: 0, aliasesName: '', companyId: 0, uid: loginDetails.id }]);
    };

    const handleAddFieldSpouseFamily = (personIndex: number, fieldType: 'huf' | 'Relation' | 'RelationnName' | 'casedetails') => {
        const updatedPeople = { ...indOrgformData };
        if (fieldType === 'huf') {
            updatedPeople.indOrgCommonDTO[personIndex].indAliasesNameDTOS.push({
                cmsId: 0,
                recordTypeId: 0,
                positionId: 0,
                linIndAliasesName: '',
            });
        }
        else if (fieldType === 'Relation') {
            updatedPeople.indOrgCommonDTO[personIndex].relationDTOS.push({
                cmsId: 0,
                recordTypeId: 0,
                positionId: 0,
                relationship: '',
                relativeMasterId: 0,
            });
        }
        else if (fieldType === 'RelationnName') {
            updatedPeople.indOrgCommonDTO[personIndex].relationAliasesDTOS.push({
                cmsId: 0,
                recordTypeId: 0,
                positionId: 0,
                relationAliasesName: '',
            });
        }
        else if (fieldType === 'casedetails') {
            updatedPeople.indOrgCommonDTO[personIndex].detailsAboutRelationDTOS.push({
                cmsId: 0,
                recordTypeId: 0,
                positionId: 0,
                detailsAboutRelation: '',
            });
        }
        setindOrgFormData({ indOrgCommonDTO: updatedPeople.indOrgCommonDTO });
    };

    const handleDeleteFieldspouseHuf = (
        personIndex: number,
        field1: 'linIndAliasesName',
        index: number
    ) => {
        const updatedPeople = [...indOrgformData.indOrgCommonDTO];
        if (field1 === 'linIndAliasesName') {
            updatedPeople[personIndex].indAliasesNameDTOS.splice(index, 1);
        }
        setindOrgFormData({ indOrgCommonDTO: updatedPeople });
    };

    const handleDeleteFieldrelation = (
        personIndex: number,
        field1: 'relationship',
        index: number
    ) => {
        const updatedPeople = [...indOrgformData.indOrgCommonDTO];
        if (field1 === 'relationship') {
            updatedPeople[personIndex].relationDTOS.splice(index, 1);
        }
        setindOrgFormData({ indOrgCommonDTO: updatedPeople });
    };

    const handleDeleteFieldspousefather = (
        personIndex: number,
        field1: 'relationAliasesName',
        index: number
    ) => {
        const updatedPeople = [...indOrgformData.indOrgCommonDTO];
        if (field1 === 'relationAliasesName') {
            updatedPeople[personIndex].relationAliasesDTOS.splice(index, 1);
        }
        setindOrgFormData({ indOrgCommonDTO: updatedPeople });
    };

    const handleDeleteFieldspousemother = (
        personIndex: number,
        field1: 'detailsAboutRelation',
        index: number
    ) => {
        const updatedPeople = [...indOrgformData.indOrgCommonDTO];
        if (field1 === 'detailsAboutRelation') {
            updatedPeople[personIndex].detailsAboutRelationDTOS.splice(index, 1);
        }
        setindOrgFormData({ indOrgCommonDTO: updatedPeople });
    };

    const handleInputChangeSpouseHuf = (
        personIndex: number,
        field: 'linIndAliasesName',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(indOrgformData));
        const value = field === 'linIndAliasesName' ? event.target.value : event.target.value;
        if (index !== null) {
            if (field === 'linIndAliasesName') {
                if (!updatedPeople.indOrgCommonDTO[personIndex].indAliasesNameDTOS[index]) {
                    updatedPeople.indOrgCommonDTO[personIndex].indAliasesNameDTOS[index] = {
                        cmsId: 0,
                        recordTypeId: 0,
                        positionId: 0,
                        linIndAliasesName: ''
                    };
                }
                updatedPeople.indOrgCommonDTO[personIndex].indAliasesNameDTOS[index][field] = value;
            }
        }
        setindOrgFormData({ indOrgCommonDTO: updatedPeople.indOrgCommonDTO });
    };

    const handleInputChangsrelationIndex = (
        personIndex: number,
        field: 'relationAliasesName',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(indOrgformData));
        updatedPeople.indOrgCommonDTO[personIndex].positionsDTO[field] = event.target.value;
        if (index !== null) {
            if (field === 'relationAliasesName') {
                if (!updatedPeople.indOrgCommonDTO[personIndex].relationAliasesDTOS[index]) {
                    updatedPeople.indOrgCommonDTO[personIndex].relationAliasesDTOS[index] = {
                        cmsId: 0,
                        recordTypeId: 0,
                        positionId: 0,
                        relationAliasesName: '',
                    };
                }
                updatedPeople.indOrgCommonDTO[personIndex].relationAliasesDTOS[index][field] = event.target.value;
            }
        }
        setindOrgFormData({ indOrgCommonDTO: updatedPeople.indOrgCommonDTO });
    };

    const handleInputChangspousefatherpan = (
        personIndex: number,
        field: 'relativeMasterId',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(indOrgformData));
        updatedPeople.indOrgCommonDTO[personIndex].positionsDTO[field] = event.target.value;
        if (index !== null) {
            if (field === 'relativeMasterId') {
                if (!updatedPeople.indOrgCommonDTO[personIndex].relationDTOS[index]) {
                    updatedPeople.indOrgCommonDTO[personIndex].relationDTOS[index] = {
                        cmsId: 0,
                        recordTypeId: 0,
                        positionId: 0,
                        relationship: '',
                        relativeMasterId: 0,
                    };
                }
                updatedPeople.indOrgCommonDTO[personIndex].relationDTOS[index][field] = event.target.value;
            }
        }
        setindOrgFormData({ indOrgCommonDTO: updatedPeople.indOrgCommonDTO });
    };

    const handleInputChangspousemotherpan = (
        personIndex: number,
        field: 'detailsAboutRelation',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(indOrgformData));
        const value = field === 'detailsAboutRelation' ? event.target.value : event.target.value.toUpperCase();
        if (index !== null) {
            if (field === 'detailsAboutRelation') {
                if (!updatedPeople.indOrgCommonDTO[personIndex].detailsAboutRelationDTOS[index]) {
                    updatedPeople.indOrgCommonDTO[personIndex].detailsAboutRelationDTOS[index] = {
                        cmsId: 0,
                        recordTypeId: 0,
                        positionId: 0,
                        detailsAboutRelation: '',
                    };
                }
                updatedPeople.indOrgCommonDTO[personIndex].detailsAboutRelationDTOS[index][field] = value;
            }
        }
        setindOrgFormData({ indOrgCommonDTO: updatedPeople.indOrgCommonDTO });
    };

    const handleInputChangespouseFamily = (
        personIndex: number,
        field: 'linIndName',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(indOrgformData));
        if (field === 'linIndName') {
            updatedPeople.indOrgCommonDTO[personIndex].positionsDTO[field] = event.target.value;
        }
        setindOrgFormData({ indOrgCommonDTO: updatedPeople.indOrgCommonDTO });
    };

    const handleInputChangepostion = (
        personIndex: number,
        field: 'position',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(indOrgformData));
        if (field === 'position') {
            updatedPeople.indOrgCommonDTO[personIndex].positionsDTO[field] = event.target.value;
        }
        setindOrgFormData({ indOrgCommonDTO: updatedPeople.indOrgCommonDTO });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name: string; registrationNum: string; value: unknown }> | SelectChangeEvent<string>,
        index: number
    ) => {
        if ('target' in e && e.target) {
            const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
            if (name in DetailsData) {
                setDetailsData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            }
        } else {
        }
    };

    const handleRegistrationNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetailsData(prevState => ({
            ...prevState,
            registrationNum: e.target.value
        }));
    };

    const recordtype = new SearchService();
    const genderService = new GenderApiService();
    const deadService = new DeadApiService();
    const idnumberService = new IdNumberApiService();
    const countryService = new CountryApiService();
    const searchService = new SearchService();
    const relatives = new RelativeApiService();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    relativeData,
                    recordtypes,
                    bankData,
                    stateData,
                    contactData,
                    regulatorData,
                    regulatorListData,
                    genderData,
                    deadData,
                    idNumberData,
                    idNumbersData,
                    countryHqData,
                    countryData
                ] = await Promise.all([
                    relatives.getRelative(),
                    recordtype.getRecoredType(),
                    recordtype.getBank(),
                    recordtype.getState(),
                    recordtype.getContactDetails(),
                    recordtype.getRegulator(),
                    recordtype.getRegulatorList(),
                    genderService.getGender(),
                    deadService.getDead(),
                    idnumberService.getIdnumber(),
                    idnumberService.getIdnumber(),
                    recordtype.getCountryHq(),
                    countryService.getCountryOptions()
                ]);
                setRelative(relativeData);
                setRecordType(recordtypes);
                setbank(bankData);
                setstate(stateData);
                setcontactDetails(contactData);
                setRegulator(regulatorData);
                setRegulatorlist(regulatorListData);
                setgender(genderData);
                setDead(deadData);
                setIdnumber(idNumberData);
                setIdnumbers(idNumbersData);
                setCountryHqData(countryHqData);
                setCountry(countryData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handledead = (event: SelectChangeEvent<string>) => {
        setDetailsData((prevFormData) => ({
            ...prevFormData,
            deadId: parseInt(event.target.value, 10),
        }));
    };

    const handlegender = (event: SelectChangeEvent<string>) => {
        setDetailsData((prevFormData) => ({
            ...prevFormData,
            genderId: parseInt(event.target.value, 10),
        }));
    };

    const handleAddPartyformDataField = () => {
        setPartyFormData([...PartyformData, { cmsId: 0, recordTypeId: 0, dob: '', birthYearAlone: '', placeOfBirth: '', uid: loginDetails.id, }]);
    };

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [fileSets, setFileSets] = useState<{ id: number; files: File[] }[]>([]);
    const [fileSetd, setFileSetd] = useState<{ id: number; files: File[] }[]>([{ id: 1, files: [] }]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setFileSets(prevFileSets => {
                const updatedFileSets = [...prevFileSets];
                updatedFileSets[index] = { ...updatedFileSets[index], files: newFiles };
                return updatedFileSets;
            });
        }
    };

    const addMoreFileInput = () => {
        setFileSets(prevFileSets => [...prevFileSets, { id: Date.now(), files: [] }]);
    };

    const handleDeleteFileSet = (id: number) => {
        setFileSets(prevFileSets => prevFileSets.filter(set => set.id !== id));
    };

    const addMoredFileInput = () => {
        setFileSetd(prevFileSets => [...prevFileSets, { id: Date.now(), files: [] }]);
    };

    const handleDeletedFileSet = (id: number) => {
        setFileSetd(prevFileSets => prevFileSets.filter(set => set.id !== id));
    };

    const [isProfileImage, setIsProfileImage] = useState(0);

    const handleFileChanged = (
        event: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        if (event.target.files && event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files);
            setFileSetd((prevFiles) =>
                prevFiles.map((fileSet, i) =>
                    i === index ? { ...fileSet, files: filesArray } : fileSet
                )
            );
        }
    };

    const [setpathId] = useState<number>(0);
    const [imgName, setImgName] = useState<number>(0);
    const [setCustomerId] = useState<number>(0);
    const [documentId, setdocumentId] = useState<number>(0);
    const hasEmptyCaseDetails = caseDetails.some(item => item.caseDetails.trim() === '');
    const pathId = selectedRecordType;

    const handleSubmit = async (pathId: number,
        imgName: string,
    ) => {
        try {
            if (!loginDetails.id || loginDetails.id === 0) {
                console.error('Ivalid User')
                return
            }
            resetAllErrors();
            let hasError = false;
            const trimmedName = DetailsData.name.trim();
            if (trimmedName === '') {
                setNameError(true);
                if (nameRef.current) {
                    nameRef.current.focus();
                }
                hasError = true;
            }
            if (hasError) {
                return
            }
            const DetailsDTOList = {
                createDetailsRequest: {
                    recordTypeId: selectedRecordType,
                    regulatorListId: regulatorListId,
                    regulatorId: regulatorId,
                    display: DetailsData.display,
                    sourceLink: DetailsData.sourceLink,
                    name: trimmedName,
                    registrationNum: DetailsData.registrationNum,
                    genderId: DetailsData.genderId,
                    deadId: DetailsData.deadId,
                    uid: loginDetails.id
                },
                detailsCombineDTO: [{
                    addressDTOS: Address.map(address => ({ ...address, recordTypeId: selectedRecordType, cmsId: address.cmsId, uid: loginDetails.id })),
                    dateOfBirthDTOS: PartyformData.map(dateOfBirth => ({ ...dateOfBirth, recordTypeId: selectedRecordType, cmsId: dateOfBirth.cmsId, uid: loginDetails.id })),
                    aliasesDTOS: AliasesData.map(alias => ({ ...alias, recordTypeId: selectedRecordType, cmsId: alias.cmsId, uid: loginDetails.id }))
                }],
                createCountryRegistrationRequest: FamilyformData.map(data => ({
                    countryId: data.countryId,
                    recordTypeId: selectedRecordType,
                    cmsId: data.cmsId,
                    countryHqId: data.countryHqId,
                    identificationNumberId: data.identificationNumberId,
                    identificationNum: data.identificationNum,
                    identificationDetails: data.identificationDetails,
                    contactId: data.contactId,
                    contactName: data.contactName,
                    uid: loginDetails.id
                })),
                createCaseDetailsRequest: [{
                    recordTypeId: selectedRecordType,
                    cmsId: caseDetails[0].cmsId,
                    caseDetails: caseDetails[0].caseDetails,
                    uid: loginDetails.id
                }],
                createBankDetailsRequests: BankformData.map(data => ({
                    recordTypeId: selectedRecordType,
                    cmsId: data.cmsId,
                    bankId: data.bankId,
                    name: data.name,
                    acc_no: data.acc_no,
                    uid: loginDetails.id
                })),
                createIndPositionsRequests: PositionsData.map(positions => ({
                    recordTypeId: selectedRecordType,
                    cmsId: positions.cmsId,
                    position: positions.position,
                    uid: loginDetails.id
                })),
                createIndCaseDetailsRequests: caseData.map(data => ({
                    recordTypeId: selectedRecordType,
                    cmsId: data.cmsId,
                    caseDetails: data.caseDetails,
                    uid: loginDetails.id
                })),
                createOrganizationDetailsRequests: organization.map(data => ({
                    recordTypeId: selectedRecordType,
                    cmsId: data.cmsId,
                    organizationDetails: data.organizationDetails,
                    uid: loginDetails.id
                })),
                indOrgCommonDTO: indOrgformData.indOrgCommonDTO.map(item => ({
                    positionsDTO: {
                        cmsId: item.positionsDTO.cmsId,
                        recordTypeId: selectedRecordType,
                        position: item.positionsDTO.position,
                        linIndName: item.positionsDTO.linIndName,
                        uid: loginDetails.id
                    },
                    indAliasesNameDTOS: item.indAliasesNameDTOS.map(alias => ({
                        cmsId: alias.cmsId,
                        recordTypeId: selectedRecordType,
                        positionId: alias.positionId,
                        linIndAliasesName: alias.linIndAliasesName,
                        uid: loginDetails.id
                    })),
                    relationDTOS: item.relationDTOS.map(relation => ({
                        cmsId: relation.cmsId,
                        recordTypeId: selectedRecordType,
                        positionId: relation.positionId,
                        relativeMasterId: relation.relativeMasterId,
                        relationship: relation.relationship,
                        uid: loginDetails.id
                    })),
                    identificationDTOS: item.identificationDTOS.map(company => ({
                        cmsId: company.cmsId,
                        recordTypeId: selectedRecordType,
                        identificationNumId: company.identificationNumId,
                        identification: company.identification,
                        positionId: company.positionId,
                        relativeMasterId:company.relativeMasterId,
                        uid: loginDetails.id
                    })),
                    relationAliasesDTOS: item.relationAliasesDTOS.map(relationAlias => ({
                        cmsId: relationAlias.cmsId,
                        recordTypeId: selectedRecordType,
                        positionId: relationAlias.positionId,
                        relationAliasesName: relationAlias.relationAliasesName,
                        uid: loginDetails.id
                    })),
                    detailsAboutRelationDTOS: item.detailsAboutRelationDTOS.map(details => ({
                        cmsId: details.cmsId,
                        recordTypeId: selectedRecordType,
                        positionId: details.positionId,
                        detailsAboutRelation: details.detailsAboutRelation,
                        uid: loginDetails.id
                    })),
                })),
                companyCombineDTO: companyformData.companyCombineDTO.map(item => ({
                    companyDetailsDTOS: {
                        cmsId: item.companyDetailsDTOS.cmsId,
                        recordTypeId: selectedRecordType,
                        identificationNumberId: item.companyDetailsDTOS.identificationNumberId,
                        stateId: item.companyDetailsDTOS.stateId,
                        role: item.companyDetailsDTOS.role,
                        companyName: item.companyDetailsDTOS.companyName,
                        address: item.companyDetailsDTOS.address,
                        idDetails: item.companyDetailsDTOS.idDetails,
                        uid: loginDetails.id
                    },
                    companyAliasesDTOS: item.companyAliasesDTOS.map(companyAliases => ({
                        cmsId: companyAliases.cmsId,
                        recordTypeId: selectedRecordType,
                        companyId: companyAliases.companyId,
                        aliasesName: companyAliases.aliasesName,
                        uid: loginDetails.id
                    })),
                })),
            };
            const addressApiService = new AddressApiService();
            const allPdfFiles = fileSets.flatMap(set => set.files);
            const allImageFiles = fileSetd.flatMap(set => set.files);
            const filesWithIsProfileImage = [
                ...allImageFiles.map((file, index) => ({
                    file,
                    isProfileImage: index === 0 ? 1 : 0
                })),
                ...allPdfFiles.map(file => ({ file, isProfileImage: 0 }))
            ];
            console.log("Files with isProfileImage flag:", filesWithIsProfileImage);
            console.log("DetailsDTOList:", DetailsDTOList);
            const response = await addressApiService.saveCustomerRequest(
                DetailsDTOList,
                filesWithIsProfileImage.map(f => f.file),
                pathId,
                filesWithIsProfileImage.find(f => f.isProfileImage === 1)?.file?.name || "",
                filesWithIsProfileImage.some(f => f.isProfileImage === 1) ? 1 : 0
            );
            console.log("API Response:", response);
            navigate(`/Details/:taskId`);
            setSubmissionSuccess(true);
            window.location.reload();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

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

    const handleorganizationDetailsChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { organizationDetails: string; value: unknown }> | SelectChangeEvent<string>,
        index: number
    ) => {
        if ('target' in e && e.target) {
            const { value } = e.target as HTMLInputElement | HTMLTextAreaElement;
            const updatedDetails = [...organization];
            updatedDetails[index] = { ...updatedDetails[index], organizationDetails: value };
            setorganizationDetails(updatedDetails);
        }
    };

    const [isDropdownDisabled, setIsDropdownDisabled] = useState<boolean>(false);

    const handleRecordTypeChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        setSelectedRecordType(value);
        setIsDropdownDisabled(true);
    };

    const handleButtonClick = () => {
        setIsDropdownDisabled(false);
        window.location.reload();
    };

    // const handleRegulatorListChange = (event: SelectChangeEvent<string>) => {
    //     setRegulatorListId(event.target.value as string);
    // };
    const handleRegulatorListChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as string;
        setRegulatorListId(selectedValue);

        // Check condition for navigation
        // if (regulatorId === "1" && ["11", "12", "13", "14", "15", "16"].includes(selectedValue)) {
        //     navigate("/EntityComponent"); // Redirect to EntityForm page
        // }
    };

    const handleRegulatorChange = async (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        setRegulatorId(selectedId);
        if (selectedId) {
            try {
                const response = await searchService.getRegulatorIdList(Number(selectedId));
                setRegulatorlist(response);
            } catch (error) {
                console.error("Error fetching regulator list:", error);
            }
        } else {
            setRegulatorlist([]);
        }
    };

    const handlecountrys = (personIndex: number, value: any) => {
        const updatedPeople = JSON.parse(JSON.stringify(FamilyformData));
        updatedPeople[personIndex].countryId = value;
        setFamilyFormData(updatedPeople);
    };

    // const handlerelativeChanges = (personIndex: number, value: any) => {
    //     const updatedPeople = JSON.parse(JSON.stringify(indOrgformData));
    //     if (updatedPeople.indOrgCommonDTO && updatedPeople.indOrgCommonDTO[personIndex]) {
    //         updatedPeople.indOrgCommonDTO[personIndex].relationDTOS[0].relativeMasterId = value;
    //         setindOrgFormData(updatedPeople);
    //     } else {
    //         console.error('Invalid personIndex or data structure not as expected');
    //     }
    // };
    const handlerelativeChanges = (personIndex: number, value: number) => {
        const updatedPeople = JSON.parse(JSON.stringify(indOrgformData));
    
        if (updatedPeople.indOrgCommonDTO && updatedPeople.indOrgCommonDTO[personIndex]) {
            // Update relativeMasterId in relationDTOS
            if (updatedPeople.indOrgCommonDTO[personIndex].relationDTOS.length > 0) {
                updatedPeople.indOrgCommonDTO[personIndex].relationDTOS[0].relativeMasterId = value;
            }
    
            // Update relativeMasterId in identificationDTOS
            if (updatedPeople.indOrgCommonDTO[personIndex].identificationDTOS.length > 0) {
                updatedPeople.indOrgCommonDTO[personIndex].identificationDTOS[0].relativeMasterId = value;
            }
    
            setindOrgFormData(updatedPeople);
    
            // Debugging Console Logs
            console.log("Updated relativeMasterId in relationDTOS:", updatedPeople.indOrgCommonDTO[personIndex].relationDTOS[0].relativeMasterId);
            console.log("Updated relativeMasterId in identificationDTOS:", updatedPeople.indOrgCommonDTO[personIndex].identificationDTOS[0].relativeMasterId);
        } else {
            console.error("Invalid personIndex or data structure not as expected");
        }
    };
    

    const renderEntityFields = () => {
        return (
            <>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="outlined-multiline-static"
                            label="Source Link"
                            variant="standard"
                            type="text"
                            fullWidth
                            size="small"
                            name="sourceLink"
                            multiline
                            value={DetailsData.sourceLink}
                            onChange={(e) => handleChange(e, 0)}
                        />
                    </Grid>
                </Grid>
                <Box m={2} p={2} sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: "#f9f9f9" }}>
                    <Grid container spacing={2}>
                        {/* Profile Upload Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" mb={1}>UPLOAD PROFILE</Typography>
                                {fileSetd.map((fileSet, index) => (
                                    <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-image-${fileSet.id}`}
                                                onChange={(e) => handleFileChanged(e, index)}
                                            />
                                            <label htmlFor={`upload-image-${fileSet.id}`}>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    sx={{
                                                        backgroundColor: "#1976D2",
                                                        color: "#fff",
                                                        width: "100%"
                                                    }}>
                                                    Upload Profile
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item xs={10} sm={7}>
                                            <TextField
                                                label="Image Attachment"
                                                type="text"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                disabled
                                            />
                                        </Grid>
                                        {fileSet.files.length > 0 && (
                                            <Grid item xs={2} sm={1}>
                                                <FontAwesomeIcon
                                                    icon={faTimesCircle}
                                                    onClick={() => handleCancelImage(index)}
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "#fa2104",
                                                        fontSize: "18px",
                                                        background: "#fff",
                                                        padding: "5px",
                                                    }}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                ))}
                            </Box>
                        </Grid>
                        {/* Document Upload Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" mb={1}>UPLOAD DOCUMENT</Typography>
                                {fileSets.map((fileSet, index) => (
                                    <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-document-${fileSet.id}`}
                                                onChange={(e) => handleFileChange(e, index)}
                                                multiple
                                            />
                                            <label htmlFor={`upload-document-${fileSet.id}`}>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    sx={{
                                                        backgroundColor: "#1976D2",
                                                        color: "#fff",
                                                        width: "100%"
                                                    }}>
                                                    Upload Document
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item xs={10} sm={7} mt={2}>
                                            <TextField
                                                label="Document Attachment"
                                                type="text"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                value={fileSet.files.map(file => file.name).join(", ")}
                                                disabled={!fileSet.files.length}
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={1}>
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDeleteFileSet(fileSet.id)}
                                                style={{
                                                    cursor: "pointer",
                                                    color: "#fa2104",
                                                    fontSize: "18px",
                                                    background: "#fff",
                                                    padding: "5px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                                <div></div>
                                {/* Add More Button */}
                                <Grid item xs={4} mt={2}>
                                    <Button
                                        variant="contained"
                                        onClick={addMoreFileInput}
                                        sx={{
                                            backgroundColor: "#1976D2",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            width: "100%"
                                        }}
                                    >
                                        + Add Another Document
                                    </Button>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="person-container">
                                <div className="field-group-column">
                                    <TextField
                                        id="Name"
                                        label="Name"
                                        variant="standard"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        name="name"
                                        value={DetailsData.name}
                                        onChange={(e) => handleChange(e, 0)}
                                        error={nameError}
                                        helperText={nameError ? 'Name is required' : ''}
                                        inputRef={nameRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="scroll-box">
                                {AliasesData.map((Aliases, index) => (
                                    <div key={index} className="person-container">
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Aliases Name"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                autoComplete="off"
                                                value={Aliases.aliasesName}
                                                onChange={(e) => {
                                                    handleAliasesNameChange(e.target.value, index);
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="delete-icon"
                                                onClick={() => handleRemoveBoxAliasesName(index)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddAliasesNameField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="scroll-box">
                                {Address.map((address, index) => (
                                    <div key={index} className="person-container">
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Address"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                multiline
                                                autoComplete="off"
                                                value={address.address}
                                                onChange={(e) => {
                                                    handleAddressChange(e.target.value, index);
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="delete-icon"
                                                onClick={() => handleRemoveBoxAddress(index)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddPAddressField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="scroll-box">
                                {caseData.map((Case, index) => (
                                    <div key={index} className="person-container">
                                        {caseData.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemovecaseAddress(index)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Unique Number"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                multiline
                                                autoComplete="off"
                                                value={Case.caseDetails}
                                                onChange={(e) => {
                                                    handlecasaeChange(e.target.value, index);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddcaseField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Unique Number
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <h5>COUNTRY DETAILS</h5>
                    <div>
                        <div className="scrollablebox">
                            {FamilyformData.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {FamilyformData.length > 1 && (
                                        <div className="close-button" onClick={() => handleRemoveBoxFamilydetails(personIndex)}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </div>
                                    )}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <div className="field-group">
                                                <div>
                                                    <div className="field-group-row">
                                                        <div className="scrollable-box">
                                                            <div className="field-group-column">
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="country-label">Country</InputLabel>
                                                                    <Select
                                                                        labelId="country-label"
                                                                        id='Country'
                                                                        value={person.countryId || ""}
                                                                        onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Country</MenuItem>
                                                                        {Array.isArray(Country) &&
                                                                            Country.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="Country-of-head-quarters-label">Country of Head Quarters</InputLabel>
                                                                    <Select
                                                                        labelId="Country-of-head-quarters-label"
                                                                        id='Country of Head Quarters'
                                                                        value={person.countryHqId || ""}
                                                                        onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Country Head Quarters</MenuItem>
                                                                        {Array.isArray(CountryHqData) &&
                                                                            CountryHqData.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="National-identification-label">National Identification</InputLabel>
                                                                    <Select
                                                                        labelId="National-identification-label"
                                                                        id='National Identification'
                                                                        value={person.identificationNumberId || ""}
                                                                        onChange={(e) => handlerelative(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select National Identification</MenuItem>
                                                                        {Array.isArray(Idnumber) &&
                                                                            Idnumber.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <TextField
                                                                    style={{ width: '50%' }}
                                                                    // label="National Identification Number"
                                                                    label="Identification Number"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.identificationNum}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputChangfatherpan(personIndex, event)
                                                                    }
                                                                />
                                                                <TextField
                                                                    style={{ width: '50%' }}
                                                                    // label="National Identification Details"
                                                                    label="Identification Details"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.identificationDetails}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputChageidentificationDetails(personIndex, event)
                                                                    }
                                                                />
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="contact-label">Contact</InputLabel>
                                                                    <Select
                                                                        labelId="contact-label"
                                                                        id="Contact"
                                                                        value={person.contactId || ""}
                                                                        onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Contact</MenuItem>
                                                                        {contactDetails.map((contact) => (
                                                                            <MenuItem key={contact.id} value={contact.id}>
                                                                                {contact.name}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <TextField
                                                                    style={{ width: '50%' }}
                                                                    label="Contact Details"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.contactName}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputContactDetails(personIndex, event)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid>
                                        <br></br>
                                    </Grid>
                                </div>
                            ))}
                            <div className="button-container">
                                <Button
                                    className="add-people"
                                    variant="contained"
                                    startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setFamilyFormData([...FamilyformData, {
                                        countryId: 0,
                                        recordTypeId: 0,
                                        cmsId: 0,
                                        countryHqId: 0,
                                        identificationNumberId: 0,
                                        identificationNum: '',
                                        identificationDetails: '',
                                        contactId: 0,
                                        contactName: ''
                                    }])}>
                                    Add country details
                                </Button>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>ORGANIZATION</h5>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="key">
                                    <div className="person-container">
                                        <div className="field-group-column">
                                            <TextField
                                                id="organization "
                                                label="Organization "
                                                variant="standard"
                                                type="text"
                                                multiline
                                                fullWidth
                                                size="small"
                                                name="organizations"
                                                value={organization[0].organizationDetails}
                                                onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                            // error={caseError}
                                            // helperText={caseError ? 'organization  is required' : ''}
                                            // inputRef={nameRef}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Card>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>BANK DETAILS INVOLVED CASE</h5>
                        <div >
                            <div className="scrollablebox">
                                {BankformData.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {BankformData.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxbankdetails(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className="field-group">
                                                    <div >
                                                        <div className="field-group-row">
                                                            <div className="scrollable-box">
                                                                <div className="field-group-column">
                                                                    <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                        <InputLabel id="bank-name-label">Bank Name</InputLabel>
                                                                        <Select
                                                                            labelId="bank-name-label"
                                                                            id='Bank Name'
                                                                            value={person.bankId || ""}
                                                                            onChange={(e) => handlebank(personIndex, e.target.value as number)}
                                                                        >
                                                                            <MenuItem value={''} style={{ color: "gray" }}>Select Bank Name</MenuItem>
                                                                            {Array.isArray(bank) &&
                                                                                bank.map((lists: any) => (
                                                                                    <MenuItem key={lists.id} value={lists.id}>
                                                                                        {lists.bankName}
                                                                                    </MenuItem>
                                                                                ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="Account Number"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.acc_no}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChangbank(personIndex, event)
                                                                        }
                                                                    />
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="Name"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.name}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChagebankDetails(personIndex, event)
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <br></br>
                                        </Grid>
                                    </div>
                                ))}
                                <div className="button-container">
                                    <Button
                                        className="add-people"
                                        variant="contained"
                                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={() =>
                                            setBankFormData(prevFormData => [
                                                ...prevFormData,
                                                {
                                                    bankId: 0,
                                                    recordTypeId: 0,
                                                    cmsId: 0,
                                                    acc_no: '',
                                                    name: '',
                                                    uid: 0,
                                                }
                                            ])
                                        }
                                    >
                                        Add Bank Details
                                    </Button>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>LINKED INDIVIDUAL DETAILS</h5>
                        <div >
                            <div className="scrollablebox">
                                {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {indOrgformData.indOrgCommonDTO.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxSpouseFamily(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                            <TextField style={{ width: '100%' }}
                                                label="Linked Individual Name"
                                                variant="standard"
                                                type="text"
                                                name="linIndName"
                                                autoComplete="off"
                                                value={person.positionsDTO.linIndName}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                }
                                            />
                                            {selectedRecordType === '2' && (
                                                <TextField
                                                    style={{ width: '50%' }}
                                                    label="Position"
                                                    variant="standard"
                                                    type="text"
                                                    name="Position"
                                                    autoComplete="off"
                                                    value={person.positionsDTO.position}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                    }
                                                />
                                            )}
                                        </div>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <div className="field-group">
                                                    <div className="field-group-container">
                                                        <div className="field-group-row">
                                                            <div className="scrollable-box">
                                                                {person.indAliasesNameDTOS.map((huf, hufIndex) => (
                                                                    <div key={hufIndex} className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Linked Individual Name Aliases"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={huf.linIndAliasesName}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangeSpouseHuf(personIndex, 'linIndAliasesName', hufIndex, event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <div className="field-group">
                                                    <div className="field-group-row">
                                                        <div className="scrollable-box">
                                                            <div className="field-group-column">
                                                                <FormControl fullWidth variant="standard" size="small">
                                                                    <InputLabel id="relative-list-label">Relative List</InputLabel>
                                                                    <Select
                                                                        labelId="relative-list-label"
                                                                        id="Relative List"
                                                                        value={
                                                                            person && person.relationDTOS && person.identificationDTOS &&
                                                                                Array.isArray(person.relationDTOS) && person.relationDTOS.length > 0 &&
                                                                                Array.isArray(person.identificationDTOS) && person.identificationDTOS.length > 0
                                                                                ? person.relationDTOS[0].relativeMasterId !== 0 ? person.relationDTOS[0].relativeMasterId : person.identificationDTOS[0].relativeMasterId
                                                                                : ''
                                                                        }
                                                                        onChange={(e) => handlerelativeChanges(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: 'gray' }}>Select Relative List</MenuItem>
                                                                        {Array.isArray(relative) && relative.map((lists) => (
                                                                            <MenuItem key={lists.id} value={lists.id}>
                                                                                {lists.name}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormControl fullWidth variant="standard" size="small">
                                                                    <InputLabel id="National-identification-label">National Identification</InputLabel>
                                                                    <Select
                                                                        labelId="National-identification-label"
                                                                        id='National Identification'
                                                                        value={person.identificationDTOS[0]?.identificationNumId || ""}
                                                                        onChange={(e) => handlerelativecompany(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select National Identification</MenuItem>
                                                                        {Array.isArray(Idnumber) &&
                                                                            Idnumber.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>

                                                                <TextField
                                                                    style={{ width: '100%' }}
                                                                    label="Identification Number"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.identificationDTOS[0]?.identification || ""}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputChangcompany(personIndex, event)
                                                                    }
                                                                />

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            {<Grid item xs={2}>
                                                <div className="field-group">
                                                    <div className="field-group-row">
                                                        <div className="field-group-container">
                                                            <div className="scrollable-box">
                                                                {person.relationAliasesDTOS.map((RelationnName, RelationnNameIndex) => (
                                                                    <div key={RelationnNameIndex} className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Relationship Name"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={RelationnName.relationAliasesName}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangsrelationIndex(personIndex, 'relationAliasesName', RelationnNameIndex, event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousefather(personIndex, 'relationAliasesName', RelationnNameIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'RelationnName')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Relationship Name
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>}
                                            <Grid item xs={3}>
                                                <div className="field-group">
                                                    <div className="field-group-row">
                                                        <div className="field-group-container">
                                                            <div className="scrollable-box">
                                                                {person.detailsAboutRelationDTOS.map((casedetails, casedetailsIndex) => (
                                                                    <div key={casedetailsIndex} className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Details about the Relation "
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={casedetails.detailsAboutRelation}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangspousemotherpan(personIndex, 'detailsAboutRelation', casedetailsIndex, event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousemother(personIndex, 'detailsAboutRelation', casedetailsIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'casedetails')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Details about the Relation
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <br></br>
                                        </Grid>
                                    </div>
                                ))}
                                <div className="button-container">
                                    <Button
                                        className="add-people"
                                        variant="contained"
                                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={() =>
                                            setindOrgFormData({
                                                indOrgCommonDTO: [
                                                    ...indOrgformData.indOrgCommonDTO,
                                                    {
                                                        positionsDTO: {
                                                            cmsId: 0,
                                                            recordTypeId: 0,
                                                            position: '',
                                                            linIndName: '',
                                                        },
                                                        indAliasesNameDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                linIndAliasesName: '',
                                                            },
                                                        ],
                                                        relationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relationship: '',
                                                                relativeMasterId: 0,
                                                            },
                                                        ],
                                                        identificationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relativeMasterId:0,
                                                                identificationNumId: 0,
                                                                identification: '',
                                                            },
                                                        ],
                                                        relationAliasesDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relationAliasesName: '',
                                                            },
                                                        ],
                                                        detailsAboutRelationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                detailsAboutRelation: '',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            })
                                        }
                                    >
                                        Add Linked Individual Details
                                    </Button>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="key">
                            <div className="person-container">
                                <div className="field-group-column">
                                    <TextField
                                        id="Case Details"
                                        label="Case Details"
                                        variant="standard"
                                        type="text"
                                        multiline
                                        fullWidth
                                        size="small"
                                        name="caseDetails"
                                        value={caseDetails[0].caseDetails}
                                        onChange={(e) => handleCaseDetailsChange(e, 0)}
                                    // error={caseError}
                                    // helperText={caseError ? 'Case Details is required' : ''}
                                    // inputRef={nameRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </>
        );
    };

    const renderIndividualFields = () => {
        {
            return (
                <>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="outlined-multiline-static"
                                label="Source Link"
                                variant="standard"
                                type="text"
                                fullWidth
                                size="small"
                                name="sourceLink"
                                multiline
                                value={DetailsData.sourceLink}
                                onChange={(e) => handleChange(e, 0)}
                            />
                        </Grid>
                    </Grid>
                    <Box m={2} p={2} sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: "#f9f9f9" }}>
                        <Grid container spacing={2}>
                            {/* Profile Upload Section */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                    <Typography variant="h6" mb={1}>UPLOAD PROFILE</Typography>
                                    {fileSetd.map((fileSet, index) => (
                                        <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                            <Grid item xs={12} sm={4}>
                                                <input
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    style={{ display: "none" }}
                                                    id={`upload-image-${fileSet.id}`}
                                                    onChange={(e) => handleFileChanged(e, index)}
                                                />
                                                <label htmlFor={`upload-image-${fileSet.id}`}>
                                                    <Button
                                                        variant="contained"
                                                        component="span"
                                                        sx={{
                                                            backgroundColor: "#1976D2",
                                                            color: "#fff",
                                                            width: "100%"
                                                        }}>
                                                        Upload Profile
                                                    </Button>
                                                </label>
                                            </Grid>
                                            <Grid item xs={10} sm={7}>
                                                <TextField
                                                    label="Image Attachment"
                                                    type="text"
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                    disabled
                                                />
                                            </Grid>
                                            {fileSet.files.length > 0 && (
                                                <Grid item xs={2} sm={1}>
                                                    <FontAwesomeIcon
                                                        icon={faTimesCircle}
                                                        onClick={() => handleCancelImage(index)}
                                                        style={{
                                                            cursor: "pointer",
                                                            color: "#fa2104",
                                                            fontSize: "18px",
                                                            background: "#fff",
                                                            padding: "5px",
                                                        }}
                                                    />
                                                </Grid>
                                            )}
                                        </Grid>
                                    ))}
                                </Box>
                            </Grid>

                            {/* Document Upload Section */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                    <Typography variant="h6" mb={1}>UPLOAD DOCUMENT</Typography>
                                    {fileSets.map((fileSet, index) => (
                                        <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                            <Grid item xs={12} sm={4}>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                    style={{ display: "none" }}
                                                    id={`upload-document-${fileSet.id}`}
                                                    onChange={(e) => handleFileChange(e, index)}
                                                    multiple
                                                />
                                                <label htmlFor={`upload-document-${fileSet.id}`}>
                                                    <Button
                                                        variant="contained"
                                                        component="span"
                                                        sx={{
                                                            backgroundColor: "#1976D2",
                                                            color: "#fff",
                                                            width: "100%"
                                                        }}>
                                                        Upload Document
                                                    </Button>
                                                </label>
                                            </Grid>
                                            <Grid item xs={10} sm={7} mt={2}>
                                                <TextField
                                                    label="Document Attachment"
                                                    type="text"
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    value={fileSet.files.map(file => file.name).join(", ")}
                                                    disabled={!fileSet.files.length}
                                                />
                                            </Grid>
                                            <Grid item xs={2} sm={1}>
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    onClick={() => handleDeleteFileSet(fileSet.id)}
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "#fa2104",
                                                        fontSize: "18px",
                                                        background: "#fff",
                                                        padding: "5px",
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    ))}

                                    {/* Add More Button */}
                                    <Grid item xs={4} mt={2}>
                                        <Button
                                            variant="contained"
                                            onClick={addMoreFileInput}
                                            sx={{
                                                backgroundColor: "#1976D2",
                                                color: "#fff",
                                                fontWeight: "bold",
                                                textTransform: "none",
                                                width: "100%"
                                            }}
                                        >
                                            + Add Another Document
                                        </Button>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                id="Name"
                                label="Name"
                                variant="standard"
                                type="text"
                                fullWidth
                                size="small"
                                name="name"
                                value={DetailsData.name}
                                onChange={(e) => handleChange(e, 0)}
                                error={nameError}
                                helperText={nameError ? 'Name is required' : ''}
                                inputRef={nameRef}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <div className="key">
                                <div className="scroll-box">
                                    {AliasesData.map((Aliases, index) => (
                                        <div key={index} className="person-container">
                                            {AliasesData.length > 1 && (
                                                <div className="close-button" onClick={() => handleRemoveBoxAliasesName(index)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </div>
                                            )}
                                            <div className="field-group-column">
                                                <TextField
                                                    style={{ width: '100%' }}
                                                    label="Aliases Name"
                                                    variant="standard"
                                                    type="text"
                                                    size="small"
                                                    autoComplete="off"
                                                    value={Aliases.aliasesName}
                                                    onChange={(e) => {
                                                        handleAliasesNameChange(e.target.value, index);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="field-group">
                                    <div className="field-group-container">
                                        <div className="field-group-row">
                                            <div className="field label">
                                                <div className="add-button" onClick={handleAddAliasesNameField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className="key">
                                <div className="person-container">
                                    <div className="field-group-column">
                                        <FormControl fullWidth variant="standard" size="small">
                                            <InputLabel id="gender-label">Gender</InputLabel>
                                            <Select
                                                labelId="gender-label"
                                                id='Gender'
                                                value={DetailsData.genderId ? DetailsData.genderId.toString() : ""}
                                                onChange={(event: SelectChangeEvent<string>) => {
                                                    handlegender(event);
                                                }}
                                            >
                                                <MenuItem value={''} style={{ color: "gray" }}>Select Gender</MenuItem>
                                                {gender.map((item) => (
                                                    <MenuItem key={item.id} value={item.id.toString()}>
                                                        {item.gender}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <div className="key">
                                <div className="scroll-box">
                                    {PartyformData.map((partyformData, index) => (
                                        <div key={index} className="person-container">
                                            {PartyformData.length > 1 && (
                                                <div
                                                    className="close-button"
                                                    onClick={() => handleRemovePartyformData(index)}
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </div>
                                            )}
                                            <div className="scrollable-box">
                                                <div className="field-group-column">
                                                    <TextField
                                                        style={{ width: '100%' }}
                                                        id="dob"
                                                        name="dob"
                                                        type="date"
                                                        value={partyformData.dob}
                                                        onChange={(e) => handlePartyformDataChange(e.target.value, index)}
                                                        label="Date of Birth"
                                                        required
                                                        variant="standard"
                                                        size="small"
                                                    />
                                                    <TextField
                                                        style={{ width: '100%' }}
                                                        label="Birth Year Alone"
                                                        variant="standard"
                                                        type="text"
                                                        size="small"
                                                        autoComplete="off"
                                                        value={partyformData.birthYearAlone}
                                                        onChange={(e) => handlePartyformDatasChanges(e.target.value, index)}
                                                    />
                                                    <TextField
                                                        style={{ width: '100%' }}
                                                        label="Place of Birth"
                                                        variant="standard"
                                                        type="text"
                                                        size="small"
                                                        autoComplete="off"
                                                        value={partyformData.placeOfBirth}
                                                        onChange={(e) => handlePartyformData(e.target.value, index)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="field-group">
                                    <div className="field-group-container">
                                        <div className="field-group-row">
                                            <div className="field label">
                                                <div className="add-button" onClick={handleAddPartyformDataField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More dob & birthYearAlone & placeOfBirth
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className="key">
                                <div className="person-container">
                                    <div className="field-group-column">
                                        <FormControl fullWidth variant="standard" size="small">
                                            <InputLabel id="dead-label">Dead</InputLabel>
                                            <Select
                                                labelId="dead-label"
                                                id='Dead'
                                                value={DetailsData.deadId ? DetailsData.deadId.toString() : ""}
                                                onChange={(event: SelectChangeEvent<string>) => {
                                                    handledead(event);
                                                }}
                                            >
                                                <MenuItem value={''} style={{ color: "gray" }}>Select Dead Status</MenuItem>
                                                {Dead.map((item) => (
                                                    <MenuItem key={item.id} value={item.id.toString()}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <div className="key">
                                <div className="scroll-box">
                                    {Address.map((address, index) => (
                                        <div key={index} className="person-container">
                                            {Address.length > 1 && (
                                                <div className="close-button" onClick={() => handleRemoveBoxAddress(index)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </div>
                                            )}
                                            <div className="field-group-column">
                                                <TextField
                                                    style={{ width: '100%' }}
                                                    label="Address"
                                                    variant="standard"
                                                    type="text"
                                                    size="small"
                                                    multiline
                                                    autoComplete="off"
                                                    value={address.address}
                                                    onChange={(e) => {
                                                        handleAddressChange(e.target.value, index);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="field-group">
                                    <div className="field-group-container">
                                        <div className="field-group-row">
                                            <div className="field label">
                                                <div className="add-button" onClick={handleAddPAddressField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className="key">
                                <div className="scroll-box">
                                    {PositionsData.map((positions, index) => (
                                        <div key={index} className="person-container">
                                            {PositionsData.length > 1 && (
                                                <div className="close-button" onClick={() => handleRemovepositionAddress(index)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </div>
                                            )}
                                            <div className="field-group-column">
                                                <TextField
                                                    style={{ width: '100%' }}
                                                    label="Position"
                                                    variant="standard"
                                                    type="text"
                                                    size="small"
                                                    multiline
                                                    autoComplete="off"
                                                    value={positions.position}
                                                    onChange={(e) => {
                                                        handlepstiotionChange(e.target.value, index);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="field-group">
                                    <div className="field-group-container">
                                        <div className="field-group-row">
                                            <div className="field label">
                                                <div className="add-button" onClick={handleAddPsotionsField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Position
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className="key">
                                <div className="scroll-box">
                                    {caseData.map((Case, index) => (
                                        <div key={index} className="person-container">
                                            {caseData.length > 1 && (
                                                <div className="close-button" onClick={() => handleRemovecaseAddress(index)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </div>
                                            )}
                                            <div className="field-group-column">
                                                <TextField
                                                    style={{ width: '100%' }}
                                                    label="Unique Number"
                                                    variant="standard"
                                                    type="text"
                                                    size="small"
                                                    multiline
                                                    autoComplete="off"
                                                    value={Case.caseDetails}
                                                    onChange={(e) => {
                                                        handlecasaeChange(e.target.value, index);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="field-group">
                                    <div className="field-group-container">
                                        <div className="field-group-row">
                                            <div className="field label">
                                                <div className="add-button" onClick={handleAddcaseField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Unique Number
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    <br></br>
                    <Card style={{
                        padding: '1%',
                        width: '100%',
                    }}>
                        <div className="key">
                            <h5>COUNTRY DETAILS</h5>
                            <div >
                                <div className="scrollablebox">
                                    {FamilyformData.map((person, personIndex) => (
                                        <div key={personIndex} className="person-container">
                                            {FamilyformData.length > 1 && (
                                                <div className="close-button" onClick={() => handleRemoveBoxFamilydetails(personIndex)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </div>
                                            )}
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <div className="field-group">
                                                        <div >
                                                            <div className="field-group-row">
                                                                <div className="scrollable-box">
                                                                    <div className="field-group-column">
                                                                        <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                            <InputLabel id="country-label">Country</InputLabel>
                                                                            <Select
                                                                                labelId="country-label"
                                                                                id='Country'
                                                                                value={person.countryId || ""}
                                                                                onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                            >
                                                                                <MenuItem value={''} style={{ color: "gray" }}>Select Country</MenuItem>
                                                                                {Array.isArray(Country) &&
                                                                                    Country.map((lists: any) => (
                                                                                        <MenuItem key={lists.id} value={lists.id}>
                                                                                            {lists.name}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                            <InputLabel id="Country-of-head-quarters-label">Country of Head Quarters</InputLabel>
                                                                            <Select
                                                                                labelId="Country-of-head-quarters-label"
                                                                                id='Country of Head Quarters'
                                                                                value={person.countryHqId || ""}
                                                                                onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                            >
                                                                                <MenuItem value={''} style={{ color: "gray" }}>Select Country Head Quarters</MenuItem>
                                                                                {Array.isArray(CountryHqData) &&
                                                                                    CountryHqData.map((lists: any) => (
                                                                                        <MenuItem key={lists.id} value={lists.id}>
                                                                                            {lists.name}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                        <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                            <InputLabel id="National-identification-label">National Identification</InputLabel>
                                                                            <Select
                                                                                labelId="National-identification-label"
                                                                                id='National Identification'
                                                                                value={person.identificationNumberId || ""}
                                                                                onChange={(e) => handlerelative(personIndex, e.target.value as number)}
                                                                            >
                                                                                <MenuItem value={''} style={{ color: "gray" }}>Select National Identification</MenuItem>
                                                                                {Array.isArray(Idnumber) &&
                                                                                    Idnumber.map((lists: any) => (
                                                                                        <MenuItem key={lists.id} value={lists.id}>
                                                                                            {lists.name}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                        <TextField
                                                                            style={{ width: '50%' }}
                                                                            label="Identification Number"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={person.identificationNum}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangfatherpan(personIndex, event)
                                                                            }
                                                                        />
                                                                        <TextField
                                                                            style={{ width: '50%' }}
                                                                            label="Identification Details"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={person.identificationDetails}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChageidentificationDetails(personIndex, event)
                                                                            }
                                                                        />
                                                                        <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                            <InputLabel id="contact-label">Contact</InputLabel>
                                                                            <Select
                                                                                labelId="contact-label"
                                                                                id="Contact"
                                                                                value={person.contactId || ""}
                                                                                onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                            >
                                                                                <MenuItem value={''} style={{ color: "gray" }}>Select Contact</MenuItem>
                                                                                {contactDetails.map((contact) => (
                                                                                    <MenuItem key={contact.id} value={contact.id}>
                                                                                        {contact.name}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                        <TextField
                                                                            style={{ width: '50%' }}
                                                                            label="Contact Details"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={person.contactName}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputContactDetails(personIndex, event)
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <br></br>
                                            </Grid>
                                        </div>
                                    ))}
                                    <div className="button-container">
                                        <Button
                                            className="add-people"
                                            variant="contained"
                                            startIcon={<FontAwesomeIcon icon={faPlus} />}
                                            onClick={() =>
                                                setFamilyFormData(prevFormData => [
                                                    ...prevFormData,
                                                    {
                                                        countryId: 0,
                                                        recordTypeId: 0,
                                                        cmsId: 0,
                                                        countryHqId: 0,
                                                        identificationNumberId: 0,
                                                        identificationNum: '',
                                                        identificationDetails: '',
                                                        contactId: 0,
                                                        contactName: ''
                                                    }
                                                ])
                                            }
                                        >
                                            Add COUNTRY Details
                                        </Button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <br></br>
                    <Card style={{
                        padding: '1%',
                        width: '100%',
                    }}>
                        <div className="key">
                            <h5>ORGANIZATION</h5>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <div className="key">
                                        <div className="person-container">
                                            <div className="field-group-column">
                                                <TextField
                                                    id="organization "
                                                    label="Organization "
                                                    variant="standard"
                                                    type="text"
                                                    multiline
                                                    fullWidth
                                                    size="small"
                                                    name="organizations"
                                                    value={organization[0].organizationDetails}
                                                    onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                                // error={caseError}
                                                // helperText={caseError ? 'organization  is required' : ''}
                                                // inputRef={nameRef}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </Card>
                    <br></br>
                    <Card style={{
                        padding: '1%',
                        width: '100%',
                    }}>
                        <div className="key">
                            <h5>LINKED INDIVIDUAL DETAILS</h5>
                            <div >
                                <div className="scrollablebox">
                                    {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                        <div key={personIndex} className="person-container">
                                            {indOrgformData.indOrgCommonDTO.length > 1 && (
                                                <div className="close-button" onClick={() => handleRemoveBoxSpouseFamily(personIndex)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </div>
                                            )}
                                            <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                                <TextField style={{ width: '50%' }}
                                                    label="Linked Individual Name"
                                                    variant="standard"
                                                    type="text"
                                                    name="linIndName"
                                                    autoComplete="off"
                                                    value={person.positionsDTO.linIndName}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                    }
                                                />
                                                {selectedRecordType === '2' && (
                                                    <TextField
                                                        style={{ width: '50%' }}
                                                        label="Position"
                                                        variant="standard"
                                                        type="text"
                                                        name="Position"
                                                        autoComplete="off"
                                                        value={person.positionsDTO.position}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleInputChangepostion(personIndex, 'position', null, event)
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <Grid container spacing={2}>
                                                <Grid item xs={3}>
                                                    <div className="field-group">
                                                        <div className="field-group-container">
                                                            <div className="field-group-row">
                                                                <div className="scrollable-box">
                                                                    {person.indAliasesNameDTOS.map((huf, hufIndex) => (
                                                                        <div key={hufIndex} className="field-group-column">
                                                                            <TextField
                                                                                style={{ width: '100%' }}
                                                                                label="Linked Individual Name Aliases"
                                                                                variant="standard"
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={huf.linIndAliasesName}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangeSpouseHuf(personIndex, 'linIndAliasesName', hufIndex, event)
                                                                                }
                                                                            />
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    <div className="field label">
                                                                        <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <div className="field-group">
                                                        <div className="field-group-row">
                                                            <div className="scrollable-box">
                                                                <div className="field-group-column">
                                                                    <FormControl fullWidth variant="standard" size="small">
                                                                        <InputLabel id="relative-list-label">Relative List</InputLabel>
                                                                        <Select
                                                                            labelId="relative-list-label"
                                                                            id='Relative List'
                                                                            value={person && person.relationDTOS && Array.isArray(person.relationDTOS) && person.relationDTOS.length > 0 ? person.relationDTOS[0].relativeMasterId : ''}
                                                                            onChange={(e) => handlerelativeChanges(personIndex, e.target.value as number)}
                                                                        >
                                                                            <MenuItem value={''} style={{ color: "gray" }}>Select Relative List</MenuItem>
                                                                            {Array.isArray(relative) && relative.map((lists) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <div className="field-group">
                                                        <div className="field-group-row">
                                                            <div className="field-group-container">
                                                                <div className="scrollable-box">
                                                                    {person.relationAliasesDTOS.map((RelationnName, RelationnNameIndex) => (
                                                                        <div key={RelationnNameIndex} className="field-group-column">
                                                                            <TextField
                                                                                style={{ width: '100%' }}
                                                                                label="Relationship Name"
                                                                                variant="standard"
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={RelationnName.relationAliasesName}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangsrelationIndex(personIndex, 'relationAliasesName', RelationnNameIndex, event)
                                                                                }
                                                                            />
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteFieldspousefather(personIndex, 'relationAliasesName', RelationnNameIndex)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    <div className="field label">
                                                                        <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'RelationnName')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} />  Add More Relationship Name
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <div className="field-group">
                                                        <div className="field-group-row">
                                                            <div className="field-group-container">
                                                                <div className="scrollable-box">
                                                                    {person.detailsAboutRelationDTOS.map((casedetails, casedetailsIndex) => (
                                                                        <div key={casedetailsIndex} className="field-group-column">
                                                                            <TextField
                                                                                style={{ width: '100%' }}
                                                                                label="Details about the Relation "
                                                                                variant="standard"
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={casedetails.detailsAboutRelation}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleInputChangspousemotherpan(personIndex, 'detailsAboutRelation', casedetailsIndex, event)
                                                                                }
                                                                            />
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteFieldspousemother(personIndex, 'detailsAboutRelation', casedetailsIndex)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    <div className="field label">
                                                                        <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'casedetails')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Details about the Relation
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <br></br>
                                            </Grid>
                                        </div>
                                    ))}
                                    <div className="button-container">
                                        <Button
                                            className="add-people"
                                            variant="contained"
                                            startIcon={<FontAwesomeIcon icon={faPlus} />}
                                            onClick={() =>
                                                setindOrgFormData({
                                                    indOrgCommonDTO: [
                                                        ...indOrgformData.indOrgCommonDTO,
                                                        {
                                                            positionsDTO: {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                position: '',
                                                                linIndName: '',
                                                            },
                                                            indAliasesNameDTOS: [
                                                                {
                                                                    cmsId: 0,
                                                                    recordTypeId: 0,
                                                                    positionId: 0,
                                                                    linIndAliasesName: '',
                                                                },
                                                            ],
                                                            relationDTOS: [
                                                                {
                                                                    cmsId: 0,
                                                                    recordTypeId: 0,
                                                                    positionId: 0,
                                                                    relationship: '',
                                                                    relativeMasterId: 0,
                                                                },
                                                            ],
                                                            identificationDTOS: [
                                                                {
                                                                    cmsId: 0,
                                                                    recordTypeId: 0,
                                                                    positionId: 0,
                                                                    relativeMasterId:0,
                                                                    identificationNumId: 0,
                                                                    identification: '',
                                                                },
                                                            ],
                                                            relationAliasesDTOS: [
                                                                {
                                                                    cmsId: 0,
                                                                    recordTypeId: 0,
                                                                    positionId: 0,
                                                                    relationAliasesName: '',
                                                                },
                                                            ],
                                                            detailsAboutRelationDTOS: [
                                                                {
                                                                    cmsId: 0,
                                                                    recordTypeId: 0,
                                                                    positionId: 0,
                                                                    detailsAboutRelation: '',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                })
                                            }
                                        >
                                            Add Linked Individual Details
                                        </Button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <br></br>
                    <Card style={{
                        padding: '1%',
                        width: '100%',
                    }}>
                        <div className="key">
                            <h5>BANK DETAILS INVOLVED CASE</h5>
                            <div >
                                <div className="scrollablebox">
                                    {BankformData.map((person, personIndex) => (
                                        <div key={personIndex} className="person-container">
                                            {BankformData.length > 1 && (
                                                <div className="close-button" onClick={() => handleRemoveBoxbankdetails(personIndex)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </div>
                                            )}
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <div className="field-group">
                                                        <div >
                                                            <div className="field-group-row">
                                                                <div className="scrollable-box">
                                                                    <div className="field-group-column">
                                                                        <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                            <InputLabel id="bank-name-label">Bank Name</InputLabel>
                                                                            <Select
                                                                                labelId="bank-name-label"
                                                                                id='Bank Name'
                                                                                value={person.bankId || ""}
                                                                                onChange={(e) => handlebank(personIndex, e.target.value as number)}
                                                                            >
                                                                                <MenuItem value={''} style={{ color: "gray" }}>Select Bank Name</MenuItem>
                                                                                {Array.isArray(bank) &&
                                                                                    bank.map((lists: any) => (
                                                                                        <MenuItem key={lists.id} value={lists.id}>
                                                                                            {lists.bankName}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                        <TextField
                                                                            style={{ width: '50%' }}
                                                                            label="Account Number"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={person.acc_no}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangbank(personIndex, event)
                                                                            }
                                                                        />
                                                                        <TextField
                                                                            style={{ width: '50%' }}
                                                                            label="Name"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={person.name}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChagebankDetails(personIndex, event)
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <br></br>
                                            </Grid>
                                        </div>
                                    ))}
                                    <div className="button-container">
                                        <Button
                                            className="add-people"
                                            variant="contained"
                                            startIcon={<FontAwesomeIcon icon={faPlus} />}
                                            onClick={() =>
                                                setBankFormData(prevFormData => [
                                                    ...prevFormData,
                                                    {
                                                        bankId: 0,
                                                        recordTypeId: 0,
                                                        cmsId: 0,
                                                        acc_no: '',
                                                        name: '',
                                                        uid: 0,
                                                    }
                                                ])
                                            }
                                        >
                                            Add Bank Details
                                        </Button>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <br></br>
                    <Card style={{ padding: '1%', width: '100%' }}>
                        <div className="key">
                            <h5>COMPANY INVOLVED CASE</h5>
                            <div>
                                <div className="scrollablebox">
                                    {companyformData.companyCombineDTO.map((person, personIndex) => (
                                        <div key={personIndex} className="person-container">
                                            {companyformData.companyCombineDTO.length > 1 && (
                                                <div className="close-button" onClick={() => handleRemoveCompany(personIndex)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </div>
                                            )}
                                            <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                                <TextField
                                                    style={{ width: '100%' }}
                                                    label="Role"
                                                    variant="standard"
                                                    type="text"
                                                    name="role"
                                                    autoComplete="off"
                                                    value={person.companyDetailsDTOS.role}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleInputChange(personIndex, 'role', event)
                                                    }
                                                />
                                                <TextField
                                                    style={{ width: '100%' }}
                                                    label="Company Name"
                                                    variant="standard"
                                                    type="text"
                                                    name="companyName"
                                                    autoComplete="off"
                                                    value={person.companyDetailsDTOS.companyName}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleInputChange(personIndex, 'companyName', event)
                                                    }
                                                />
                                                <TextField
                                                    style={{ width: '50%' }}
                                                    label="Address"
                                                    variant="standard"
                                                    type="text"
                                                    autoComplete="off"
                                                    multiline
                                                    value={person.companyDetailsDTOS.address}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleInputChange(personIndex, 'address', event)
                                                    }
                                                />
                                                <FormControl style={{ width: '50%' }} variant="standard" size="small">
                                                    <InputLabel id="state-label">State</InputLabel>
                                                    <Select
                                                        labelId="state-label"
                                                        id='State'
                                                        value={person.companyDetailsDTOS.stateId || ""}
                                                        onChange={(e) => handlecompany(personIndex, e.target.value as number)}
                                                    >
                                                        <MenuItem value={''} style={{ color: "gray" }}>Select State</MenuItem>
                                                        {Array.isArray(state) &&
                                                            state.map((lists: any) => (
                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                    {lists.stateName}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                </FormControl>
                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                    <InputLabel id="identification-label">Identification</InputLabel>
                                                    <Select
                                                        labelId="identification-label"
                                                        id='Identification'
                                                        value={person.companyDetailsDTOS.identificationNumberId || ""}
                                                        onChange={(e) => handleidentificationNumberId(personIndex, e.target.value as string)}
                                                    >
                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Identification</MenuItem>
                                                        {Array.isArray(Idnumbers) &&
                                                            Idnumbers.map((lists: any) => (
                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                    {lists.name}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                </FormControl>
                                                <TextField
                                                    style={{ width: '50%' }}
                                                    label="Id Details"
                                                    variant="standard"
                                                    type="text"
                                                    autoComplete="off"
                                                    value={person.companyDetailsDTOS.idDetails}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleInputChageidDetailsDetails(personIndex, event.target.value, event)
                                                    }
                                                />
                                            </div>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <div className="field-group">
                                                        <div className="field-group-container">
                                                            <div className="field-group-row">
                                                                <div className="scrollable-box">
                                                                    {person.companyAliasesDTOS.map((alias, aliasIndex) => (
                                                                        <div key={aliasIndex} className="field-group-column">
                                                                            <TextField
                                                                                style={{ width: '100%' }}
                                                                                label="Company Aliases Name"
                                                                                variant="standard"
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={alias.aliasesName}
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                    handleAliasChange(personIndex, aliasIndex, 'aliasesName', event)
                                                                                }
                                                                            />
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteAlias(personIndex, aliasIndex)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                    <div className="field label">
                                                                        <div className="add-button" onClick={() => handleAddAlias(personIndex)}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Company Aliases Name
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    ))}
                                    <div className="button-container">
                                        <Button
                                            className="add-people"
                                            variant="contained"
                                            startIcon={<FontAwesomeIcon icon={faPlus} />}
                                            onClick={handleAddCompany}
                                        >
                                            Add Linked Company Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <br></br>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className="key">
                                <div className="person-container">
                                    <div className="field-group-column">
                                        <TextField
                                            id="Case Details"
                                            label="Case Details"
                                            variant="standard"
                                            type="text"
                                            multiline
                                            fullWidth
                                            size="small"
                                            name="caseDetails"
                                            value={caseDetails[0].caseDetails}
                                            onChange={(e) => handleCaseDetailsChange(e, 0)}
                                        // error={caseError}
                                        // helperText={caseError ? 'Case Details is required' : ''}
                                        // inputRef={nameRef}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </>
            );
        }
    };

    const renderShipFields = () => {
        return (
            <>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="outlined-multiline-static"
                            label="Source Link"
                            variant="standard"
                            type="text"
                            fullWidth
                            size="small"
                            name="sourceLink"
                            multiline
                            value={DetailsData.sourceLink}
                            onChange={(e) => handleChange(e, 0)}
                        />
                    </Grid>
                </Grid>
                <Box m={2} p={2} sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: "#f9f9f9" }}>
                    <Grid container spacing={2}>
                        {/* Profile Upload Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" mb={1}>UPLOAD PROFILE</Typography>
                                {fileSetd.map((fileSet, index) => (
                                    <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-image-${fileSet.id}`}
                                                onChange={(e) => handleFileChanged(e, index)}
                                            />
                                            <label htmlFor={`upload-image-${fileSet.id}`}>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    sx={{
                                                        backgroundColor: "#1976D2",
                                                        color: "#fff",
                                                        width: "100%"
                                                    }}>
                                                    Upload Profile
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item xs={10} sm={7}>
                                            <TextField
                                                label="Image Attachment"
                                                type="text"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                disabled
                                            />
                                        </Grid>
                                        {fileSet.files.length > 0 && (
                                            <Grid item xs={2} sm={1}>
                                                <FontAwesomeIcon
                                                    icon={faTimesCircle}
                                                    onClick={() => handleCancelImage(index)}
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "#fa2104",
                                                        fontSize: "18px",
                                                        background: "#fff",
                                                        padding: "5px",
                                                    }}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                ))}
                            </Box>
                        </Grid>
                        {/* Document Upload Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" mb={1}>UPLOAD DOCUMENT</Typography>
                                {fileSets.map((fileSet, index) => (
                                    <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-document-${fileSet.id}`}
                                                onChange={(e) => handleFileChange(e, index)}
                                                multiple
                                            />
                                            <label htmlFor={`upload-document-${fileSet.id}`}>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    sx={{
                                                        backgroundColor: "#1976D2",
                                                        color: "#fff",
                                                        width: "100%"
                                                    }}>
                                                    Upload Document
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item xs={10} sm={7} mt={2}>
                                            <TextField
                                                label="Document Attachment"
                                                type="text"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                value={fileSet.files.map(file => file.name).join(", ")}
                                                disabled={!fileSet.files.length}
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={1}>
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDeleteFileSet(fileSet.id)}
                                                style={{
                                                    cursor: "pointer",
                                                    color: "#fa2104",
                                                    fontSize: "18px",
                                                    background: "#fff",
                                                    padding: "5px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}

                                {/* Add More Button */}
                                <Grid item xs={4} mt={2}>
                                    <Button
                                        variant="contained"
                                        onClick={addMoreFileInput}
                                        sx={{
                                            backgroundColor: "#1976D2",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            width: "100%"
                                        }}
                                    >
                                        + Add Another Document
                                    </Button>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            id="Name"
                            label="Name"
                            variant="standard"
                            type="text"
                            fullWidth
                            size="small"
                            name="name"
                            value={DetailsData.name}
                            onChange={(e) => handleChange(e, 0)}
                            error={nameError}
                            helperText={nameError ? 'Name is required' : ''}
                            inputRef={nameRef}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <div className="key">
                            <div className="scroll-box">
                                {AliasesData.map((Aliases, index) => (
                                    <div key={index} className="person-container">
                                        {AliasesData.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxAliasesName(index)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Aliases Name"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                autoComplete="off"
                                                value={Aliases.aliasesName}
                                                onChange={(e) => {
                                                    handleAliasesNameChange(e.target.value, index);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddAliasesNameField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="outlined-multiline-static"
                            label="Registration Number"
                            variant="standard"
                            type="text"
                            fullWidth
                            size="small"
                            name="Registration Number"
                            multiline
                            value={DetailsData.registrationNum}
                            onChange={handleRegistrationNumChange}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={4}>
                    <div className="key">
                        <div className="scroll-box">
                            {Address.map((address, index) => (
                                <div key={index} className="person-container">
                                    {Address.length > 1 && (
                                        <div className="close-button" onClick={() => handleRemoveBoxAddress(index)}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </div>
                                    )}
                                    <div className="field-group-column">
                                        <TextField
                                            style={{ width: '100%' }}
                                            label="Address"
                                            variant="standard"
                                            type="text"
                                            multiline
                                            size="small"
                                            autoComplete="off"
                                            value={address.address}
                                            onChange={(e) => {
                                                handleAddressChange(e.target.value, index);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="field-group">
                            <div className="field-group-container">
                                <div className="field-group-row">
                                    <div className="field label">
                                        <div className="add-button" onClick={handleAddPAddressField}>
                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Grid>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>COUNTRY DETAILS</h5>
                        <div >
                            <div className="scrollablebox">
                                {FamilyformData.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {FamilyformData.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxFamilydetails(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className="field-group">
                                                    <div >
                                                        <div className="field-group-row">
                                                            <div className="scrollable-box">
                                                                <div className="field-group-column">
                                                                    <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                        <InputLabel id="country-label">Country</InputLabel>
                                                                        <Select
                                                                            labelId="country-label"
                                                                            id='Country'
                                                                            value={person.countryId || ""}
                                                                            onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                        >
                                                                            <MenuItem value={''} style={{ color: "gray" }}>Select Country</MenuItem>
                                                                            {Array.isArray(Country) &&
                                                                                Country.map((lists: any) => (
                                                                                    <MenuItem key={lists.id} value={lists.id}>
                                                                                        {lists.name}
                                                                                    </MenuItem>
                                                                                ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                        <InputLabel id="Country-of-head-quarters-label">Country of Head Quarters</InputLabel>
                                                                        <Select
                                                                            labelId="Country-of-head-quarters-label"
                                                                            id='Country of Head Quarters'
                                                                            value={person.countryHqId || ""}
                                                                            onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                        >
                                                                            <MenuItem value={''} style={{ color: "gray" }}>Select Country Head Quarters</MenuItem>
                                                                            {Array.isArray(CountryHqData) &&
                                                                                CountryHqData.map((lists: any) => (
                                                                                    <MenuItem key={lists.id} value={lists.id}>
                                                                                        {lists.name}
                                                                                    </MenuItem>
                                                                                ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="National Identification Number"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.identificationNum}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChangfatherpan(personIndex, event)
                                                                        }
                                                                    />
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="National Identification Details"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.identificationDetails}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChageidentificationDetails(personIndex, event)
                                                                        }
                                                                    />
                                                                    <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                        <InputLabel id="contact-label">Contact</InputLabel>
                                                                        <Select
                                                                            labelId="contact-label"
                                                                            id="Contact"
                                                                            value={person.contactId || ""}
                                                                            onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                        >
                                                                            <MenuItem value={''} style={{ color: "gray" }}>Select Contact</MenuItem>
                                                                            {contactDetails.map((contact) => (
                                                                                <MenuItem key={contact.id} value={contact.id}>
                                                                                    {contact.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="Contact Details"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.contactName}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputContactDetails(personIndex, event)
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <br></br>
                                        </Grid>
                                    </div>
                                ))}
                                <div className="button-container">
                                    <Button
                                        className="add-people"
                                        variant="contained"
                                        startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setFamilyFormData([...FamilyformData, {
                                            countryId: 0,
                                            recordTypeId: 0,
                                            cmsId: 0,
                                            countryHqId: 0,
                                            identificationNumberId: 0,
                                            identificationNum: '',
                                            identificationDetails: '',
                                            contactId: 0,
                                            contactName: ''
                                        }])}>
                                        Add COUNTRY Details
                                    </Button>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>ORGANIZATION</h5>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="key">
                                    <div className="person-container">
                                        <div className="field-group-column">
                                            <TextField
                                                id="organization "
                                                label="Organization "
                                                variant="standard"
                                                type="text"
                                                multiline
                                                fullWidth
                                                size="small"
                                                name="organizations"
                                                value={organization[0].organizationDetails}
                                                onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                            // error={caseError}
                                            // helperText={caseError ? 'organization  is required' : ''}
                                            // inputRef={nameRef}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Card>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>LINKED INDIVIDUAL DETAILS</h5>
                        <div >
                            <div className="scrollablebox">
                                {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {indOrgformData.indOrgCommonDTO.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxSpouseFamily(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                            <TextField style={{ width: '100%' }}
                                                label="Linked Individual Name"
                                                variant="standard"
                                                type="text"
                                                name="linIndName"
                                                autoComplete="off"
                                                value={person.positionsDTO.linIndName}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                }
                                            />
                                            {selectedRecordType === '2' && (
                                                <TextField
                                                    style={{ width: '20%' }}
                                                    label="Position"
                                                    variant="standard"
                                                    type="text"
                                                    name="Position"
                                                    autoComplete="off"
                                                />
                                            )}
                                        </div>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className="field-group">
                                                    <div className="field-group-container">
                                                        <div className="field-group-row">
                                                            <div className="scrollable-box">
                                                                {person.indAliasesNameDTOS.map((huf, hufIndex) => (
                                                                    <div key={hufIndex} className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Linked Individual Name Aliases"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={huf.linIndAliasesName}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangeSpouseHuf(personIndex, 'linIndAliasesName', hufIndex, event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <br></br>
                                        </Grid>
                                    </div>
                                ))}
                                <div className="button-container">
                                    <Button
                                        className="add-people"
                                        variant="contained"
                                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={() =>
                                            setindOrgFormData({
                                                indOrgCommonDTO: [
                                                    ...indOrgformData.indOrgCommonDTO,
                                                    {
                                                        positionsDTO: {
                                                            cmsId: 0,
                                                            recordTypeId: 0,
                                                            position: '',
                                                            linIndName: '',
                                                        },
                                                        indAliasesNameDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                linIndAliasesName: '',
                                                            },
                                                        ],
                                                        relationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relationship: '',
                                                                relativeMasterId: 0,
                                                            },
                                                        ],
                                                        identificationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relativeMasterId:0,
                                                                identificationNumId: 0,
                                                                identification: '',
                                                            },
                                                        ],
                                                        relationAliasesDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relationAliasesName: '',
                                                            },
                                                        ],
                                                        detailsAboutRelationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                detailsAboutRelation: '',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            })
                                        }
                                    >
                                        Add Linked Individual Details
                                    </Button>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="key">
                            <div className="person-container">
                                <div className="field-group-column">
                                    <TextField
                                        id="Case Details"
                                        label="Case Details"
                                        variant="standard"
                                        type="text"
                                        multiline
                                        fullWidth
                                        size="small"
                                        name="caseDetails"
                                        value={caseDetails[0].caseDetails}
                                        onChange={(e) => handleCaseDetailsChange(e, 0)}
                                    // error={caseError}
                                    // helperText={caseError ? 'Case Details is required' : ''}
                                    // inputRef={nameRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </>
        );
    };

    const renderAircraftFields = () => {
        return (
            <>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="outlined-multiline-static"
                            label="Source Link"
                            variant="standard"
                            type="text"
                            fullWidth
                            size="small"
                            name="sourceLink"
                            multiline
                            value={DetailsData.sourceLink}
                            onChange={(e) => handleChange(e, 0)}
                        />
                    </Grid>
                </Grid>
                <Box m={2} p={2} sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: "#f9f9f9" }}>
                    <Grid container spacing={2}>
                        {/* Profile Upload Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" mb={1}>UPLOAD PROFILE</Typography>
                                {fileSetd.map((fileSet, index) => (
                                    <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-image-${fileSet.id}`}
                                                onChange={(e) => handleFileChanged(e, index)}
                                            />
                                            <label htmlFor={`upload-image-${fileSet.id}`}>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    sx={{
                                                        backgroundColor: "#1976D2",
                                                        color: "#fff",
                                                        width: "100%"
                                                    }}>
                                                    Upload Profile
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item xs={10} sm={7}>
                                            <TextField
                                                label="Image Attachment"
                                                type="text"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                disabled
                                            />
                                        </Grid>
                                        {fileSet.files.length > 0 && (
                                            <Grid item xs={2} sm={1}>
                                                <FontAwesomeIcon
                                                    icon={faTimesCircle}
                                                    onClick={() => handleCancelImage(index)}
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "#fa2104",
                                                        fontSize: "18px",
                                                        background: "#fff",
                                                        padding: "5px",
                                                    }}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                ))}
                            </Box>
                        </Grid>
                        {/* Document Upload Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" mb={1}>UPLOAD DOCUMENT</Typography>
                                {fileSets.map((fileSet, index) => (
                                    <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-document-${fileSet.id}`}
                                                onChange={(e) => handleFileChange(e, index)}
                                                multiple
                                            />
                                            <label htmlFor={`upload-document-${fileSet.id}`}>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    sx={{
                                                        backgroundColor: "#1976D2",
                                                        color: "#fff",
                                                        width: "100%"
                                                    }}>
                                                    Upload Document
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item xs={10} sm={7} mt={2}>
                                            <TextField
                                                label="Document Attachment"
                                                type="text"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                value={fileSet.files.map(file => file.name).join(", ")}
                                                disabled={!fileSet.files.length}
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={1}>
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDeleteFileSet(fileSet.id)}
                                                style={{
                                                    cursor: "pointer",
                                                    color: "#fa2104",
                                                    fontSize: "18px",
                                                    background: "#fff",
                                                    padding: "5px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                                {/* Add More Button */}
                                <Grid item xs={4} mt={2}>
                                    <Button
                                        variant="contained"
                                        onClick={addMoreFileInput}
                                        sx={{
                                            backgroundColor: "#1976D2",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            width: "100%"
                                        }}
                                    >
                                        + Add Another Document
                                    </Button>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <TextField
                            id="Name"
                            label="Name"
                            variant="standard"
                            type="text"
                            fullWidth
                            size="small"
                            name="name"
                            value={DetailsData.name}
                            onChange={(e) => handleChange(e, 0)}
                            error={nameError}
                            helperText={nameError ? 'Name is required' : ''}
                            inputRef={nameRef}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="scroll-box">
                                {AliasesData.map((Aliases, index) => (
                                    <div key={index} className="person-container">
                                        {AliasesData.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxAliasesName(index)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Aliases Name"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                autoComplete="off"
                                                value={Aliases.aliasesName}
                                                onChange={(e) => {
                                                    handleAliasesNameChange(e.target.value, index);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddAliasesNameField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="scroll-box">
                                {Address.map((address, index) => (
                                    <div key={index} className="person-container">
                                        {Address.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxAddress(index)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Address"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                multiline
                                                autoComplete="off"
                                                value={address.address}
                                                onChange={(e) => {
                                                    handleAddressChange(e.target.value, index);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddPAddressField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="outlined-multiline-static"
                            label="Registration Number"
                            variant="standard"
                            type="text"
                            fullWidth
                            size="small"
                            name="Registration Number"
                            multiline
                            value={DetailsData.registrationNum}
                            onChange={handleRegistrationNumChange}
                        />
                    </Grid>
                </Grid>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>COUNTRY DETAILS</h5>
                        <div >
                            <div className="scrollablebox">
                                {FamilyformData.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {FamilyformData.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxFamilydetails(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className="field-group">
                                                    <div >
                                                        <div className="field-group-row">
                                                            <div className="scrollable-box">
                                                                <div className="field-group-column">
                                                                    <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                        <InputLabel id="country-label">Country</InputLabel>
                                                                        <Select
                                                                            labelId="country-label"
                                                                            id='Country'
                                                                            value={person.countryId || ""}
                                                                            onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                        >
                                                                            <MenuItem value={''} style={{ color: "gray" }}>Select Country</MenuItem>
                                                                            {Array.isArray(Country) &&
                                                                                Country.map((lists: any) => (
                                                                                    <MenuItem key={lists.id} value={lists.id}>
                                                                                        {lists.name}
                                                                                    </MenuItem>
                                                                                ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                        <InputLabel id="Country-of-head-quarters-label">Country of Head Quarters</InputLabel>
                                                                        <Select
                                                                            labelId="Country-of-head-quarters-label"
                                                                            id='Country of Head Quarters'
                                                                            value={person.countryHqId || ""}
                                                                            onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                        >
                                                                            <MenuItem value={''} style={{ color: "gray" }}>Select Country Head Quarters</MenuItem>
                                                                            {Array.isArray(CountryHqData) &&
                                                                                CountryHqData.map((lists: any) => (
                                                                                    <MenuItem key={lists.id} value={lists.id}>
                                                                                        {lists.name}
                                                                                    </MenuItem>
                                                                                ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="National Identification Number"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.identificationNum}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChangfatherpan(personIndex, event)
                                                                        }
                                                                    />
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="National Identification Details"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.identificationDetails}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChageidentificationDetails(personIndex, event)
                                                                        }
                                                                    />
                                                                    <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                        <InputLabel id="contact-label">Contact</InputLabel>
                                                                        <Select
                                                                            labelId="contact-label"
                                                                            id="Contact"
                                                                            value={person.contactId || ""}
                                                                            onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                        >
                                                                            <MenuItem value={''} style={{ color: "gray" }}>Select Contact</MenuItem>
                                                                            {contactDetails.map((contact) => (
                                                                                <MenuItem key={contact.id} value={contact.id}>
                                                                                    {contact.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="Contact Details"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.contactName}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputContactDetails(personIndex, event)
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <br></br>
                                        </Grid>
                                    </div>
                                ))}
                                <div className="button-container">
                                    <Button
                                        className="add-people"
                                        variant="contained"
                                        startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setFamilyFormData([...FamilyformData, {
                                            countryId: 0,
                                            recordTypeId: 0,
                                            cmsId: 0,
                                            countryHqId: 0,
                                            identificationNumberId: 0,
                                            identificationNum: '',
                                            identificationDetails: '',
                                            contactId: 0,
                                            contactName: ''
                                        }])}>
                                        Add country Details
                                    </Button>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>ORGANIZATION</h5>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="key">
                                    <div className="person-container">
                                        <div className="field-group-column">
                                            <TextField
                                                id="organization "
                                                label="Organization "
                                                variant="standard"
                                                type="text"
                                                multiline
                                                fullWidth
                                                size="small"
                                                name="organizations"
                                                value={organization[0].organizationDetails}
                                                onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                            // error={caseError}
                                            // helperText={caseError ? 'organization  is required' : ''}
                                            // inputRef={nameRef}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Card>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>LINKED INDIVIDUAL DETAILS</h5>
                        <div >
                            <div className="scrollablebox">
                                {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {indOrgformData.indOrgCommonDTO.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxSpouseFamily(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                            <TextField style={{ width: '100%' }}
                                                label="Linked Individual Name"
                                                variant="standard"
                                                type="text"
                                                name="linIndName"
                                                autoComplete="off"
                                                value={person.positionsDTO.linIndName}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                }
                                            />
                                            {selectedRecordType === '2' && (
                                                <TextField
                                                    style={{ width: '20%' }}
                                                    label="Position"
                                                    variant="standard"
                                                    type="text"
                                                    name="Position"
                                                    autoComplete="off"
                                                />
                                            )}
                                        </div>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className="field-group">
                                                    <div className="field-group-container">
                                                        <div className="field-group-row">
                                                            <div className="scrollable-box">
                                                                {person.indAliasesNameDTOS.map((huf, hufIndex) => (
                                                                    <div key={hufIndex} className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Linked Individual Name Aliases"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={huf.linIndAliasesName}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangeSpouseHuf(personIndex, 'linIndAliasesName', hufIndex, event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <br></br>
                                        </Grid>
                                    </div>
                                ))}
                                <div className="button-container">
                                    <Button
                                        className="add-people"
                                        variant="contained"
                                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={() =>
                                            setindOrgFormData({
                                                indOrgCommonDTO: [
                                                    ...indOrgformData.indOrgCommonDTO,
                                                    {
                                                        positionsDTO: {
                                                            cmsId: 0,
                                                            recordTypeId: 0,
                                                            position: '',
                                                            linIndName: '',
                                                        },
                                                        indAliasesNameDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                linIndAliasesName: '',
                                                            },
                                                        ],
                                                        relationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relationship: '',
                                                                relativeMasterId: 0,
                                                            },
                                                        ],
                                                        identificationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relativeMasterId:0,
                                                                identificationNumId: 0,
                                                                identification: '',
                                                            },
                                                        ],
                                                        relationAliasesDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relationAliasesName: '',
                                                            },
                                                        ],
                                                        detailsAboutRelationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                detailsAboutRelation: '',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            })
                                        }
                                    >
                                        Add Linked Individual Details
                                    </Button>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="key">
                            <div className="person-container">
                                <div className="field-group-column">
                                    <TextField
                                        id="Case Details"
                                        label="Case Details"
                                        variant="standard"
                                        type="text"
                                        multiline
                                        fullWidth
                                        size="small"
                                        name="caseDetails"
                                        value={caseDetails[0].caseDetails}
                                        onChange={(e) => handleCaseDetailsChange(e, 0)}
                                    // error={caseError}
                                    // helperText={caseError ? 'Case Details is required' : ''}
                                    // inputRef={nameRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </>
        );
    };

    const renderorganizationFields = () => {
        return (
            <>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="outlined-multiline-static"
                            label="Source Link"
                            variant="standard"
                            type="text"
                            fullWidth
                            size="small"
                            name="sourceLink"
                            multiline
                            value={DetailsData.sourceLink}
                            onChange={(e) => handleChange(e, 0)}
                        />
                    </Grid>
                </Grid>
                <Box m={2} p={2} sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: "#f9f9f9" }}>
                    <Grid container spacing={2}>
                        {/* Profile Upload Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" mb={1}>UPLOAD PROFILE</Typography>
                                {fileSetd.map((fileSet, index) => (
                                    <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-image-${fileSet.id}`}
                                                onChange={(e) => handleFileChanged(e, index)}
                                            />
                                            <label htmlFor={`upload-image-${fileSet.id}`}>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    sx={{
                                                        backgroundColor: "#1976D2",
                                                        color: "#fff",
                                                        width: "100%"
                                                    }}>
                                                    Upload Profile
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item xs={10} sm={7}>
                                            <TextField
                                                label="Image Attachment"
                                                type="text"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                disabled
                                            />
                                        </Grid>
                                        {fileSet.files.length > 0 && (
                                            <Grid item xs={2} sm={1}>
                                                <FontAwesomeIcon
                                                    icon={faTimesCircle}
                                                    onClick={() => handleCancelImage(index)}
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "#fa2104",
                                                        fontSize: "18px",
                                                        background: "#fff",
                                                        padding: "5px",
                                                    }}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                ))}
                            </Box>
                        </Grid>
                        {/* Document Upload Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" mb={1}>UPLOAD DOCUMENT</Typography>
                                {fileSets.map((fileSet, index) => (
                                    <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-document-${fileSet.id}`}
                                                onChange={(e) => handleFileChange(e, index)}
                                                multiple
                                            />
                                            <label htmlFor={`upload-document-${fileSet.id}`}>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    sx={{
                                                        backgroundColor: "#1976D2",
                                                        color: "#fff",
                                                        width: "100%"
                                                    }}>
                                                    Upload Document
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item xs={10} sm={7} mt={2}>
                                            <TextField
                                                label="Document Attachment"
                                                type="text"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                value={fileSet.files.map(file => file.name).join(", ")}
                                                disabled={!fileSet.files.length}
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={1}>
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDeleteFileSet(fileSet.id)}
                                                style={{
                                                    cursor: "pointer",
                                                    color: "#fa2104",
                                                    fontSize: "18px",
                                                    background: "#fff",
                                                    padding: "5px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                                {/* Add More Button */}
                                <Grid item xs={4} mt={2}>
                                    <Button
                                        variant="contained"
                                        onClick={addMoreFileInput}
                                        sx={{
                                            backgroundColor: "#1976D2",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            width: "100%"
                                        }}
                                    >
                                        + Add Another Document
                                    </Button>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="person-container">
                                <div className="field-group-column">
                                    <TextField
                                        id="Name"
                                        label="Name"
                                        variant="standard"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        name="name"
                                        value={DetailsData.name}
                                        onChange={(e) => handleChange(e, 0)}
                                        error={nameError}
                                        helperText={nameError ? 'Name is required' : ''}
                                        inputRef={nameRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="scroll-box">
                                {AliasesData.map((Aliases, index) => (
                                    <div key={index} className="person-container">
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Aliases Name"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                autoComplete="off"
                                                value={Aliases.aliasesName}
                                                onChange={(e) => {
                                                    handleAliasesNameChange(e.target.value, index);
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="delete-icon"
                                                onClick={() => handleRemoveBoxAliasesName(index)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddAliasesNameField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="scroll-box">
                                {Address.map((address, index) => (
                                    <div key={index} className="person-container">
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Address"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                multiline
                                                autoComplete="off"
                                                value={address.address}
                                                onChange={(e) => {
                                                    handleAddressChange(e.target.value, index);
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="delete-icon"
                                                onClick={() => handleRemoveBoxAddress(index)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddPAddressField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="scroll-box">
                                {caseData.map((Case, index) => (
                                    <div key={index} className="person-container">
                                        {caseData.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemovecaseAddress(index)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Unique Number"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                multiline
                                                autoComplete="off"
                                                value={Case.caseDetails}
                                                onChange={(e) => {
                                                    handlecasaeChange(e.target.value, index);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddcaseField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Unique Number
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <h5>COUNTRY DETAILS</h5>
                    <div>
                        <div className="scrollablebox">
                            {FamilyformData.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {FamilyformData.length > 1 && (
                                        <div className="close-button" onClick={() => handleRemoveBoxFamilydetails(personIndex)}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </div>
                                    )}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <div className="field-group">
                                                <div >
                                                    <div className="field-group-row">
                                                        <div className="scrollable-box">
                                                            <div className="field-group-column">
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="country-label">Country</InputLabel>
                                                                    <Select
                                                                        labelId="country-label"
                                                                        id='Country'
                                                                        value={person.countryId || ""}
                                                                        onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Country</MenuItem>
                                                                        {Array.isArray(Country) &&
                                                                            Country.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="Country-of-head-quarters-label">Country of Head Quarters</InputLabel>
                                                                    <Select
                                                                        labelId="Country-of-head-quarters-label"
                                                                        id='Country of Head Quarters'
                                                                        value={person.countryHqId || ""}
                                                                        onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Country Head Quarters</MenuItem>
                                                                        {Array.isArray(CountryHqData) &&
                                                                            CountryHqData.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="National-identification-label">National Identification</InputLabel>
                                                                    <Select
                                                                        labelId="National-identification-label"
                                                                        id='National Identification'
                                                                        value={person.identificationNumberId || ""}
                                                                        onChange={(e) => handlerelative(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select National Identification</MenuItem>
                                                                        {Array.isArray(Idnumber) &&
                                                                            Idnumber.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <TextField
                                                                    style={{ width: '50%' }}
                                                                    label="Identification Number"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.identificationNum}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputChangfatherpan(personIndex, event)
                                                                    }
                                                                />
                                                                <TextField
                                                                    style={{ width: '50%' }}
                                                                    label="Identification Details"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.identificationDetails}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputChageidentificationDetails(personIndex, event)
                                                                    }
                                                                />
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="contact-label">Contact</InputLabel>
                                                                    <Select
                                                                        labelId="contact-label"
                                                                        id="Contact"
                                                                        value={person.contactId || ""}
                                                                        onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Contact</MenuItem>
                                                                        {contactDetails.map((contact) => (
                                                                            <MenuItem key={contact.id} value={contact.id}>
                                                                                {contact.name}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <TextField
                                                                    style={{ width: '50%' }}
                                                                    label="Contact Details"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.contactName}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputContactDetails(personIndex, event)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid>
                                        <br></br>
                                    </Grid>
                                </div>
                            ))}
                            <div className="button-container">
                                <Button
                                    className="add-people"
                                    variant="contained"
                                    startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setFamilyFormData([...FamilyformData, {
                                        countryId: 0,
                                        recordTypeId: 0,
                                        cmsId: 0,
                                        countryHqId: 0,
                                        identificationNumberId: 0,
                                        identificationNum: '',
                                        identificationDetails: '',
                                        contactId: 0,
                                        contactName: ''
                                    }])}>
                                    Add country details
                                </Button>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Card style={{ padding: '1%', width: '100%', }}>
                    <div className="key">
                        <h5>ORGANIZATION</h5>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="key">
                                    <div className="person-container">
                                        <div className="field-group-column">
                                            <TextField
                                                id="organization "
                                                label="Organization "
                                                variant="standard"
                                                type="text"
                                                multiline
                                                fullWidth
                                                size="small"
                                                name="organizations"
                                                value={organization[0].organizationDetails}
                                                onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                            // error={caseError}
                                            // helperText={caseError ? 'organization  is required' : ''}
                                            // inputRef={nameRef}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Card>
                <br></br>
                <Card style={{ padding: '1%', width: '100%' }}>
                    <div className="key">
                        <h5>BANK DETAILS INVOLVED CASE</h5>
                        <div >
                            <div className="scrollablebox">
                                {BankformData.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {BankformData.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxbankdetails(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className="field-group">
                                                    <div >
                                                        <div className="field-group-row">
                                                            <div className="scrollable-box">
                                                                <div className="field-group-column">
                                                                    <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                        <InputLabel id="bank-name-label">Bank Name</InputLabel>
                                                                        <Select
                                                                            labelId="bank-name-label"
                                                                            id='Bank Name'
                                                                            value={person.bankId || ""}
                                                                            onChange={(e) => handlebank(personIndex, e.target.value as number)}
                                                                        >
                                                                            <MenuItem value={''} style={{ color: "gray" }}>Select Bank Name</MenuItem>
                                                                            {Array.isArray(bank) &&
                                                                                bank.map((lists: any) => (
                                                                                    <MenuItem key={lists.id} value={lists.id}>
                                                                                        {lists.bankName}
                                                                                    </MenuItem>
                                                                                ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="Account Number"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.acc_no}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChangbank(personIndex, event)
                                                                        }
                                                                    />
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="Name"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.name}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChagebankDetails(personIndex, event)
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <br></br>
                                        </Grid>
                                    </div>
                                ))}
                                <div className="button-container">
                                    <Button
                                        className="add-people"
                                        variant="contained"
                                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={() =>
                                            setBankFormData(prevFormData => [
                                                ...prevFormData,
                                                {
                                                    bankId: 0,
                                                    recordTypeId: 0,
                                                    cmsId: 0,
                                                    acc_no: '',
                                                    name: '',
                                                    uid: 0,
                                                }
                                            ])
                                        }
                                    >
                                        Add BANK Details
                                    </Button>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Card style={{ padding: '1%', width: '100%' }}>
                    <div className="key">
                        <h5>LINKED INDIVIDUAL DETAILS</h5>
                        <div >
                            <div className="scrollablebox">
                                {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {indOrgformData.indOrgCommonDTO.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxSpouseFamily(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                            <TextField style={{ width: '100%' }}
                                                label="Linked Individual Name"
                                                variant="standard"
                                                type="text"
                                                name="linIndName"
                                                autoComplete="off"
                                                value={person.positionsDTO.linIndName}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                }
                                            />
                                            {selectedRecordType === '2' && (
                                                <TextField
                                                    style={{ width: '50%' }}
                                                    label="Position"
                                                    variant="standard"
                                                    type="text"
                                                    name="Position"
                                                    autoComplete="off"
                                                    value={person.positionsDTO.position}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                    }
                                                />
                                            )}
                                        </div>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <div className="field-group">
                                                    <div className="field-group-container">
                                                        <div className="field-group-row">
                                                            <div className="scrollable-box">
                                                                {person.indAliasesNameDTOS.map((huf, hufIndex) => (
                                                                    <div key={hufIndex} className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Linked Individual Name Aliases"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={huf.linIndAliasesName}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangeSpouseHuf(personIndex, 'linIndAliasesName', hufIndex, event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <div className="field-group">
                                                    <div className="field-group-row">
                                                        <div className="scrollable-box">
                                                            <div className="field-group-column">
                                                                <FormControl fullWidth variant="standard" size="small">
                                                                    <InputLabel id="relative-list-label">Relative List</InputLabel>
                                                                    <Select
                                                                        labelId="relative-list-label"
                                                                        id='Relative List'
                                                                        value={person?.relationDTOS?.[0]?.relativeMasterId || ""}
                                                                        // value={person && person.relationDTOS && Array.isArray(person.relationDTOS) && person.relationDTOS.length > 0 ? person.relationDTOS[0].relativeMasterId : ''}
                                                                        onChange={(e) => handlerelativeChanges(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Relative List</MenuItem>
                                                                        {Array.isArray(relative) && relative.map((lists) => (
                                                                            <MenuItem key={lists.id} value={lists.id}>
                                                                                {lists.name}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            {<Grid item xs={3}>
                                                <div className="field-group">
                                                    <div className="field-group-row">
                                                        <div className="field-group-container">
                                                            <div className="scrollable-box">
                                                                {person.relationAliasesDTOS.map((RelationnName, RelationnNameIndex) => (
                                                                    <div key={RelationnNameIndex} className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Relationship Name"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={RelationnName.relationAliasesName}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangsrelationIndex(personIndex, 'relationAliasesName', RelationnNameIndex, event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousefather(personIndex, 'relationAliasesName', RelationnNameIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'RelationnName')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Relationship Name
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>}
                                            <Grid item xs={3}>
                                                <div className="field-group">
                                                    <div className="field-group-row">
                                                        <div className="field-group-container">
                                                            <div className="scrollable-box">
                                                                {person.detailsAboutRelationDTOS.map((casedetails, casedetailsIndex) => (
                                                                    <div key={casedetailsIndex} className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Details about the Relation "
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={casedetails.detailsAboutRelation}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangspousemotherpan(personIndex, 'detailsAboutRelation', casedetailsIndex, event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousemother(personIndex, 'detailsAboutRelation', casedetailsIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'casedetails')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Details about the Relation
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <br></br>
                                        </Grid>
                                    </div>
                                ))}
                                <div className="button-container">
                                    <Button
                                        className="add-people"
                                        variant="contained"
                                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={() =>
                                            setindOrgFormData({
                                                indOrgCommonDTO: [
                                                    ...indOrgformData.indOrgCommonDTO,
                                                    {
                                                        positionsDTO: {
                                                            cmsId: 0,
                                                            recordTypeId: 0,
                                                            position: '',
                                                            linIndName: '',
                                                        },
                                                        indAliasesNameDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                linIndAliasesName: '',
                                                            },
                                                        ],
                                                        relationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relationship: '',
                                                                relativeMasterId: 0,
                                                            },
                                                        ],
                                                        identificationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relativeMasterId:0,
                                                                identificationNumId: 0,
                                                                identification: '',
                                                            },
                                                        ],
                                                        relationAliasesDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relationAliasesName: '',
                                                            },
                                                        ],
                                                        detailsAboutRelationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                detailsAboutRelation: '',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            })
                                        }
                                    >
                                        Add Linked Individual Details
                                    </Button>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="key">
                            <div className="person-container">
                                <div className="field-group-column">
                                    <TextField
                                        id="Case Details"
                                        label="Case Details"
                                        variant="standard"
                                        type="text"
                                        multiline
                                        fullWidth
                                        size="small"
                                        name="caseDetails"
                                        value={caseDetails[0].caseDetails}
                                        onChange={(e) => handleCaseDetailsChange(e, 0)}
                                    // error={caseError}
                                    // helperText={caseError ? 'Case Details is required' : ''}
                                    // inputRef={nameRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </>
        );
    };

    const renderMLMCompaniesFields = () => {
        return (
            <>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="outlined-multiline-static"
                            label="Source Link"
                            variant="standard"
                            type="text"
                            fullWidth
                            size="small"
                            name="sourceLink"
                            multiline
                            value={DetailsData.sourceLink}
                            onChange={(e) => handleChange(e, 0)}
                        />
                    </Grid>
                </Grid>
                <Box m={2} p={2} sx={{ borderRadius: 2, boxShadow: 2, backgroundColor: "#f9f9f9" }}>
                    <Grid container spacing={2}>
                        {/* Profile Upload Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" mb={1}>UPLOAD PROFILE</Typography>
                                {fileSetd.map((fileSet, index) => (
                                    <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-image-${fileSet.id}`}
                                                onChange={(e) => handleFileChanged(e, index)}
                                            />
                                            <label htmlFor={`upload-image-${fileSet.id}`}>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    sx={{
                                                        backgroundColor: "#1976D2",
                                                        color: "#fff",
                                                        width: "100%"
                                                    }}>
                                                    Upload Profile
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item xs={10} sm={7}>
                                            <TextField
                                                label="Image Attachment"
                                                type="text"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                disabled
                                            />
                                        </Grid>
                                        {fileSet.files.length > 0 && (
                                            <Grid item xs={2} sm={1}>
                                                <FontAwesomeIcon
                                                    icon={faTimesCircle}
                                                    onClick={() => handleCancelImage(index)}
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "#fa2104",
                                                        fontSize: "18px",
                                                        background: "#fff",
                                                        padding: "5px",
                                                    }}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                ))}
                            </Box>
                        </Grid>
                        {/* Document Upload Section */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6" mb={1}>UPLOAD DOCUMENT</Typography>
                                {fileSets.map((fileSet, index) => (
                                    <Grid container spacing={2} key={fileSet.id} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-document-${fileSet.id}`}
                                                onChange={(e) => handleFileChange(e, index)}
                                                multiple
                                            />
                                            <label htmlFor={`upload-document-${fileSet.id}`}>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    sx={{
                                                        backgroundColor: "#1976D2",
                                                        color: "#fff",
                                                        width: "100%"
                                                    }}>
                                                    Upload Document
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item xs={10} sm={7} mt={2}>
                                            <TextField
                                                label="Document Attachment"
                                                type="text"
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                value={fileSet.files.map(file => file.name).join(", ")}
                                                disabled={!fileSet.files.length}
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={1}>
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDeleteFileSet(fileSet.id)}
                                                style={{
                                                    cursor: "pointer",
                                                    color: "#fa2104",
                                                    fontSize: "18px",
                                                    background: "#fff",
                                                    padding: "5px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                                <div></div>
                                {/* Add More Button */}
                                <Grid item xs={4} mt={2}>
                                    <Button
                                        variant="contained"
                                        onClick={addMoreFileInput}
                                        sx={{
                                            backgroundColor: "#1976D2",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            width: "100%"
                                        }}
                                    >
                                        + Add Another Document
                                    </Button>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="person-container">
                                <div className="field-group-column">
                                    <TextField
                                        id="Name"
                                        label="Name"
                                        variant="standard"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        name="name"
                                        value={DetailsData.name}
                                        onChange={(e) => handleChange(e, 0)}
                                        error={nameError}
                                        helperText={nameError ? 'Name is required' : ''}
                                        inputRef={nameRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="scroll-box">
                                {AliasesData.map((Aliases, index) => (
                                    <div key={index} className="person-container">
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Aliases Name"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                autoComplete="off"
                                                value={Aliases.aliasesName}
                                                onChange={(e) => {
                                                    handleAliasesNameChange(e.target.value, index);
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="delete-icon"
                                                onClick={() => handleRemoveBoxAliasesName(index)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddAliasesNameField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="scroll-box">
                                {Address.map((address, index) => (
                                    <div key={index} className="person-container">
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Address"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                multiline
                                                autoComplete="off"
                                                value={address.address}
                                                onChange={(e) => {
                                                    handleAddressChange(e.target.value, index);
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="delete-icon"
                                                onClick={() => handleRemoveBoxAddress(index)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddPAddressField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="key">
                            <div className="scroll-box">
                                {caseData.map((Case, index) => (
                                    <div key={index} className="person-container">
                                        {caseData.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemovecaseAddress(index)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Unique Number"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                multiline
                                                autoComplete="off"
                                                value={Case.caseDetails}
                                                onChange={(e) => {
                                                    handlecasaeChange(e.target.value, index);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            <div className="add-button" onClick={handleAddcaseField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Unique Number
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <br></br>
                <Card style={{ padding: '1%', width: '100%', }}>
                    <h5>COUNTRY DETAILS</h5>
                    <div>
                        <div className="scrollablebox">
                            {FamilyformData.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {FamilyformData.length > 1 && (
                                        <div className="close-button" onClick={() => handleRemoveBoxFamilydetails(personIndex)}>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </div>
                                    )}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <div className="field-group">
                                                <div >
                                                    <div className="field-group-row">
                                                        <div className="scrollable-box">
                                                            <div className="field-group-column">
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="country-label">Country</InputLabel>
                                                                    <Select
                                                                        labelId="country-label"
                                                                        id='Country'
                                                                        value={person.countryId || ""}
                                                                        onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Country</MenuItem>
                                                                        {Array.isArray(Country) &&
                                                                            Country.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="Country-of-head-quarters-label">Country of Head Quarters</InputLabel>
                                                                    <Select
                                                                        labelId="Country-of-head-quarters-label"
                                                                        id='Country of Head Quarters'
                                                                        value={person.countryHqId || ""}
                                                                        onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Country Head Quarters</MenuItem>
                                                                        {Array.isArray(CountryHqData) &&
                                                                            CountryHqData.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="National-identification-label">National Identification</InputLabel>
                                                                    <Select
                                                                        labelId="National-identification-label"
                                                                        id='National Identification'
                                                                        value={person.identificationNumberId || ""}
                                                                        onChange={(e) => handlerelative(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select National Identification</MenuItem>
                                                                        {Array.isArray(Idnumber) &&
                                                                            Idnumber.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <TextField
                                                                    style={{ width: '50%' }}
                                                                    label="Identification Number"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.identificationNum}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputChangfatherpan(personIndex, event)
                                                                    }
                                                                />
                                                                <TextField
                                                                    style={{ width: '50%' }}
                                                                    label="Identification Details"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.identificationDetails}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputChageidentificationDetails(personIndex, event)
                                                                    }
                                                                />
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="contact-label">Contact</InputLabel>
                                                                    <Select
                                                                        labelId="contact-label"
                                                                        id="Contact"
                                                                        value={person.contactId || ""}
                                                                        onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Contact</MenuItem>
                                                                        {contactDetails.map((contact) => (
                                                                            <MenuItem key={contact.id} value={contact.id}>
                                                                                {contact.name}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <TextField
                                                                    style={{ width: '50%' }}
                                                                    label="Contact Details"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.contactName}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputContactDetails(personIndex, event)
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid>
                                        <br></br>
                                    </Grid>
                                </div>
                            ))}
                            <div className="button-container">
                                <Button
                                    className="add-people"
                                    variant="contained"
                                    startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setFamilyFormData([...FamilyformData, {
                                        countryId: 0,
                                        recordTypeId: 0,
                                        cmsId: 0,
                                        countryHqId: 0,
                                        identificationNumberId: 0,
                                        identificationNum: '',
                                        identificationDetails: '',
                                        contactId: 0,
                                        contactName: ''
                                    }])}>
                                    Add country details
                                </Button>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Card style={{ padding: '1%', width: '100%' }}>
                    <div className="key">
                        <h5>ORGANIZATION</h5>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="key">
                                    <div className="person-container">
                                        <div className="field-group-column">
                                            <TextField
                                                id="organization "
                                                label="Organization "
                                                variant="standard"
                                                type="text"
                                                multiline
                                                fullWidth
                                                size="small"
                                                name="organizations"
                                                value={organization[0].organizationDetails}
                                                onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                            // error={caseError}
                                            // helperText={caseError ? 'organization  is required' : ''}
                                            // inputRef={nameRef}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Card>
                <br></br>
                <Card style={{ padding: '1%', width: '100%' }}>
                    <div className="key">
                        <h5>BANK DETAILS INVOLVED CASE</h5>
                        <div >
                            <div className="scrollablebox">
                                {BankformData.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {BankformData.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxbankdetails(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div className="field-group">
                                                    <div >
                                                        <div className="field-group-row">
                                                            <div className="scrollable-box">
                                                                <div className="field-group-column">
                                                                    <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                        <InputLabel id="bank-name-label">Bank Name</InputLabel>
                                                                        <Select
                                                                            labelId="bank-name-label"
                                                                            id='Bank Name'
                                                                            value={person.bankId || ""}
                                                                            onChange={(e) => handlebank(personIndex, e.target.value as number)}
                                                                        >
                                                                            <MenuItem value={''} style={{ color: "gray" }}>Select Bank Name</MenuItem>
                                                                            {Array.isArray(bank) &&
                                                                                bank.map((lists: any) => (
                                                                                    <MenuItem key={lists.id} value={lists.id}>
                                                                                        {lists.bankName}
                                                                                    </MenuItem>
                                                                                ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="Account Number"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.acc_no}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChangbank(personIndex, event)
                                                                        }
                                                                    />
                                                                    <TextField
                                                                        style={{ width: '50%' }}
                                                                        label="Name"
                                                                        variant="standard"
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        value={person.name}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChagebankDetails(personIndex, event)
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <br></br>
                                        </Grid>
                                    </div>
                                ))}
                                <div className="button-container">
                                    <Button
                                        className="add-people"
                                        variant="contained"
                                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={() =>
                                            setBankFormData(prevFormData => [
                                                ...prevFormData,
                                                {
                                                    bankId: 0,
                                                    recordTypeId: 0,
                                                    cmsId: 0,
                                                    acc_no: '',
                                                    name: '',
                                                    uid: 0,
                                                }
                                            ])
                                        }
                                    >
                                        Add Bank Details
                                    </Button>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Card style={{ padding: '1%', width: '100%', }}>
                    <div className="key">
                        <h5>LINKED INDIVIDUAL DETAILS</h5>
                        <div >
                            <div className="scrollablebox">
                                {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {indOrgformData.indOrgCommonDTO.length > 1 && (
                                            <div className="close-button" onClick={() => handleRemoveBoxSpouseFamily(personIndex)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </div>
                                        )}
                                        <div className="field-group-column" style={{ marginBottom: '10px' }}>
                                            <TextField style={{ width: '100%' }}
                                                label="Linked Individual Name"
                                                variant="standard"
                                                type="text"
                                                name="linIndName"
                                                autoComplete="off"
                                                value={person.positionsDTO.linIndName}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                }
                                            />
                                            {selectedRecordType === '2' && (
                                                <TextField
                                                    style={{ width: '50%' }}
                                                    label="Position"
                                                    variant="standard"
                                                    type="text"
                                                    name="Position"
                                                    autoComplete="off"
                                                    value={person.positionsDTO.position}
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                    }
                                                />
                                            )}
                                        </div>
                                        <Grid container spacing={2}>
                                            <Grid item xs={3}>
                                                <div className="field-group">
                                                    <div className="field-group-container">
                                                        <div className="field-group-row">
                                                            <div className="scrollable-box">
                                                                {person.indAliasesNameDTOS.map((huf, hufIndex) => (
                                                                    <div key={hufIndex} className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Linked Individual Name Aliases"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={huf.linIndAliasesName}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangeSpouseHuf(personIndex, 'linIndAliasesName', hufIndex, event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <div className="field-group">
                                                    <div className="field-group-row">
                                                        <div className="scrollable-box">
                                                            <div className="field-group-column">
                                                                <FormControl fullWidth variant="standard" size="small">
                                                                    <InputLabel id="relative-list-label">Relative List</InputLabel>
                                                                    <Select
                                                                        labelId="relative-list-label"
                                                                        id='Relative List'
                                                                        value={person?.relationDTOS?.[0]?.relativeMasterId || ""}
                                                                        // value={person && person.relationDTOS && Array.isArray(person.relationDTOS) && person.relationDTOS.length > 0 ? person.relationDTOS[0].relativeMasterId : ''}
                                                                        onChange={(e) => handlerelativeChanges(personIndex, e.target.value as number)}
                                                                    >
                                                                        <MenuItem value={''} style={{ color: "gray" }}>Select Relative List</MenuItem>
                                                                        {Array.isArray(relative) && relative.map((lists) => (
                                                                            <MenuItem key={lists.id} value={lists.id}>
                                                                                {lists.name}
                                                                            </MenuItem>
                                                                        ))}
                                                                    </Select>
                                                                </FormControl>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            {<Grid item xs={3}>
                                                <div className="field-group">
                                                    <div className="field-group-row">
                                                        <div className="field-group-container">
                                                            <div className="scrollable-box">
                                                                {person.relationAliasesDTOS.map((RelationnName, RelationnNameIndex) => (
                                                                    <div key={RelationnNameIndex} className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Relationship Name"
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={RelationnName.relationAliasesName}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangsrelationIndex(personIndex, 'relationAliasesName', RelationnNameIndex, event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousefather(personIndex, 'relationAliasesName', RelationnNameIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'RelationnName')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Relationship Name
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>}
                                            <Grid item xs={3}>
                                                <div className="field-group">
                                                    <div className="field-group-row">
                                                        <div className="field-group-container">
                                                            <div className="scrollable-box">
                                                                {person.detailsAboutRelationDTOS.map((casedetails, casedetailsIndex) => (
                                                                    <div key={casedetailsIndex} className="field-group-column">
                                                                        <TextField
                                                                            style={{ width: '100%' }}
                                                                            label="Details about the Relation "
                                                                            variant="standard"
                                                                            type="text"
                                                                            autoComplete="off"
                                                                            value={casedetails.detailsAboutRelation}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleInputChangspousemotherpan(personIndex, 'detailsAboutRelation', casedetailsIndex, event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousemother(personIndex, 'detailsAboutRelation', casedetailsIndex)}
                                                                        />
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'casedetails')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Details about the Relation
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <br></br>
                                        </Grid>
                                    </div>
                                ))}
                                <div className="button-container">
                                    <Button
                                        className="add-people"
                                        variant="contained"
                                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={() =>
                                            setindOrgFormData({
                                                indOrgCommonDTO: [
                                                    ...indOrgformData.indOrgCommonDTO,
                                                    {
                                                        positionsDTO: {
                                                            cmsId: 0,
                                                            recordTypeId: 0,
                                                            position: '',
                                                            linIndName: '',
                                                        },
                                                        indAliasesNameDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                linIndAliasesName: '',
                                                            },
                                                        ],
                                                        relationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relationship: '',
                                                                relativeMasterId: 0,
                                                            },
                                                        ],
                                                        identificationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relativeMasterId:0,
                                                                identificationNumId: 0,
                                                                identification: '',
                                                            },
                                                        ],
                                                        relationAliasesDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                relationAliasesName: '',
                                                            },
                                                        ],
                                                        detailsAboutRelationDTOS: [
                                                            {
                                                                cmsId: 0,
                                                                recordTypeId: 0,
                                                                positionId: 0,
                                                                detailsAboutRelation: '',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            })
                                        }
                                    >
                                        Add Linked Individual Details
                                    </Button>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="key">
                            <div className="person-container">
                                <div className="field-group-column">
                                    <TextField
                                        id="Case Details"
                                        label="Case Details"
                                        variant="standard"
                                        type="text"
                                        multiline
                                        fullWidth
                                        size="small"
                                        name="caseDetails"
                                        value={caseDetails[0].caseDetails}
                                        onChange={(e) => handleCaseDetailsChange(e, 0)}
                                    // error={caseError}
                                    // helperText={caseError ? 'Case Details is required' : ''}
                                    // inputRef={nameRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </>
        );
    };


    const renderFieldsBasedOnRecordType = (selectedRecordType: string) => {
        // if (
        //     regulatorId === "1" &&
        //     ["11", "12", "13", "14", "15", "16"].includes(regulatorListId) &&
        //     selectedRecordType === "1"
        // ) {
        //     return <Entity entities={entities} setEntities={setEntities} />;
        // }

        switch (selectedRecordType) {
            case '1':
                return renderEntityFields();
            case '2':
                return renderIndividualFields();
            case '3':
                return renderShipFields();
            case '4':
                return renderAircraftFields();
            case '5':
                return renderorganizationFields();
            case '6':
                return renderMLMCompaniesFields();
            default:
                return null;
        }
    };
   


    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, p: 6 }}>
                    <Card style={{
                        marginTop: '7%',
                        padding: '1%',
                        boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                        width: '100%',
                    }}>
                        <Box m={1}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <FormControl style={{ width: '100%' }}>
                                        <InputLabel htmlFor="regulator">Regulator</InputLabel>
                                        <Select
                                            label="Regulator"
                                            variant="standard"
                                            value={regulatorId}
                                            onChange={handleRegulatorChange}
                                        >
                                            <MenuItem value={''} style={{ color: "gray" }}>
                                                Select Regulator
                                            </MenuItem>
                                            {Regulator?.map((item) => (
                                                <MenuItem key={item.id} value={item.id.toString()}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl style={{ width: '100%' }} disabled={!regulatorId}>
                                        <InputLabel htmlFor="regulatorList">Regulator List</InputLabel>
                                        <Select
                                            label="Regulator List"
                                            variant="standard"
                                            value={regulatorListId}
                                            onChange={handleRegulatorListChange}
                                        >
                                            <MenuItem value={''} style={{ color: "gray" }}>
                                                Select Regulator List
                                            </MenuItem>
                                            {Regulatorlist?.map((item) => (
                                                <MenuItem key={item.id} value={item.id.toString()}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <FormControl style={{ width: '100%' }}>
                                        <InputLabel htmlFor="record-type">Record Type</InputLabel>
                                        <Select
                                            label="Record Type"
                                            variant="standard"
                                            value={selectedRecordType}
                                            onChange={handleRecordTypeChange}
                                            disabled={isDropdownDisabled}
                                        >
                                            <MenuItem value={''} style={{ color: "gray" }}>Select Record Type</MenuItem>
                                            {RecordType.map((item) => (
                                                <MenuItem key={item.id} value={item.id.toString()}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    <br></br>
                                    <Button onClick={handleButtonClick}>Enable Dropdown</Button>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    {renderFieldsBasedOnRecordType(selectedRecordType)}
                                </Grid>
                            </Grid>
                        </Box>
                    </Card>
                    <br></br>
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (selectedRecordType) {
                                const numericPathId = pathId ? (typeof pathId === 'string' ? parseInt(pathId) : pathId) : 0;
                                handleSubmit(numericPathId, imgName.toString());
                            }
                        }}
                        disabled={submissionSuccess}
                    >
                        Submit
                    </Button>
                    
                    {/* {selectedRecordType === "1" &&
                        regulatorId === "1" &&
                        ["11", "12", "13", "14", "15", "16"].includes(regulatorListId) ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmited}
                            style={{ marginTop: "10px" }}
                        >
                            Submit
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                if (selectedRecordType) {
                                    const numericPathId = pathId ? (typeof pathId === 'string' ? parseInt(pathId) : pathId) : 0;
                                    handleSubmit(numericPathId, imgName.toString());
                                }
                            }}
                            disabled={submissionSuccess}
                        >
                            Submit
                        </Button>


                    )} */}

                </Box>

            </Box>
        </>
    );
}

export default Search;