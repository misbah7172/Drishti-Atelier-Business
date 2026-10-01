import HeroSlidingBanner from '../../components/HeroSlidingBanner/HeroSlidingBanner';
import TopCategories from '../../components/TopCategories/TopCategories';
import SlideBanner from '../../components/SlideBanner/SlideBanner';
import ShowcaseSubItemsBanner from '../../components/ShowcaseSubItemsBanner/ShowcaseSubItemsBanner';
import EyeglassesShapeGuide from '../../components/EyeglassesShapeGuide/EyeglassesShapeGuide';
import FullscreenMoments from '../../components/FullscreenMoments/FullscreenMoments';
import BestSellingProducts from '../../components/BestSellingProducts/BestSellingProducts';
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

      {/* Slide Banner (1500x500px): After Top Categories Section */}
      <SlideBanner
        id="banner-after-categories"
        ariaLabel="Top Categories Featured Slide Banner"
        preset="categories"
      />

      {/* 03. Get the perfect shape - Eyeglasses Guide (FRAME ANATOMY & FACIAL PROPORTIONS) */}
      <EyeglassesShapeGuide />

      {/* Showcase Banner with 4 Sub-Items (Firmoo-Style Layout): After FRAME ANATOMY Section */}
      <ShowcaseSubItemsBanner
        id="banner-after-anatomy"
        ariaLabel="Tortoiseshell Frames Collection Showcase"
        preset="tortoise"
      />

      {/* 04. Dark Full-Screen Advertising Spread */}
      <FullscreenMoments />

      {/* 05. Best Selling Products Section */}
      <BestSellingProducts />

      {/* 08. High-Fashion Social Proof */}
      <EditorialTestimonials />

      {/* 09. High-Impact Conversion Finale (The Finale) */}
      <FinalCTA />

      {/* Showcase Banner with 4 Sub-Items: After The Finale Section */}
      <ShowcaseSubItemsBanner
        id="banner-after-finale"
        ariaLabel="Titanium Architecture Showcase"
        preset="titanium"
      />

      {/* 10. Our House Brands (Over Footer) */}
      <OurBrands />
    </div>
  );
}
