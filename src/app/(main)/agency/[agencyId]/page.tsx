import React from "react";

const page = async ({ params }: { params: { agencyId: string } }) => {
  return <div>{params.agencyId}</div>;
};

export default page;
