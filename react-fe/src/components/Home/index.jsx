// UserCard - reusable  | Name | Places No.
//Take a json for now.
import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [usersData, setUsersData] = useState([]);

  const getUsersData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_OUR_PLACES_URL}/users`
      );
      const data = res.data;
      setUsersData(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="flex flex-wrap gap-x-4 gap-y-4 my-4 mt-8 place-items-center">
        {usersData.map((userItem) => {
          return <UserCard userItem={userItem} />;
        })}
      </div>
    </>
  );
};

export default Home;
