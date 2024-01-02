"use client";

import { Image } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { URL } from "@/enums/global-enums";
import clsx from "clsx";
import { useState } from "react";

interface DropDownOpen {
  dropDownKey: number;
  itemKey?: number;
}

interface SideBarItemProps {
  route: URL;
  label: string;
  iconPath: string;
  activeIconPath: string;
  iconRadius?: "none" | "full" | "lg" | "md" | "sm";
  isSelected?: boolean;
  type?: "dropdownitem";
  dropDownKey?: number;
  dropDownOpen?: DropDownOpen[];
  itemKey?: number;
}

export default function SideBarItem(props: SideBarItemProps) {
  let toShow = false;
  let isActive = false;
  const [isHover, setIsHover] = useState<boolean>(false);

  if (props.dropDownOpen) {
    for (let i = 0; i < props.dropDownOpen.length; i++) {
      if (props.dropDownKey === props.dropDownOpen[i].dropDownKey) {
        toShow = true;
      }
      if (props.itemKey === props.dropDownOpen[i].itemKey) {
        isActive = true;
        break;
      }
    }
  }
  const router = useRouter();

  return (
    <>
      {toShow && props.type === "dropdownitem" && (
        <div onMouseOver={() => setIsHover(true)} onMouseOut={() => setIsHover(false)} onClick={() => router.push(props.route)} className={clsx("mx-4 mt-2 items-center cursor-pointer w-[89%] px-4 rounded-lg py-3 flex")}>
          <Image radius={props.iconRadius ? props.iconRadius : "none"} className="cursor-pointer ms-5 mr-2 w-4 h-4" src={isActive ? props.activeIconPath : isHover ? props.activeIconPath : props.iconPath} alt={`${props.label} Icon`} />
          <label className={clsx("cursor-pointer", isActive && "text-semibold text-logo-color", !isActive && !isHover && "text-slate-600", !isActive && isHover && "text-logo-color text-semibold")}>{props.label}</label>
        </div>
      )}
      {!props.type && (
        <div onClick={() => router.push(props.route)} className={clsx("mx-4 mt-2 items-center cursor-pointer w-[89%] px-4 rounded-lg py-3 flex hover:bg-logo-color-lighter", props.isSelected && "bg-logo-color-lighter")}>
          <Image radius={props.iconRadius ? props.iconRadius : "none"} className={clsx("cursor-pointer w-6 mr-2 h-6")} src={props.isSelected ? props.activeIconPath : props.iconPath} alt={`${props.label} Icon`} />
          <label className={clsx("cursor-pointer", props.isSelected && "text-semibold text-logo-color", !props.isSelected && "text-slate-600")}>{props.label}</label>
        </div>
      )}
    </>
  );
}
