import FeaturedPrompts from "@/components/cards/ui card/FeaturedPrompts";
import HeroBanner from "@/components/ui/landingpage/HeroBanner";

import StatsAndCategories from "@/components/ui/landingpage/StatsAndCategories";

import Image from "next/image";
import WhyPromptHub from "@/components/ui/landingpage/WhyPromptHub";
import TopCreators from "@/components/ui/landingpage/TopCreators";
import Testimonials from "@/components/ui/landingpage/Testimonials";


export default function Home() {
  return (
    <div >
      {/* hero banner */}
      <div>
        <HeroBanner/>
      </div>
      {/* StatsAndCategories */}
      <div>
        <StatsAndCategories/>
      </div>
      {/* FeaturedPrompts */}
      <div>
        <FeaturedPrompts/>
      </div>
      {/* WhyPromptHub */}
      <div>
        <WhyPromptHub/>
      </div>
      {/* TopCreators */}
      <div>
        <TopCreators/>
      </div>
        {/* Testimonials */}
        <div>
        <Testimonials/>
        </div>
    </div>
  );
}
