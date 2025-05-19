import HttpClientWrapper from "../../api/http-client-wrapper";

class EditDetailsApiService {

  private httpClientWrapper: HttpClientWrapper;

  constructor() {
    this.httpClientWrapper = new HttpClientWrapper();
  }

  updateCustomer = async (
    detailsDTOList: string,
    cmsId: number,
    euid: number,
    documentfiles: File[],
    pathId: number,
    imgName: string,
    includeImageRequest: boolean,
    isProfileImage: number
  ) => {
    try {
      const queryParams = `?DetailsDTOList=${encodeURIComponent(detailsDTOList)}&cmsId=${cmsId}&euid=${euid}&pathId=${pathId}&imgName=${encodeURIComponent(imgName)}&includeImageRequest=${includeImageRequest}&isProfileImage=${isProfileImage}`;
      const formData = new FormData();
      documentfiles.forEach(file => formData.append('documentfiles', file));
      const response = await this.httpClientWrapper.pute(`/api/v1/DetailSave/UpdateDetails${queryParams}`, formData);
      return response.data;
    } catch (error) {
      console.error("EditDetailsApiService updateCustomer() error:", error);
      throw error;
    }
  };

  fetchData = async (cmsId: number, pathId: number) => {
    try {
      const response = await this.httpClientWrapper.get(`/api/v1/GetDocumentType?cmsId=${cmsId}&pathId=${pathId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };

  getFormDataHeaderConfig() {
    return this.httpClientWrapper.getHeaderConfig('multipart/form-data');
  };

  uploadCompanyFiles = async (files: File[], pathIds: number[], documentIds: number[], cmsId: number, imgName: string, isProfileImage: number) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      pathIds.forEach((pathId) => formData.append('pathId', String(pathId)));
      documentIds.forEach((documentId) => formData.append('documentId', String(documentId)));
      formData.append('cmsId', String(cmsId));
      formData.append('imgName', String(imgName));
      formData.append('isProfileImage', isProfileImage.toString());
      const response = await this.httpClientWrapper.postFormData('/api/v1/Document/upload', formData);
      console.log('File upload successful:', response);
      return response;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  };

}

export default EditDetailsApiService;