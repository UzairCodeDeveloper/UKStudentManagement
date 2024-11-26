import httpClient from "../../../http-commons";
import { getToken } from "../../../../util/adminUtil";

const getStudentCoursePercentage = (studentId) => {
  const token = getToken();
  return httpClient.get(`/percentage/${studentId}`, {
    headers: {
      "x-auth-token": token,
    },
  });
};

const PercentageApi = {
  getStudentCoursePercentage,
};

export default PercentageApi;
