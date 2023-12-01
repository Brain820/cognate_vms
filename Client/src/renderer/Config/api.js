export const ListOfPatients = () =>
  `http://localhost:8000/api/patients/get-patients-list/`;
export const PatientDetails = (id) =>
  `http://127.0.0.1:8000/api/patients/get-surgery-list-by-patient/${id}/`;
export const AllDoctors = () =>
  `http://127.0.0.1:8000/api/doctors/get-all-doctors/`;
export const loginUser = () => `http://localhost:8000/api/user/signin/`;
export const singlePatient = (id) =>
  `http://localhost:8000/api/patients/get-patient/${id}/`;
export const registerUser = () => `http://localhost:8000/api/user/signup/`;
export const surgeryDetails = (id) =>
  `http://127.0.0.1:8000/api/patients/get-surgery-details/${id}/`;
export const addDoctor = () => `http://127.0.0.1:8000/api/doctors/add-doctor/`;
export const addPatient = () =>
  `http://localhost:8000/api/patients/add-patient/`;
export const addSurgery = (id) =>
  `http://localhost:8000/api/patients/add-surgery/${id}/`;
export const editDoctor = (id) =>
  `http://127.0.0.1:8000/api/doctors/update-doctor/${id}/`;
export const editPatient = (id) =>
  `http://localhost:8000/api/patients/update-patient/${id}/`;

export const editSurgery = (id) =>
  `http://localhost:8000/api/patients/update-surgery/${id}/`;
export const updateUserData = (id) =>
  `http://localhost:8000/api/user/profile/update/${id}/`;
export const companyDetails = (id) =>
  `http://localhost:8000/api/company_setting/get_company_by_id/${id}/`;
export const addCommentOnSurgeryImage = (id) =>
  `http://127.0.0.1:8000/api/patients/add-comment-on-surgery-image/${id}/`;
export const deleteCommentOnSurgeryImage = (id) =>
  `http://localhost:8000/api/patients/delete-comment-on-surgery-image/${id}/`;
export const addSurgeryVedio = (id) =>
  `http://localhost:8000/api/patients/add-surgery-video/${id}/`;
export const getImageListBySurgery = (id) =>
  `http://localhost:8000/api/patients/get-image-list-by-surgery/${id}/`;
export const getVedioListBySurgery = (id) =>
  `http://127.0.0.1:8000/api/patients/get-video-list-by-surgery/${id}/`;
export const getCommentOnSurgeryVedio = (id) =>
  `http://localhost:8000/api/patients/get-comment-on-surgery-video/${id}/`;
