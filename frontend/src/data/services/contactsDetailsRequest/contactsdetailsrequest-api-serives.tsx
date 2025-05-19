import HttpClientWrapper from "../../api/http-client-wrapper";
import { ContactsDetailsRequestPayload } from "./contactsdetailsrequest-payload";

class ContactsDetailsRequestApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  saveContactsRequest = async (payload: ContactsDetailsRequestPayload) => {
    try {
      const response = await this.httpClientWrapper.post('/api/v1/ContactsDetails/CreateContactsDetailsRequest', payload);
      const data = response.data;
      return data;
    } catch (error) {
      console.error("LLPsApiService saveCustomerRequest() error:", error);
      throw error;
    }
  };

}

export default ContactsDetailsRequestApiService;