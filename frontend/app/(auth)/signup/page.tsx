"use client"
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import Image from "next/image";

export default function SignUp() {
  
  return (
  <div className="w-full min-h-screen grid grid-cols-1 sm:grid-cols-2">
    <div className="left w-full min-h-screen flex flex-col justify-center items-center gap-10 bg-[#FB6050] text-white" id="initialFields">
       <h2 className="text-3xl text-center">Create your account</h2>
       <form className="w-full">
          <div className="mb-12">
            <Input
              type="email"
              label="Email"
              id="email"
              className="w-full sm:w-[85%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto "
            />
          </div>
          <div className="mb-12">
            <Input
              type="name"
              label="Name"
              id="name"
              className="w-full sm:w-[85%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto "
            />
          </div>
          <div className="mb-12">
            <Input
              type="password"
              label="Password"
              id="password"
              className="w-full sm:w-[85%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto "
            />
          </div>
          <div className="mb-16">
            <Input
              type="confirmpassword"
              label="Confirm Password"
              id="confirmpassword"
              className="w-full sm:w-[85%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto"
            />
          </div>

          <div className="w-full flex flex-col items-center sm:flex-row sm:justify-center">
          <button
            type="submit"
            className="bg-white text-black px-6 py-3 uppercase rounded-md hover:bg-gray-200 mb-2 sm:mb-0 sm:mr-4 md:mr-8 lg:mr-12 xl:mr-16 2xl:mr-48"
            id="signupButton"
          >
            Register
          </button>
          <a href="./signup" className="mt-2 sm:mt-0 hover:text-gray-200">
            Log in your account ➡
          </a>
        </div>
        </form>
    </div>

    <div className="right w-full h-screen flex flex-col justify-center items-center bg-[#0c0f38] text-white">
        <a href="/signup" className="logo-box">
          <Image src="/images/logo-light.png" alt="Logo" width={300} height={150} />
        </a>
        <p className="text-center mt-4">True comfort in style!!</p>
      </div>
  </div>
  );
}
