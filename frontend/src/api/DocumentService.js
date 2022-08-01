/**
 * The service interacts with external file management service.
 *
 *
 * @author [Aasif Faizal](aasif@dal.ca)
 */
import axios from "axios";
import CONFIG from '../config'
import fileDownload from "js-file-download";

const BASE_URL = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/document`

const DocumentService =  {
  upload: (file, fileType, accessToken) => {
    /**
     * Validates if the user exists using the accessToken
     *
     * @param file Document that needs to be uploaded.
     * @param fileType Type of the document.
     * @param accessToken Access token of the user.
     */
    const formData = new FormData();
    formData.append('document', file);
    formData.append('file_type', fileType)
    return axios.post(`${BASE_URL}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
  fetchDocuments: (accessToken) => {
    const url = `${BASE_URL}/get_all`
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  },
  downloadDocument: (accessToken, id, name) => {
    const url = `${BASE_URL}/${id}`;
    axios.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        responseType: 'blob'
      }
    ).then((response) => {
      console.log(response)
      fileDownload(response.data, name);
    })
  },
  downloadReviewDocument: (accessToken, application_id, document_id, name) => {
    const url = `${BASE_URL}/reviewer/${application_id}/${document_id}`;
    axios.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        responseType: 'blob'
      }
    ).then((response) => {
      console.log(response)
      fileDownload(response.data, name);
    })
  }
}

export default DocumentService