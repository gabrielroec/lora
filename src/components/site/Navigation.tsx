/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import logo from "../../../public/assets/plura-logo.svg";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../global/mode-toggle";
import { getAuthUserDetails } from "@/lib/queries";
import { Loader } from "lucide-react";
interface Props {
  user?: null | User;
}

const Navigation = ({ user }: Props) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [authUser, setAuthUser] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const userDetails = await getAuthUserDetails();
      console.log(userDetails);
      setAuthUser(userDetails?.email);
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-10 transition-all ${
        hasScrolled ? "bg-background/80 backdrop-blur-md border-b" : ""
      }`}
    >
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
          {isLoading ? <Loader className="animate-spin" /> : authUser ? "Entrar na agência" : "Fazer login"}
        </Link>
        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
