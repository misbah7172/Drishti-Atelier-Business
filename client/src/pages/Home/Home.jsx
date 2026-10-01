import HeroSlidingBanner from '../../components/HeroSlidingBanner/HeroSlidingBanner';
import TopCategories from '../../components/TopCategories/TopCategories';
import SlideBanner from '../../components/SlideBanner/SlideBanner';
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

      {/* Slide Banner (1500x500px): After FRAME ANATOMY & FACIAL PROPORTIONS Section */}
      <SlideBanner
        id="banner-after-anatomy"
        ariaLabel="Frame Anatomy & Facial Proportions Slide Banner"
        preset="anatomy"
      />

      {/* 04. Dark Full-Screen Advertising Spread */}
      <FullscreenMoments />

      {/* 05. Best Selling Products Section */}
      <BestSellingProducts />

      {/* 08. High-Fashion Social Proof */}
      <EditorialTestimonials />

      {/* 09. High-Impact Conversion Finale (The Finale) */}
      <FinalCTA />

      {/* Slide Banner (1500x500px): After The Finale Section */}
      <SlideBanner
        id="banner-after-finale"
        ariaLabel="The Finale & Atelier Privilege Slide Banner"
        preset="finale"
      />

      {/* 10. Our House Brands (Over Footer) */}
      <OurBrands />
    </div>
  );
}
