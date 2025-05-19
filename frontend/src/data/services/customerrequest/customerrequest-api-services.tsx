import HttpClientWrapper from "../../api/http-client-wrapper";

class CustomerRequestApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  getcustomer = async (pepId: string) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/CustomerSave/GetAssociatedCompaniesRequest/${pepId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

}

export default CustomerRequestApiService;