export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("data");
  window.location.href = "/";
};
