import HttpClientWrapper from "../../../api/http-client-wrapper";
import { GenderPayload } from "./gender_payload";

class GenderApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    insertGender = async (payload: GenderPayload) => {
        try {
            const response = await this.httpClientWrapper.post('/api/v1/Gender/createGender', payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("GenderApiService insertGender() error:", error);
            throw error;
        }
    };

    getGender = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/Gender');
            return response;
        } catch (error) {
            throw error;
        }
    };

    updateGender = async (id: number, payload: GenderPayload) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Gender/${id}`, payload);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("GenderApiService updateGender() error:", error);
            throw error;
        }
    };

    blockGender = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Gender/${id}/block`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error;
        }
    };

    unblockGender = async (id: number) => {
        try {
            const response = await this.httpClientWrapper.put(`/api/v1/Gender/${id}/unblock`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("StateApiService deleteState() error:", error);
            throw error;
        }
    };
}

export default GenderApiService;