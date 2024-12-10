import API_URL from "../config";

// Example function to make an API call
export const fetchData = async () => {
  const response = await fetch(`${API_URL}/endpoint`);
  const data = await response.json();
  return data;
};
