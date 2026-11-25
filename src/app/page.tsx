import type { Metadata } from "next";
import AboutBand from "@/components/home/AboutBand";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import PhotoField from "@/components/home/PhotoField";
import Practice from "@/components/home/Practice";
import WorkRail from "@/components/home/WorkRail";
import ContactSection from "@/components/ContactSection";
import Ticker from "@/components/Ticker";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <WorkRail />
      <Practice />
      <PhotoField />
      <AboutBand />
      <Ticker
        className="home-ticker"
        items={[
          "Autonomy",
          "Photography",
          "Design",
          "Teaching",
          "Systems",
          "Image-making",
        ]}
      />
      <ContactSection />
    </>
  );
}
