"use client";

import clsx from "clsx";
import { Image } from "@nextui-org/react";

interface DropDownOpen {
  dropDownKey: number;
  itemKey?: number;
}

interface SideBarDropDownProps {
  label: string;
  iconPath: string;
  activeIconPath: string;
  isSelected: boolean;
  dropDownOpen: DropDownOpen[];
  setDropDownOpen: React.Dispatch<React.SetStateAction<DropDownOpen[]>>;
  dropDownKey: number;
}

export default function SideBarDropDown(props: SideBarDropDownProps) {
  let toShow = false;
  let isActive = false;

  for (let i = 0; i < props.dropDownOpen.length; i++) {
    if (props.dropDownKey === props.dropDownOpen[i].dropDownKey) {
      toShow = true;
      if (props.dropDownOpen[i].itemKey) {
        isActive = true;
      }
      break;
    }
  }

  return (
    <div
      className={clsx("mx-4 mt-2 cursor-pointer w-[89%] max-w-full hover:bg-logo-color-lighter px-4 py-3 flex items-center rounded-lg", isActive && "bg-logo-color-lighter")}
      onClick={() => {
        if (!toShow) {
          props.setDropDownOpen([...props.dropDownOpen, { dropDownKey: props.dropDownKey }]);
        } else {
          props.setDropDownOpen(props.dropDownOpen.filter((d) => d.dropDownKey !== props.dropDownKey));
        }
      }}
    >
      <div></div>
      <Image src={isActive ? props.activeIconPath : props.iconPath} alt={`${props.label} Icon`} radius="none" className="cursor-pointer mr-2 w-6 h-6" />
      <label className={clsx(isActive && "text-semibold text-logo-color", !isActive && "text-slate-600", "cursor-pointer me-auto")}>{props.label}</label>
      <Image src={toShow ? "/icons/chevron-up-slate.svg" : "/icons/chevron-down-slate.svg"} alt="Down Icon" className="w-4 h-4 ms-auto" radius="none" />
    </div>
  );
}
