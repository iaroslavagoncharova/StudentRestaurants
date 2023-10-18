const fetchData = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    alert(`Error ${response.status} occured, reason: ${response.statusText}`);
    throw new Error(`Error ${response.status} occured`);
  }
  const json = response.json();
  return json;
};

export {fetchData};
