import HeroProductReveal from '../../components/HeroProductReveal/HeroProductReveal';
import ProductAnatomy from '../../components/ProductAnatomy/ProductAnatomy';
import FullscreenMoments from '../../components/FullscreenMoments/FullscreenMoments';
import FrameExplorer from '../../components/FrameExplorer/FrameExplorer';
import EditorialCollections from '../../components/EditorialCollections/EditorialCollections';
import FrameFinder from '../../components/FrameFinder/FrameFinder';
import BrandStory from '../../components/BrandStory/BrandStory';
import EditorialTestimonials from '../../components/EditorialTestimonials/EditorialTestimonials';
import FinalCTA from '../../components/FinalCTA/FinalCTA';
import './Home.css';

export default function Home() {
  return (
    <div className="home-editorial-page">
      {/* 01. Hero Product Entrance */}
      <HeroProductReveal />

      {/* 02. The Frame Engineering Breakdown */}
      <ProductAnatomy />

      {/* 03. Dark Full-Screen Advertising Spread */}
      <FullscreenMoments />

      {/* 04. Studio White Interactive Angle Explorer */}
      <FrameExplorer />

      {/* 05. Curated Architectural Collections & Cards */}
      <EditorialCollections />

      {/* 06. Interactive Face & Style Advisor */}
      <FrameFinder />

      {/* 07. Editorial Benefit Statements & Brand Manifesto */}
      <BrandStory />

      {/* 08. High-Fashion Social Proof */}
      <EditorialTestimonials />

      {/* 09. High-Impact Conversion Finale */}
      <FinalCTA />
    </div>
  );
}
