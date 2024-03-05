import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPlace = () => {
  const navigate = useNavigate();

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    initialValues: {
      title: "",
      description: "",
      address: "",
      image: "",
    },
  });

  const submitHandler = async (data) => {
    //console.log(data, "AddPlacesData");
    const newPlaceParams = {
      ...data,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROc4mJPWstYdTHXamlHR-riLoHvQi_G4AVW3117kIogQ&s",
      createdBy: sessionStorage.getItem("userId"),
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_OUR_PLACES_URL}/addPlace`,
        newPlaceParams
      );
      const data = res.data;
      toast.success(data.message);
      navigate("/");
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="flex container mx-auto justify-center place-items-center mt-12">
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <h2 className="text-2xl font-bold my-2">Add Place</h2>
          <form className="card-body" onSubmit={handleSubmit(submitHandler)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                placeholder="Title"
                className="input input-bordered"
                required
                {...register("title", {
                  required: "Title is required",
                  pattern: {
                    value: /^[A-Za-z]+[A-Za-z0-9 -]*/i,
                    message: "Invalid Title",
                  },
                })}
              />
              {errors.title && (
                <span className="text-red-400 text-left text-sm ml-1 my-1">
                  {errors?.title?.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                placeholder="Description"
                className="textarea textarea-bordered textarea-md w-full max-w-xs"
                {...register("description", {
                  required: "Description is required",
                  pattern: {
                    value: /^[A-Za-z]+[A-Za-z0-9 -]*/i,
                    message: "Invalid Description",
                  },
                })}
              ></textarea>
              {errors.description && (
                <span className="text-red-400 text-left text-sm ml-1 my-1">
                  {errors?.description?.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                type="text"
                placeholder="Address"
                className="input input-bordered"
                required
                {...register("address", {
                  required: "Address is required",
                  pattern: {
                    value: /^[A-Za-z]+[A-Za-z0-9 -]*/i,
                    message: "Invalid Address",
                  },
                })}
              />
              {errors.address && (
                <span className="text-red-400 text-left text-sm ml-1 my-1">
                  {errors?.address?.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Upload an Image</span>
              </label>
              <input type="file" accept="image/*" required />
            </div>
            {/* <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                placeholder="Location"
                className="input input-bordered"
                required
                {...register("location", {
                  required: "Location is required",
                })}
              />
              {errors.location && (
                <span className="text-red-400 text-left text-sm ml-1 my-1">
                  {errors?.location?.message}
                </span>
              )}
            </div> */}

            <div className="form-control mt-6">
              <button className="btn btn-primary text-lg">Add Place</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddPlace;
