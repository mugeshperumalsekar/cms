import HttpClientWrapper from "../../../api/http-client-wrapper";

class DeadApiService {

    private httpClientWrapper: HttpClientWrapper;

    constructor() {
        this.httpClientWrapper = new HttpClientWrapper();
    }

    getDead = async () => {
        try {
            const response = await this.httpClientWrapper.get('/api/v1/ConfigDead');
            return response;
        } catch (error) {
            throw error;
        }
    };

}

export default DeadApiService;