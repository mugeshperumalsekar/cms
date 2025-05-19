import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import { Suspense } from "react";
import Login from "../pages/Login/login";
import Dashboard from "../pages/dashboard-page/dashboard";
import Header from "../layouts/header/header";
import Country from "../pages/Master/Country/Country";
import State from "../pages/Master/State/State";
import Adminuserrights from "../pages/Adminuserrights/Adminuserrights";
import AdminUser from "../pages/Master/Adminuser/adminuser";
import AddEmp from "../pages/Master/Adminuser/addemp";
import ChangePassword from "../pages/change-password/changepassword";
import Edited from "../pages/Edit/Edited";
import Individualview from "../pages/View/Individualview";
import Entityview from "../pages/View/Entityview";
import Shipview from "../pages/View/Shipview";
import Details from "../pages/Insert/Details";
import CustomerEdit from "../pages/Reports/CustomerEdit";
import DataEntry from "../pages/Reports/DataEntry";
import QcView from "../pages/Reports/QcView";
import QcEdit from "../pages/Reports/QcEdit";
import ManagerApprove from "../pages/Reports/ManagerApprove";
import ReassignTask from "../pages/Reports/ReassignTask";
import QcPending from "../pages/Reports/QcPending";
import ManagerPending from "../pages/Reports/ManagerPending";
import PublishedData from "../pages/Reports/PublishedData";
import TaskAssign from "../pages/TaskAssign/taskAssign";
import SearchIdentify from "../pages/Insert/SearchIdentify";
import TaskAssignView from "../pages/TaskAssign/taskAssignView";
import Identify from "../pages/Insert/Identify";
import Client from "../pages/View/Client";
import ClientSearch from "../pages/View/ClientSearch";
import Aircraftview from "../pages/View/Aircraftview";
import Manager from "../pages/Manager/Manager";
import ManagerPendingView from "../pages/Manager/ManagerPendingView";
import QcPendingView from "../pages/Qc/QcPendingView";
import QcViewDate from "../pages/Qc/QcView";
import ClientIndividualview from "../pages/View/ClientIndividualview";
import Clientship from "../pages/View/Clientship";
import ClientAircraftview from "../pages/View/ClientAircraftvie";
import ManagerEntityview from "../pages/Manager/ManagerEntityView";
import ManagerIndividualview from "../pages/Manager/ManagerIndividualView";
import ManagerShipview from "../pages/Manager/ManagerShipView";
import ManagerAircraftview from "../pages/Manager/ManagerAircraftView";
import Organizationview from "../pages/View/Organizationview";
import ClientOrganizationview from "../pages/View/ClientOrganizationview";
import MLMCompanies from "../pages/View/MLMCompaniesView";



const AppRouter = () => {

    return (
        <Suspense fallback={<span>Loading....</span>}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/header" element={<Header />} />
                    <Route path="/Country" element={<Country />} />
                    <Route path="/State" element={<State />} />
                    <Route path="/adminuser" element={<AdminUser />} />
                    <Route path="/addemp" element={<AddEmp />} />
                    <Route path="/Adminuserrights" element={<Adminuserrights />} />
                    <Route path="/ChangePassword" element={<ChangePassword />} />
                    <Route path="/Details" element={<Details />} />
                    <Route path="/Edited/:cmsId/:uid/:recordTypeId" element={<Edited />} />
                    <Route path="/CustomerEdit" element={<CustomerEdit />} />
                    <Route path="/view/Entityview/:cmsId/:uid/:recordTypeId" element={<Entityview />} />
                    <Route path="view/Individualview/:cmsId/:uid/:recordTypeId" element={<Individualview />} />
                    <Route path="view/Aircraftview/:cmsId/:uid/:recordTypeId" element={<Aircraftview />} />
                    <Route path="view/Shipview/:cmsId/:uid/:recordTypeId" element={<Shipview />} />
                    <Route path="view/Organizationview/:cmsId/:uid/:recordTypeId" element={<Organizationview />} />
                    <Route path="/view/MLMCompaniesview/:cmsId/:uid/:recordTypeId" element={<MLMCompanies />} />
                    <Route path="/view/ManagerEntityview/:cmsId/:uid/:recordTypeId" element={<ManagerEntityview />} />
                    <Route path="/view/ManagerIndividualview/:cmsId/:uid/:recordTypeId" element={<ManagerIndividualview />} />
                    <Route path="/view/ManagerShipview/:cmsId/:uid/:recordTypeId" element={<ManagerShipview />} />
                    <Route path="/view/ManagerAircraftview/:cmsId/:uid/:recordTypeId" element={<ManagerAircraftview />} />
                    <Route path="/DataEntryReport" element={<DataEntry />} />
                    <Route path="/QcViewReport" element={<QcView />} />
                    <Route path="/QcEdit" element={<QcEdit />} />
                    <Route path="/ManagerApprove" element={<ManagerApprove />} />
                    <Route path="/ReassignTask" element={<ReassignTask />} />
                    <Route path="/QcPendingReport" element={<QcPending />} />
                    <Route path="/ManagerPending" element={<ManagerPending />} />
                    <Route path="/PublishedData" element={<PublishedData />} />
                    <Route path="/taskAssign" element={<TaskAssign />} />
                    <Route path="/QcView" element={<CustomerEdit />} />
                    <Route path="/QcView/:cmsId" element={<CustomerEdit />} />
                    <Route path="/DataEntry" element={<SearchIdentify />} />
                    <Route path="/taskAssignView" element={<TaskAssignView />} />
                    <Route path="/Details/:taskId" element={<Identify />} />
                    <Route path="ClientView/Client/:cmsId/:uid/:entity" element={< Client />} />
                    <Route path="ClientView/ClientIndividualview/:cmsId/:uid/:entity" element={< ClientIndividualview />} />
                    <Route path="ClientView/Clientship/:cmsId/:uid/:entity" element={< Clientship />} />
                    <Route path="ClientView/ClientAircraftview/:cmsId/:uid/:entity" element={< ClientAircraftview />} />
                    <Route path="ClientView/ClientOrganizationview/:cmsId/:uid/:entity" element={<ClientOrganizationview />} />

                    <Route path="/ClientView" element={<ClientSearch />} />
                    <Route path="/Manager" element={<Manager />} />
                    <Route path="/Manager/:cmsId" element={<Manager />} />
                    <Route path="/ManagerPendingView" element={<ManagerPendingView />} />
                    <Route path="/QcViewData" element={<QcViewDate />} />
                    <Route path="/QcPending/:pepId/:uid" element={<QcPendingView />} />
                    <Route path="/QcPending" element={<QcPendingView />} />
                   
                    
                    
                </Routes>
            </Router>
        </Suspense>
    );
};

export default AppRouter;