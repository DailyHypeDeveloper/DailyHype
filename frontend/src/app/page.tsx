"use client";

import Link from "next/link";
import Header from "./(components)/header";
import { useState } from "react";

export default function Home() {

  return (
    <div>
      <Header currentPage="home" />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>This is home page.</label>
      </div>
    </div>
  );
}
