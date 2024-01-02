"use client";

import { CurrentActivePage, URL } from "@/enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import UserIcon from "@/icons/user-icon";
import { Elsie_Swash_Caps } from "next/font/google";

interface UserData {
  email: string;
  name: string;
  phone: string;
  address: string;
  gender: "M" | "F";
  imageid: string;
}

export default function Profile() {
  const { setCurrentActivePage } = useAppState();
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState("default");
  const [userData, setUserData] = useState<UserData>({
    email: "",
    name: "",
    phone: "",
    address: "",
    gender: "M",
    imageid: "",
  });
  const [selectedRegion, setSelectedRegion] = useState("Region");
  const [selectedImage, setSelectedImage] = useState<string>("http://ssl.gstatic.com/accounts/ui/avatar_2x.png");
  const regions = ["East", "West", "North", "South", "Central"];
  const variants: Array<"flat"> = ["flat"];

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.Profile);

    fetchUserProfile();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed");
    const file = event.target.files?.[0];

    if (file) {
      console.log("File selected:", file);
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string | null;
        if (result) {
          console.log("New image data URL:", result);
          setSelectedImage(result);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Handle save logic here...
    console.log("Save button clicked");
  };

  const handleReset = () => {
    // Handle reset logic here...
    console.log("Reset button clicked");
  };

  const handleDeleteAccount = () => {
    // Handle delete account logic here...
    console.log("Delete Account button clicked");
  };

  const fetchUserProfile = () => {
    fetch(`${process.env.BACKEND_URL}/api/profile`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 403) {
          throw new Error("Unauthorized Access");
        }
        return response.json();
      })
      .then((userData) => {
        console.log("User Profile Data:", userData);
        setUserData(userData);
        setSelectedRegion(userData.region);
      })
      .catch((error) => {
        console.error("Error fetching user profile data:", error.message);
      });
  };

  const DropdownContent = ({ variant }: { variant: "flat" }) => (
    <Dropdown>
      <DropdownTrigger>
        <Button variant={variant} className="capitalize w-80 dark:bg-default-100">
          {selectedRegion}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dropdown Variants" variant={variant}>
        {regions.map((region) => (
          <DropdownItem key={region} onClick={() => setSelectedRegion(region)}>
            {region}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className="container mx-auto mb-8 p-4">
      <div className="flex">
        <div className="w-1/4 p-4">
          <div className="text-center mb-4">
            {userData.imageid ? <Image src={`https://res.cloudinary.com/dcrv5rnoy/image/upload/${userData.imageid}`} className="rounded-full border-2 border-gray-300" alt="avatar" width={200} height={200} style={{ width: "200px", height: "200px" }} /> : <Image src="http://ssl.gstatic.com/accounts/ui/avatar_2x.png" className="rounded-full border-2 border-gray-300" alt="avatar" width={200} height={200} style={{ width: "200px", height: "200px" }} />}
            <br />
            <input type="file" className="text-center center-block file-upload" id="photoInput" accept="image/*" onChange={handleFileChange} />
          </div>
          <hr className="my-4" />
        </div>

        <div className="w-3/4 p-4">
          <h3>Your Information</h3>
          <hr className="my-4" />
          <form className="form">
            <div className="form-group">
              <div className="col-xs-6">
                <label htmlFor="name"></label>
                <Input isRequired type="email" label="Email" value={userData.email} className="max-w-xs mb-8" />

                <Input isRequired type="name" label="Name" value={userData.name} className="max-w-xs mb-8" />
                <Input isRequired type="phone" label="Phone" value={userData.phone} className="max-w-xs mb-8" />

                <Input isRequired type="address" label="Address" value={userData.address} className="max-w-xs mb-8" />

                <div className="mb-12">
                  <div className="flex items-center space-x-4 text-black dark:text-white">
                    <label className="flex items-center">
                      <input type="radio" id="male" name="gender" value="M" checked={userData.gender === "M"} className="form-radio text-white" />
                      <span className="ml-2">Male</span>
                    </label>

                    <label className="flex items-center">
                      <input type="radio" id="female" name="gender" value="F" checked={userData.gender === "F"} className="form-radio text-white" />
                      <span className="ml-2">Female</span>
                    </label>
                  </div>
                </div>

                <div className="mb-8">
                  {variants.map((variant) => (
                    <DropdownContent key={variant} variant={variant} />
                  ))}
                </div>

                <Input isRequired type="password" label="Old Password" className="max-w-xs mb-8" />

                <Input isRequired type="password" label="New Password" className="max-w-xs mb-8" />

                <Input isRequired type="password" label="Confirm Password" className="max-w-xs mb-8" />
              </div>
            </div>

            <div className="flex items-center">
              <Button onClick={handleSave} className="mr-4" color="success">
                Save
              </Button>
              <Button onClick={handleReset} className="mr-4">
                Reset
              </Button>
              <div className="flex-grow" />
              <Button onClick={handleDeleteAccount} color="danger" variant="bordered" startContent={<UserIcon />} className="ml-4">
                Delete user
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
