"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input, Link,Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import { URL } from "@/app/_enums/global-enums";


export default function Page() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showAdditional, setShowAdditional] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [showVerification, setShowVerification] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [timer, setTimer] = useState<number>(300); 
  const {isOpen, onOpenChange} = useDisclosure();


  const handleNextButtonClick = () => {
    if (name && email && password && confirmPassword) {
      setShowAdditional(true);
    } else {
      setErrorMessage("Please fill in all fields.");
    }
  };

  const startTimer = () => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(intervalId);
          setShowVerification(false); // Close the modal when the timer reaches 0
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleVerification = () => {
    const payload = {
      email: email,
    };
  fetch(`${process.env.BACKEND_URL}/api/sendmail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response as needed
      console.log("Sendmail response:", data);

      // Assuming you want to show the verification modal after sending the email
      setShowVerificationModal(true);
      startTimer(); // Start the timer for verification code
    })
    .catch((error) => {
      console.error("Error sending email:", error.message);
      // Handle the error, show an error message, etc.
    });
    setShowVerification(false); // Close the modal
    clearInterval(timer); // Stop the timer
};

  return (
    <div className="w-full min-h-screen grid grid-cols-1 sm:grid-cols-2">
      {!showAdditional && (
        <div className="left w-full min-h-screen flex flex-col justify-center items-center gap-10 bg-[#FB6050] text-white" id="initialFields">
          
          <h2 className="text-3xl text-center">Create your account</h2>
          <div className="w-full">
            <div className="mb-12">
              <Input isRequired type="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full sm:w-[85%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto " />
            </div>
            <div className="mb-12">
              <Input isRequired type="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full sm:w-[85%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto " />
            </div>
            <div className="mb-12">
            <Input isRequired type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full sm:w-[85%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto " />
            </div>
            <div className="mb-16">
            <Input isRequired type="password" label="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full sm:w-[85%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto " />
            </div>

            <div className="mb-4 w-full flex flex-col items-center sm:flex-row sm:justify-center">
              <button className="bg-white text-black px-6 py-3 uppercase rounded-md hover:bg-gray-200 mb-2 sm:mb-0 sm:mr-4 md:mr-8 lg:mr-12 xl:mr-16 2xl:mr-48" onClick={handleNextButtonClick}>
                Next
              </button>
              <a href={URL.SignIn} className="mt-2 sm:mt-0 hover:text-gray-200">
                Log in your account ➡
              </a>
            </div>
            <div className="text-center 2xl:mr-72">{errorMessage}</div>
          </div>
        </div>
      )}

      {showAdditional && (
        <div className="left w-full min-h-screen flex  justify-center  gap-10 bg-[#FB6050] text-white" id="additionalFields">
          <div className="additional w-full flex flex-col justify-center items-center mt-25vh gap-10">
          <div className="left w-full flex flex-col justify-start items-start gap-10">
            <button onClick={() => setShowAdditional(false)} className="text-white">
              &lt; Back
            </button>
          </div>
            <h2 className="text-3xl text-center">Additional Information</h2>
            <div className="w-full">
              <div className="mb-12">
                <Input type="phone" label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full sm:w-[80%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto" />
              </div>

              <div className="mb-12">
                <div className="flex items-center justify-center space-x-4 text-white">
                  <label className="flex items-center">
                    <input type="radio" id="male" name="gender" value="M" onChange={(e) => setGender(e.target.value)} className="form-radio text-white" />
                    <span className="ml-2">Male</span>
                  </label>

                  <label className="flex items-center">
                    <input type="radio" id="female" name="gender" value="F" onChange={(e) => setGender(e.target.value)} className="form-radio text-white" />
                    <span className="ml-2">Female</span>
                  </label>
                </div>
              </div>

              <div className="mb-12">
                <Input type="address" label="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full sm:w-[80%] h-10 border-none rounded-md text-base px-4 sm:px-24 block mx-auto" />
              </div>

              <div className="mb-12 mt-20">
                <select id="region" name="region" value={region} onChange={(e) => setRegion(e.target.value)} className="w-full sm:w-[56%] h-12 border-none rounded-lg text-base px-4 sm:px-24 block mx-auto text-black">
                  <option value="" disabled>
                    Select Region
                  </option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="central">Central</option>
                </select>
              </div>

              <div className="w-full flex flex-col items-center sm:flex-row sm:justify-center">
                <button className="bg-white text-black px-6 py-3 uppercase rounded-md hover:bg-gray-200 mb-2 sm:mb-0 sm:mr-4 md:mr-8 lg:mr-12 xl:mr-16 2xl:mr-48" onClick={()=>{handleVerification(); onOpenChange(); setShowVerificationModal(true)}}>Create</button>
                <a href={URL.SignIn} className="mt-2 sm:mt-0 hover:text-gray-200">
                  Log in your account ➡
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

        {showVerificationModal && (
           <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
           <ModalContent>
             {(onClose) => (
               <>
                 <ModalHeader className="flex flex-col gap-1">Verify your account</ModalHeader>
                 <ModalBody>
                   <p> 
                   6-digit code has been sent to your email account 
                   </p>
                   <Input type="code" label="Code" />
                 </ModalBody>
                 <ModalFooter>
                   <Button color="primary" onPress={onClose}>
                     Verify
                   </Button>
                 </ModalFooter>
               </>
             )}
           </ModalContent>
         </Modal>
        )}

      <div className="right w-full h-screen flex flex-col justify-center items-center bg-[#0c0f38] text-white">
        <a href="/signup" className="logo-box">
          <Image src="/images/logo-light.png" alt="Logo" width={300} height={150} />
        </a>
        <p className="text-center mt-4">True comfort in style!!</p>
      </div>
    </div>
  );
}