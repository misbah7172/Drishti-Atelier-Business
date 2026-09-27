import HeroSlidingBanner from '../../components/HeroSlidingBanner/HeroSlidingBanner';
import TopCategories from '../../components/TopCategories/TopCategories';
import EyeglassesShapeGuide from '../../components/EyeglassesShapeGuide/EyeglassesShapeGuide';
import FullscreenMoments from '../../components/FullscreenMoments/FullscreenMoments';
import FrameExplorer from '../../components/FrameExplorer/FrameExplorer';
import EditorialCollections from '../../components/EditorialCollections/EditorialCollections';
import BrandStory from '../../components/BrandStory/BrandStory';
import EditorialTestimonials from '../../components/EditorialTestimonials/EditorialTestimonials';
import FinalCTA from '../../components/FinalCTA/FinalCTA';
import OurBrands from '../../components/OurBrands/OurBrands';
import './Home.css';

export default function Home() {
  return (
    <div className="home-editorial-page">
      {/* 01. Hero Sliding Banner Carousel */}
      <HeroSlidingBanner />

      {/* 02. Curated Taxonomy & Top Categories */}
      <TopCategories />

      {/* 03. Get the perfect shape - Eyeglasses Guide */}
      <EyeglassesShapeGuide />

      {/* 04. Dark Full-Screen Advertising Spread */}
      <FullscreenMoments />

      {/* 05. Studio White Interactive Angle Explorer */}
      <FrameExplorer />

      {/* 06. Curated Architectural Collections & Cards */}
      <EditorialCollections />

      {/* 07. Editorial Benefit Statements & Brand Manifesto */}
      <BrandStory />

      {/* 08. High-Fashion Social Proof */}
      <EditorialTestimonials />

      {/* 09. High-Impact Conversion Finale */}
      <FinalCTA />

      {/* 10. Our House Brands (Over Footer) */}
      <OurBrands />
    </div>
  );
}
