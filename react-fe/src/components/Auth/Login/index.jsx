import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = async (loginData) => {
    console.log(loginData, "loginData");
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_OUR_PLACES_URL}/login`,
        loginData
      );
      const data = res.data;
      toast.success(data.message);
      sessionStorage.setItem("token", data.payload.token);
      sessionStorage.setItem("userId", data.payload.userId);
      setIsLoggedIn(true);
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
          <h2 className="text-2xl font-bold my-2">Login</h2>
          <form className="card-body" onSubmit={handleSubmit(submitHandler)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered"
                //required
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Za-z]+[A-Za-z0-9 -]*/i,
                    message: "Invalid Email",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-400 text-left text-sm ml-1 my-1">
                  {errors?.email?.message}
                </span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered"
                required
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-400 text-left text-sm ml-1 my-1">
                  {errors?.password?.message}
                </span>
              )}
              <label className="label">
                {/* <a href="#" className=" text-sm link link-hover">
                  Forgot password?
                </a> */}
                <span
                  className="text-blue-900 font-normal text-sm hover:underline hover:cursor-pointer"
                  onClick={() => navigate("/forgotPwd")}
                >
                  Forgot password?
                </span>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary text-lg">Login</button>
            </div>
            <div className="flex gap-1 justify-center place-items-center my-1">
              Don't have an account?{" "}
              <span
                className="text-blue-700 font-semibold text-md hover:underline hover:cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Create Account
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
