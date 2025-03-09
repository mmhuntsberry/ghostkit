"use client";

import { useState, useEffect } from "react";
// import { Button } from "@mmhuntsberry/components";

const Dashboard = () => {
  // const [isCssLoaded, setIsCssLoaded] = useState(false);

  // useEffect(() => {
  //   if (brand) {
  //     console.log("Loading brand CSS:", brand);
  //     import(`@mmhuntsberry/tokens/theme/${brand}`)
  //       .then((module) => {
  //         setIsCssLoaded(true);
  //         console.log("Brand CSS loaded:", brand);
  //       })
  //       .catch((err) => {
  //         console.error("Failed to load brand CSS:", err);
  //       });
  //   }
  // }, [brand]);

  // if (!isCssLoaded) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <h1>Dashboard</h1>
      <button data-brand={process.env.NEXT_PUBLIC_SITE_TYPE}>Click me</button>
      <button>Click me</button>
    </div>
  );
};

export default Dashboard;
