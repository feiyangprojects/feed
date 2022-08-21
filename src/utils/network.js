function fetchX(url, init) {
  return new Promise((resolve, reject) => {
    fetch(url, init).then(
      (response) => {
        if (response.ok == true) {
          return resolve(response);
        } else {
          return reject(new Error(`${response.status} ${response.statusText}`));
        }
      },
      (error) => {
        return reject(error);
      },
    );
  });
}

export { fetchX };
