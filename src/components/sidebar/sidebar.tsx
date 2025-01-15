import { getAuthUserDetails } from "@/lib/queries";
import React from "react";

interface SidebarProps {
  id: string;
  type: "agency" | "subaccount";
}

const sidebar = async ({ id, type }: SidebarProps) => {
  const user = await getAuthUserDetails();

  if (!user) return null;

  if (!user.Agency) return null;

  const details = type === "agency" ? user.Agency : user?.Agency.SubAccount.find((subaccount) => subaccount.id === id);

  const isWhiteLabelAgency = user.Agency.whiteLabel;

  if (!details) return;

  let sidebarLogo = user.Agency.agencyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabelAgency) {
    if (type === "subaccount") {
      sideBarLogo = user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)?.subAccountLogo || user.Agency.agencyLogo;
    }
  }

  const sideBarOpt =
    type === "agency"
      ? user.Agency.SidebarOption || []
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)?.SidebarOption || [];

  const subaccount = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find((permission) => permission.subAccountId === subaccount.id && permission.access)
  );

  return (
    <>
      <MenuOptions />
      <MenuOptions />
    </>
  );
};

export default sidebar;
