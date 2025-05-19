import HttpClientWrapper from "../../api/http-client-wrapper";

class AddressApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  saveCustomerRequest = async (
    detailsDTOList: any,
    documentfiles: File[],
    pathId: number,
    imgName: string,
    isProfileImage: number  // <-- Required parameter


  ) => {
    try {
      const formData = new FormData();
      formData.append('DetailsDTOList', JSON.stringify(detailsDTOList));
      // documentfiles.forEach(file => formData.append('documentfiles', file));
      documentfiles.forEach((file, index) => {
        console.log(`Appending file ${index + 1}:`, file.name); // Debugging
        formData.append('documentfiles', file);
      });
      formData.append('pathId', pathId.toString());
      formData.append('imgName', imgName);
      formData.append('isProfileImage', isProfileImage.toString()); // Add isProfileImage

      const response = await this.httpClientWrapper.postFormData('/api/v1/DetailSave/CreateDetails', formData);
      return response.data;
    } catch (error) {
      console.error('AddressApiService saveCustomerRequest() error:', error);
      throw error;
    }
  };

  saveCompany = async (companyData: any) => {
    try {
      const response = await this.httpClientWrapper.post(
        "/api/v1/cms/create",
        companyData,
        
      );
      return response.data;
    } catch (error) {
      console.error("Error saving company:", error);
      throw error;
    }
  };
  



}

export default AddressApiService;