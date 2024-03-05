const Place = require("../models/place");
const User = require("../models/user");
const getCoordsForAddress = require("../utils/location");

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
  const id = req.query.userId; // query Params
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
    res.status(200).json({ places: places, totalCount: places.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePlace = async (req, res) => {
  const placeId = req.query.placeId;
  const userId = req.query.userId;
  const place = await Place.findById(placeId);

  if (userId === place.createdBy.toString()) {
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
  } else {
    return res
      .status(400)
      .json({ error: "You are not authorized to delete this place" });
  }
};

const editPlace = async (req, res) => {
  //const placeId = req.params.placeId;

  const { _id, title, description, image, address, userId } = req.body;

  try {
    const place = await Place.findById(_id);
    if (place) {
      if (place.createdBy.toString() === userId) {
        const coordinates = await getCoordsForAddress(address);
        place.title = title;
        place.description = description;
        place.image = image;
        place.address = address;
        place.location = coordinates;

        await place.save();
        res.status(200).json({ message: "Place updated successfully", place });
      } else {
        return res
          .status(400)
          .json({ error: "You are not authorized to update this place" });
      }
    } else {
      return res.status(400).json({ error: "Place not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlacesByUserIdWithPagination = async (req, res) => {
  const id = req.query.userId; // query Params
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
      const allPlaces = userWithPlaces.places.map((place) =>
        place.toObject({ getters: true })
      );
      //console.log(allPlaces, "allPlaces");
      const page = parseInt(req.query.page) || 1; //InitialPage
      const pageSize = parseInt(req.query.pageSize) || 10; //InitialPageSize
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;

      const paginatedItems = allPlaces.slice(startIndex, endIndex);
      const totalPages = Math.ceil(allPlaces.length / pageSize);

      res.status(200).json({
        items: paginatedItems,
        totalItems: allPlaces.length,
        totalPages: totalPages,
        currentPage: page,
      });
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
  getPlacesByUserIdWithPagination,
};
