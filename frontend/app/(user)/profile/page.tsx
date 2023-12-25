"use client";

import { CurrentActivePage, URL } from "@/app/_enums/global-enums";
import { useAppState } from "@/app/app-provider";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

export default function Cart() {
  const { token, setToken, setCurrentActivePage } = useAppState();
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState("default");
  const [selectedRegion, setSelectedRegion] = useState("Region");
  const [selectedImage, setSelectedImage] = useState<string>("http://ssl.gstatic.com/accounts/ui/avatar_2x.png");

  useEffect(() => {
    setCurrentActivePage(CurrentActivePage.Profile);
    if (!token) {
      alert("Unauthorized Access!");
      localStorage.removeItem("token");
      setToken(null);
      router.replace(URL.SignIn);
    }
  }, []);

  if (!token) return <></>;

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

  const regions = ["East", "West", "North", "South", "Central"];
  const variants: Array<"flat"> = ["flat"];

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
            <Image src={selectedImage} className="rounded-full border-2 border-gray-300" alt="avatar" width={200} height={200} style={{ width: "200px", height: "200px" }} />
            <br />
            <input type="file" className="text-center center-block file-upload" id="photoInput" accept="image/*" onChange={handleFileChange} />
          </div>
          <hr className="my-4" />
        </div>

        <div className="w-3/4 p-4">
          <h3>Your Information</h3>
          <hr className="my-4" />
          <form className="form">
            {/* ... form fields */}
            <div className="form-group">
              <div className="col-xs-6">
                <label htmlFor="name"></label>
                <Input isRequired type="email" label="Email" defaultValue="junior@nextui.org" className="max-w-xs mb-8" />

                <Input isRequired type="name" label="Name" defaultValue="junior@nextui.org" className="max-w-xs mb-8" />
                <Input isRequired type="phone" label="Phone" defaultValue="junior@nextui.org" className="max-w-xs mb-8" />

                <Input isRequired type="address" label="Address" defaultValue="junior@nextui.org" className="max-w-xs mb-8" />

                <div className="mb-12">
                  <div className="flex items-center space-x-4 text-black dark:text-white">
                    <label className="flex items-center">
                      <input type="radio" id="male" name="gender" value="M" className="form-radio text-white" />
                      <span className="ml-2">Male</span>
                    </label>

                    <label className="flex items-center">
                      <input type="radio" id="female" name="gender" value="F" className="form-radio text-white" />
                      <span className="ml-2">Female</span>
                    </label>
                  </div>
                </div>

                <div className="mb-8">
                  {variants.map((variant) => (
                    <DropdownContent key={variant} variant={variant} />
                  ))}
                </div>

                <Input isRequired type="password" label="Old Password" defaultValue="junior@nextui.org" className="max-w-xs mb-8" />

                <Input isRequired type="password" label="New Password" defaultValue="junior@nextui.org" className="max-w-xs mb-8" />

                <Input isRequired type="password" label="Confirm Password" defaultValue="junior@nextui.org" className="max-w-xs mb-8" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
