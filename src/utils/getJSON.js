// // Libraries
// const fetch = require(`node-fetch`)

// module.exports = async (url) => {
// 	return new Promise(resolve => {
// 		fetch(url)
// 			.then(res => res.json())
// 			.then(json => resolve(json));
// 	});
// imports
const fetch = import('node-fetch').then(module => module.default);

const getJSON = async (url) => {
  try {
    // get jsonResponse from the user input URL
    const response = await fetch.then(fn => fn(url));
    const data = await response.json();
    // return json object
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

module.exports = getJSON;