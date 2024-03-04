const axios = require("axios");

//const HttpError = require("../models/http-error");

const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    // const error = new HttpError(
    //   "Could not find location for the specified address.",
    //   422
    // );
    throw new Error("Could not find location for the specified address.");
  }
  const coordinates = data?.results[0]?.geometry?.location;
  return coordinates || { lat: 17.385044, lon: 78.486671 };
}

module.exports = getCoordsForAddress;
