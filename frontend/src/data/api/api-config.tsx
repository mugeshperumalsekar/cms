import axios, { AxiosInstance } from "axios";

class ApiConfig {

    private baseURL = 'http://localhost:8095';
    // private baseURL = process.env.REACT_APP_API_URL;
    // private environment = process.env.REACT_APP_ENVIRONMENT;
    // private baseURL = 'http://192.168.1.65:8095';
    // private baseSecURL = 'http://localhost:8095';

    private apiBaseUrl: string;
    // private apiBaseSecUrl: string;

    constructor() {
        this.apiBaseUrl = this.baseURL;
        // this.apiBaseSecUrl = this.baseSecURL;
    }

    private getApiBaseURL = () => {
        return this.apiBaseUrl;
    }

    public getAxiosInstance = () => {
        return axios.create({
            baseURL: this.getApiBaseURL()
        });
    }

    // private getApiBaseSecURL = () => {
    //     return this.apiBaseSecUrl;
    // }

    // public getAxiosSecInstance = () => {
    //     return axios.create({ baseURL: this.getApiBaseSecURL() });
    // }
}

export default ApiConfig;