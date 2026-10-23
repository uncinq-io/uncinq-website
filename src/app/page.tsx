import { Hero } from "@/components/home/hero";
import { Projects } from "@/components/home/projects";
import { VideoSection } from "@/components/home/video-section";
import { Services } from "@/components/home/services";
import { Delivery } from "@/components/home/delivery";
import { Process } from "@/components/home/process";
import { CallToAction } from "@/components/home/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <VideoSection />
      <Services />
      <Delivery />
      <Process />
      <CallToAction />
    </>
  );
}
