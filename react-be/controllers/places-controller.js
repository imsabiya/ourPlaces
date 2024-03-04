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
  const userId = req.params.userId;
  try {
    const userWithPlaces = await User.findById(userId).populate("places");
    //console.log(userWithPlaces, "uw");
    if (!userWithPlaces) {
      return res
        .status(400)
        .json({ error: "Could not find places for given User Id" });
    } else {
      res.status(200).json({
        places: userWithPlaces.places.map((place) =>
          place.toObject({ getters: true })
        ),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { addPlace, getPlacesByUserId };
