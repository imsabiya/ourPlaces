import React from "react";
import { useNavigate } from "react-router-dom";

const ViewCard = ({ placeItem }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="mx-4"
        //onClick={() => navigate("/view-places")}
        key={placeItem.id}
      >
        <div className="card w-96 bg-base-100 shadow-xl rounded-md">
          <figure>
            <img
              src={placeItem.image || "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"}
              alt="Shoes"
              className="rounded-t-lg"
            />
          </figure>
          <div className="card-body text-left p-2 m-2">
            <h2 className="card-title text-2xl font-bold pb-1">
              {placeItem.title}
            </h2>
            <p>{placeItem.description}</p>
            <div className="card-actions justify-end">
              <button className="btn btn-accent">View Location</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCard;
