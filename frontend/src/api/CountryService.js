/**
 * Interacts with the backend services to fetch countries and state information.
 *
 *
 * @author [Amrita Krishna](amrita@dal.ca)
 */
import axios from "axios";
import CONFIG from "../config";

/**
 * Fetches all the countries and their states from the backend service
 *
 * @param none
 */
export function getCountries() {
  return axios.get(`${CONFIG.EXTERNAL_SERVICE.BASE_URL}/countries`);
}
