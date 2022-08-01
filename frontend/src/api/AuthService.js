/**
 * The service with interacts with external authentication service.
 *
 *
 * @author [Aasif Faizal](aasif@dal.ca)
 */
import axios from "axios";
import CONFIG from "../config";

const AuthService = {
  validateUser: (accessToken) => {
    /**
     * Validates if the user exists using the accessToken
     *
     * @param accessToken Access token of the user.
     */
    const url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/user/validate`;
    return axios.post(url, null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

export default AuthService;
