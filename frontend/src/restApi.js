const baseUrl = process.env.REACT_APP_APIURL;

const matchesList = async () => {
  return fetch(baseUrl + '/list-matches').then(r => r.json());
};

export { matchesList }
