export const useFetch = async (url, payload = {}, method) => {
  let data;
  let error;

  const response =
    method === "POST"
      ? await fetch(url, { method, body: JSON.stringify(payload) })
      : await fetch(url);
  if (!response.ok) {
    const json = await response.json();
    error = json.message;
  } else {
    data = await response.json();
  }

  return { data, error };
};
