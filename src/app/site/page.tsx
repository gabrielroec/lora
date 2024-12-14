/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RetroGrid } from "@/components/background/retro-grid";
import Image from "next/image";
import preview from "../../../public/assets/preview.png";
import { pricingCards } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <section className="h-full w-full md:pt-44 relative flex items-center justify-center flex-col ">
        <RetroGrid angle={45} className="top-[-400px]" />
        <p className="text-center">Run your agency, in one place</p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px]">Plura</h1>
        </div>
        <div className="flex justify-center items-center relative md:mt-[-70px]">
          <Image
            src={preview}
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>
      <section className="flex justify-center items-center flex-col gap-4 md:!mt-20 mt-[-60px]">
        <h2 className="text-4xl text-center">Escolha o que mais te atende.</h2>
        <p className="text-muted-foreground text-center">
          Nossos planos de preços simples são adaptados para atender às suas necessidades. Se
          {" você"} não <br />
          pronto para se comprometer, você pode começar gratuitamente.
        </p>
        <div className="flex items-center gap-4 flex-wrap mt-6">
          <div className="flex  justify-center gap-4 flex-wrap mt-6">
            {pricingCards.map((card) => (
              <p>Cards</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
