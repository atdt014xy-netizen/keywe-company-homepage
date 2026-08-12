import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { TrustBadges } from "@/components/sections/trust-badges";
import { ProductsCarousel } from "@/components/sections/products-carousel";
import { About } from "@/components/sections/about";
import { Process } from "@/components/sections/process";
import { Trust } from "@/components/sections/trust";
import { Precautions } from "@/components/sections/precautions";
import { ConsultSection } from "@/components/sections/consult-section";
import { LoanAdvertisementDisclosure } from "@/components/legal/loan-advertisement-disclosure";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustBadges />
        <ProductsCarousel />
        <About />
        <Process />
        <Trust />
        <Precautions />
        <ConsultSection />
        <LoanAdvertisementDisclosure />
      </main>
      <SiteFooter />
    </>
  );
}
