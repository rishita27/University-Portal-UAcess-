/**
 * Interacts with the backend services to save/update/fetch application related information.
 *
 *
 * @author [Amrita Krishna](amrita@dal.ca)
 * @author [Rishita Kotiyal](rs677988@dal.ca)
 */
import axios from "axios";
import CONFIG from "../config";

const BASE_URL = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/application`;

/**
 * Maps the form data to the post request object
 *
 * @param body Form data for the application
 * @param documents Data of files uploaded to s3 and their entry to the database
 * @param program_id UUID of the program
 * @param student_id UUID of the user
 */
function postDataAdapter(body, documents, program_id, student_id) {
  console.log(body);
  const application_data = {
    program_id: program_id,
    student_id: student_id,
    first_name: body.firstName,
    middle_name: body.middleName,
    last_name: body.lastName,
    address_line_1: body.address1,
    address_line_2: body.address2,
    city: body.city,
    country: body.country,
    province: body.province,
    zip: body.zipCode,
    phone: body.phoneNumber.toString(),
    language_test: {
      type: body.test.toLowerCase(),
      reading: parseFloat(body.reading),
      writing: parseFloat(body.writing),
      listening: parseFloat(body.listening),
      speaking: parseFloat(body.speaking),
      overall: parseFloat(body.overall),
    },
    sop: body.sop,
    applicant_institutions: [
      {
        name: body.institution,
        degree: body.degree,
        course: body.course,
        major: body.major,
        cgpa: parseFloat(body.cgpa),
        city: body.instituteCity,
        country: body.institutionCountry,
        completion_status: body.status.toLowerCase(),
      },
    ],
    resume_doc_id: documents.resume,
    transcript_doc_id: documents.transcript,
    language_test_doc_id: documents.language_test,
  };

  return application_data;
}

/**
 * Gets the application from the backend service given the application id
 *
 * @param application_id UUID id of the application
 */
export function getApplicationById(application_id) {
  return axios.get(`${BASE_URL}/detail/${application_id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY)}`,
    },
  });
}

/**
 * Sends the application to the backend service with the form data to create a new application
 *
 * @param body Form data for the application
 * @param documents Data of files uploaded to s3 and their entry to the database
 * @param program_id UUID of the program
 * @param student_id UUID of the user
 */
export function sendApplication(body, documents, program_id, student_id) {
  const post_body = postDataAdapter(body, documents, program_id, student_id);
  return axios.post(BASE_URL, post_body, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY)}`,
    },
  });
}

/**
 * Withdraws the application and updates the status of the application to withdrawn given the application id
 *
 * @param application_id UUID id of the application
 */
export function withdrawApplication(application_id) {
  return axios.put(
    `${BASE_URL}/${application_id}/withdraw`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          CONFIG.ACCESS_TOKEN_KEY
        )}`,
      },
    }
  );
}

/**
 * Fetches all the applications from the backend service given the student id
 *
 * @param none
 */
export function getApplicationsForStudent() {
  return axios.get(`${BASE_URL}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY)}`,
    },
  });
}

export function getApplicationsForReviewer() {
  return axios.get(`${BASE_URL}/review`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY)}`,
    },
  });
}

export function updateApplicationReviewStatus(
  application_id,
  status = "in_review"
) {
  return axios.put(
    `${BASE_URL}/review/update`,
    { application_id, status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          CONFIG.ACCESS_TOKEN_KEY
        )}`,
      },
    }
  );
}

export function getApplicationsForUniversity() {
  return axios.get(`${BASE_URL}/university`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY)}`,
    },
  });
}

export function uploadApplicationDocuments(formData) {
  const url = `${CONFIG.EXTERNAL_SERVICE.BASE_URL}/document/upload_application_package`;
  return axios.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem(CONFIG.ACCESS_TOKEN_KEY)}`,
    },
  });
}
