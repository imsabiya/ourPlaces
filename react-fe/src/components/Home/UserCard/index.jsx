import React from "react";
import { useNavigate } from "react-router-dom";

const UserCard = ({ userItem }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="mx-4 hover:cursor-pointer"
        onClick={() => navigate(`/view-places/${userItem.id}`)}
        key={userItem.id}
      >
        <div className="flex gap-2 card w-60 h-22 card-side bg-slate-400 shadow-xl rounded-md">
          <figure className="">
            <img
              src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg"
              alt="Movie"
              className="rounded-md w-24 h-20"
            />
          </figure>
          <div className="flex flex-col p-2 text-white w-full justify-start place-items-start">
            <h2 className="text-xl font-semibold capitalize">
              {userItem.name}
            </h2>
            <p>{userItem.places.length} Places</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
