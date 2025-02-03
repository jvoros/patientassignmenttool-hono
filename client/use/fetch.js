export const useFetch = async (url, payload = {}, method) => {
  let data;
  let error;

  const response =
    method === "POST"
      ? await fetch(url, { method, body: JSON.stringify(payload) })
      : await fetch(url);
  const json = await response.json();
  if (!response.ok) {
    error = json.message;
  } else if (json.error) {
    error = json.error;
  } else {
    data = json;
  }

  return { data, error };
};
