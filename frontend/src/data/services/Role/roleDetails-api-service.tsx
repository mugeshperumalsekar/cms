import HttpClientWrapper from "../../api/http-client-wrapper";
import { RoleDetailsPayload } from "./roleDetails-payload";

class RoleDetailsService {

    private httpClientWrapper: HttpClientWrapper;
    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getRole = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/RolesCommonService');
            return response;
        } catch (error) {
            throw error;
        }
    };

    saveRole = async (payload: RoleDetailsPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/RoleDetails/CreateRoleDetailsRequest', payload);
            return response;
        } catch (error) {
            throw error;
        }
    };
    
}

export default RoleDetailsService;