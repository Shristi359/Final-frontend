import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://atomically-nonimpressionable-major.ngrok-free.dev/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// TOKEN AUTH INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// AUTH REDIRECT
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ========== API ENDPOINTS ==========

export const authAPI = {
  getCsrf:  ()     => api.get("auth/csrf/"),
  register: (data) => api.post("auth/register/", data),
  login:    (data) => api.post("auth/login/", data),
  logout:   ()     => api.post("auth/logout/"),
  me:       ()     => api.get("auth/me/"),
};

export const lookupsAPI = {
  priorityLevels: () => api.get("lookups/priority-levels/"),
  projectTypes:   () => api.get("lookups/project-types/"),
  roadTypes:      () => api.get("lookups/road-types/"),
  delayTypes:     () => api.get("lookups/delay-types/"),
  alertTypes:     () => api.get("lookups/alert-types/"),
  budgetSources:  () => api.get("lookups/budget-sources/"),
  fiscalYears:    () => api.get("lookups/fiscal-years/"),
};

const formDataConfig = (data) =>
  data instanceof FormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};

export const contractorsAPI = {
  list:   ()         => api.get("contractors/contractor/"),
  get:    (id)       => api.get(`contractors/contractor/${id}/`),
  create: (data)     => api.post("contractors/contractor/", data, formDataConfig(data)),
  update: (id, data) => api.patch(`contractors/contractor/${id}/`, data, formDataConfig(data)),
  delete: (id)       => api.delete(`contractors/contractor/${id}/`),
};

export const chairpersonsAPI = {
  list:   ()         => api.get("chairpersons/chairperson/"),
  get:    (id)       => api.get(`chairpersons/chairperson/${id}/`),
  create: (data)     => api.post("chairpersons/chairperson/", data),
  update: (id, data) => api.patch(`chairpersons/chairperson/${id}/`, data),
  delete: (id)       => api.delete(`chairpersons/chairperson/${id}/`),
};

export const engineersAPI = {
  list:   ()         => api.get("engineers/engineer/"),
  get:    (id)       => api.get(`engineers/engineer/${id}/`),
  create: (data)     => api.post("engineers/engineer/", data),
  update: (id, data) => api.patch(`engineers/engineer/${id}/`, data),
  delete: (id)       => api.delete(`engineers/engineer/${id}/`),
};

export const accountsAPI = {
  list:   ()     => api.get("accounts/"),
  get:    (id)   => api.get(`accounts/${id}/`),
  create: (data) => api.post("auth/register/", data),
};

export const projectsAPI = {
  list:   ()         => api.get("projects/project/"),
  get:    (id)       => api.get(`projects/project/${id}/`),
  create: (data)     => api.post("projects/project/", data),
  update: (id, data) => api.patch(`projects/project/${id}/`, data),
  delete: (id)       => api.delete(`projects/project/${id}/`),
};

export const milestonesAPI = {
  list:   (projectId) => api.get("milestones/milestone/", { params: { project: projectId } }),
  get:    (id)        => api.get(`milestones/milestone/${id}/`),
  create: (data)      => api.post("milestones/milestone/", data),
  update: (id, data)  => api.patch(`milestones/milestone/${id}/`, data),
  delete: (id)        => api.delete(`milestones/milestone/${id}/`),
};

export const weeklyLogsAPI = {
  list:   (projectId) => api.get("logs/weekly-logs/", { params: { project: projectId } }),
  create: (data)      => api.post("logs/weekly-logs/", data, formDataConfig(data)),
};

export const delayLogsAPI = {
  list:   (projectId) => api.get("logs/delay-logs/", { params: { project: projectId } }),
  create: (data)      => api.post("logs/delay-logs/", data),
  update: (id, data)  => api.patch(`logs/delay-logs/${id}/`, data),
  delete: (id)        => api.delete(`logs/delay-logs/${id}/`),
};

export const roadsAPI = {
  list:   ()     => api.get("roads/road/"),
  get:    (id)   => api.get(`roads/road/${id}/`),
  create: (data) => api.post("roads/road/", data),
};

export const locationsAPI = {
  list:   ()     => api.get("locations/location/"),
  create: (data) => api.post("locations/location/", data),
};

export const alertsAPI = {
  list:     ()    => api.get("alerts/alerts/"),
  markRead: (id)  => api.patch(`alerts/alerts/${id}/`, { is_read: true }),
};

export const pastProjectRecordsAPI = {
  list:   ()     => api.get("projects/past-project-records/"),
  upload: (data) => api.post("projects/past-project-records/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id)   => api.delete(`projects/past-project-records/${id}/`),
};

export const auditAPI = {
  list: () => api.get("audit/audit-log/"),
};

export default api;