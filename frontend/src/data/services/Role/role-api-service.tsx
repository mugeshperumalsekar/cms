import HttpClientWrapper from "../../api/http-client-wrapper";
import { RolePayload } from "./role-payload";

class RoleApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    saveRole = async (payload: RolePayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Role/CreateRole', payload);
            return response;
        } catch (error) {
            throw error;
        }
    };
    
}

export default RoleApiService;