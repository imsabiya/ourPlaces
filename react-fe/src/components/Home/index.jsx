// UserCard - reusable  | Name | Places No.
//Take a json for now.
import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [usersData, setUsersData] = useState([]);
  const [searchText, setSearchText] = useState();

  const [filteredData, setFilteredData] = useState([]);

  const getUsersData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_OUR_PLACES_URL}/users`
      );
      const data = res.data;
      setUsersData(data);
      setFilteredData(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const handleUserSearch = (value) => {
    //console.log(e.target.value);
    setSearchText(value);
    // console.log(
    //   "check",
    //   usersData.filter((user) =>
    //     user.name.toLowerCase().includes(e.target.value.toLowerCase())
    //   )
    // );
    setFilteredData(() => {
      if (value) {
        return usersData.filter((user) =>
          user.name.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        return usersData;
      }
    });
  };

  // useEffect(() => {
  //   handleUserSearch(searchText);
  //   console.log(searchText, "searchText")
  // }, [searchText]);

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="flex flex-col mt-4 gap-2 mx-auto">
        <div className="flex justify-end mx-2">
          <input
            type="text"
            placeholder="Search user..."
            className="input input-bordered"
            value={searchText}
            onChange={(e) => handleUserSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-4 my-4 mt-8 place-items-center">
          {filteredData.length > 0 ? (
            filteredData.map((userItem) => {
              return <UserCard userItem={userItem} />;
            })
          ) : (
            <div className="w-full flex justify-center">No user found.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
