import { Hero } from "@/components/Hero";
import { Video } from "@/components/Video";
import { Founder } from "@/components/Founder";
import { Leaks } from "@/components/Leaks";
import { Steps } from "@/components/Steps";
import { Board } from "@/components/Board";
import { Benefits } from "@/components/Benefits";
import { Pricing } from "@/components/Pricing";
import { Roi } from "@/components/Roi";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Video />
      <Founder />
      <Leaks />
      <Steps />
      <Board />
      <Benefits />
      <Pricing />
      <Roi />
      <Faq />
      <Cta />
    </>
  );
}
