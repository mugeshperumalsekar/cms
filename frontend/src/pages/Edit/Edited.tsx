import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Grid, InputLabel, FormControl, Select, MenuItem, FormControlLabel, Checkbox, Dialog, DialogContent, IconButton, Paper, DialogTitle, DialogActions } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlusCircle, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { SelectChangeEvent } from '@mui/material/Select';
import SearchService from '../../data/services/Search/search-api-service';
import { createDetailsRequest, Regulator, RegulatorListData, Gender, RecordTypeData, Dead, InorgPayload, bank, AliasesDTO, AddressDTO, DateOfBirthDTO, DetailsCombineDTO, CreateCountryRegistrationRequest, IdNumberData, CountryHqData, Country, CreateCaseDetailsRequest, createIndPositionsRequests, createIndCaseDetailsRequests, createBankDetailsRequests, State, ContactDetails, CompanyPayload, CreateorganizationDetailsRequest } from '../../data/services/Search/search-payload';
import GenderApiService from '../../data/services/master/Gender/gender_api_service';
import DeadApiService from '../../data/services/master/Dead/dead_api_service';
import IdNumberApiService from '../../data/services/master/IdNumber/idnumber_api_service';
import CountryApiService from '../../data/services/master/Country/country_api_service';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../layouts/header/header';
import { Card, Image } from 'react-bootstrap';
import EditDetailsApiService from '../../data/services/editdetails/editdetails-api-service';
import CustomerApiService from '../../data/services/customerEdit/customeredit_api_service';
import RelativeApiService from '../../data/services/master/relative/relative-api-serivces';
import { Relative } from '../../data/services/viewpage/viewpagedetails-payload';
import DeleteIcon from "@mui/icons-material/Delete";

interface SelectedFile {
    file: File;
    pathId: number;
    documentId: number;
    cmsId: number;
    imgName: number;
};

interface PDFFile {
    fileId: string;
    fileName: string;
    documentType: string;
    documentId: number;
    isProfileImage: string;
};

interface UpdateCheckingData {
    detailsEdit?: boolean;
    addressEdit?: boolean;
    caseEdit?: boolean;
    positionEdit?: boolean;
    countryEdit?: boolean;
    bankEdit?: boolean;
    comapnyEdit?: boolean;
    linkedIndividualEdit?: boolean;
    caseDetailsEdit?: boolean;
    organizationDetailsEdit?: boolean;
};

interface Image {
    name: string;
    uploading: boolean;
    uploadSuccess: boolean;
};

function Edited() {

    const userDetails = useSelector((state: any) => state.loginReducer);
    const loginDetails = userDetails.loginDetails;
    const navigate = useNavigate();
    const { cmsId, recordTypeId, positionId } = useParams();
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [checkboxError, setCheckboxError] = useState<string>('');
    const numericCmsId = cmsId ? Number(cmsId) : undefined;

    const initialImageState: Image = {
        name: '',
        uploading: false,
        uploadSuccess: false,
    };

    interface Image {
        name: string;
        uploading: boolean;
        uploadSuccess: boolean;
        file?: File;
    };

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

    const [Regulator, setRegulator] = useState<Regulator[]>([]);
    const [Regulatorlist, setRegulatorlist] = useState<RegulatorListData[]>([]);
    const [RecordType, setRecordType] = useState<RecordTypeData[]>([]);
    const [selectedRecordType, setSelectedRecordType] = useState<string>('');
    const [Dead, setDead] = useState<Dead[]>([]);
    const [Idnumber, setIdnumber] = useState<IdNumberData[]>([]);
    const [Idnumbers, setIdnumbers] = useState<IdNumberData[]>([]);
    const [CountryHqData, setCountryHqData] = useState<CountryHqData[]>([]);
    const [Country, setCountry] = useState<Country[]>([]);
    const [gender, setgender] = useState<Gender[]>([]);
    const deadRef = useRef<HTMLInputElement | null>(null);
    const genderRef = useRef<HTMLInputElement | null>(null);
    const [caseDetails, setCaseDetails] = useState<CreateCaseDetailsRequest[]>([{ cmsId: 0, recordTypeId: 0, caseDetails: '', uid: loginDetails.id }]);
    const [AliasesData, setAliasesData] = useState<AliasesDTO[]>([{ cmsId: 0, recordTypeId: 0, aliasesName: '', uid: loginDetails.id }]);
    const [organization, setorganizationDetails] = useState<CreateorganizationDetailsRequest[]>([{ cmsId: 0, recordTypeId: 0, organizationDetails: '', uid: loginDetails.id }]);

    const [PartyformData, setPartyFormData] = useState<DateOfBirthDTO[]>([
        {
            cmsId: 0, recordTypeId: 0, dob: '', birthYearAlone: '', placeOfBirth: '', uid: loginDetails.id
        },
    ]);

    const [Address, setAddress] = useState<AddressDTO[]>([{ cmsId: 0, recordTypeId: 0, address: '', uid: loginDetails.id }]);
    const [PositionsData, setPositionsData] = useState<createIndPositionsRequests[]>([{ cmsId: 0, recordTypeId: 0, position: '', uid: loginDetails.id }]);
    const [caseData, setcaseData] = useState<createIndCaseDetailsRequests[]>([{ cmsId: 0, recordTypeId: 0, caseDetails: '', uid: loginDetails.id }]);

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

    const detailsCombine: DetailsCombineDTO = {
        addressDTOS: Address,
        dateOfBirthDTOS: PartyformData,
        aliasesDTOS: AliasesData
    };

    const [images, setImages] = useState<Image[]>([initialImageState]);
    const [isFileSelected, setIsFileSelected] = useState<boolean>(false);
    const [includeCountryRequest, setIncludeCountryRequest] = useState(false);
    const [inclueLinkedRequest, setIncludeLinkedRequest] = useState(false);
    const [inclueCaseRequest, setIncludeCaseRequest] = useState(false);
    const [inclueNameRequest, setIncludeNameRequest] = useState(false);
    const [includeAddressRequest, setIncludeAddressRequest] = useState(false);
    const [includepositionRequest, setIncludepositionRequest] = useState(false);
    const [inclueCaseSRequest, setIncludeCaseSRequest] = useState(false);
    const [inclueBankRequest, setIncludeBankRequest] = useState(false);
    const [inclueComapnyRequest, setIncludeComapnyRequest] = useState(false);
    const [includeImageRequest, setIncludeImageRequest] = useState(false);

    const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        if (name === 'includeCountryRequest') {
            setIncludeCountryRequest(checked);
        } else if (name === 'inclueLinkedRequest') {
            setIncludeLinkedRequest(checked);
        } else if (name === 'inclueCaseRequest') {
            setIncludeCaseRequest(checked);
        } else if (name === 'inclueNameRequest') {
            setIncludeNameRequest(checked);
        } else if (name === 'includeAddressRequest') {
            setIncludeAddressRequest(checked);
        } else if (name === 'includepositionRequest') {
            setIncludepositionRequest(checked);
        } else if (name === 'updateCheckingData.caseEdit') {
            setIncludeCaseSRequest(checked);
        } else if (name === 'inclueBankRequest') {
            setIncludeBankRequest(checked);
        } else if (name === 'inclueComapnyRequest') {
            setIncludeComapnyRequest(checked);
        } else if (name === 'includeImageRequest') {
            setIncludeImageRequest(checked);
        }
    };

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
                        relativeMasterId: 0,
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

    const [CountryData, setCountryData] = useState<CreateCountryRegistrationRequest[]>([
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

    useEffect(() => {
        if (recordTypeId) {
            setSelectedRecordType(recordTypeId);
        }
    }, [recordTypeId]);

    useEffect(() => {
        renderFieldsBasedOnRecordType(selectedRecordType);
    }, [selectedRecordType]);

    useEffect(() => {
        const fetchRegulator = async () => {
            try {
                const regulatorOptions = await recordtype.getRegulator();
                setRegulator(regulatorOptions);
                if (regulatorOptions.length > 0) {
                    setRegulatorId(regulatorOptions[0].id.toString());
                }
            } catch (error) {
                console.error("Error fetching associated list:", error);
            }
        };
        fetchRegulator();
    }, []);

    useEffect(() => {
        const fetchRegulatorList = async () => {
            try {
                const regulatorList = await recordtype.getRegulatorList();
                setRegulatorlist(regulatorList);
                if (regulatorList.length > 0) {
                    setRegulatorListId(regulatorList[0].id.toString());
                }
            } catch (error) {
                console.error("Error fetching regulator list:", error);
            }
        };
        fetchRegulatorList();
    }, []);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async (cmsId: string) => {
            try {
                setIsLoading(true);
                const customerData = await customer.getCustomer(cmsId);
                if (customerData.createDetailsRequest) {
                    const {
                        recordTypeId,
                        regulatorListId,
                        regulatorId,
                        display,
                        sourceLink,
                        name,
                        registrationNum,
                        deadId,
                        genderId,
                    } = customerData.createDetailsRequest;
                    setDetailsData({
                        recordTypeId: recordTypeId || '',
                        regulatorListId: regulatorListId || '',
                        regulatorId: regulatorId || '',
                        display: display || '',
                        name: name || '',
                        sourceLink: sourceLink || '',
                        registrationNum: registrationNum || '',
                        deadId: deadId || '',
                        genderId: genderId || '',
                        uid: loginDetails.id,
                    });
                }
                if (customerData.detailsCombineDTO) {
                    const addressData = customerData.detailsCombineDTO[0].addressDTOS.map((address: { cmsId: any; }) => ({
                        ...address,
                        cmsId: address.cmsId || '',
                        recordTypeId: recordTypeId || '',
                        uid: loginDetails.id,
                    }));
                    setAddress(addressData);
                    const dateOfBirthData = customerData.detailsCombineDTO[0].dateOfBirthDTOS.map((dateOfBirth: any) => ({
                        ...dateOfBirth,
                        cmsId: dateOfBirth.cmsId || '',
                        recordTypeId: recordTypeId || '',
                        dob: dateOfBirth.dob || '',
                        birthYearAlone: dateOfBirth.birthYearAlone || '',
                        placeOfBirth: dateOfBirth.placeOfBirth || '',
                        uid: loginDetails.id,
                    }));
                    setPartyFormData(dateOfBirthData);
                    const aliasesData = customerData.detailsCombineDTO[0].aliasesDTOS.map((alias: { cmsId: any; }) => ({
                        ...alias,
                        cmsId: alias.cmsId || '',
                        recordTypeId: recordTypeId || '',
                        uid: loginDetails.id,
                    }));
                    setAliasesData(aliasesData);
                }
                if (customerData.countryRegistrationData) {
                    const countryRegistrationData = customerData.countryRegistrationData.map((country: { countryId: any; recordTypeId: any; cmsId: any; countryHqId: any; identificationNumberId: any; identificationNum: any; identificationDetails: any; contactId: any; contactName: any; }) => ({
                        countryId: country.countryId || '',
                        recordTypeId: country.recordTypeId || '',
                        cmsId: country.cmsId || '',
                        countryHqId: country.countryHqId || '',
                        identificationNumberId: country.identificationNumberId || '',
                        identificationNum: country.identificationNum || '',
                        identificationDetails: country.identificationDetails || '',
                        contactId: country.contactId || '',
                        contactName: country.contactName || '',
                    }));
                    setCountryData(countryRegistrationData);
                }
                if (customerData.caseDetailsData) {
                    const caseDetailsData = customerData.caseDetailsData.map((caseDetail: any) => ({
                        recordTypeId: caseDetail.recordTypeId || '',
                        cmsId: caseDetail.cmsId || '',
                        caseDetails: caseDetail.caseDetails || '',
                        uid: loginDetails.id
                    }));
                    setCaseDetails(caseDetailsData);
                }
                if (customerData.bankDetailsData) {
                    const bankDetailsData = customerData.bankDetailsData.map((data: { recordTypeId: any; cmsId: any; bankId: any; name: any; acc_no: any; }) => ({
                        recordTypeId: data.recordTypeId || '',
                        cmsId: data.cmsId || '',
                        bankId: data.bankId || '',
                        name: data.name || '',
                        acc_no: data.acc_no || '',

                    }));
                    setBankFormData(bankDetailsData)
                }
                if (customerData.companyDetailsData) {
                    const companyDetailsData = customerData.companyDetailsData.map((data: any) => ({
                        recordTypeId: selectedRecordType,
                        cmsId: data.cmsId,
                        identificationNumberId: data.identificationNumberId,
                        stateId: data.stateId,
                        companyName: data.companyName,
                        role: data.role,
                        address: data.address,
                        idDetails: data.idDetails,
                        uid: loginDetails.id
                    }));
                    setCompanyFormData(companyDetailsData)
                }
                if (customerData.indPositionsData) {
                    const indPositionsData = customerData.indPositionsData.map((PositionsData: any) => ({
                        recordTypeId: PositionsData.selectedRecordType || '',
                        cmsId: PositionsData.cmsId || '',
                        position: PositionsData.position || '',
                        uid: loginDetails.id
                    }));
                    setPositionsData(indPositionsData);
                }
                if (customerData.indCaseDetailsData) {
                    const indCaseDetailsData = customerData.indCaseDetailsData.map((caseDetails: any) => ({
                        recordTypeId: caseDetails.selectedRecordType || '',
                        cmsId: caseDetails.cmsId || '',
                        caseDetails: caseDetails.caseDetails || '',
                        uid: loginDetails.id
                    }));
                    setcaseData(indCaseDetailsData);
                }
                if (customerData.organizationDetailsData && Array.isArray(customerData.organizationDetailsData)) {
                    const organizationDetailsData = customerData.organizationDetailsData.map((organizationDetails: any) => ({
                        recordTypeId: organizationDetails.selectedRecordType || '',
                        cmsId: organizationDetails.cmsId || '',
                        organizationDetails: organizationDetails.organizationDetails || '',
                        uid: loginDetails.id
                    }));
                    setorganizationDetails(organizationDetailsData);
                } else {
                    setorganizationDetails([]);
                }
                if (customerData.companyCombineDTO) {
                    const companyformData = customerData.companyCombineDTO.map((item: any) => ({
                        companyDetailsDTOS: {
                            cmsId: item.companyDetailsDTOS.cmsId || '',
                            recordTypeId: selectedRecordType || '',
                            identificationNumberId: item.companyDetailsDTOS.identificationNumberId || '',
                            stateId: item.companyDetailsDTOS.stateId || '',
                            role: item.companyDetailsDTOS.role || '',
                            companyName: item.companyDetailsDTOS.companyName || '',
                            address: item.companyDetailsDTOS.address || '',
                            idDetails: item.companyDetailsDTOS.idDetails || '',
                            uid: loginDetails.id
                        },
                        companyAliasesDTOS: item.companyAliasesDTOS.map((companyAliases: any) => ({
                            cmsId: companyAliases.cmsId || '',
                            recordTypeId: selectedRecordType || '',
                            companyId: companyAliases.companyId || '',
                            aliasesName: companyAliases.aliasesName || '',
                            uid: loginDetails.id
                        }))
                    }));
                    setCompanyFormData({
                        ...companyformData, companyCombineDTO: companyformData
                    });
                };
                if (customerData.indOrgCommonDTO) {
                    const indOrgCommonData = customerData.indOrgCommonDTO.map((item: any) => ({
                        positionsDTO: {
                            cmsId: item.positionsDTO.cmsId || '',
                            recordTypeId: selectedRecordType || '',
                            position: item.positionsDTO.position || '',
                            linIndName: item.positionsDTO.linIndName || '',
                        },
                        indAliasesNameDTOS: item.indAliasesNameDTOS.map((alias: any) => ({
                            cmsId: alias.cmsId || '',
                            recordTypeId: selectedRecordType || '',
                            positionId: alias.positionId || '',
                            linIndAliasesName: alias.linIndAliasesName || '',
                        })),
                        relationDTOS: item.relationDTOS.map((relation: any) => ({
                            cmsId: relation.cmsId || '',
                            recordTypeId: selectedRecordType || '',
                            positionId: relation.positionId || '',
                            relativeMasterId: relation.relativeMasterId || '',
                        })),
                        identificationDTOS: item.identificationDTOS.map((company: any) => ({
                            cmsId: company.cmsId || '',
                            recordTypeId: selectedRecordType || '',
                            positionId: company.positionId || '',
                            relativeMasterId: company.relativeMasterId || '',
                            identificationNumId: company.identificationNumId,
                            identification: company.identification,
                        })),
                        relationAliasesDTOS: item.relationAliasesDTOS.map((relationAlias: any) => ({
                            cmsId: relationAlias.cmsId || '',
                            recordTypeId: selectedRecordType || '',
                            positionId: relationAlias.positionId || '',
                            relationAliasesName: relationAlias.relationAliasesName || '',
                        })),
                        detailsAboutRelationDTOS: item.detailsAboutRelationDTOS.map((details: any) => ({
                            cmsId: details.cmsId || '',
                            recordTypeId: selectedRecordType || '',
                            positionId: details.positionId || '',
                            detailsAboutRelation: details.detailsAboutRelation || '',
                        })),
                    }));
                    setindOrgFormData({ ...indOrgformData, indOrgCommonDTO: indOrgCommonData });
                }
            } catch (error) {
                console.error('Error fetching customer:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (cmsId) {
            fetchCustomer(cmsId);
        }
    }, [cmsId]);

    const handleRecordTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedValue = event.target.value as string;
        setSelectedRecordType(selectedValue);
        if (selectedValue === '1') {
            window.location.reload();
        }
    };

    const handleInputChange = (personIndex: number, field: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const newCompanyCombineDTO = [...companyformData.companyCombineDTO];
        newCompanyCombineDTO[personIndex].companyDetailsDTOS[field] = event.target.value;
        setCompanyFormData({ companyCombineDTO: newCompanyCombineDTO });
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

    const handleRemoveCompany = (personIndex: number) => {
        const newCompanyCombineDTO = [...companyformData.companyCombineDTO];
        newCompanyCombineDTO.splice(personIndex, 1);
        setCompanyFormData({ companyCombineDTO: newCompanyCombineDTO });
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

    const handleChooseImagesClick1 = (index1: number) => {
        document.getElementById(`image-upload-input1-${index1}`)?.click();
    };

    const handleRemoveBoxAliasesName = (index: number) => {
        const updatedaAliase = [...AliasesData];
        updatedaAliase.splice(index, 1);
        setAliasesData(updatedaAliase);
    };

    const handleAddAliasesNameField = () => {
        setAliasesData([...AliasesData, { cmsId: 0, recordTypeId: 0, aliasesName: '', uid: loginDetails.id }]);
    };

    const handleAliasesNameChange = (value: string, index: number) => {
        const updatedaAliase = [...AliasesData];
        updatedaAliase[index].aliasesName = value;
        setAliasesData(updatedaAliase);
    };

    const handleRemoveBoxAddress = (index: number) => {
        const updatedaAddress = [...Address];
        updatedaAddress.splice(index, 1);
        setAddress(updatedaAddress);
    };

    const handleAddPAddressField = () => {
        setAddress([...Address, { cmsId: 0, recordTypeId: 0, address: '', uid: loginDetails.id, }]);
    };

    const handleAddressChange = (value: string, index: number) => {
        const updatedaAddress = [...Address];
        updatedaAddress[index].address = value;
        setAddress(updatedaAddress);
    };

    const handleRemoveBoxSpouseFamily = (personIndex: number) => {
        setindOrgFormData((prevData) => {
            const updatedPeople = [...prevData.indOrgCommonDTO];
            updatedPeople.splice(personIndex, 1);
            return { indOrgCommonDTO: updatedPeople };
        });
    };

    const [relative, setRelative] = useState<Relative[]>([]);

    const handleContactDetails = (personIndex: number, value: number) => {
        const updatedFormData = [...CountryData];
        updatedFormData[personIndex].contactId = value;
        setCountryData(updatedFormData);
    };

    const handleInputContactDetails = (personIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedFormData = [...CountryData];
        updatedFormData[personIndex].contactName = event.target.value;
        setCountryData(updatedFormData);
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
            if (updatedPeople.indOrgCommonDTO[personIndex].relationDTOS.length > 0) {
                updatedPeople.indOrgCommonDTO[personIndex].relationDTOS[0].relativeMasterId = value;
            }
            if (updatedPeople.indOrgCommonDTO[personIndex].identificationDTOS.length > 0) {
                updatedPeople.indOrgCommonDTO[personIndex].identificationDTOS[0].relativeMasterId = value;
            }
            setindOrgFormData(updatedPeople);
            console.log("Updated relativeMasterId in relationDTOS:", updatedPeople.indOrgCommonDTO[personIndex].relationDTOS[0].relativeMasterId);
            console.log("Updated relativeMasterId in identificationDTOS:", updatedPeople.indOrgCommonDTO[personIndex].identificationDTOS[0].relativeMasterId);
        } else {
            console.error("Invalid personIndex or data structure not as expected");
        }
    };

    const handlerelativecompany = (personIndex: number, value: number) => {
        setindOrgFormData((prevData) => {
            const updatedFormData = { ...prevData };
            updatedFormData.indOrgCommonDTO = [...prevData.indOrgCommonDTO];
            if (updatedFormData.indOrgCommonDTO[personIndex]) {
                updatedFormData.indOrgCommonDTO[personIndex] = {
                    ...updatedFormData.indOrgCommonDTO[personIndex],
                    identificationDTOS: updatedFormData.indOrgCommonDTO[personIndex].identificationDTOS.map(
                        (company: any, index: any) => ({
                            ...company,
                            identificationNumId: value,
                        })
                    ),
                };
            }
            return updatedFormData;
        });
    };

    const handleInputChangcompany = (personIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        setindOrgFormData((prevData) => {
            const updatedFormData = { ...prevData };
            updatedFormData.indOrgCommonDTO = [...prevData.indOrgCommonDTO];
            if (updatedFormData.indOrgCommonDTO[personIndex]) {
                updatedFormData.indOrgCommonDTO[personIndex] = {
                    ...updatedFormData.indOrgCommonDTO[personIndex],
                    identificationDTOS: updatedFormData.indOrgCommonDTO[personIndex].identificationDTOS.map((company: any) => ({
                        ...company,
                        identification: event.target.value,
                    })),
                };
            }
            return updatedFormData;
        });
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
        field: 'relationship',
        index: number | null,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedPeople = JSON.parse(JSON.stringify(indOrgformData));
        updatedPeople.indOrgCommonDTO[personIndex].positionsDTO[field] = event.target.value;
        if (index !== null) {
            if (field === 'relationship') {
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

    const handlecountry = (personIndex: number, value: number) => {
        const updatedFormData = [...CountryData];
        updatedFormData[personIndex].countryId = value;
        setCountryData(updatedFormData);
    };

    const handlerelativeChange = (personIndex: number, value: number) => {
        const updatedFormData = [...CountryData];
        updatedFormData[personIndex].countryHqId = value;
        setCountryData(updatedFormData);
    };

    const handlerelative = (personIndex: number, value: number) => {
        const updatedFormData = [...CountryData];
        updatedFormData[personIndex].identificationNumberId = value;
        setCountryData(updatedFormData);
    };

    const handleInputChangfatherpan = (personIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedFormData = [...CountryData];
        updatedFormData[personIndex].identificationNum = event.target.value;
        setCountryData(updatedFormData);
    };

    const handleInputChageidentificationDetails = (personIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedFormData = [...CountryData];
        updatedFormData[personIndex].identificationDetails = event.target.value;
        setCountryData(updatedFormData);
    };

    const handleRemoveBoxFamilydetails = (personIndex: number) => {
        const updatedFormData = [...CountryData];
        updatedFormData.splice(personIndex, 1);
        setCountryData(updatedFormData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name: string; value: unknown }> | SelectChangeEvent<string>,
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

    const recordtype = new SearchService();
    const genderService = new GenderApiService();
    const deadService = new DeadApiService();
    const idnumberService = new IdNumberApiService();
    const countryService = new CountryApiService();
    const customer = new SearchService();
    const editDetailsApiService = new EditDetailsApiService();
    const customerApiService = new CustomerApiService();
    const relatives = new RelativeApiService();

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [
                recordtypes,
                regulator,
                regulatorList,
                gender,
                dead,
                idnumber,
                countryHq,
                country,
                relativeData,
                bank,
                state,
                contactDetails
            ] = await Promise.all([
                recordtype.getRecoredType(),
                recordtype.getRegulator(),
                recordtype.getRegulatorList(),
                genderService.getGender(),
                deadService.getDead(),
                idnumberService.getIdnumber(),
                recordtype.getCountryHq(),
                countryService.getCountryOptions(),
                relatives.getRelative(),
                recordtype.getBank(),
                recordtype.getState(),
                recordtype.getContactDetails()
            ]);
            setRecordType(recordtypes);
            setRegulator(regulator);
            setRegulatorlist(regulatorList);
            setgender(gender);
            setDead(dead);
            setIdnumber(idnumber);
            setCountryHqData(countryHq);
            setCountry(country);
            setRelative(relativeData);
            setbank(bank);
            setstate(state);
            setcontactDetails(contactDetails);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handledead = (event: SelectChangeEvent<string>) => {
        setDetailsData((prevFormData) => ({
            ...prevFormData,
            deadId: parseInt(event.target.value, 10),
        }));
    };

    const handleRegistrationNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetailsData(prevState => ({
            ...prevState,
            registrationNum: e.target.value
        }));
    };

    const handlegender = (event: SelectChangeEvent<string>) => {
        setDetailsData((prevFormData) => ({
            ...prevFormData,
            genderId: parseInt(event.target.value, 10),
        }));
    };

    const handleRemovecaseAddress = (index: number) => {
        const updatedaAddress = [...caseData];
        updatedaAddress.splice(index, 1);
        setcaseData(updatedaAddress);
    };

    const handleAddcaseField = () => {
        setcaseData([...caseData, { cmsId: 0, recordTypeId: 0, caseDetails: '', uid: loginDetails.id }]);
    };

    const handlecasaeChange = (value: string, index: number) => {
        const updatedCaseData = [...caseData];
        updatedCaseData[index].caseDetails = value;
        setcaseData(updatedCaseData);
    };

    const handleAddPsotionsField = () => {
        setPositionsData([...PositionsData, { cmsId: 0, recordTypeId: 0, position: '', uid: loginDetails.id, }]);
    };

    const handlepstiotionChange = (value: string, index: number) => {
        const updatedaAddress = [...PositionsData];
        updatedaAddress[index].position = value;
        setPositionsData(updatedaAddress);
    };

    const handleRemovepositionAddress = (index: number) => {
        const updatedaAddress = [...PositionsData];
        updatedaAddress.splice(index, 1);
        setPositionsData(updatedaAddress);
    };

    const handleRemovePartyformData = (index: number) => {
        const updatedFormData = [...PartyformData];
        updatedFormData.splice(index, 1);
        setPartyFormData(updatedFormData);
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

    const handleAddPartyformDataField = () => {
        setPartyFormData([...PartyformData, { cmsId: 0, recordTypeId: 0, dob: '', birthYearAlone: '', placeOfBirth: '', uid: loginDetails.id }]);
    };

    const handlebank = (personIndex: number, value: number) => {
        const updatedFormData = [...BankformData];
        updatedFormData[personIndex].bankId = value;
        setBankFormData(updatedFormData);
    };

    const [bank, setbank] = useState<bank[]>([]);
    const [state, setstate] = useState<State[]>([]);
    const [contactDetails, setcontactDetails] = useState<ContactDetails[]>([]);

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

    const handleRemoveBoxbankdetails = (personIndex: number) => {
        const updatedFormData = [...BankformData];
        updatedFormData.splice(personIndex, 1);
        setBankFormData(updatedFormData);
    };

    const fetchBank = async () => {
        try {
            const recordtypes = await recordtype.getBank();
            setbank(recordtypes);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const fetchSatete = async () => {
        try {
            const recordtypes = await recordtype.getState();
            setstate(recordtypes);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const fetchContactDetails = async () => {
        try {
            const recordtypes = await recordtype.getContactDetails();
            setcontactDetails(recordtypes);
        }
        catch (error) {
            console.error("Error fetching contact details:", error);
        }
    };

    const fetchRelative = async () => {
        try {
            const relativeData = await relatives.getRelative();
            setRelative(relativeData);
        }
        catch (error) {
            console.error("Error fetching associated list:", error);
        }
    };

    const [regulatorListId, setRegulatorListId] = useState<string>('');
    const [regulatorId, setRegulatorId] = useState<string>('');

    const handleRegulatorChange = async (event: { target: any }) => {
        const selectedId = event.target.value;
        setDetailsData(prevState => ({
            ...prevState,
            regulatorId: selectedId
        }));
        setRegulatorId(selectedId);
        try {
            const response = await recordtype.getRegulatorIdList(Number(selectedId));
            setRegulatorlist(response);
            setRegulatorListId('');
        } catch (error) {
            console.error("Error fetching regulator list:", error);
        }
    };

    const handleRegulatorListChange = (event: { target: any }) => {
        const newValue = event.target.value;
        setDetailsData(prevState => ({
            ...prevState,
            regulatorListId: newValue
        }));
        setRegulatorListId(newValue);
    };

    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const [fileSets, setFileSets] = useState<{ id: number; files: File[] }[]>([]);

    const [fileSetd, setFileSetd] = useState<{ id: number; files: File[] }[]>([
        { id: 1, files: [] },
    ]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            console.log(`Selected Files for Index ${index}:`, newFiles);
            setFileSets(prevFileSets =>
                prevFileSets.map((set, i) =>
                    i === index ? { ...set, files: newFiles } : set
                )
            );
        }
    };

    const addMoreFileInput = () => {
        setFileSets(prevFileSets => [...prevFileSets, { id: Date.now(), files: [] }]);
    };

    const handleDeleteFileSet = (id: number) => {
        setFileSets(prevFileSets => prevFileSets.filter(set => set.id !== id));
    };

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

    const [updateCheckingData, setUpdateCheckingData] = useState<UpdateCheckingData>({
        detailsEdit: false,
        addressEdit: false,
        caseEdit: false,
        positionEdit: false,
        countryEdit: false,
        bankEdit: false,
        comapnyEdit: false,
        linkedIndividualEdit: false,
        caseDetailsEdit: false,
        organizationDetailsEdit: false
    });

    const handleCheckboxChang = (event: { target: { name: any; checked: any; }; }) => {
        const { name, checked } = event.target;
        setUpdateCheckingData(prevState => ({
            ...prevState,
            [name]: checked ? 1 : 0
        }));
    };

    const [setpathId] = useState<number>(0);
    const [imgName, setImgName] = useState<number>(0);
    const [setCustomerId] = useState<number>(0);
    const pathId = selectedRecordType;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEdit = async (cmsId: number, imgName: string, pathId: number) => {
        try {
            const imgName = await editDetailsApiService.fetchData(cmsId, pathId);
            if (!imgName) {
                console.error('imgName is not defined.');
                return;
            }
            const isAnyCheckboxSelected =
                updateCheckingData ||
                includeImageRequest;
            if (!isAnyCheckboxSelected) {
                setCheckboxError('Please select atleast one checkbox to Edit');
                return;
            }
            const DetailsDTOList = {
                id: cmsId,
                updateDetailsRequest: updateCheckingData ? {
                    recordTypeId: selectedRecordType,
                    regulatorListId: DetailsData.regulatorListId,
                    regulatorId: DetailsData.regulatorId,
                    display: DetailsData.display,
                    sourceLink: DetailsData.sourceLink,
                    name: DetailsData.name,
                    registrationNum: DetailsData.registrationNum,
                    genderId: DetailsData.genderId,
                    deadId: DetailsData.deadId,
                    uid: loginDetails.id
                } : null,
                updateCheckingData: {
                    detailsEdit: updateCheckingData.detailsEdit ? 1 : 0,
                    addressEdit: updateCheckingData.addressEdit ? 1 : 0,
                    caseEdit: updateCheckingData.caseEdit ? 1 : 0,
                    positionEdit: updateCheckingData.positionEdit ? 1 : 0,
                    countryEdit: updateCheckingData.countryEdit ? 1 : 0,
                    bankEdit: updateCheckingData.bankEdit ? 1 : 0,
                    comapnyEdit: updateCheckingData.comapnyEdit ? 1 : 0,
                    linkedIndividualEdit: updateCheckingData.linkedIndividualEdit ? 1 : 0,
                    caseDetailsEdit: updateCheckingData.caseDetailsEdit ? 1 : 0,
                    organizationDetailsEdit: updateCheckingData.organizationDetailsEdit ? 1 : 0,
                },
                detailsCombineDTO: updateCheckingData ? [{
                    addressDTOS: Address.map(address => ({ ...address, recordTypeId: selectedRecordType, cmsId: address.cmsId, uid: loginDetails.id })),
                    dateOfBirthDTOS: PartyformData.map(dateOfBirth => ({ ...dateOfBirth, recordTypeId: selectedRecordType, cmsId: dateOfBirth.cmsId, uid: loginDetails.id })),
                    aliasesDTOS: AliasesData.map(alias => ({ ...alias, recordTypeId: selectedRecordType, cmsId: alias.cmsId, uid: loginDetails.id }))
                }] : [],
                createCountryRegistrationRequest: updateCheckingData ? CountryData.map(data => ({
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
                })) : [],
                createCaseDetailsRequest: updateCheckingData ? [{
                    recordTypeId: selectedRecordType,
                    cmsId: caseDetails[0].cmsId,
                    caseDetails: caseDetails[0].caseDetails,
                    uid: loginDetails.id
                }] : [],
                createBankDetailsRequests: updateCheckingData ? BankformData.map(data => ({
                    recordTypeId: selectedRecordType,
                    cmsId: data.cmsId,
                    bankId: data.bankId,
                    name: data.name,
                    acc_no: data.acc_no,
                    uid: loginDetails.id
                })) : [],
                companyCombineDTO: companyformData.companyCombineDTO.map(item => ({
                    companyDetailsDTOS: updateCheckingData ? {
                        cmsId: item.companyDetailsDTOS.cmsId,
                        recordTypeId: selectedRecordType,
                        identificationNumberId: item.companyDetailsDTOS.identificationNumberId,
                        stateId: item.companyDetailsDTOS.stateId,
                        role: item.companyDetailsDTOS.role,
                        companyName: item.companyDetailsDTOS.companyName,
                        address: item.companyDetailsDTOS.address,
                        idDetails: item.companyDetailsDTOS.idDetails,
                        uid: loginDetails.id
                    } : {},
                    companyAliasesDTOS: updateCheckingData ? item.companyAliasesDTOS.map(companyAliases => ({
                        cmsId: companyAliases.cmsId,
                        recordTypeId: selectedRecordType,
                        companyId: companyAliases.companyId,
                        aliasesName: companyAliases.aliasesName,
                        uid: loginDetails.id
                    })) : [],
                })),
                createIndPositionsRequests: updateCheckingData ? PositionsData.map(positions => ({
                    recordTypeId: selectedRecordType,
                    cmsId: positions.cmsId,
                    position: positions.position,
                    uid: loginDetails.id
                })) : [],
                createIndCaseDetailsRequests: updateCheckingData ? caseData.map(data => ({
                    recordTypeId: selectedRecordType,
                    cmsId: data.cmsId,
                    caseDetails: data.caseDetails,
                    uid: loginDetails.id
                })) : [],
                createOrganizationDetailsRequests: updateCheckingData ? organization.map(data => ({
                    recordTypeId: selectedRecordType,
                    cmsId: data.cmsId,
                    organizationDetails: data.organizationDetails,
                    uid: loginDetails.id
                })) : [],
                indOrgCommonDTO: indOrgformData.indOrgCommonDTO.map(item => ({
                    positionsDTO: updateCheckingData ? {
                        cmsId: item.positionsDTO.cmsId,
                        recordTypeId: selectedRecordType,
                        position: item.positionsDTO.position,
                        linIndName: item.positionsDTO.linIndName,
                        uid: loginDetails.id
                    } : {},
                    indAliasesNameDTOS: updateCheckingData ?
                        item.indAliasesNameDTOS.map(alias => ({
                            cmsId: alias.cmsId,
                            recordTypeId: selectedRecordType,
                            positionId: alias.positionId,
                            linIndAliasesName: alias.linIndAliasesName,
                            uid: loginDetails.id
                        })) : [],
                    relationDTOS: updateCheckingData ?
                        item.relationDTOS.map(relation => ({
                            cmsId: relation.cmsId,
                            recordTypeId: selectedRecordType,
                            positionId: relation.positionId,
                            relativeMasterId: relation.relativeMasterId,
                            relationship: relation.relationship,
                            uid: loginDetails.id
                        })) : [],
                    identificationDTOS: updateCheckingData ?
                        item.identificationDTOS.map(company => ({
                            cmsId: company.cmsId,
                            recordTypeId: selectedRecordType,
                            identificationNumId: company.identificationNumId,
                            identification: company.identification,
                            positionId: company.positionId,
                            relativeMasterId: company.relativeMasterId,
                            uid: loginDetails.id
                        })) : [],
                    relationAliasesDTOS: updateCheckingData ?
                        item.relationAliasesDTOS.map(relationAlias => ({
                            cmsId: relationAlias.cmsId,
                            recordTypeId: selectedRecordType,
                            positionId: relationAlias.positionId,
                            relationAliasesName: relationAlias.relationAliasesName,
                            uid: loginDetails.id
                        })) : [],
                    detailsAboutRelationDTOS: updateCheckingData ?
                        item.detailsAboutRelationDTOS.map(details => ({
                            cmsId: details.cmsId,
                            recordTypeId: selectedRecordType,
                            positionId: details.positionId,
                            detailsAboutRelation: details.detailsAboutRelation,
                            uid: loginDetails.id
                        })) : [],
                })),
                includeImageRequest: includeImageRequest ? true : false,
            };
            console.log('DetailsDTOList:', DetailsDTOList);
            console.log('checkboxValues:', updateCheckingData);
            const allPdfFiles = fileSets.flatMap(set => set.files); // PDFs
            const allImageFiles = fileSetd.flatMap(set => set.files); // Images
            console.log("PDF Files:", allPdfFiles);
            console.log("Image Files:", allImageFiles);
            const filesWithIsProfileImage = [
                ...allImageFiles.map((file, index) => ({
                    file,
                    isProfileImage: index === 0 ? 1 : 0
                })),
                ...allPdfFiles.map(file => ({ file, isProfileImage: 0 }))
            ];
            console.log("Files with isProfileImage flag:", filesWithIsProfileImage);
            const response = await editDetailsApiService.updateCustomer(
                JSON.stringify(DetailsDTOList),
                cmsId,
                1,
                filesWithIsProfileImage.map(f => f.file),
                pathId,
                filesWithIsProfileImage.find(f => f.isProfileImage === 1)?.file?.name || "",
                includeImageRequest,
                filesWithIsProfileImage.some(f => f.isProfileImage === 1) ? 1 : 0
            );
            if (response) {
                if (newTab && !newTab.closed) {
                    newTab.close();
                }
                setNewTab(null);
                setSubmissionSuccess(true);
                window.close();
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setIsSubmitting(false);
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

    const [base64Images, setBase64Images] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [base64Imageship, setBase64Imageship] = useState<string | null>(null);
    const [base64Imageair, setBase64Imageair] = useState<string | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(1);

    const [pdfData, setPdfData] = useState<{ base64: string | null; filename: string | null }>({
        base64: null,
        filename: null
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [pdfList, setPdfList] = useState<PDFFile[]>([]);

    useEffect(() => {
        const fetchPDFs = async (cmsId: any) => {
            try {
                const response = await customerApiService.getPDFs(cmsId);
                if (!response || response.length === 0) {
                    return;
                }
                setPdfList(response);
                console.log('22:', response)
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };
        fetchPDFs(cmsId);
    }, [cmsId]);

    const [clickedDocumentId, setClickedDocumentId] = useState<number | null>(null);
    const [selectedIsProfileImage, setSelectedIsProfileImage] = useState<string | null>(null);

    const handleFileClick = async (fileId: string, fileName: string, documentType: string, isProfileImage: string) => {
        try {
            console.log(`Clicked fileId: ${fileId}, fileName: ${fileName}, documentType: ${documentType}, isProfileImage: ${isProfileImage}`);
            setClickedDocumentId(Number(fileId));
            setSelectedIsProfileImage(String(isProfileImage));
            if (["png", "jpg", "jpeg"].includes(documentType.toLowerCase())) {
                const response = await customerApiService.getSinglImage(Number(fileId));
                if (response) {
                    const base64String = arrayBufferToBase64(response);
                    setBase64Image(base64String);
                    setSelectedImage(base64String);
                    setShowModal(true);
                } else {
                    console.error("Error: No image data received.");
                }
            } else if (documentType === "pdf") {
                const pdfResponse = await customerApiService.getSinglePDF(Number(fileId));
                if (pdfResponse && pdfResponse.data) {
                    setPdfData({ base64: pdfResponse.data, filename: pdfResponse.filename });
                    setShowPdfModal(true);
                } else {
                    console.error("Error: No PDF data received.");
                }
            } else {
                console.error("Unsupported file type:", documentType);
            }
        } catch (error) {
            console.error("Error fetching file:", error);
        }
    };

    const [openModal, setOpenModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null);

    const handleOpenModal = (file: PDFFile) => {
        setSelectedFile(file);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedFile(null);
    };

    // const handleConfirmDelete = () => {
    //     if (selectedFile) {
    //         const numericRecordTypeId = recordTypeId ? Number(recordTypeId) : undefined;
    //         const numericFileId = Number(selectedFile.fileId);
    //         if (numericCmsId !== undefined && numericRecordTypeId !== undefined && !isNaN(numericFileId)) {
    //             handleDeleteImage(numericCmsId, numericRecordTypeId, numericFileId);
    //         } else {
    //             console.error("cmsId, recordTypeId, or fileId is undefined or invalid. Cannot delete the image.");
    //         }
    //     }
    //     handleCloseModal();
    // };

    const handleConfirmDelete = () => {
        if (selectedFile) {
            const numericRecordTypeId = recordTypeId ? Number(recordTypeId) : undefined;
            const numericFileId = pdfList
                .find((file) => file.fileId === selectedFile.fileId)?.documentId;

            const numericDocumentId = numericFileId ? Number(numericFileId) : undefined;
            if (
                numericCmsId !== undefined &&
                numericRecordTypeId !== undefined &&
                numericDocumentId !== undefined &&
                !isNaN(numericDocumentId)
            ) {
                handleDeleteImage(numericCmsId, numericRecordTypeId, numericDocumentId);
            } else {
                console.error("cmsId, recordTypeId, or documentId is undefined or invalid. Cannot delete the image.");
            }
        }
        handleCloseModal();
    };

    const handleDeleteImage = async (cmsId: number | undefined, recordTypeId: number, fileId: number) => {
        if (cmsId === undefined) {
            console.error("Invalid cmsId: Cannot delete image");
            return;
        }
        try {
            const response = await customerApiService.deleteImage(cmsId, recordTypeId, fileId);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting the image:", error);
        }
    };

    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        const binary = new Uint8Array(buffer);
        const bytes = [];
        for (let i = 0; i < binary.length; i++) {
            bytes.push(String.fromCharCode(binary[i]));
        }
        return `data:image/png;base64,${btoa(bytes.join(""))}`;
    };

    const handleImageClick = (image: string) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    const handleZoom = () => {
        setZoomLevel(zoomLevel === 1 ? 2 : 1);
    };

    const handleFileChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("File changed:", event.target.files);
    };

    const handleFileChange4 = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFiles = Array.from(event.target.files) as File[];
            const nameWithoutExtension = selectedFiles[0].name.replace(/\.[^/.]+$/, '');
            setImages(prevFields => {
                const updatedFields = [...prevFields];
                updatedFields[index] = {
                    ...updatedFields[index],
                    name: nameWithoutExtension,
                    uploading: false,
                    uploadSuccess: false,
                    file: selectedFiles[0],
                };
                return updatedFields;
            });
            setIsFileSelected(true);
        } else {
            setIsFileSelected(false);
        }
    };

    const [fileError, setFileError] = useState<string | null>(null);

    const handleSaveFiles = async (files: File[], pathIds: number[], documentIds: number[], cmsId: number, imgName: string, isProfileImage: any) => {
        try {
            console.log("Files:", files);
            console.log("Path IDs:", pathIds);
            console.log("Document IDs:", documentIds);
            console.log("CMS ID:", cmsId);
            console.log("Image Name:", imgName);
            console.log("isProfileImage:", isProfileImage);
            const response = await editDetailsApiService.uploadCompanyFiles(files, pathIds, documentIds, cmsId, imgName, isProfileImage);
            console.log('Files uploaded successfully:', response);
        } catch (error) {
            console.error('File upload failed:', error);
        }
    };

    const handleSaveFilesWrapper = () => {
        if (clickedDocumentId !== null) {
            const selectedFiles = images.map(image => image.file).filter(Boolean) as File[];
            if (selectedFiles.length === 0) {
                setFileError("Select a file");
                return;
            }
            setFileError(null);
            const pathIds = [Number(pathId)];
            const documentIds = [clickedDocumentId];
            console.log("Selected isProfileImage before saving:", selectedIsProfileImage);
            const isProfileImageValue = selectedIsProfileImage && selectedIsProfileImage === "1" ? 1 : 0;
            console.log("Final isProfileImage before upload:", isProfileImageValue);
            handleSaveFiles(
                selectedFiles,
                pathIds,
                documentIds,
                Number(cmsId) || 0,
                String(imgName),
                isProfileImageValue
            );
            console.log("Selected isProfileImageValue:", isProfileImageValue);
            setShowModal(false);
            setShowPdfModal(false);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            console.error("Error: No document selected");
        }
    };

    const handleIndividualClick = async (cmsId: number, pathId: number, fileType: string) => {
        try {
            if (fileType === 'image') {
                const imageData = await customerApiService.getImage(pathId, cmsId);
                const base64String = arrayBufferToBase64(imageData);
                setBase64Image(base64String);
            } else if (fileType === 'pdf') {
                const pdfData = await customerApiService.getPDF(pathId, cmsId);
                setPdfData({ base64: pdfData.data, filename: pdfData.filename });
            }
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    };

    const handleShipClick = async (cmsId: number, pathId: number, fileType: string) => {
        try {
            if (fileType === 'image') {
                const imageData = await customerApiService.getImage(pathId, cmsId);
                const base64String = arrayBufferToBase64(imageData);
                setBase64Imageship(base64String);
            } else if (fileType === 'pdf') {
                const pdfData = await customerApiService.getPDF(pathId, cmsId);
                setPdfData({ base64: pdfData.data, filename: pdfData.filename });
            }
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    };

    const handleAirCraftClick = async (cmsId: number, pathId: number, fileType: string) => {
        try {
            if (fileType === 'image') {
                const imageData = await customerApiService.getImage(pathId, cmsId);
                const base64String = arrayBufferToBase64(imageData);
                setBase64Imageair(base64String);
            } else if (fileType === 'pdf') {
                const pdfData = await customerApiService.getPDF(pathId, cmsId);
                setPdfData({ base64: pdfData.data, filename: pdfData.filename });
            }
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    };

    const handleorganizationClick = async (cmsId: number, pathId: number, fileType: string) => {
        try {
            if (fileType === 'image') {
                const imageData = await customerApiService.getImage(pathId, cmsId);
                const base64String = arrayBufferToBase64(imageData);
                setBase64Imageair(base64String);
            } else if (fileType === 'pdf') {
                const pdfData = await customerApiService.getPDF(pathId, cmsId);
                setPdfData({ base64: pdfData.data, filename: pdfData.filename });
            }
        } catch (error) {
            console.error('Error fetching file:', error);
        }
    };

    useEffect(() => {
        handleIndividualClick(parseInt(cmsId || '0', 10), 2, 'image');
        handleIndividualClick(parseInt(cmsId || '0', 10), 2, 'pdf');
    }, []);

    useEffect(() => {
        handleShipClick(parseInt(cmsId || '0', 10), 3, 'image');
        handleShipClick(parseInt(cmsId || '0', 10), 3, 'pdf');
    }, []);

    useEffect(() => {
        handleAirCraftClick(parseInt(cmsId || '0', 10), 4, 'image');
        handleAirCraftClick(parseInt(cmsId || '0', 10), 4, 'pdf');
    }, []);

    useEffect(() => {
        handleorganizationClick(parseInt(cmsId || '0', 10), 5, 'image');
        handleorganizationClick(parseInt(cmsId || '0', 10), 5, 'pdf');
    }, []);

    // Entity Edit part
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
                            disabled={!updateCheckingData.detailsEdit}
                        />
                    </Grid>
                </Grid>
                <div className="card-body">
                    <Box m={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                {fileSetd.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        {/* File Upload Button */}
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-image-${fileSet.id}`}
                                                onChange={(e) => handleFileChanged(e, index)}
                                            />
                                            <label htmlFor={`upload-image-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Image Upload
                                                </Button>
                                            </label>
                                        </Grid>
                                        {/* Display Uploaded File Name */}
                                        <Grid item sm={4}>
                                            <TextField
                                                label="Image Attachment"
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                disabled
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item sm={2}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {pdfList.map((file: PDFFile) => (
                                        <div key={file.fileId} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div
                                                style={{
                                                    border: "1px solid #ccc",
                                                    padding: "10px",
                                                    width: "200px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleFileClick(String(file.fileId), file.fileName, file.documentType, file.isProfileImage)}
                                            >
                                                <h6>{file.fileName}</h6>
                                            </div>
                                            <IconButton onClick={() => handleOpenModal(file)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </Grid>
                            <Dialog open={openModal} onClose={handleCloseModal}>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete this file?
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseModal} color="primary">
                                        No
                                    </Button>
                                    <Button onClick={handleConfirmDelete} color="error">
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                open={showModal}
                                onClose={() => setShowModal(false)}
                                maxWidth="lg"
                                fullWidth
                                PaperProps={{
                                    style: { backgroundColor: "transparent", boxShadow: "none" }
                                }}
                            >
                                <Paper style={{ padding: 16, position: "relative" }}>
                                    <DialogTitle>Image Preview</DialogTitle>
                                    <DialogContent
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexDirection: "column"
                                        }}
                                    >
                                        {!isEditing ? (
                                            // Image Preview Mode
                                            <>
                                                {selectedImage && (
                                                    <img
                                                        src={selectedImage}
                                                        alt="Preview"
                                                        style={{
                                                            maxWidth: "100%",
                                                            maxHeight: "100%",
                                                            transform: `scale(${zoomLevel})`,
                                                            transition: "transform 0.2s ease-in-out"
                                                        }}
                                                    />
                                                )}
                                                <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        style={{ marginRight: "10px" }}
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => setShowModal(false)}
                                                    >
                                                        Close
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            // File Upload Section
                                            <Grid container spacing={2} style={{ width: "100%" }}>
                                                {images.map((image, index) => (
                                                    <Grid item xs={12} key={index}>
                                                        <form encType="multipart/form-data">
                                                            <div>
                                                                <div className="field-group-column">
                                                                    <input
                                                                        type="file"
                                                                        id={`image-upload-input1-${index}`}
                                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                        onChange={(event) => {
                                                                            handleFileChanges(event);
                                                                            handleFileChange4(index, event);
                                                                        }}
                                                                        style={{ display: "none" }}
                                                                    />
                                                                    <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                        Photo
                                                                    </Button>
                                                                    <TextField
                                                                        label="Attachment"
                                                                        type="text"
                                                                        size="small"
                                                                        variant="outlined"
                                                                        value={image.name}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </Grid>
                                                ))}
                                                <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                    {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                    <Button variant="contained" color="primary" onClick={() => setIsEditing(false)} style={{ marginRight: "10px" }}>
                                                        Back
                                                    </Button>
                                                    <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                        Save
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </DialogContent>
                                </Paper>
                            </Dialog>
                            <Dialog open={showPdfModal} onClose={() => setShowPdfModal(false)} maxWidth="lg" fullWidth>
                                <DialogTitle>PDF Preview</DialogTitle>
                                <DialogContent>
                                    {!isEdit ? (
                                        <>
                                            {pdfData.base64 && (
                                                <>
                                                    <iframe
                                                        title="PDF Preview"
                                                        width="100%"
                                                        height="500px"
                                                        style={{ border: "none" }}
                                                        src={`data:application/pdf;base64,${pdfData.base64}`}
                                                    />
                                                    {pdfData.filename && (
                                                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                                                            <a
                                                                href={`data:application/pdf;base64,${pdfData.base64}`}
                                                                download={pdfData.filename}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    textDecoration: "none",
                                                                    padding: "10px",
                                                                    backgroundColor: "#2a75bb",
                                                                    color: "white",
                                                                    borderRadius: "5px",
                                                                    cursor: "pointer",
                                                                    display: "inline-block",
                                                                }}
                                                            >
                                                                Download PDF
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                        <Button variant="contained" color="primary" onClick={() => setIsEdit(true)} style={{ marginRight: "10px" }}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={() => setShowPdfModal(false)}>
                                                            Close
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        // File Upload Section
                                        <Grid container spacing={2} style={{ width: "100%" }}>
                                            {images.map((image, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <form encType="multipart/form-data">
                                                        <div>
                                                            <div className="field-group-column">
                                                                <input
                                                                    type="file"
                                                                    id={`image-upload-input1-${index}`}
                                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                    onChange={(event) => {
                                                                        handleFileChanges(event);
                                                                        handleFileChange4(index, event);
                                                                    }}
                                                                    style={{ display: "none" }}
                                                                />
                                                                <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                    Photo
                                                                </Button>
                                                                <TextField label="Attachment" type="text" size="small" variant="outlined" value={image.name} disabled />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </Grid>
                                            ))}
                                            <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                <Button variant="contained" color="primary" onClick={() => setIsEdit(false)} style={{ marginRight: "10px" }}>
                                                    Back
                                                </Button>
                                                <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                    Save
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                </DialogContent>
                            </Dialog>
                            <Grid item xs={8}>
                                {fileSets.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-document-${fileSet.id}`}
                                                onChange={(e) => handleFileChange(e, index)}
                                                multiple
                                            />
                                            <label htmlFor={`upload-document-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Document Upload {index + 1}
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <TextField
                                                label={`Attachments ${index + 1}`}
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.map(file => file.name).join(", ")}
                                                disabled={!fileSet.files.length}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDeleteFileSet(fileSet.id)}
                                                style={{
                                                    position: "absolute",
                                                    cursor: "pointer",
                                                    color: "red",
                                                    fontSize: "16px",
                                                    background: "white",
                                                    borderRadius: "50%",
                                                    padding: "2px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                                <Grid item sm={2}>
                                    <Button variant="contained" color="primary" onClick={addMoreFileInput}>
                                        Add More
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
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
                                        disabled={!updateCheckingData.detailsEdit}
                                    />
                                </div>
                            </div>
                        </div>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={updateCheckingData.detailsEdit}
                                            onChange={handleCheckboxChang}
                                            name="detailsEdit"
                                        />
                                    }
                                    label="Details Edit" style={{ color: 'red' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="key">
                            <div className="scroll-box">
                                {AliasesData.map((Aliases, index) => (
                                    <div key={index} className="person-container">
                                        {AliasesData.length > 1 && updateCheckingData.addressEdit && (
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
                                                disabled={!updateCheckingData.addressEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.addressEdit && (
                                                <div className="add-button" onClick={handleAddAliasesNameField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <div className="key">
                            <div className="scroll-box">
                                {Address.map((address, index) => (
                                    <div key={index} className="person-container">
                                        {Address.length > 1 && updateCheckingData.addressEdit && (
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
                                                autoComplete="off"
                                                multiline
                                                value={address.address}
                                                onChange={(e) => {
                                                    handleAddressChange(e.target.value, index);
                                                }}
                                                disabled={!updateCheckingData.addressEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.addressEdit && (
                                                <div className="add-button" onClick={handleAddPAddressField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Grid container spacing={1}>
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {/* <FormControlLabel
                                    control={
                                        <Checkbox style={{color:'red'}} checked={updateCheckingData.addressEdit} onChange={handleChangeCheckbox} name="updateCheckingData.addressEdit"
                                        /> */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={updateCheckingData.addressEdit}
                                            onChange={handleCheckboxChang}
                                            name="addressEdit"
                                        />
                                    }
                                    label="Address Edit" style={{ color: 'red' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="key">
                            <div className="scroll-box">
                                {caseData.map((data, index) => (
                                    <div key={index} className="person-container">
                                        {caseData.length > 1 && updateCheckingData.caseEdit && (
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
                                                value={data.caseDetails}
                                                onChange={(e) => {
                                                    handlecasaeChange(e.target.value, index);
                                                }}
                                                disabled={!updateCheckingData.caseEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.caseEdit && (
                                                <div className="add-button" onClick={handleAddcaseField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Unique Number
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}} checked={includeCaseSRequest} onChange={handleChangeCheckbox} name="includeCaseSRequest"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.caseEdit}
                                        onChange={handleCheckboxChang}
                                        name="caseEdit"
                                    />
                                }
                                label="Case Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>COUNTRY DETAILS</h5>
                        <div className="scrollablebox">
                            {CountryData.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {CountryData.length > 1 && updateCheckingData.countryEdit && (
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
                                                                        value={person.countryId}
                                                                        onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
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
                                                                        value={person.countryHqId}
                                                                        onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
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
                                                                        value={person.identificationNumberId}
                                                                        onChange={(e) => handlerelative(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
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
                                                                    disabled={!updateCheckingData.countryEdit}
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
                                                                    disabled={!updateCheckingData.countryEdit}
                                                                />
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="contact-label">Contact</InputLabel>
                                                                    <Select
                                                                        labelId="contact-label"
                                                                        id="Contact"
                                                                        value={person.contactId}
                                                                        onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                    //onChange={handleSelectChange}
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
                                                                    disabled={!updateCheckingData.countryEdit}
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
                                    // style={{ width: '17%',display:'flex' }}
                                    startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setCountryData([...CountryData, {
                                        countryId: 0,
                                        recordTypeId: 0,
                                        cmsId: 0,
                                        countryHqId: 0,
                                        identificationNumberId: 0,
                                        identificationNum: '',
                                        identificationDetails: '',
                                        contactId: 0,
                                        contactName: ''
                                    }])} disabled={!updateCheckingData.countryEdit}>
                                    Add Country Details
                                </Button>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                                control={
                                                    <Checkbox style={{color:'red'}}checked={updateCheckingData.countryEdit} onChange={handleChangeCheckbox} name="updateCheckingData.countryEdit"
                                                    /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.countryEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="countryEdit"
                                                />
                                            }
                                            label="Country Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Grid container spacing={2}>
                    <span style={{ marginLeft: '1%' }}><h5>ORGANIZATION</h5></span>
                    <Grid item xs={12}>
                        <div className="key">
                            <div className="person-container">
                                <div className="field-group-column">
                                    <TextField
                                        id="organization"
                                        label="Organization"
                                        variant="standard"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        name="organizations"
                                        // value={organization[0].organizationDetails}
                                        value={organization.length > 0 ? organization[0].organizationDetails || '' : ''}
                                        onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                        multiline
                                        disabled={!updateCheckingData.organizationDetailsEdit!}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}}checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.organizationDetailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="organizationDetailsEdit"
                                    />
                                }
                                label="Organization Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
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
                                        {BankformData.length > 1 && updateCheckingData.bankEdit && (
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
                                                                            value={person.bankId}
                                                                            onChange={(e) => handlebank(personIndex, e.target.value as number)}
                                                                            disabled={!updateCheckingData.bankEdit}
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
                                                                        disabled={!updateCheckingData.bankEdit}
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
                                                                        disabled={!updateCheckingData.bankEdit}
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
                                        disabled={!updateCheckingData.bankEdit}
                                    >
                                        Add Bank Details
                                    </Button>
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                            control={
                                                <Checkbox style={{color:'red'}} checked={updateCheckingData.bankEdit} onChange={handleChangeCheckbox} name="updateCheckingData.bankEdit"
                                                /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.bankEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="bankEdit"
                                                />
                                            }
                                            label="Bank Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
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
                        <h5>LINKED INDIVIDUAL</h5>
                        <div className="scrollablebox">
                            {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {indOrgformData.indOrgCommonDTO.length > 1 && updateCheckingData.linkedIndividualEdit && (
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
                                            disabled={!updateCheckingData.linkedIndividualEdit}
                                        />
                                        {selectedRecordType === '2' && (
                                            <TextField
                                                style={{ width: '20%' }}
                                                label="Position"
                                                variant="standard"
                                                type="text"
                                                name="Position"
                                                autoComplete="off"
                                                value={person.positionsDTO.position}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                }
                                                disabled={!updateCheckingData.linkedIndividualEdit}
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                    />
                                                                    <FontAwesomeIcon
                                                                        icon={faTrash}
                                                                        className="delete-icon"
                                                                        onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                    />
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                    </div>
                                                                )}
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
                                                                        person &&
                                                                            Array.isArray(person.relationDTOS) && person.relationDTOS.length > 0 &&
                                                                            Array.isArray(person.identificationDTOS) && person.identificationDTOS.length > 0
                                                                            ? person.relationDTOS[0].relativeMasterId !== 0
                                                                                ? person.relationDTOS[0].relativeMasterId
                                                                                : person.identificationDTOS[0].relativeMasterId
                                                                            : ''
                                                                    }
                                                                    onChange={(e) => handlerelativeChanges(personIndex, e.target.value as number)}
                                                                    disabled={!updateCheckingData.linkedIndividualEdit}
                                                                >
                                                                    <MenuItem value={''} style={{ color: "gray" }}>Select Relative List</MenuItem>
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
                                                                    disabled={!updateCheckingData.linkedIndividualEdit}
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
                                                                disabled={!updateCheckingData.linkedIndividualEdit}
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                        autoComplete="off"
                                                                        value={RelationnName.relationAliasesName}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChangsrelationIndex(personIndex, 'relationAliasesName', RelationnNameIndex, event)
                                                                        }
                                                                    />
                                                                    {updateCheckingData.linkedIndividualEdit && (
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousefather(personIndex, 'relationAliasesName', RelationnNameIndex)}
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'RelationnName')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Relationship Name
                                                                    </div>
                                                                )}
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                    />
                                                                    {updateCheckingData.linkedIndividualEdit && (
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousemother(personIndex, 'detailsAboutRelation', casedetailsIndex)}
                                                                        />)}
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'casedetails')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Details about the Relation
                                                                    </div>
                                                                )}
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
                                    style={{ width: '54%' }}
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
                                                            relativeMasterId: 0,
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
                                    disabled={!updateCheckingData.linkedIndividualEdit}
                                >
                                    Add Linked Individual
                                </Button>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                                control={
                                                    <Checkbox style={{color:'red'}}checked={inclueLinkedRequest} onChange={handleChangeCheckbox} name="inclueLinkedRequest"
                                                    /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.linkedIndividualEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="linkedIndividualEdit"
                                                />
                                            }
                                            label="Linked Individual Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div>
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
                                        fullWidth
                                        size="small"
                                        name="caseDetails"
                                        value={caseDetails[0].caseDetails}
                                        onChange={(e) => handleCaseDetailsChange(e, 0)}
                                        multiline
                                        disabled={!updateCheckingData.caseDetailsEdit!}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}}checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.caseDetailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="caseDetailsEdit"
                                    />
                                }
                                label="Case Details Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </>
        );
    };

    // Individual Edit part
    const renderIndividualFields = () => {
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
                            disabled={!updateCheckingData.detailsEdit}
                        />
                    </Grid>
                </Grid>
                <div className="card-body">
                    <Box m={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                {fileSetd.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        {/* File Upload Button */}
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-image-${fileSet.id}`}
                                                onChange={(e) => handleFileChanged(e, index)}
                                            />
                                            <label htmlFor={`upload-image-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Image Upload
                                                </Button>
                                            </label>
                                        </Grid>
                                        {/* Display Uploaded File Name */}
                                        <Grid item sm={4}>
                                            <TextField
                                                label="Image Attachment"
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                disabled
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item sm={2}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {pdfList.map((file: PDFFile) => (
                                        <div key={file.fileId} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div
                                                style={{
                                                    border: "1px solid #ccc",
                                                    padding: "10px",
                                                    width: "200px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleFileClick(String(file.fileId), file.fileName, file.documentType, file.isProfileImage)}
                                            >
                                                <h6>{file.fileName}</h6>
                                            </div>
                                            <IconButton onClick={() => handleOpenModal(file)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </Grid>
                            <Dialog open={openModal} onClose={handleCloseModal}>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete this file?
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseModal} color="primary">
                                        No
                                    </Button>
                                    <Button onClick={handleConfirmDelete} color="error">
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                open={showModal}
                                onClose={() => setShowModal(false)}
                                maxWidth="lg"
                                fullWidth
                                PaperProps={{
                                    style: { backgroundColor: "transparent", boxShadow: "none" }
                                }}
                            >
                                <Paper style={{ padding: 16, position: "relative" }}>
                                    <DialogTitle>Image Preview</DialogTitle>
                                    <DialogContent
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexDirection: "column"
                                        }}
                                    >
                                        {!isEditing ? (
                                            // Image Preview Mode
                                            <>
                                                {selectedImage && (
                                                    <img
                                                        src={selectedImage}
                                                        alt="Preview"
                                                        style={{
                                                            maxWidth: "100%",
                                                            maxHeight: "100%",
                                                            transform: `scale(${zoomLevel})`,
                                                            transition: "transform 0.2s ease-in-out"
                                                        }}
                                                    />
                                                )}
                                                <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        style={{ marginRight: "10px" }}
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => setShowModal(false)}
                                                    >
                                                        Close
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            // File Upload Section
                                            <Grid container spacing={2} style={{ width: "100%" }}>
                                                {images.map((image, index) => (
                                                    <Grid item xs={12} key={index}>
                                                        <form encType="multipart/form-data">
                                                            <div>
                                                                <div className="field-group-column">
                                                                    <input
                                                                        type="file"
                                                                        id={`image-upload-input1-${index}`}
                                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                        onChange={(event) => {
                                                                            handleFileChanges(event);
                                                                            handleFileChange4(index, event);
                                                                        }}
                                                                        style={{ display: "none" }}
                                                                    />
                                                                    <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                        Photo
                                                                    </Button>
                                                                    <TextField
                                                                        label="Attachment"
                                                                        type="text"
                                                                        size="small"
                                                                        variant="outlined"
                                                                        value={image.name}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </Grid>
                                                ))}
                                                <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                    {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                    <Button variant="contained" color="primary" onClick={() => setIsEditing(false)} style={{ marginRight: "10px" }}>
                                                        Back
                                                    </Button>
                                                    <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                        Save
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </DialogContent>
                                </Paper>
                            </Dialog>
                            <Dialog open={showPdfModal} onClose={() => setShowPdfModal(false)} maxWidth="lg" fullWidth>
                                <DialogTitle>PDF Preview</DialogTitle>
                                <DialogContent>
                                    {!isEdit ? (
                                        <>
                                            {pdfData.base64 && (
                                                <>
                                                    <iframe
                                                        title="PDF Preview"
                                                        width="100%"
                                                        height="500px"
                                                        style={{ border: "none" }}
                                                        src={`data:application/pdf;base64,${pdfData.base64}`}
                                                    />
                                                    {pdfData.filename && (
                                                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                                                            <a
                                                                href={`data:application/pdf;base64,${pdfData.base64}`}
                                                                download={pdfData.filename}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    textDecoration: "none",
                                                                    padding: "10px",
                                                                    backgroundColor: "#2a75bb",
                                                                    color: "white",
                                                                    borderRadius: "5px",
                                                                    cursor: "pointer",
                                                                    display: "inline-block",
                                                                }}
                                                            >
                                                                Download PDF
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                        <Button variant="contained" color="primary" onClick={() => setIsEdit(true)} style={{ marginRight: "10px" }}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={() => setShowPdfModal(false)}>
                                                            Close
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        // File Upload Section
                                        <Grid container spacing={2} style={{ width: "100%" }}>
                                            {images.map((image, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <form encType="multipart/form-data">
                                                        <div>
                                                            <div className="field-group-column">
                                                                <input
                                                                    type="file"
                                                                    id={`image-upload-input1-${index}`}
                                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                    onChange={(event) => {
                                                                        handleFileChanges(event);
                                                                        handleFileChange4(index, event);
                                                                    }}
                                                                    style={{ display: "none" }}
                                                                />
                                                                <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                    Photo
                                                                </Button>
                                                                <TextField label="Attachment" type="text" size="small" variant="outlined" value={image.name} disabled />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </Grid>
                                            ))}
                                            <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                <Button variant="contained" color="primary" onClick={() => setIsEdit(false)} style={{ marginRight: "10px" }}>
                                                    Back
                                                </Button>
                                                <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                    Save
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                </DialogContent>
                            </Dialog>
                            <Grid item xs={8}>
                                {fileSets.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-document-${fileSet.id}`}
                                                onChange={(e) => handleFileChange(e, index)}
                                                multiple
                                            />
                                            <label htmlFor={`upload-document-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Document Upload {index + 1}
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <TextField
                                                label={`Attachments ${index + 1}`}
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.map(file => file.name).join(", ")}
                                                disabled={!fileSet.files.length}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDeleteFileSet(fileSet.id)}
                                                style={{
                                                    position: "absolute",
                                                    cursor: "pointer",
                                                    color: "red",
                                                    fontSize: "16px",
                                                    background: "white",
                                                    borderRadius: "50%",
                                                    padding: "2px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                                <Grid item sm={2}>
                                    <Button variant="contained" color="primary" onClick={addMoreFileInput}>
                                        Add More
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
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
                            disabled={!updateCheckingData.detailsEdit}
                        />
                        <Grid item xs={12}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}} checked={updateCheckingData.detailsEdit} onChange={handleChangeCheckbox} name="updateCheckingData.detailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.detailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="detailsEdit"
                                    />
                                }
                                label="Details Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <div className="key">
                            <div className="scroll-box">
                                {AliasesData.map((Aliases, index) => (
                                    <div key={index} className="person-container">
                                        {AliasesData.length > 1 && updateCheckingData.addressEdit && (
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
                                                disabled={!updateCheckingData.addressEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.addressEdit && (
                                                <div className="add-button" onClick={handleAddAliasesNameField} >
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                                </div>
                                            )}
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
                                            disabled={!updateCheckingData.detailsEdit}
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
                    <Grid item xs={12}>
                        <div className="key">
                            <div className="scroll-box">
                                {PartyformData.map((partyformData, index) => (
                                    <div key={index} className="person-container">
                                        {PartyformData.length > 1 && updateCheckingData.addressEdit && (
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
                                                    disabled={!updateCheckingData.addressEdit}
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
                                                    disabled={!updateCheckingData.addressEdit}
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
                                                    disabled={!updateCheckingData.addressEdit}
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
                                            {updateCheckingData.addressEdit && (
                                                <div className="add-button" onClick={handleAddPartyformDataField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More dob & birthYearAlone & placeOfBirth
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <div className="key">
                            <div className="person-container">
                                <div className="field-group-column">
                                    <FormControl fullWidth variant="standard" size="small">
                                        <InputLabel id="dead-label">Dead</InputLabel>
                                        <Select
                                            labelId="Dead-label"
                                            id='Dead'
                                            value={DetailsData.deadId ? DetailsData.deadId.toString() : ""}
                                            onChange={(event: SelectChangeEvent<string>) => {
                                                handledead(event);
                                            }}
                                            disabled={!updateCheckingData.addressEdit}
                                        >
                                            <MenuItem value={''} style={{ color: "gray" }}>Select Dead</MenuItem>
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
                    <Grid item xs={8}>
                        <div className="key">
                            <div className="scroll-box">
                                {Address.map((address, index) => (
                                    <div key={index} className="person-container">
                                        {Address.length > 1 && updateCheckingData.addressEdit && (
                                            <button className="close-button" onClick={() => handleRemoveBoxAddress(index)} disabled={!updateCheckingData.addressEdit}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        )}
                                        <div className="field-group-column">
                                            <TextField
                                                style={{ width: '100%' }}
                                                label="Address"
                                                variant="standard"
                                                type="text"
                                                size="small"
                                                autoComplete="off"
                                                value={address.address}
                                                multiline
                                                onChange={(e) => {
                                                    handleAddressChange(e.target.value, index);
                                                }}
                                                disabled={!updateCheckingData.addressEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.addressEdit && (
                                                <div className="add-button" onClick={handleAddPAddressField}  >
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox  style={{color:'red'}} checked={updateCheckingData.addressEdit} onChange={handleChangeCheckbox} name="updateCheckingData.addressEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.addressEdit}
                                        onChange={handleCheckboxChang}
                                        name="addressEdit"
                                    />
                                }
                                label="Address Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <div className="key">
                                <div className="scroll-box">
                                    {PositionsData.map((positions, index) => (
                                        <div key={index} className="person-container">
                                            {PositionsData.length > 1 && updateCheckingData.positionEdit && (
                                                <div className="close-button" onClick={() => handleRemovepositionAddress(index)}  >
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
                                                    disabled={!updateCheckingData.positionEdit}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="field-group">
                                    <div className="field-group-container">
                                        <div className="field-group-row">
                                            <div className="field label">
                                                {updateCheckingData.positionEdit && (
                                                    <button className="add-button" onClick={handleAddPsotionsField} disabled={!updateCheckingData.positionEdit}>
                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Position
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {/* <FormControlLabel
                                    control={
                                        <Checkbox style={{color:'red'}} checked={updateCheckingData.positionEdit} onChange={handleChangeCheckbox} name="updateCheckingData.positionEdit"
                                        /> */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={updateCheckingData.positionEdit}
                                            onChange={handleCheckboxChang}
                                            name="positionEdit"
                                        />
                                    }
                                    label="Position Edit" style={{ color: 'red' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <div className="key">
                                <div className="scroll-box">
                                    {caseData.map((Case, index) => (
                                        <div key={index} className="person-container">
                                            {caseData.length > 1 && updateCheckingData.caseEdit && (
                                                <button className="close-button" onClick={() => handleRemovecaseAddress(index)} disabled={!updateCheckingData.caseEdit}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
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
                                                    disabled={!updateCheckingData.caseEdit}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="field-group">
                                    <div className="field-group-container">
                                        <div className="field-group-row">
                                            <div className="field label">
                                                {updateCheckingData.caseEdit && (
                                                    <div className="add-button" onClick={handleAddcaseField}>
                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Unique Number
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {/* <FormControlLabel
                                    control={
                                        <Checkbox style={{color:'red'}} checked={updateCheckingData.caseEdit} onChange={handleChangeCheckbox} name="updateCheckingData.caseEdit"
                                        /> */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={updateCheckingData.caseEdit}
                                            onChange={handleCheckboxChang}
                                            name="caseEdit"
                                        />
                                    }
                                    label="Case Edit" style={{ color: 'red' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>COUNTRY DETAILS</h5>
                        <div className="scrollablebox">
                            {CountryData.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {CountryData.length > 1 && updateCheckingData.countryEdit && (
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
                                                                        value={person.countryId}
                                                                        onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
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
                                                                        value={person.countryHqId}
                                                                        onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                        variant="standard"
                                                                        type="text"
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
                                                                        value={person.identificationNumberId}
                                                                        onChange={(e) => handlerelative(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
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
                                                                    disabled={!updateCheckingData.countryEdit}
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
                                                                    disabled={!updateCheckingData.countryEdit}
                                                                />
                                                                <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                    <InputLabel id="contact-label">Contact</InputLabel>
                                                                    <Select
                                                                        labelId="contact-label"
                                                                        id="Contact"
                                                                        value={person.contactId}
                                                                        onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                    //onChange={handleSelectChange}
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
                                                                    disabled={!updateCheckingData.countryEdit}
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
                                    style={{ width: '24%' }}
                                    startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setCountryData([...CountryData, {
                                        countryId: 0,
                                        recordTypeId: 0,
                                        cmsId: 0,
                                        countryHqId: 0,
                                        identificationNumberId: 0,
                                        identificationNum: '',
                                        identificationDetails: '',
                                        contactId: 0,
                                        contactName: ''
                                    }])} disabled={!updateCheckingData.countryEdit}>
                                    Add Country Details
                                </Button>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                                    control={
                                                        <Checkbox style={{color:'red'}} checked={updateCheckingData.countryEdit} onChange={handleChangeCheckbox} name="updateCheckingData.countryEdit"
                                                        /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.countryEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="countryEdit"
                                                />
                                            }
                                            label="Country Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div>
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
                                        id="organization"
                                        label="Organization"
                                        variant="standard"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        name="organizations"
                                        value={organization.length > 0 ? organization[0].organizationDetails || '' : ''}
                                        onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                        multiline
                                        disabled={!updateCheckingData.organizationDetailsEdit!}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}}checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.organizationDetailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="organizationDetailsEdit"
                                    />
                                }
                                label="Organization Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>LINKED INDIVIDUAL</h5>
                        <div className="scrollablebox">
                            {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {indOrgformData.indOrgCommonDTO.length > 1 && updateCheckingData.linkedIndividualEdit && (
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
                                            disabled={!updateCheckingData.linkedIndividualEdit}
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
                                                disabled={!updateCheckingData.linkedIndividualEdit}
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                    />
                                                                    {updateCheckingData.linkedIndividualEdit && (
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}  >
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                    </div>
                                                                )}
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
                                                                    disabled={!updateCheckingData.linkedIndividualEdit}
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                        autoComplete="off"
                                                                        value={RelationnName.relationAliasesName}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChangsrelationIndex(personIndex, 'relationAliasesName', RelationnNameIndex, event)
                                                                        }
                                                                    />
                                                                    {updateCheckingData.linkedIndividualEdit && (
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousefather(personIndex, 'relationAliasesName', RelationnNameIndex)}
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'RelationnName')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} />  Add More Relationship Name
                                                                    </div>
                                                                )}
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                    />
                                                                    {updateCheckingData.linkedIndividualEdit && (
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousemother(personIndex, 'detailsAboutRelation', casedetailsIndex)}
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'casedetails')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Details about the Relation
                                                                    </div>
                                                                )}
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
                                    style={{ width: '54%' }}
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
                                                            relativeMasterId: 0,
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
                                    disabled={!updateCheckingData.linkedIndividualEdit}
                                >
                                    Add Linked Individual
                                </Button>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                                control={
                                                    <Checkbox style={{color:'red'}} checked={updateCheckingData.linkedIndividualEdit} onChange={handleChangeCheckbox} name="updateCheckingData.linkedIndividualEdit"
                                                    /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.linkedIndividualEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="linkedIndividualEdit"
                                                />
                                            }
                                            label="Linked Individual Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
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
                        <h5>BANK DETAILS INVOLVED CASE</h5>
                        <div>
                            <div className="scrollablebox">
                                {BankformData.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {BankformData.length > 1 && updateCheckingData.bankEdit && (
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
                                                                            value={person.bankId}
                                                                            onChange={(e) => handlebank(personIndex, e.target.value as number)}
                                                                            disabled={!updateCheckingData.bankEdit}
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
                                                                        disabled={!updateCheckingData.bankEdit}
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
                                                                        disabled={!updateCheckingData.bankEdit}
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
                                        disabled={!updateCheckingData.bankEdit}
                                    >
                                        Add COUNTRY Details
                                    </Button>
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                            control={
                                                <Checkbox style={{color:'red'}} checked={updateCheckingData.bankEdit} onChange={handleChangeCheckbox} name="updateCheckingData.bankEdit"
                                                /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.bankEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="bankEdit"
                                                />
                                            }
                                            label="Bank Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
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
                                                disabled={!updateCheckingData.comapnyEdit}
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
                                                disabled={!updateCheckingData.comapnyEdit}
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
                                                disabled={!updateCheckingData.comapnyEdit}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleInputChange(personIndex, 'address', event)
                                                }
                                            />
                                            <FormControl style={{ width: '50%' }} variant="standard" size="small">
                                                <InputLabel id="state-label">State</InputLabel>
                                                <Select
                                                    labelId="state-label"
                                                    id='State'
                                                    value={person.companyDetailsDTOS.stateId}
                                                    disabled={!updateCheckingData.comapnyEdit}
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
                                                    value={person.companyDetailsDTOS.identificationNumberId}
                                                    disabled={!updateCheckingData.comapnyEdit}
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
                                                disabled={!updateCheckingData.comapnyEdit}
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
                                                                            disabled={!updateCheckingData.comapnyEdit}
                                                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                                handleAliasChange(personIndex, aliasIndex, 'aliasesName', event)
                                                                            }
                                                                        />
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteAlias(personIndex, aliasIndex)}
                                                                        //disabled={!updateCheckingData.comapnyEdit}
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
                                        startIcon={<FontAwesomeIcon icon={faPlus} />
                                        }
                                        onClick={handleAddCompany}
                                        disabled={!updateCheckingData.comapnyEdit}
                                    >
                                        Add Linked Company Details
                                    </Button>
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.comapnyEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="comapnyEdit"
                                                />
                                            }
                                            label="Company Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
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
                                        disabled={!updateCheckingData.caseDetailsEdit}
                                        multiline
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {/* <FormControlLabel
                            control={
                                <Checkbox style={{color:'red'}} checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                /> */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={updateCheckingData.caseDetailsEdit}
                                    onChange={handleCheckboxChang}
                                    name="caseDetailsEdit"
                                />
                            }
                            label="Case Details Edit" style={{ color: 'red' }}
                        />
                    </Grid>
                </Grid>
            </>
        );
    };

    // Ship Edit part
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
                            disabled={!updateCheckingData.detailsEdit}
                        />
                    </Grid>
                </Grid>
                <div className="card-body">
                    <Box m={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                {fileSetd.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        {/* File Upload Button */}
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-image-${fileSet.id}`}
                                                onChange={(e) => handleFileChanged(e, index)}
                                            />
                                            <label htmlFor={`upload-image-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Image Upload
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <TextField
                                                label="Image Attachment"
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                disabled
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item sm={2}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {pdfList.map((file: PDFFile) => (
                                        <div key={file.fileId} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div
                                                style={{
                                                    border: "1px solid #ccc",
                                                    padding: "10px",
                                                    width: "200px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleFileClick(String(file.fileId), file.fileName, file.documentType, file.isProfileImage)}
                                            >
                                                <h6>{file.fileName}</h6>
                                            </div>
                                            <IconButton onClick={() => handleOpenModal(file)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </Grid>
                            <Dialog open={openModal} onClose={handleCloseModal}>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete this file?
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseModal} color="primary">
                                        No
                                    </Button>
                                    <Button onClick={handleConfirmDelete} color="error">
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                open={showModal}
                                onClose={() => setShowModal(false)}
                                maxWidth="lg"
                                fullWidth
                                PaperProps={{
                                    style: { backgroundColor: "transparent", boxShadow: "none" }
                                }}
                            >
                                <Paper style={{ padding: 16, position: "relative" }}>
                                    <DialogTitle>Image Preview</DialogTitle>
                                    <DialogContent
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexDirection: "column"
                                        }}
                                    >
                                        {!isEditing ? (
                                            <>
                                                {selectedImage && (
                                                    <img
                                                        src={selectedImage}
                                                        alt="Preview"
                                                        style={{
                                                            maxWidth: "100%",
                                                            maxHeight: "100%",
                                                            transform: `scale(${zoomLevel})`,
                                                            transition: "transform 0.2s ease-in-out"
                                                        }}
                                                    />
                                                )}
                                                <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        style={{ marginRight: "10px" }}
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => setShowModal(false)}
                                                    >
                                                        Close
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            // File Upload Section
                                            <Grid container spacing={2} style={{ width: "100%" }}>
                                                {images.map((image, index) => (
                                                    <Grid item xs={12} key={index}>
                                                        <form encType="multipart/form-data">
                                                            <div>
                                                                <div className="field-group-column">
                                                                    <input
                                                                        type="file"
                                                                        id={`image-upload-input1-${index}`}
                                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                        onChange={(event) => {
                                                                            handleFileChanges(event);
                                                                            handleFileChange4(index, event);
                                                                        }}
                                                                        style={{ display: "none" }}
                                                                    />
                                                                    <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                        Photo
                                                                    </Button>
                                                                    <TextField
                                                                        label="Attachment"
                                                                        type="text"
                                                                        size="small"
                                                                        variant="outlined"
                                                                        value={image.name}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </Grid>
                                                ))}
                                                <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                    {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                    <Button variant="contained" color="primary" onClick={() => setIsEditing(false)} style={{ marginRight: "10px" }}>
                                                        Back
                                                    </Button>
                                                    <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                        Save
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </DialogContent>
                                </Paper>
                            </Dialog>
                            <Dialog open={showPdfModal} onClose={() => setShowPdfModal(false)} maxWidth="lg" fullWidth>
                                <DialogTitle>PDF Preview</DialogTitle>
                                <DialogContent>
                                    {!isEdit ? (
                                        <>
                                            {pdfData.base64 && (
                                                <>
                                                    <iframe
                                                        title="PDF Preview"
                                                        width="100%"
                                                        height="500px"
                                                        style={{ border: "none" }}
                                                        src={`data:application/pdf;base64,${pdfData.base64}`}
                                                    />
                                                    {pdfData.filename && (
                                                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                                                            <a
                                                                href={`data:application/pdf;base64,${pdfData.base64}`}
                                                                download={pdfData.filename}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    textDecoration: "none",
                                                                    padding: "10px",
                                                                    backgroundColor: "#2a75bb",
                                                                    color: "white",
                                                                    borderRadius: "5px",
                                                                    cursor: "pointer",
                                                                    display: "inline-block",
                                                                }}
                                                            >
                                                                Download PDF
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                        <Button variant="contained" color="primary" onClick={() => setIsEdit(true)} style={{ marginRight: "10px" }}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={() => setShowPdfModal(false)}>
                                                            Close
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <Grid container spacing={2} style={{ width: "100%" }}>
                                            {images.map((image, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <form encType="multipart/form-data">
                                                        <div>
                                                            <div className="field-group-column">
                                                                <input
                                                                    type="file"
                                                                    id={`image-upload-input1-${index}`}
                                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                    onChange={(event) => {
                                                                        handleFileChanges(event);
                                                                        handleFileChange4(index, event);
                                                                    }}
                                                                    style={{ display: "none" }}
                                                                />
                                                                <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                    Photo
                                                                </Button>
                                                                <TextField label="Attachment" type="text" size="small" variant="outlined" value={image.name} disabled />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </Grid>
                                            ))}
                                            <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                <Button variant="contained" color="primary" onClick={() => setIsEdit(false)} style={{ marginRight: "10px" }}>
                                                    Back
                                                </Button>
                                                <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                    Save
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                </DialogContent>
                            </Dialog>
                            <Grid item xs={8}>
                                {fileSets.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-document-${fileSet.id}`}
                                                onChange={(e) => handleFileChange(e, index)}
                                                multiple
                                            />
                                            <label htmlFor={`upload-document-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Document Upload {index + 1}
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <TextField
                                                label={`Attachments ${index + 1}`}
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.map(file => file.name).join(", ")}
                                                disabled={!fileSet.files.length}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDeleteFileSet(fileSet.id)}
                                                style={{
                                                    position: "absolute",
                                                    cursor: "pointer",
                                                    color: "red",
                                                    fontSize: "16px",
                                                    background: "white",
                                                    borderRadius: "50%",
                                                    padding: "2px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                                <Grid item sm={2}>
                                    <Button variant="contained" color="primary" onClick={addMoreFileInput}>
                                        Add More
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
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
                            disabled={!updateCheckingData.detailsEdit}
                        />
                        <Grid item xs={12}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}} checked={updateCheckingData.detailsEdit} onChange={handleChangeCheckbox} name="updateCheckingData.detailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.detailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="detailsEdit"
                                    />
                                }
                                label="Details Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <div className="key">
                            <div className="scroll-box">
                                {AliasesData.map((Aliases, index) => (
                                    <div key={index} className="person-container">
                                        {AliasesData.length > 1 && updateCheckingData.addressEdit && (
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
                                                disabled={!updateCheckingData.addressEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.addressEdit && (
                                                <div className="add-button" onClick={handleAddAliasesNameField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                                </div>
                                            )}
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
                            disabled={!updateCheckingData.detailsEdit}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <div className="key">
                        <div className="scroll-box">
                            {Address.map((address, index) => (
                                <div key={index} className="person-container">
                                    {Address.length > 1 && updateCheckingData.addressEdit && (
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
                                            autoComplete="off"
                                            value={address.address}
                                            multiline
                                            onChange={(e) => {
                                                handleAddressChange(e.target.value, index);
                                            }}
                                            disabled={!updateCheckingData.addressEdit}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="field-group">
                            <div className="field-group-container">
                                <div className="field-group-row">
                                    <div className="field label">
                                        {updateCheckingData.addressEdit && (
                                            <div className="add-button" onClick={handleAddPAddressField}>
                                                <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Grid container spacing={1}>
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {/* <FormControlLabel
                                    control={
                                        <Checkbox style={{color:'red'}} checked={updateCheckingData.addressEdit} onChange={handleChangeCheckbox} name="updateCheckingData.addressEdit"
                                        /> */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={updateCheckingData.addressEdit}
                                            onChange={handleCheckboxChang}
                                            name="addressEdit"
                                        />
                                    }
                                    label="Address Edit" style={{ color: 'red' }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>COUNTRY DETAILS</h5>
                        <div className="details-containers">
                            <div className="scrollablebox">
                                {CountryData.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {CountryData.length > 1 && updateCheckingData.countryEdit && (
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
                                                                            value={person.countryId}
                                                                            onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                            disabled={!updateCheckingData.countryEdit}
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
                                                                            value={person.countryHqId}
                                                                            onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                            disabled={!updateCheckingData.countryEdit}
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
                                                                        disabled={!updateCheckingData.countryEdit}
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
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                    />
                                                                    <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                        <InputLabel id="contact-label">Contact</InputLabel>
                                                                        <Select
                                                                            labelId="contact-label"
                                                                            id="Contact"
                                                                            value={person.contactId}
                                                                            onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                            //onChange={handleSelectChange}
                                                                            size="small"
                                                                            disabled={!updateCheckingData.countryEdit}
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
                                                                        disabled={!updateCheckingData.countryEdit}
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
                                        style={{ width: '24%' }}
                                        startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setCountryData([...CountryData, {
                                            countryId: 0,
                                            recordTypeId: 0,
                                            cmsId: 0,
                                            countryHqId: 0,
                                            identificationNumberId: 0,
                                            identificationNum: '',
                                            identificationDetails: '',
                                            contactId: 0,
                                            contactName: ''
                                        }])} disabled={!updateCheckingData.countryEdit}>
                                        Add Country Details
                                    </Button>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            {/* <FormControlLabel
                                                    control={
                                                        <Checkbox style={{color:'red'}}checked={updateCheckingData.countryEdit} onChange={handleChangeCheckbox} name="updateCheckingData.countryEdit"
                                                        /> */}
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={updateCheckingData.countryEdit}
                                                        onChange={handleCheckboxChang}
                                                        name="countryEdit"
                                                    />
                                                }
                                                label="Country Edit" style={{ color: 'red' }}
                                            />
                                        </Grid>
                                    </Grid>
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
                                        id="organization"
                                        label="Organization"
                                        variant="standard"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        name="organizations"
                                        value={organization.length > 0 ? organization[0].organizationDetails || '' : ''}
                                        onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                        multiline
                                        disabled={!updateCheckingData.organizationDetailsEdit!}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}}checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.organizationDetailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="organizationDetailsEdit"
                                    />
                                }
                                label="Organization Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h4>LINKED INDIVIDUAL</h4>
                        <div className="details-containers">
                            <div className="scrollablebox">
                                {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {indOrgformData.indOrgCommonDTO.length > 1 && updateCheckingData.linkedIndividualEdit && (
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
                                                disabled={!updateCheckingData.linkedIndividualEdit}
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
                                                                            disabled={!updateCheckingData.linkedIndividualEdit}
                                                                        />
                                                                        {updateCheckingData.linkedIndividualEdit &&
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                            />
                                                                        }
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    {updateCheckingData.linkedIndividualEdit && (
                                                                        <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                        </div>
                                                                    )}
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
                                        style={{ width: '54%' }}
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
                                                                relativeMasterId: 0,
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
                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                    >
                                        Add Linked Individual
                                    </Button>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            {/* <FormControlLabel
                                                control={
                                                    <Checkbox style={{color:'red'}}checked={updateCheckingData.linkedIndividualEdit} onChange={handleChangeCheckbox} name="updateCheckingData.linkedIndividualEdit"
                                                    /> */}
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={updateCheckingData.linkedIndividualEdit}
                                                        onChange={handleCheckboxChang}
                                                        name="linkedIndividualEdit"
                                                    />
                                                }
                                                label="Linked Individual Edit" style={{ color: 'red' }}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
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
                                        autoFocus
                                        autoComplete="off"
                                        multiline
                                        disabled={!updateCheckingData.caseDetailsEdit}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {/* <FormControlLabel
                            control={
                                <Checkbox style={{color:'red'}} checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                /> */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={updateCheckingData.caseDetailsEdit}
                                    onChange={handleCheckboxChang}
                                    name="caseDetailsEdit"
                                />
                            }
                            label="Case Details Edit" style={{ color: 'red' }}
                        />
                    </Grid>
                </Grid>
            </>
        );
    };

    // Aircraft Edit part
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
                            disabled={!updateCheckingData.detailsEdit}
                        />
                    </Grid>
                </Grid>
                <div className="card-body">
                    <Box m={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                {fileSetd.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-image-${fileSet.id}`}
                                                onChange={(e) => handleFileChanged(e, index)}
                                            />
                                            <label htmlFor={`upload-image-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Image Upload
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <TextField
                                                label="Image Attachment"
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                disabled
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item sm={2}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {pdfList.map((file: PDFFile) => (
                                        <div key={file.fileId} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div
                                                style={{
                                                    border: "1px solid #ccc",
                                                    padding: "10px",
                                                    width: "200px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleFileClick(String(file.fileId), file.fileName, file.documentType, file.isProfileImage)}
                                            >
                                                <h6>{file.fileName}</h6>
                                            </div>
                                            <IconButton onClick={() => handleOpenModal(file)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </Grid>
                            <Dialog open={openModal} onClose={handleCloseModal}>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete this file?
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseModal} color="primary">
                                        No
                                    </Button>
                                    <Button onClick={handleConfirmDelete} color="error">
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                open={showModal}
                                onClose={() => setShowModal(false)}
                                maxWidth="lg"
                                fullWidth
                                PaperProps={{
                                    style: { backgroundColor: "transparent", boxShadow: "none" }
                                }}
                            >
                                <Paper style={{ padding: 16, position: "relative" }}>
                                    <DialogTitle>Image Preview</DialogTitle>
                                    <DialogContent
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexDirection: "column"
                                        }}
                                    >
                                        {!isEditing ? (
                                            <>
                                                {selectedImage && (
                                                    <img
                                                        src={selectedImage}
                                                        alt="Preview"
                                                        style={{
                                                            maxWidth: "100%",
                                                            maxHeight: "100%",
                                                            transform: `scale(${zoomLevel})`,
                                                            transition: "transform 0.2s ease-in-out"
                                                        }}
                                                    />
                                                )}
                                                <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        style={{ marginRight: "10px" }}
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => setShowModal(false)}
                                                    >
                                                        Close
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <Grid container spacing={2} style={{ width: "100%" }}>
                                                {images.map((image, index) => (
                                                    <Grid item xs={12} key={index}>
                                                        <form encType="multipart/form-data">
                                                            <div>
                                                                <div className="field-group-column">
                                                                    <input
                                                                        type="file"
                                                                        id={`image-upload-input1-${index}`}
                                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                        onChange={(event) => {
                                                                            handleFileChanges(event);
                                                                            handleFileChange4(index, event);
                                                                        }}
                                                                        style={{ display: "none" }}
                                                                    />
                                                                    <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                        Photo
                                                                    </Button>
                                                                    <TextField
                                                                        label="Attachment"
                                                                        type="text"
                                                                        size="small"
                                                                        variant="outlined"
                                                                        value={image.name}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </Grid>
                                                ))}
                                                <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                    {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                    <Button variant="contained" color="primary" onClick={() => setIsEditing(false)} style={{ marginRight: "10px" }}>
                                                        Back
                                                    </Button>
                                                    <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                        Save
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </DialogContent>
                                </Paper>
                            </Dialog>
                            <Dialog open={showPdfModal} onClose={() => setShowPdfModal(false)} maxWidth="lg" fullWidth>
                                <DialogTitle>PDF Preview</DialogTitle>
                                <DialogContent>
                                    {!isEdit ? (
                                        <>
                                            {pdfData.base64 && (
                                                <>
                                                    <iframe
                                                        title="PDF Preview"
                                                        width="100%"
                                                        height="500px"
                                                        style={{ border: "none" }}
                                                        src={`data:application/pdf;base64,${pdfData.base64}`}
                                                    />
                                                    {pdfData.filename && (
                                                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                                                            <a
                                                                href={`data:application/pdf;base64,${pdfData.base64}`}
                                                                download={pdfData.filename}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    textDecoration: "none",
                                                                    padding: "10px",
                                                                    backgroundColor: "#2a75bb",
                                                                    color: "white",
                                                                    borderRadius: "5px",
                                                                    cursor: "pointer",
                                                                    display: "inline-block",
                                                                }}
                                                            >
                                                                Download PDF
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                        <Button variant="contained" color="primary" onClick={() => setIsEdit(true)} style={{ marginRight: "10px" }}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={() => setShowPdfModal(false)}>
                                                            Close
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <Grid container spacing={2} style={{ width: "100%" }}>
                                            {images.map((image, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <form encType="multipart/form-data">
                                                        <div>
                                                            <div className="field-group-column">
                                                                <input
                                                                    type="file"
                                                                    id={`image-upload-input1-${index}`}
                                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                    onChange={(event) => {
                                                                        handleFileChanges(event);
                                                                        handleFileChange4(index, event);
                                                                    }}
                                                                    style={{ display: "none" }}
                                                                />
                                                                <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                    Photo
                                                                </Button>
                                                                <TextField label="Attachment" type="text" size="small" variant="outlined" value={image.name} disabled />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </Grid>
                                            ))}
                                            <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                <Button variant="contained" color="primary" onClick={() => setIsEdit(false)} style={{ marginRight: "10px" }}>
                                                    Back
                                                </Button>
                                                <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                    Save
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                </DialogContent>
                            </Dialog>
                            <Grid item xs={8}>
                                {fileSets.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-document-${fileSet.id}`}
                                                onChange={(e) => handleFileChange(e, index)}
                                                multiple
                                            />
                                            <label htmlFor={`upload-document-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Document Upload {index + 1}
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <TextField
                                                label={`Attachments ${index + 1}`}
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.map(file => file.name).join(", ")}
                                                disabled={!fileSet.files.length}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDeleteFileSet(fileSet.id)}
                                                style={{
                                                    position: "absolute",
                                                    cursor: "pointer",
                                                    color: "red",
                                                    fontSize: "16px",
                                                    background: "white",
                                                    borderRadius: "50%",
                                                    padding: "2px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                                <Grid item sm={2}>
                                    <Button variant="contained" color="primary" onClick={addMoreFileInput}>
                                        Add More
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
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
                            disabled={!updateCheckingData.detailsEdit}
                        />
                        <Grid item xs={12}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}} checked={updateCheckingData.detailsEdit} onChange={handleChangeCheckbox} name="updateCheckingData.detailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.detailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="detailsEdit"
                                    />
                                }
                                label="Details Edit" style={{ color: 'red' }}
                            />
                        </Grid>
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
                                                disabled={!updateCheckingData.addressEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.addressEdit &&
                                                <div className="add-button" onClick={handleAddAliasesNameField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={4}>
                        <div className="key">
                            <div className="scroll-box">
                                {Address.map((address, index) => (
                                    <div key={index} className="person-container">
                                        {Address.length > 1 && updateCheckingData.addressEdit && (
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
                                                autoComplete="off"
                                                value={address.address}
                                                multiline
                                                onChange={(e) => {
                                                    handleAddressChange(e.target.value, index);
                                                }}
                                                disabled={!updateCheckingData.addressEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.addressEdit &&
                                                <div className="add-button" onClick={handleAddPAddressField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Grid container spacing={1}>
                                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {/* <FormControlLabel
                                        control={
                                            <Checkbox style={{color:'red'}} checked={updateCheckingData.addressEdit} onChange={handleChangeCheckbox} name="updateCheckingData.addressEdit"
                                            /> */}
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={updateCheckingData.addressEdit}
                                                onChange={handleCheckboxChang}
                                                name="addressEdit"
                                            />
                                        }
                                        label="Address Edit" style={{ color: 'red' }}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>COUNTRY DETAILS</h5>
                        <div className="details-containers">
                            <div className="scrollablebox">
                                {CountryData.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {CountryData.length > 1 && !updateCheckingData.countryEdit && (
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
                                                                            value={person.countryId}
                                                                            onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                            disabled={!updateCheckingData.countryEdit}
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
                                                                            value={person.countryHqId}
                                                                            onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                            disabled={!updateCheckingData.countryEdit}
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
                                                                        disabled={!updateCheckingData.countryEdit}
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
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                    />
                                                                    <FormControl style={{ width: "50%" }} variant="standard" size="small">
                                                                        <InputLabel id="contact-label">Contact</InputLabel>
                                                                        <Select
                                                                            labelId="contact-label"
                                                                            id="Contact"
                                                                            value={person.contactId}
                                                                            onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                            //onChange={handleSelectChange}
                                                                            variant="standard"
                                                                            size="small"
                                                                            disabled={!updateCheckingData.countryEdit}
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
                                                                        disabled={!updateCheckingData.countryEdit}
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
                                        style={{ width: '24%' }}
                                        startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setCountryData([...CountryData, {
                                            countryId: 0,
                                            recordTypeId: 0,
                                            cmsId: 0,
                                            countryHqId: 0,
                                            identificationNumberId: 0,
                                            identificationNum: '',
                                            identificationDetails: '',
                                            contactId: 0,
                                            contactName: ''
                                        }])} disabled={!updateCheckingData.countryEdit}>
                                        Add Country Details
                                    </Button>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            {/* <FormControlLabel
                                                    control={
                                                        <Checkbox style={{color:'red'}} checked={updateCheckingData.countryEdit} onChange={handleChangeCheckbox} name="updateCheckingData.countryEdit"
                                                        /> */}
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={updateCheckingData.countryEdit}
                                                        onChange={handleCheckboxChang}
                                                        name="countryEdit"
                                                    />
                                                }
                                                label="Country Edit" style={{ color: 'red' }}
                                            />
                                        </Grid>
                                    </Grid>
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
                                        id="organization"
                                        label="Organization"
                                        variant="standard"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        name="organizations"
                                        value={organization.length > 0 ? organization[0].organizationDetails || '' : ''}
                                        onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                        multiline
                                        disabled={!updateCheckingData.organizationDetailsEdit!}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}}checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.organizationDetailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="organizationDetailsEdit"
                                    />
                                }
                                label="Organization Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h5>LINKED INDIVIDUAL</h5>
                        <div className="details-containers">
                            <div className="scrollablebox">
                                {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {indOrgformData.indOrgCommonDTO.length > 1 && updateCheckingData.linkedIndividualEdit && (
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
                                                disabled={!updateCheckingData.linkedIndividualEdit}
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
                                                                            disabled={!updateCheckingData.linkedIndividualEdit}
                                                                        />
                                                                        {updateCheckingData.linkedIndividualEdit &&
                                                                            <FontAwesomeIcon
                                                                                icon={faTrash}
                                                                                className="delete-icon"
                                                                                onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                            />
                                                                        }
                                                                    </div>
                                                                ))}
                                                                <div className="field label">
                                                                    {updateCheckingData.linkedIndividualEdit &&
                                                                        <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                            <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                        </div>
                                                                    }
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
                                        style={{ width: '54%' }}
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
                                                                relativeMasterId: 0,
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
                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                    >
                                        Add Linked Individual
                                    </Button>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            {/* <FormControlLabel
                                                control={
                                                    <Checkbox style={{color:'red'}} checked={updateCheckingData.linkedIndividualEdit} onChange={handleChangeCheckbox} name="updateCheckingData.linkedIndividualEdit"
                                                    /> */}
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={updateCheckingData.linkedIndividualEdit}
                                                        onChange={handleCheckboxChang}
                                                        name="linkedIndividualEdit"
                                                    />
                                                }
                                                label="Linked Individual Edit" style={{ color: 'red' }}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
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
                                        multiline
                                        disabled={!updateCheckingData.caseDetailsEdit}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {/* <FormControlLabel
                            control={
                                <Checkbox style={{color:'red'}} checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                /> */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={updateCheckingData.caseDetailsEdit}
                                    onChange={handleCheckboxChang}
                                    name="caseDetailsEdit"
                                />
                            }
                            label="Case Details Edit" style={{ color: 'red' }}
                        />
                    </Grid>
                </Grid>
            </>
        );
    };

    // Organization Edit part
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
                            disabled={!updateCheckingData.detailsEdit}
                        />
                    </Grid>
                </Grid>
                <div className="card-body">
                    <Box m={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                {fileSetd.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        {/* File Upload Button */}
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-image-${fileSet.id}`}
                                                onChange={(e) => handleFileChanged(e, index)}
                                            />
                                            <label htmlFor={`upload-image-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Image Upload
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <TextField
                                                label="Image Attachment"
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                disabled
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item sm={2}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {pdfList.map((file: PDFFile) => (
                                        <div key={file.fileId} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div
                                                style={{
                                                    border: "1px solid #ccc",
                                                    padding: "10px",
                                                    width: "200px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleFileClick(String(file.fileId), file.fileName, file.documentType, file.isProfileImage)}
                                            >
                                                <h6>{file.fileName}</h6>
                                            </div>
                                            <IconButton onClick={() => handleOpenModal(file)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </Grid>
                            <Dialog open={openModal} onClose={handleCloseModal}>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete this file?
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseModal} color="primary">
                                        No
                                    </Button>
                                    <Button onClick={handleConfirmDelete} color="error">
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                open={showModal}
                                onClose={() => setShowModal(false)}
                                maxWidth="lg"
                                fullWidth
                                PaperProps={{
                                    style: { backgroundColor: "transparent", boxShadow: "none" }
                                }}
                            >
                                <Paper style={{ padding: 16, position: "relative" }}>
                                    <DialogTitle>Image Preview</DialogTitle>
                                    <DialogContent
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexDirection: "column"
                                        }}
                                    >
                                        {!isEditing ? (
                                            <>
                                                {selectedImage && (
                                                    <img
                                                        src={selectedImage}
                                                        alt="Preview"
                                                        style={{
                                                            maxWidth: "100%",
                                                            maxHeight: "100%",
                                                            transform: `scale(${zoomLevel})`,
                                                            transition: "transform 0.2s ease-in-out"
                                                        }}
                                                    />
                                                )}
                                                <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        style={{ marginRight: "10px" }}
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => setShowModal(false)}
                                                    >
                                                        Close
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <Grid container spacing={2} style={{ width: "100%" }}>
                                                {images.map((image, index) => (
                                                    <Grid item xs={12} key={index}>
                                                        <form encType="multipart/form-data">
                                                            <div>
                                                                <div className="field-group-column">
                                                                    <input
                                                                        type="file"
                                                                        id={`image-upload-input1-${index}`}
                                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                        onChange={(event) => {
                                                                            handleFileChanges(event);
                                                                            handleFileChange4(index, event);
                                                                        }}
                                                                        style={{ display: "none" }}
                                                                    />
                                                                    <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                        Photo
                                                                    </Button>
                                                                    <TextField
                                                                        label="Attachment"
                                                                        type="text"
                                                                        size="small"
                                                                        variant="outlined"
                                                                        value={image.name}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </Grid>
                                                ))}
                                                <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                    {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                    <Button variant="contained" color="primary" onClick={() => setIsEditing(false)} style={{ marginRight: "10px" }}>
                                                        Back
                                                    </Button>
                                                    <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                        Save
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </DialogContent>
                                </Paper>
                            </Dialog>
                            <Dialog open={showPdfModal} onClose={() => setShowPdfModal(false)} maxWidth="lg" fullWidth>
                                <DialogTitle>PDF Preview</DialogTitle>
                                <DialogContent>
                                    {!isEdit ? (
                                        <>
                                            {pdfData.base64 && (
                                                <>
                                                    <iframe
                                                        title="PDF Preview"
                                                        width="100%"
                                                        height="500px"
                                                        style={{ border: "none" }}
                                                        src={`data:application/pdf;base64,${pdfData.base64}`}
                                                    />
                                                    {pdfData.filename && (
                                                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                                                            <a
                                                                href={`data:application/pdf;base64,${pdfData.base64}`}
                                                                download={pdfData.filename}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    textDecoration: "none",
                                                                    padding: "10px",
                                                                    backgroundColor: "#2a75bb",
                                                                    color: "white",
                                                                    borderRadius: "5px",
                                                                    cursor: "pointer",
                                                                    display: "inline-block",
                                                                }}
                                                            >
                                                                Download PDF
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                        <Button variant="contained" color="primary" onClick={() => setIsEdit(true)} style={{ marginRight: "10px" }}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={() => setShowPdfModal(false)}>
                                                            Close
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <Grid container spacing={2} style={{ width: "100%" }}>
                                            {images.map((image, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <form encType="multipart/form-data">
                                                        <div>
                                                            <div className="field-group-column">
                                                                <input
                                                                    type="file"
                                                                    id={`image-upload-input1-${index}`}
                                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                    onChange={(event) => {
                                                                        handleFileChanges(event);
                                                                        handleFileChange4(index, event);
                                                                    }}
                                                                    style={{ display: "none" }}
                                                                />
                                                                <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                    Photo
                                                                </Button>
                                                                <TextField label="Attachment" type="text" size="small" variant="outlined" value={image.name} disabled />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </Grid>
                                            ))}
                                            <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                <Button variant="contained" color="primary" onClick={() => setIsEdit(false)} style={{ marginRight: "10px" }}>
                                                    Back
                                                </Button>
                                                <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                    Save
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                </DialogContent>
                            </Dialog>
                            <Grid item xs={8}>
                                {fileSets.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-document-${fileSet.id}`}
                                                onChange={(e) => handleFileChange(e, index)}
                                                multiple
                                            />
                                            <label htmlFor={`upload-document-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Document Upload {index + 1}
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <TextField
                                                label={`Attachments ${index + 1}`}
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.map(file => file.name).join(", ")}
                                                disabled={!fileSet.files.length}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDeleteFileSet(fileSet.id)}
                                                style={{
                                                    position: "absolute",
                                                    cursor: "pointer",
                                                    color: "red",
                                                    fontSize: "16px",
                                                    background: "white",
                                                    borderRadius: "50%",
                                                    padding: "2px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                                <Grid item sm={2}>
                                    <Button variant="contained" color="primary" onClick={addMoreFileInput}>
                                        Add More
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
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
                                        disabled={!updateCheckingData.detailsEdit}
                                    />
                                </div>
                            </div>
                        </div>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={updateCheckingData.detailsEdit}
                                            onChange={handleCheckboxChang}
                                            name="detailsEdit"
                                        />
                                    }
                                    label="Details Edit" style={{ color: 'red' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="key">
                            <div className="scroll-box">
                                {AliasesData.map((Aliases, index) => (
                                    <div key={index} className="person-container">
                                        {AliasesData.length > 1 && updateCheckingData.addressEdit && (
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
                                                disabled={!updateCheckingData.addressEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.addressEdit && (
                                                <div className="add-button" onClick={handleAddAliasesNameField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <div className="key">
                            <div className="scroll-box">
                                {Address.map((address, index) => (
                                    <div key={index} className="person-container">
                                        {Address.length > 1 && updateCheckingData.addressEdit && (
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
                                                autoComplete="off"
                                                multiline
                                                value={address.address}
                                                onChange={(e) => {
                                                    handleAddressChange(e.target.value, index);
                                                }}
                                                disabled={!updateCheckingData.addressEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.addressEdit && (
                                                <div className="add-button" onClick={handleAddPAddressField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Grid container spacing={1}>
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {/* <FormControlLabel
                                    control={
                                        <Checkbox style={{color:'red'}} checked={updateCheckingData.addressEdit} onChange={handleChangeCheckbox} name="updateCheckingData.addressEdit"
                                        /> */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={updateCheckingData.addressEdit}
                                            onChange={handleCheckboxChang}
                                            name="addressEdit"
                                        />
                                    }
                                    label="Address Edit" style={{ color: 'red' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="key">
                            <div className="scroll-box">
                                {caseData.map((data, index) => (
                                    <div key={index} className="person-container">
                                        {caseData.length > 1 && updateCheckingData.caseEdit && (
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
                                                value={data.caseDetails}
                                                onChange={(e) => {
                                                    handlecasaeChange(e.target.value, index);
                                                }}
                                                disabled={!updateCheckingData.caseEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.caseEdit && (
                                                <div className="add-button" onClick={handleAddcaseField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Unique Number
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}} checked={includeCaseSRequest} onChange={handleChangeCheckbox} name="includeCaseSRequest"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.caseEdit}
                                        onChange={handleCheckboxChang}
                                        name="caseEdit"
                                    />
                                }
                                label="Case Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h4>COUNTRY DETAILS</h4>
                        <div className="scrollablebox">
                            {CountryData.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {CountryData.length > 1 && updateCheckingData.countryEdit && (
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
                                                                <FormControl style={{ width: '50%' }}>
                                                                    <InputLabel htmlFor="type"> Country</InputLabel>
                                                                    <Select
                                                                        label="Country"
                                                                        value={person.countryId}
                                                                        onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                        variant="standard"
                                                                        type="text"
                                                                    >
                                                                        {Array.isArray(Country) &&
                                                                            Country.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormControl style={{ width: '50%' }}>
                                                                    <InputLabel htmlFor="type"> Country of Head Quarters</InputLabel>
                                                                    <Select
                                                                        label="Country of Head Quarters"
                                                                        value={person.countryHqId}
                                                                        onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                        variant="standard"
                                                                        type="text"
                                                                    >
                                                                        {Array.isArray(CountryHqData) &&
                                                                            CountryHqData.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormControl style={{ width: '50%' }}>
                                                                    <InputLabel htmlFor="type">National Identification</InputLabel>
                                                                    <Select
                                                                        label="Country of Head Quarters"
                                                                        value={person.identificationNumberId}
                                                                        onChange={(e) => handlerelative(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                        variant="standard"
                                                                        type="text"
                                                                    >
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
                                                                    label="National Identification Number"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.identificationNum}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputChangfatherpan(personIndex, event)
                                                                    }
                                                                    disabled={!updateCheckingData.countryEdit}
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
                                                                    disabled={!updateCheckingData.countryEdit}
                                                                />
                                                                <FormControl style={{ width: '50%' }}>
                                                                    <InputLabel htmlFor="contact-select">Contact</InputLabel>
                                                                    <Select
                                                                        label="Contact"
                                                                        id="contact-select"
                                                                        value={person.contactId}
                                                                        onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                        //onChange={handleSelectChange}
                                                                        variant="standard"
                                                                        size="small"
                                                                    >
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
                                                                    disabled={!updateCheckingData.countryEdit}
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
                                    startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setCountryData([...CountryData, {
                                        countryId: 0,
                                        recordTypeId: 0,
                                        cmsId: 0,
                                        countryHqId: 0,
                                        identificationNumberId: 0,
                                        identificationNum: '',
                                        identificationDetails: '',
                                        contactId: 0,
                                        contactName: ''
                                    }])} disabled={!updateCheckingData.countryEdit}>
                                    Add Country Details
                                </Button>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                                control={
                                                    <Checkbox style={{color:'red'}}checked={updateCheckingData.countryEdit} onChange={handleChangeCheckbox} name="updateCheckingData.countryEdit"
                                                    /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.countryEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="countryEdit"
                                                />
                                            }
                                            label="Country Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div>
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
                                        id="organization"
                                        label="Organization"
                                        variant="standard"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        name="organizations"
                                        value={organization.length > 0 ? organization[0].organizationDetails || '' : ''}
                                        onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                        multiline
                                        disabled={!updateCheckingData.organizationDetailsEdit!}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}}checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.organizationDetailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="organizationDetailsEdit"
                                    />
                                }
                                label="Organization Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h6>BANK DETAILS INVOLVED CASE</h6>
                        <div >
                            <div className="scrollablebox">
                                {BankformData.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {BankformData.length > 1 && updateCheckingData.bankEdit && (
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
                                                                    <FormControl style={{ width: '50%' }}>
                                                                        <InputLabel htmlFor="type"> Bank Name</InputLabel>
                                                                        <Select
                                                                            label="Country"
                                                                            value={person.bankId}
                                                                            onChange={(e) => handlebank(personIndex, e.target.value as number)}
                                                                            disabled={!updateCheckingData.bankEdit}
                                                                            variant="standard"
                                                                            type="text"
                                                                        >
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
                                                                        disabled={!updateCheckingData.bankEdit}
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
                                                                        disabled={!updateCheckingData.bankEdit}
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
                                        disabled={!updateCheckingData.bankEdit}
                                    >
                                        Add Bank Details
                                    </Button>
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                            control={
                                                <Checkbox style={{color:'red'}} checked={updateCheckingData.bankEdit} onChange={handleChangeCheckbox} name="updateCheckingData.bankEdit"
                                                /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.bankEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="bankEdit"
                                                />
                                            }
                                            label="Bank Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
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
                        <h4>LINKED INDIVIDUAL</h4>
                        <div className="scrollablebox">
                            {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {indOrgformData.indOrgCommonDTO.length > 1 && updateCheckingData.linkedIndividualEdit && (
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
                                            disabled={!updateCheckingData.linkedIndividualEdit}
                                        />
                                        {selectedRecordType === '2' && (
                                            <TextField
                                                style={{ width: '20%' }}
                                                label="Position"
                                                variant="standard"
                                                type="text"
                                                name="Position"
                                                autoComplete="off"
                                                value={person.positionsDTO.position}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                }
                                                disabled={!updateCheckingData.linkedIndividualEdit}
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                    />
                                                                    <FontAwesomeIcon
                                                                        icon={faTrash}
                                                                        className="delete-icon"
                                                                        onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                    />
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                    </div>
                                                                )}
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
                                                            <FormControl style={{ width: '100%' }}>
                                                                <InputLabel htmlFor="relationship-type">Relative List</InputLabel>
                                                                <Select
                                                                    label="Relationship"
                                                                    value={person && person.relationDTOS && Array.isArray(person.relationDTOS) && person.relationDTOS.length > 0 ? person.relationDTOS[0].relativeMasterId : ''}
                                                                    onChange={(e) => handlerelativeChanges(personIndex, e.target.value as number)}
                                                                    variant="standard"
                                                                    type="text"
                                                                    disabled={!updateCheckingData.linkedIndividualEdit}
                                                                >
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                        autoComplete="off"
                                                                        value={RelationnName.relationAliasesName}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChangsrelationIndex(personIndex, 'relationAliasesName', RelationnNameIndex, event)
                                                                        }
                                                                    />
                                                                    {updateCheckingData.linkedIndividualEdit && (
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousefather(personIndex, 'relationAliasesName', RelationnNameIndex)}
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'RelationnName')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Relationship Name
                                                                    </div>
                                                                )}
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                    />
                                                                    {updateCheckingData.linkedIndividualEdit && (
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousemother(personIndex, 'detailsAboutRelation', casedetailsIndex)}
                                                                        />)}
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'casedetails')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Details about the Relation
                                                                    </div>
                                                                )}
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
                                    style={{ width: '54%' }}
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
                                                            relativeMasterId: 0,
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
                                    disabled={!updateCheckingData.linkedIndividualEdit}
                                >
                                    Add Linked Individual
                                </Button>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                                control={
                                                    <Checkbox style={{color:'red'}}checked={inclueLinkedRequest} onChange={handleChangeCheckbox} name="inclueLinkedRequest"
                                                    /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.linkedIndividualEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="linkedIndividualEdit"
                                                />
                                            }
                                            label="Linked Individual Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div>
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
                                        fullWidth
                                        size="small"
                                        name="caseDetails"
                                        value={caseDetails[0].caseDetails}
                                        onChange={(e) => handleCaseDetailsChange(e, 0)}
                                        multiline
                                        disabled={!updateCheckingData.caseDetailsEdit!}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}}checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.caseDetailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="caseDetailsEdit"
                                    />
                                }
                                label="Case Details Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </>
        );
    };

    // MLM Companies Edit part
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
                            disabled={!updateCheckingData.detailsEdit}
                        />
                    </Grid>
                </Grid>
                <div className="card-body">
                    <Box m={1}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                {fileSetd.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-image-${fileSet.id}`}
                                                onChange={(e) => handleFileChanged(e, index)}
                                            />
                                            <label htmlFor={`upload-image-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Image Upload
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <TextField
                                                label="Image Attachment"
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.length > 0 ? fileSet.files.map(f => f.name).join(", ") : ""}
                                                disabled
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item sm={2}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                    {pdfList.map((file: PDFFile) => (
                                        <div key={file.fileId} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div
                                                style={{
                                                    border: "1px solid #ccc",
                                                    padding: "10px",
                                                    width: "200px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleFileClick(String(file.fileId), file.fileName, file.documentType, file.isProfileImage)}
                                            >
                                                <h6>{file.fileName}</h6>
                                            </div>
                                            <IconButton onClick={() => handleOpenModal(file)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </Grid>
                            <Dialog open={openModal} onClose={handleCloseModal}>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogContent>
                                    Are you sure you want to delete this file?
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseModal} color="primary">
                                        No
                                    </Button>
                                    <Button onClick={handleConfirmDelete} color="error">
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Dialog
                                open={showModal}
                                onClose={() => setShowModal(false)}
                                maxWidth="lg"
                                fullWidth
                                PaperProps={{
                                    style: { backgroundColor: "transparent", boxShadow: "none" }
                                }}
                            >
                                <Paper style={{ padding: 16, position: "relative" }}>
                                    <DialogTitle>Image Preview</DialogTitle>
                                    <DialogContent
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            flexDirection: "column"
                                        }}
                                    >
                                        {!isEditing ? (
                                            <>
                                                {selectedImage && (
                                                    <img
                                                        src={selectedImage}
                                                        alt="Preview"
                                                        style={{
                                                            maxWidth: "100%",
                                                            maxHeight: "100%",
                                                            transform: `scale(${zoomLevel})`,
                                                            transition: "transform 0.2s ease-in-out"
                                                        }}
                                                    />
                                                )}
                                                <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        style={{ marginRight: "10px" }}
                                                        onClick={() => setIsEditing(true)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => setShowModal(false)}
                                                    >
                                                        Close
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <Grid container spacing={2} style={{ width: "100%" }}>
                                                {images.map((image, index) => (
                                                    <Grid item xs={12} key={index}>
                                                        <form encType="multipart/form-data">
                                                            <div>
                                                                <div className="field-group-column">
                                                                    <input
                                                                        type="file"
                                                                        id={`image-upload-input1-${index}`}
                                                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                        onChange={(event) => {
                                                                            handleFileChanges(event);
                                                                            handleFileChange4(index, event);
                                                                        }}
                                                                        style={{ display: "none" }}
                                                                    />
                                                                    <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                        Photo
                                                                    </Button>
                                                                    <TextField
                                                                        label="Attachment"
                                                                        type="text"
                                                                        size="small"
                                                                        variant="outlined"
                                                                        value={image.name}
                                                                        disabled
                                                                    />
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </Grid>
                                                ))}
                                                <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                    {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                    <Button variant="contained" color="primary" onClick={() => setIsEditing(false)} style={{ marginRight: "10px" }}>
                                                        Back
                                                    </Button>
                                                    <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                        Save
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </DialogContent>
                                </Paper>
                            </Dialog>
                            <Dialog open={showPdfModal} onClose={() => setShowPdfModal(false)} maxWidth="lg" fullWidth>
                                <DialogTitle>PDF Preview</DialogTitle>
                                <DialogContent>
                                    {!isEdit ? (
                                        <>
                                            {pdfData.base64 && (
                                                <>
                                                    <iframe
                                                        title="PDF Preview"
                                                        width="100%"
                                                        height="500px"
                                                        style={{ border: "none" }}
                                                        src={`data:application/pdf;base64,${pdfData.base64}`}
                                                    />
                                                    {pdfData.filename && (
                                                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                                                            <a
                                                                href={`data:application/pdf;base64,${pdfData.base64}`}
                                                                download={pdfData.filename}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{
                                                                    textDecoration: "none",
                                                                    padding: "10px",
                                                                    backgroundColor: "#2a75bb",
                                                                    color: "white",
                                                                    borderRadius: "5px",
                                                                    cursor: "pointer",
                                                                    display: "inline-block",
                                                                }}
                                                            >
                                                                Download PDF
                                                            </a>
                                                        </div>
                                                    )}
                                                    <div style={{ marginTop: "20px", textAlign: 'end' }}>
                                                        <Button variant="contained" color="primary" onClick={() => setIsEdit(true)} style={{ marginRight: "10px" }}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="contained" color="primary" onClick={() => setShowPdfModal(false)}>
                                                            Close
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <Grid container spacing={2} style={{ width: "100%" }}>
                                            {images.map((image, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <form encType="multipart/form-data">
                                                        <div>
                                                            <div className="field-group-column">
                                                                <input
                                                                    type="file"
                                                                    id={`image-upload-input1-${index}`}
                                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                                    onChange={(event) => {
                                                                        handleFileChanges(event);
                                                                        handleFileChange4(index, event);
                                                                    }}
                                                                    style={{ display: "none" }}
                                                                />
                                                                <Button variant="outlined" onClick={() => handleChooseImagesClick1(index)}>
                                                                    Photo
                                                                </Button>
                                                                <TextField label="Attachment" type="text" size="small" variant="outlined" value={image.name} disabled />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </Grid>
                                            ))}
                                            <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                                                {fileError && <p style={{ color: "red", marginBottom: "10px" }}>{fileError}</p>}
                                                <Button variant="contained" color="primary" onClick={() => setIsEdit(false)} style={{ marginRight: "10px" }}>
                                                    Back
                                                </Button>
                                                <Button variant="contained" color="success" onClick={handleSaveFilesWrapper}>
                                                    Save
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}
                                </DialogContent>
                            </Dialog>
                            <Grid item xs={8}>
                                {fileSets.map((fileSet, index) => (
                                    <Grid container item spacing={2} key={fileSet.id}>
                                        <Grid item sm={2}>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                style={{ display: "none" }}
                                                id={`upload-document-${fileSet.id}`}
                                                onChange={(e) => handleFileChange(e, index)}
                                                multiple
                                            />
                                            <label htmlFor={`upload-document-${fileSet.id}`} style={{ marginRight: "20px" }}>
                                                <Button variant="outlined" component="span">
                                                    Document Upload {index + 1}
                                                </Button>
                                            </label>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <TextField
                                                label={`Attachments ${index + 1}`}
                                                type="text"
                                                size="small"
                                                multiline
                                                variant="outlined"
                                                value={fileSet.files.map(file => file.name).join(", ")}
                                                disabled={!fileSet.files.length}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                onClick={() => handleDeleteFileSet(fileSet.id)}
                                                style={{
                                                    position: "absolute",
                                                    cursor: "pointer",
                                                    color: "red",
                                                    fontSize: "16px",
                                                    background: "white",
                                                    borderRadius: "50%",
                                                    padding: "2px",
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                                <Grid item sm={2}>
                                    <Button variant="contained" color="primary" onClick={addMoreFileInput}>
                                        Add More
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
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
                                        disabled={!updateCheckingData.detailsEdit}
                                    />
                                </div>
                            </div>
                        </div>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={updateCheckingData.detailsEdit}
                                            onChange={handleCheckboxChang}
                                            name="detailsEdit"
                                        />
                                    }
                                    label="Details Edit" style={{ color: 'red' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="key">
                            <div className="scroll-box">
                                {AliasesData.map((Aliases, index) => (
                                    <div key={index} className="person-container">
                                        {AliasesData.length > 1 && updateCheckingData.addressEdit && (
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
                                                disabled={!updateCheckingData.addressEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.addressEdit && (
                                                <div className="add-button" onClick={handleAddAliasesNameField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Aliases Name
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <div className="key">
                            <div className="scroll-box">
                                {Address.map((address, index) => (
                                    <div key={index} className="person-container">
                                        {Address.length > 1 && updateCheckingData.addressEdit && (
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
                                                autoComplete="off"
                                                multiline
                                                value={address.address}
                                                onChange={(e) => {
                                                    handleAddressChange(e.target.value, index);
                                                }}
                                                disabled={!updateCheckingData.addressEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.addressEdit && (
                                                <div className="add-button" onClick={handleAddPAddressField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Address
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Grid container spacing={1}>
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {/* <FormControlLabel
                                    control={
                                        <Checkbox style={{color:'red'}} checked={updateCheckingData.addressEdit} onChange={handleChangeCheckbox} name="updateCheckingData.addressEdit"
                                        /> */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={updateCheckingData.addressEdit}
                                            onChange={handleCheckboxChang}
                                            name="addressEdit"
                                        />
                                    }
                                    label="Address Edit" style={{ color: 'red' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="key">
                            <div className="scroll-box">
                                {caseData.map((data, index) => (
                                    <div key={index} className="person-container">
                                        {caseData.length > 1 && updateCheckingData.caseEdit && (
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
                                                value={data.caseDetails}
                                                onChange={(e) => {
                                                    handlecasaeChange(e.target.value, index);
                                                }}
                                                disabled={!updateCheckingData.caseEdit}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="field-group">
                                <div className="field-group-container">
                                    <div className="field-group-row">
                                        <div className="field label">
                                            {updateCheckingData.caseEdit && (
                                                <div className="add-button" onClick={handleAddcaseField}>
                                                    <FontAwesomeIcon icon={faPlusCircle} /> Add More Unique Number
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}} checked={includeCaseSRequest} onChange={handleChangeCheckbox} name="includeCaseSRequest"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.caseEdit}
                                        onChange={handleCheckboxChang}
                                        name="caseEdit"
                                    />
                                }
                                label="Case Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h4>COUNTRY DETAILS</h4>
                        <div className="scrollablebox">
                            {CountryData.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {CountryData.length > 1 && updateCheckingData.countryEdit && (
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
                                                                <FormControl style={{ width: '50%' }}>
                                                                    <InputLabel htmlFor="type"> Country</InputLabel>
                                                                    <Select
                                                                        label="Country"
                                                                        value={person.countryId}
                                                                        onChange={(e) => handlecountry(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                        variant="standard"
                                                                        type="text"
                                                                    >
                                                                        {Array.isArray(Country) &&
                                                                            Country.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormControl style={{ width: '50%' }}>
                                                                    <InputLabel htmlFor="type"> Country of Head Quarters</InputLabel>
                                                                    <Select
                                                                        label="Country of Head Quarters"
                                                                        value={person.countryHqId}
                                                                        onChange={(e) => handlerelativeChange(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                        variant="standard"
                                                                        type="text"
                                                                    >
                                                                        {Array.isArray(CountryHqData) &&
                                                                            CountryHqData.map((lists: any) => (
                                                                                <MenuItem key={lists.id} value={lists.id}>
                                                                                    {lists.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                    </Select>
                                                                </FormControl>
                                                                <FormControl style={{ width: '50%' }}>
                                                                    <InputLabel htmlFor="type">National Identification</InputLabel>
                                                                    <Select
                                                                        label="Country of Head Quarters"
                                                                        value={person.identificationNumberId}
                                                                        onChange={(e) => handlerelative(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                        variant="standard"
                                                                        type="text"
                                                                    >
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
                                                                    label="National Identification Number"
                                                                    variant="standard"
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    value={person.identificationNum}
                                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                        handleInputChangfatherpan(personIndex, event)
                                                                    }
                                                                    disabled={!updateCheckingData.countryEdit}
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
                                                                    disabled={!updateCheckingData.countryEdit}
                                                                />
                                                                <FormControl style={{ width: '50%' }}>
                                                                    <InputLabel htmlFor="contact-select">Contact</InputLabel>
                                                                    <Select
                                                                        label="Contact"
                                                                        id="contact-select"
                                                                        value={person.contactId}
                                                                        onChange={(e) => handleContactDetails(personIndex, e.target.value as number)}
                                                                        disabled={!updateCheckingData.countryEdit}
                                                                        //onChange={handleSelectChange}
                                                                        variant="standard"
                                                                        size="small"
                                                                    >
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
                                                                    disabled={!updateCheckingData.countryEdit}
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
                                    // style={{ width: '17%',display:'flex' }}
                                    startIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => setCountryData([...CountryData, {
                                        countryId: 0,
                                        recordTypeId: 0,
                                        cmsId: 0,
                                        countryHqId: 0,
                                        identificationNumberId: 0,
                                        identificationNum: '',
                                        identificationDetails: '',
                                        contactId: 0,
                                        contactName: ''
                                    }])} disabled={!updateCheckingData.countryEdit}>
                                    Add Country Details
                                </Button>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                                control={
                                                    <Checkbox style={{color:'red'}}checked={updateCheckingData.countryEdit} onChange={handleChangeCheckbox} name="updateCheckingData.countryEdit"
                                                    /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.countryEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="countryEdit"
                                                />
                                            }
                                            label="Country Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div>
                            </div>
                        </div>
                    </div>
                </Card>
                <br></br>
                <Grid container spacing={2}>
                    <h6>organization</h6>
                    <Grid item xs={12}>
                        <div className="key">
                            <div className="person-container">
                                <div className="field-group-column">
                                    <TextField
                                        id="organization"
                                        label="Organization"
                                        variant="standard"
                                        type="text"
                                        fullWidth
                                        size="small"
                                        name="organizations"
                                        // value={organization[0].organizationDetails}
                                        value={organization.length > 0 ? organization[0].organizationDetails || '' : ''}
                                        onChange={(e) => handleorganizationDetailsChange(e, 0)}
                                        multiline
                                        disabled={!updateCheckingData.organizationDetailsEdit!}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}}checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.organizationDetailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="organizationDetailsEdit"
                                    />
                                }
                                label="Organization Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <br></br>
                <Card style={{
                    padding: '1%',
                    width: '100%',
                }}>
                    <div className="key">
                        <h6>BANK DETAILS INVOLVED CASE</h6>
                        <div >
                            <div className="scrollablebox">
                                {BankformData.map((person, personIndex) => (
                                    <div key={personIndex} className="person-container">
                                        {BankformData.length > 1 && updateCheckingData.bankEdit && (
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
                                                                    <FormControl style={{ width: '50%' }}>
                                                                        <InputLabel htmlFor="type"> Bank Name</InputLabel>
                                                                        <Select
                                                                            label="Country"
                                                                            value={person.bankId}
                                                                            onChange={(e) => handlebank(personIndex, e.target.value as number)}
                                                                            disabled={!updateCheckingData.bankEdit}
                                                                            variant="standard"
                                                                            type="text"
                                                                        >
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
                                                                        disabled={!updateCheckingData.bankEdit}
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
                                                                        disabled={!updateCheckingData.bankEdit}
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
                                        disabled={!updateCheckingData.bankEdit}
                                    >
                                        Add Bank Details
                                    </Button>
                                </div>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                            control={
                                                <Checkbox style={{color:'red'}} checked={updateCheckingData.bankEdit} onChange={handleChangeCheckbox} name="updateCheckingData.bankEdit"
                                                /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.bankEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="bankEdit"
                                                />
                                            }
                                            label="Bank Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
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
                        <h4>LINKED INDIVIDUAL</h4>
                        <div className="scrollablebox">
                            {indOrgformData.indOrgCommonDTO.map((person, personIndex) => (
                                <div key={personIndex} className="person-container">
                                    {indOrgformData.indOrgCommonDTO.length > 1 && updateCheckingData.linkedIndividualEdit && (
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
                                            disabled={!updateCheckingData.linkedIndividualEdit}
                                        />
                                        {selectedRecordType === '2' && (
                                            <TextField
                                                style={{ width: '20%' }}
                                                label="Position"
                                                variant="standard"
                                                type="text"
                                                name="Position"
                                                autoComplete="off"
                                                value={person.positionsDTO.position}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleInputChangespouseFamily(personIndex, 'linIndName', null, event)
                                                }
                                                disabled={!updateCheckingData.linkedIndividualEdit}
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                    />
                                                                    <FontAwesomeIcon
                                                                        icon={faTrash}
                                                                        className="delete-icon"
                                                                        onClick={() => handleDeleteFieldspouseHuf(personIndex, 'linIndAliasesName', hufIndex)}
                                                                    />
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'huf')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Linked Individual Name Aliases
                                                                    </div>
                                                                )}
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
                                                            <FormControl style={{ width: '100%' }}>
                                                                <InputLabel htmlFor="relationship-type">Relative List</InputLabel>
                                                                <Select
                                                                    label="Relationship"
                                                                    value={person && person.relationDTOS && Array.isArray(person.relationDTOS) && person.relationDTOS.length > 0 ? person.relationDTOS[0].relativeMasterId : ''}
                                                                    onChange={(e) => handlerelativeChanges(personIndex, e.target.value as number)}
                                                                    variant="standard"
                                                                    type="text"
                                                                    disabled={!updateCheckingData.linkedIndividualEdit}
                                                                >
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                        autoComplete="off"
                                                                        value={RelationnName.relationAliasesName}
                                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                                            handleInputChangsrelationIndex(personIndex, 'relationAliasesName', RelationnNameIndex, event)
                                                                        }
                                                                    />
                                                                    {updateCheckingData.linkedIndividualEdit && (
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousefather(personIndex, 'relationAliasesName', RelationnNameIndex)}
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'RelationnName')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Relationship Name
                                                                    </div>
                                                                )}
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
                                                                        disabled={!updateCheckingData.linkedIndividualEdit}
                                                                    />
                                                                    {updateCheckingData.linkedIndividualEdit && (
                                                                        <FontAwesomeIcon
                                                                            icon={faTrash}
                                                                            className="delete-icon"
                                                                            onClick={() => handleDeleteFieldspousemother(personIndex, 'detailsAboutRelation', casedetailsIndex)}
                                                                        />)}
                                                                </div>
                                                            ))}
                                                            <div className="field label">
                                                                {updateCheckingData.linkedIndividualEdit && (
                                                                    <div className="add-button" onClick={() => handleAddFieldSpouseFamily(personIndex, 'casedetails')}>
                                                                        <FontAwesomeIcon icon={faPlusCircle} /> Add More Details about the Relation
                                                                    </div>
                                                                )}
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
                                    style={{ width: '54%' }}
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
                                                            relativeMasterId: 0,
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
                                    disabled={!updateCheckingData.linkedIndividualEdit}
                                >
                                    Add Linked Individual
                                </Button>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        {/* <FormControlLabel
                                                control={
                                                    <Checkbox style={{color:'red'}}checked={inclueLinkedRequest} onChange={handleChangeCheckbox} name="inclueLinkedRequest"
                                                    /> */}
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={updateCheckingData.linkedIndividualEdit}
                                                    onChange={handleCheckboxChang}
                                                    name="linkedIndividualEdit"
                                                />
                                            }
                                            label="Linked Individual Edit" style={{ color: 'red' }}
                                        />
                                    </Grid>
                                </Grid>
                            </div>
                            <div>
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
                                        fullWidth
                                        size="small"
                                        name="caseDetails"
                                        value={caseDetails[0].caseDetails}
                                        onChange={(e) => handleCaseDetailsChange(e, 0)}
                                        multiline
                                        disabled={!updateCheckingData.caseDetailsEdit!}
                                    />
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox style={{color:'red'}}checked={updateupdateCheckingData.caseDetailsEdit} onChange={handleChangeCheckbox} name="updateupdateCheckingData.caseDetailsEdit"
                                    /> */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={updateCheckingData.caseDetailsEdit}
                                        onChange={handleCheckboxChang}
                                        name="caseDetailsEdit"
                                    />
                                }
                                label="Case Details Edit" style={{ color: 'red' }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </>
        );
    };

    const renderFieldsBasedOnRecordType = (selectedRecordType: string) => {
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
        }
    };

    const [newTab, setNewTab] = useState<Window | null>(null);

    const handleOpenTab = () => {
        const tab = window.open('/CustomerEdit', '_blank');
        if (tab) {
            setNewTab(tab);
            console.log('New tab opened successfully.');
        } else {
            console.error('Failed to open new tab. Check browser pop-up settings.');
        }
    };

    const handleCloseClick = () => {
        window.close();
        navigate('/CustomerEdit');
    };

    return (
        <>
            <Header />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Box m={2} style={{ marginTop: '7%' }}>
                    <Card style={{
                        padding: '1%',
                        boxShadow: 'rgb(0 0 0 / 28%) 0px 4px 8px',
                        width: '100%',
                    }}>
                        <div className="card-body">
                            <Box m={2}>
                                <Grid container spacing={3}>
                                    <Grid item xs={4}>
                                        <FormControl style={{ width: '100%' }}>
                                            <InputLabel htmlFor="regulator">Regulator</InputLabel>
                                            <Select
                                                label="Regulator"
                                                variant="standard"
                                                onChange={(event) => {
                                                    const stringValue = event.target.value.toString();
                                                    const updatedEvent = {
                                                        target: {
                                                            name: event.target.name,
                                                            value: stringValue
                                                        }
                                                    };
                                                    handleRegulatorChange(updatedEvent);
                                                }}
                                                value={DetailsData.regulatorId.toString()}
                                                disabled={!updateCheckingData.detailsEdit}
                                            >
                                                <MenuItem value={''} style={{ color: "gray" }}>
                                                    Select Regulator
                                                </MenuItem>
                                                {Regulator?.map((item) => (
                                                    <MenuItem
                                                        key={item.id}
                                                        value={item.id.toString()}
                                                    >
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
                                                onChange={(event) => {
                                                    const stringValue = event.target.value.toString();
                                                    const updatedEvent = {
                                                        target: {
                                                            name: event.target.name,
                                                            value: stringValue
                                                        }
                                                    };
                                                    handleRegulatorListChange(updatedEvent);
                                                }}
                                                value={DetailsData.regulatorListId.toString()}
                                                disabled={!updateCheckingData.detailsEdit}
                                            >
                                                <MenuItem value={''} style={{ color: "gray" }}>
                                                    Select Regulator List
                                                </MenuItem>
                                                {Regulatorlist?.map((item) => (
                                                    <MenuItem
                                                        key={item.id}
                                                        value={item.id.toString()}
                                                    >
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl style={{ width: '100%' }}>
                                            <InputLabel htmlFor="record-type">Record Type</InputLabel>
                                            <Select
                                                label="Record Type"
                                                variant="standard"
                                                value={recordTypeId}
                                                onChange={(event: SelectChangeEvent<string>) => {
                                                    setSelectedRecordType(event.target.value as string);
                                                }}
                                                disabled
                                            >
                                                <MenuItem value={''} style={{ color: "gray" }}>Select Record Type</MenuItem>
                                                {RecordType.map((item) => (
                                                    <MenuItem
                                                        key={item.id}
                                                        value={item.id.toString()}
                                                    >
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        {renderFieldsBasedOnRecordType(selectedRecordType)}
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box mt={2} display="flex" justifyContent="flex-end">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (!isSubmitting && cmsId !== undefined) {
                                            setIsSubmitting(true);
                                            handleEdit(parseInt(cmsId!), imgName.toString(), parseInt(pathId));
                                        } else {
                                            console.error('cmsId is undefined or already submitting');
                                        }
                                    }}
                                    disabled={isSubmitting}
                                    style={{ marginRight: '10px' }}
                                >
                                    Submit
                                </button>
                                <button type="button" className="btn btn-outline-primary" onClick={handleCloseClick}>Close</button>
                                {checkboxError && <div style={{ color: 'red' }}>{checkboxError}</div>}
                            </Box>
                        </div>
                        <br></br>
                    </Card>
                </Box>
            </Box>
        </>
    );
}

export default Edited;