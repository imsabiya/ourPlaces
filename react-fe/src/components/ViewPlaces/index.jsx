// UserCard - reusable  | Name | Places No.
//Take a json for now.
import React, { useState, useEffect } from "react";
import ViewCard from "./ViewCard";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewPlaces = () => {
  const { id } = useParams();

  const [placesData, setPlacesData] = useState([]);
  const [filteredPlacesData, setFilteredPlacesData] = useState([]);

  const [searchText, setSearchText] = useState();

  const paramsData = {
    userId: id,
  };

  const getPlacesData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_OUR_PLACES_URL}/places/user`,
        { params: paramsData }
      );
      console.log(res, "res");
      const data = res.data;
      setPlacesData(data.places);
      setFilteredPlacesData(data.places);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    getPlacesData();
  }, []);

  const handlePlaceSearch = (value) => {
    setSearchText(value);
    setFilteredPlacesData(() => {
      if (value) {
        return placesData.filter(
          (place) =>
            place.title.toLowerCase().includes(value.toLowerCase()) ||
            place.description.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        return placesData;
      }
    });
  };

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="flex flex-col mt-4 gap-2 mx-auto">
        <div className="flex justify-end mx-2">
          <input
            type="text"
            placeholder="Search place..."
            className="input input-bordered"
            value={searchText}
            onChange={(e) => handlePlaceSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-4 my-4 mt-8 place-items-center">
          {filteredPlacesData.length > 0 ? (
            filteredPlacesData?.map((placeItem) => {
              return <ViewCard placeItem={placeItem} />;
            })
          ) : (
            <div className="w-full flex justify-center">No Places...</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewPlaces;
