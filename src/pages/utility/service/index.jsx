import React from "react";
import ExampleTwo from "@/pages/table/react-tables/ExampleTwo"
// import images
import post1Img from "@/assets/images/all-img/post-1.png";

const ServicePage = () => {
  return (
    <div className="lg:flex flex-wrap blog-posts lg:space-x-5 space-y-5 lg:space-y-0 rtl:space-x-reverse">
      <div className="flex-1">
        <ExampleTwo/>
      </div>
    </div>
  );
};

export default ServicePage;
