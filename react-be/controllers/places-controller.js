const Place = require("../models/place");
const User = require("../models/user");
const getCoordsForAddress = require("../utils/location");

let SECRET_KEY = "my cat says meow";

// const getPlaces = async (req, res) => {
//   let users;

//   try {
//     users = await Place.find();
//     res.status(200).json(
//       users.map((user) => {
//         return {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           image: user.image,
//           places: user.places,
//         };
//       })
//     );
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const addPlace = async (req, res) => {
  const { title, description, address, image, createdBy } = req.body;
  try {
    const user = await User.findById(createdBy.toString());
    if (user) {
      const coordinates = await getCoordsForAddress(address);
      const newPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image,
        createdBy,
      });
      await newPlace.save();
      user["places"].push(newPlace);
      res.status(200).json({ message: "New Place added successfully" });
    } else {
      return res
        .status(400)
        .json({ error: "Could not find user for provided creator Id" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlacesByUserId = async (req, res) => {
  const id = req.query.userId;
  try {
    const users = await User.find();
    const places = await Place.find();

    const usersWithPlaces = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        places: places.filter((place) => {
          return place.createdBy.toString() === user.id;
        }),
      };
    });

    const userWithPlaces = usersWithPlaces.find((user) => user.id === id);

    if (!userWithPlaces) {
      return res
        .status(400)
        .json({ error: "Could not find places for given User Id" });
    } else {
      res.status(200).json({
        places: userWithPlaces.places.map((place) =>
          place.toObject({ getters: true })
        ),
        totalCount: userWithPlaces.places.length,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePlace = async (req, res) => {
  const placeId = req.params.placeId;

  await Place.findByIdAndDelete(placeId)
    .then((data) => {
      if (data) {
        res.json({ message: "Place deleted successfully", data });
      } else {
        res.status(400).json({ message: "Place already deleted" });
      }
    })
    .catch((err) =>
      res.status(400).json({
        message: "Unable to delete Place",
        error: err.message,
      })
    );
};

const editPlace = async (req, res) => {
  const placeId = req.params.placeId;

  const { title, description, image, address } = req.body;

  try {
    const place = await Place.findById(placeId);
    if (place) {
      const coordinates = await getCoordsForAddress(address);
      place.title = title;
      place.description = description;
      place.image = image;
      place.address = address;
      place.location = coordinates;

      await place.save();
      res.status(200).json({ message: "Place updated successfully", place });
    } else {
      return res.status(400).json({ error: "Place not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addPlace,
  getPlacesByUserId,
  getAllPlaces,
  deletePlace,
  editPlace,
};
