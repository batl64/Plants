export const respons = async (method, url, body = null) => {
  const response = await fetch(process.env.BACKEND + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });

  const res = await response.json();
  if (!response.ok) {
    throw new Error(res.message);
  }

  return res;
};

export const upload = async (method, url, body = null, headers = {}) => {
  const response = await fetch(process.env.BACKEND + url, {
    method: method,
    body: body,
    headers: headers,
  });

  const res = await response.json();
  if (!response.ok) {
    throw new Error(res.message);
  }

  return res;
};

export const fetchKyivRegion = async (name) => {
  const response = await fetch(
    `https://overpass-api.de/api/interpreter?data=[out:json];(${name});out geom;`
  );

  const data = await response.json();
  return data;
};
