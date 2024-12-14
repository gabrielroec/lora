/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import logo from "../../../public/assets/plura-logo.svg";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../global/mode-toggle";
interface Props {
  user?: null | User;
}

const Navigation = ({ user }: Props) => {
  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-2">
        <Image src={logo} alt="logo" height={50} width={50} />
        <span className="text-xl font-bold">Plura</span>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href="/">Preços</Link>
          <Link href="/">Sobre</Link>
          <Link href="/">Documentação</Link>
          <Link href="/">Features</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        <Link href={"/agency"} className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80">
          Login
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
