import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "./header.css";
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from '../../pages/dashboard-page/dashboard';
import Navigation from './navigation';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import NavbarToggle from 'react-bootstrap/esm/NavbarToggle';
import { Details } from '@mui/icons-material';

const Header = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState([]);
  const [isTablesDropdownOpen, setIsTablesDropdownOpen] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);
  const [isMastersDropdownOpen, setIsMastersDropdownOpen] = useState(false);
  const [selectedMasters, setSelectedMasters] = useState([]);
  const [isDetailsDropdownOpen, setIsDetailsDropdownOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [isQcDropdownOpen, setIsQcDropdownOpen] = useState(false);
  const [selectedQc, setSelectedQc] = useState([]);
  const [isManagerDropdownOpen, setIsManagerDropdownOpen] = useState(false);
  const [isManagersDropdownOpen, setIsManagersDropdownOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [adminData, setAdminData] = useState<{ name: string; code: string; link: string }[]>([]);
  const [managerData, setManagerData] = useState<{ name: string; code: string; link: string }[]>([]);
  const [mastersList, setMastersList] = useState<{ name: string; code: string; link: string }[]>([]);
  const [reportList, setReportList] = useState<{ name: string; code: string; link: string }[]>([]);
  const [detailsList, setDetailsList] = useState<{ name: string; code: string; link: string }[]>([]);
  const [managerList, setManagerList] = useState<{ name: string; code: string; link: string }[]>([]);
  const [qcList, setQcList] = useState<{ name: string; code: string; link: string }[]>([]);
  const [managersList, setManagersList] = useState<{ name: String; code: string; link: string }[]>([]);

  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getFromLocalStorage = (key: string) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  const handleMastersDropdownEnter = () => {
    setIsMastersDropdownOpen(true);
  };

  const handleMastersDropdownLeave = () => {
    setIsMastersDropdownOpen(false);
  };

  const handleTablesDropdownEnter = () => {
    setIsTablesDropdownOpen(true);
  };

  const handleQcDropdownEnter = () => {
    setIsQcDropdownOpen(true);
  };

  const handleQcDropdownLeave = () => {
    setIsQcDropdownOpen(false);
  };

  const handleManagerDropdownEnter = () => {
    setIsManagerDropdownOpen(true);
  };

  const handleManagersDropdownEnter = () => {
    setIsManagersDropdownOpen(true);
  };

  const handleTablesDropdownLeave = () => {
    setIsTablesDropdownOpen(false);
  };

  const handleManagerDropdownLeave = () => {
    setIsManagerDropdownOpen(false);
  };

  const handleManagersDropdownLeave = () => {
    setIsManagersDropdownOpen(false);
  };

  const toggleMastersDropdown = () => {
    setIsMastersDropdownOpen(!isMastersDropdownOpen);
  };

  const handleMastersSelect = (Masters: any) => {
    setIsMastersDropdownOpen(prevState => Masters !== selectedMasters || !prevState);
    setSelectedMasters(Masters);
    navigate(Masters.link);
  };

  const handleDetailsSelect = (Details: any) => {
    setIsDetailsDropdownOpen(prevState => Details !== selectedDetails || !prevState);
    setSelectedDetails(Details);
    navigate(Details.link);
  };

  const toggleTablesDropdown = () => {
    setIsTablesDropdownOpen(!isTablesDropdownOpen);
  };

  const handleTablesSelect = (Tables: any) => {
    setSelectedTables(Tables);
    setIsTablesDropdownOpen(true);
    navigate(Tables.link);
  };

  const handleQcSelect = (QcView: any) => {
    setSelectedQc(QcView);
    setIsQcDropdownOpen(true);
    navigate(QcView.link);
  };

  const handleManagerSelect = (Manager: any) => {
    setSelectedManager(Manager);
    setIsManagerDropdownOpen(true);
    navigate(Manager.link);
  };

  const handleManagersSelect = (Managers: any) => {
    setSelectedManagers(Managers);
    setIsManagersDropdownOpen(true);
    navigate(Managers.link);
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleSearchClick = () => {
    navigate('/CustomerSearch');
  };

  const handleAdminUserrightsClick = () => {
    navigate('/adminuserrights');
  };

  const handleDataEntryClick = () => {
    navigate('/DataEntry');
  };

  const handleQcViewClick = () => {
    navigate('/QcViewData');
  };

  const handleQcPendingClick = () => {
    navigate('/QcPending');
  };

  const handleManagerClick = () => {
    navigate('/Manager');
  };

  const handleDaughterDetailsClick = () => {
    navigate('/Details');
  };

  const handleDetailsDropdownEnter = () => {
    setIsDetailsDropdownOpen(true);
  };

  const handleDetailsDropdownLeave = () => {
    setIsDetailsDropdownOpen(false);
  };

  const toggleDetailsDropdown = () => {
    setIsDetailsDropdownOpen(!isDetailsDropdownOpen);
  };

  const shouldDisplayMenuItem = (headerValues: string | any[]) => {
    const accessPermissionData = location.state?.accessPermissionData;
    return Array.isArray(accessPermissionData) && accessPermissionData.some(item => headerValues.includes(item.header));
  };

  const removeDuplicates = (list: any[]) => {
    const uniqueList = list.filter((item, index, self) =>
      index === self.findIndex((t) => t.name === item.name)
    );
    return uniqueList;
  };
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const accessPermissionData = location.state?.accessPermissionData;
    if (Array.isArray(accessPermissionData)) {
      const mastersData = accessPermissionData.filter((item) => item.header === '1');
      const reportData = accessPermissionData.filter((item) => item.header === '5');
      const detailsData = accessPermissionData.filter((item) => item.header === '4');
      const dashboarddata = accessPermissionData.filter((item) => item.header === '2');
      const adminData = accessPermissionData.filter((item) => item.header === '3');
      setAdminData(adminData);
      const managerData = accessPermissionData.filter((item) => item.header === '6');
      const qcData = accessPermissionData.filter((item) => item.header === '7');
      const managersData = accessPermissionData.filter((item) => item.header === '8');
      const mappedMastersList: { name: string; code: string; link: string }[] = mastersData.map((master) => ({
        name: master.name,
        code: master.code,
        link: master.link,
      }));
      const mappedReportList: { name: string; code: string; link: string }[] = reportData.map((report) => ({
        name: report.name,
        code: report.code,
        link: report.link,
      }));
      const mappedDetailsList: { name: string; code: string; link: string }[] = detailsData.map((details) => ({
        name: details.name,
        code: details.code,
        link: details.link,
      }));
      const mappedManagerList: { name: string; code: string; link: string }[] = managerData.map((manager) => ({
        name: manager.name,
        code: manager.code,
        link: manager.link,
      }));
      const mappedQcList: { name: string; code: string; link: string }[] = qcData.map((qc) => ({
        name: qc.name,
        code: qc.code,
        link: qc.link,
      }));
      const mappedManagersList: { name: string; code: string; link: string }[] = managersData.map((managers) => ({
        name: managers.name,
        code: managers.code,
        link: managers.link,
      }))
      const uniqueMastersList = removeDuplicates(mappedMastersList);
      const uniqueReportList = removeDuplicates(mappedReportList);
      const uniqueDetailsList = removeDuplicates(mappedDetailsList);
      const uniqueManagerList = removeDuplicates(mappedManagerList);
      const uniqueQcList = removeDuplicates(mappedQcList);
      const uniqueManagersList = removeDuplicates(mappedManagersList);
      setMastersList(uniqueMastersList);
      setReportList(uniqueReportList);
      setDetailsList(uniqueDetailsList);
      setManagerList(uniqueManagerList);
      setQcList(uniqueQcList);
      setManagersList(uniqueManagersList);
      saveToLocalStorage('mastersList', uniqueMastersList);
      saveToLocalStorage('reportList', uniqueReportList);
      saveToLocalStorage('detailsList', uniqueDetailsList);
      saveToLocalStorage('managerList', uniqueManagerList);
      saveToLocalStorage('adminData', adminData);
      saveToLocalStorage('managersDetails', managersData);
      saveToLocalStorage('qcList', uniqueQcList);
      saveToLocalStorage('managersList', uniqueManagersList);
      const showDashboardButton = dashboarddata.length > 0;
      const showAdminButton = adminData.length > 0;
      if (showDashboardButton) {
        localStorage.setItem('showDashboardButton', 'true');
      } else {
        localStorage.removeItem('showDashboardButton');
      }
      if (showAdminButton) {
        localStorage.setItem('showAdminButton', 'true');
      } else {
        localStorage.removeItem('showAdminButton');
      }
    } else {
      const storedMastersList = getFromLocalStorage('mastersList');
      const storedReportList = getFromLocalStorage('reportList');
      const storedDetailsList = getFromLocalStorage('detailsList');
      const storedManagerList = getFromLocalStorage('managerList');
      const storedAdminList = getFromLocalStorage('adminData');
      const storedManager = getFromLocalStorage('manager');
      const storedQc = getFromLocalStorage('qcList');
      const storedManagersList = getFromLocalStorage('managersList');
      setMastersList(storedMastersList || []);
      setReportList(storedReportList || []);
      setDetailsList(storedDetailsList || []);
      setManagerList(storedManagerList || []);
      setAdminData(storedAdminList || []);
      setManagerData(storedManager || []);
      setQcList(storedQc || []);
      setManagersList(storedManagersList || []);
    }
    return () => {
      setIsMastersDropdownOpen(false);
      setIsTablesDropdownOpen(false);
      setIsDetailsDropdownOpen(false);
      setIsManagerDropdownOpen(false);
      setIsQcDropdownOpen(false);
      setSelectedMasters([]);
      setIsManagersDropdownOpen(false);
    };
  }, [location.state, setIsMastersDropdownOpen, setIsTablesDropdownOpen, setIsDetailsDropdownOpen, setIsManagerDropdownOpen, setIsQcDropdownOpen, setIsManagersDropdownOpen]);

  return (
    <>
      <div className="fixed-header">
        <Navigation />
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" >
          <Navbar.Brand href="#home"> </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleToggle} />
          <Navbar.Collapse id="responsive-navbar-nav" className={expanded ? 'show' : ''}>
            <Nav className="mr-auto">
              <Nav.Link className="white-text Dashboard" onClick={handleDashboardClick}>
                Dashboard
              </Nav.Link>
              {mastersList.length > 0 && (
                <li
                  className={`white-text nav-item dropdown ${isMastersDropdownOpen ? 'show' : ''}`}
                  onMouseEnter={() => setIsMastersDropdownOpen(true)}
                  onMouseLeave={() => setIsMastersDropdownOpen(false)}
                >
                  <a
                    className="white-text nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDetailsDropdown();
                    }}
                  >
                    Master
                  </a>
                  <ul className={`white-text dropdown-menu dropdown-menu ${isMastersDropdownOpen ? 'show' : ''} scrollable-dropdown`}>
                    {mastersList.map((master) => (
                      <li key={master.code}>
                        <a className="dropdown-item" onClick={() => handleMastersSelect(master)}>
                          {master.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {adminData.length > 0 && (
                <Nav.Link className="white-text AdminUser" onClick={handleAdminUserrightsClick}>
                  Admin User rights
                </Nav.Link>
              )}
              {detailsList.length > 0 && (
                <li
                  className={`white-text nav-item dropdown ${isDetailsDropdownOpen ? 'show' : ''}`}
                  onMouseEnter={handleDetailsDropdownEnter}
                  onMouseLeave={handleDetailsDropdownLeave}
                >
                  <a
                    className="white-text nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDetailsDropdown();
                    }}
                  >
                    Details
                  </a>
                  <ul className={`white-text dropdown-menu dropdown-menu ${isDetailsDropdownOpen ? 'show' : ''} scrollable-dropdown`}>
                    {detailsList.map((details) => (
                      <li key={details.code}>
                        <a className="dropdown-item" onClick={() => handleDetailsSelect(details)}>
                          {details.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {reportList.length > 0 && (
                <li
                  className={`white-text nav-item dropdown ${isTablesDropdownOpen ? 'show' : ''}`}
                  onMouseEnter={handleTablesDropdownEnter}
                  onMouseLeave={handleTablesDropdownLeave}
                >
                  <a
                    className="white-text nav-link dropdown-toggle"
                    href="#"
                    role="button"
                  >
                    Reports
                  </a>
                  <ul className={`white-text dropdown-menu dropdown-menu ${isTablesDropdownOpen ? 'show' : ''} scrollable-dropdown`}>
                    {reportList.map((table) => (
                      <li key={table.code}>
                        <a className="dropdown-item" onClick={() => handleTablesSelect(table)}>
                          {table.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {managerList.length > 0 && (
                <li
                  className={`white-text nav-item dropdown ${isManagerDropdownOpen ? 'show' : ''}`}
                  onMouseEnter={handleManagerDropdownEnter}
                  onMouseLeave={handleManagerDropdownLeave}
                >
                  <a
                    className="white-text nav-link dropdown-toggle"
                    href="#"
                    role="button"
                  >
                    TaskAssign
                  </a>
                  <ul className={`white-text dropdown-menu dropdown-menu ${isManagerDropdownOpen ? 'show' : ''} scrollable-dropdown`}>
                    {managerList.map((manager) => (
                      <li key={manager.code}>
                        <a className="dropdown-item" onClick={() => handleManagerSelect(manager)}>
                          {manager.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {qcList.length > 0 && (
                <li
                  className={`white-text nav-item dropdown ${isQcDropdownOpen ? 'show' : ''}`}
                  onMouseEnter={handleQcDropdownEnter}
                  onMouseLeave={handleQcDropdownLeave}
                >
                  <a
                    className="white-text nav-link dropdown-toggle"
                    href="#"
                    role="button"
                  >
                    Qc
                  </a>
                  <ul className={`white-text dropdown-menu dropdown-menu ${isQcDropdownOpen ? 'show' : ''} scrollable-dropdown`}>
                    {qcList.map((table) => (
                      <li key={table.code}>
                        <a className="dropdown-item" onClick={() => handleQcSelect(table)}>
                          {table.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {managersList.length > 0 && (
                <li
                  className={`white-text nav-item dropdown ${isManagersDropdownOpen ? 'show' : ''}`}
                  onMouseEnter={handleManagersDropdownEnter}
                  onMouseLeave={handleManagersDropdownLeave}
                >
                  <a
                    className="white-text nav-link dropdown-toggle"
                    href="#"
                    role="button"
                  >
                    Manager
                  </a>
                  <ul className={`white-text dropdown-menu dropdown-menu ${isManagersDropdownOpen ? 'show' : ''} scrollable-dropdown`}>
                    {managersList.map((managers) => (
                      <li key={managers.code}>
                        <a className="dropdown-item" onClick={() => handleManagersSelect(managers)}>
                          {managers.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </>
  );
}

export default Header;