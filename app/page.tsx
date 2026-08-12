import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { ProductsSlider } from "@/components/sections/products-slider";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Trust } from "@/components/sections/trust";
import { Cta } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ProductsSlider />
        <About />
        <Services />
        <Process />
        <Trust />
        <Cta />
      </main>
      <SiteFooter />
    </>
  );
}
