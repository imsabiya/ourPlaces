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

  const [usersData, setUsersData] = useState([]);

  const getUsersData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_OUR_PLACES_URL}/users`
      );
      const data = res.data;
      setUsersData(data);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const getPlacesByUserId = usersData.find((user) => user.id === id);
  // console.log(getPlacesByUserId, "getPLaces");

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="flex flex-wrap gap-x-4 gap-y-4 my-4 mt-8 place-items-center">
        {getPlacesByUserId?.places.length > 0 ? (
          getPlacesByUserId?.places?.map((placeItem) => {
            return <ViewCard placeItem={placeItem} />;
          })
        ) : (
          <div className="w-full flex justify-center">No Places.... </div>
        )}
      </div>
    </>
  );
};

export default ViewPlaces;
