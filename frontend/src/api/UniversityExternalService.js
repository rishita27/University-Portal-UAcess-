/**
 * This service interacts with the backend to execute university related actions.
 *
 *
 * @author [Aasif Faizal](aasif@dal.ca)
 */
import axios from "axios";
import CONFIG from "../config";
const UniversityExternalService = {
  fetchUniversities: (searchKey, page) => {
    /**
     * Fetches paginated universities
     *
     * @param searchKey Search key for searching the universities.
     * @param page Page number of the search.
     */
    const url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/get-universities`;
    return axios.get(
      url, {
        params: {
          search_key: searchKey,
          page: page,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            CONFIG.ACCESS_TOKEN_KEY
          )}`,
        },
      }
    );
  },
  fetchUniversity: (universityID) => {
    /**
     * Fetches university based on id.
     *
     * @param universityID ID of the university that needs to be fetched.
     */
    const url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/${universityID}`;
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          CONFIG.ACCESS_TOKEN_KEY
        )}`,
      },
    });
  },

  getStaffByUniversityId: () => {
    const url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/university/users`;
    return axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          CONFIG.ACCESS_TOKEN_KEY
        )}`,
      },
    });
  },
};

export default UniversityExternalService;
