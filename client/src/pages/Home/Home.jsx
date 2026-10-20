import { useState, useEffect } from 'react';
import HeroSlidingBanner from '../../components/HeroSlidingBanner/HeroSlidingBanner';
import TopCategories from '../../components/TopCategories/TopCategories';
import SlideBanner from '../../components/SlideBanner/SlideBanner';
import ShowcaseSubItemsBanner from '../../components/ShowcaseSubItemsBanner/ShowcaseSubItemsBanner';
import EyeglassesShapeGuide from '../../components/EyeglassesShapeGuide/EyeglassesShapeGuide';
import ProductCarouselSection from '../../components/ProductCarouselSection/ProductCarouselSection';
import EditorialTestimonials from '../../components/EditorialTestimonials/EditorialTestimonials';
import FinalCTA from '../../components/FinalCTA/FinalCTA';
import OurBrands from '../../components/OurBrands/OurBrands';
import SEO from '../../components/SEO/SEO';
import { fetchFeaturedProducts, fetchBestsellerProducts } from '../../services/productService';
import {
  getPublicHomepageSections,
  DEFAULT_HOMEPAGE_SECTIONS,
} from '../../services/homepageService';
import './Home.css';

const SECTION_COMPONENTS = {
  'hero': (key) => <HeroSlidingBanner key={key} />,
  'top-categories': (key) => <TopCategories key={key} />,
  'banner-categories': (key) => (
    <SlideBanner
      key={key}
      id="banner-after-categories"
      ariaLabel="Top Categories Featured Slide Banner"
      preset="categories"
    />
  ),
  'shape-guide': (key) => <EyeglassesShapeGuide key={key} />,
  'banner-anatomy': (key) => (
    <ShowcaseSubItemsBanner
      key={key}
      id="banner-after-anatomy"
      ariaLabel="Tortoiseshell Frames Collection Showcase"
      preset="tortoise"
    />
  ),
  'featured-products': (key) => (
    <ProductCarouselSection
      key={key}
      id="featured-products"
      title="Featured Products"
      fetchFn={fetchFeaturedProducts}
      viewAllLink="/shop?featured=true"
      limit={10}
    />
  ),
  'hot-selling-products': (key) => (
    <ProductCarouselSection
      key={key}
      id="hot-selling-products"
      title="Hot Selling Products"
      fetchFn={fetchBestsellerProducts}
      viewAllLink="/shop?sort=bestseller"
      limit={10}
      lightBg
    />
  ),
  'testimonials': (key) => <EditorialTestimonials key={key} />,
  'final-cta': (key) => <FinalCTA key={key} />,
  'banner-finale': (key) => (
    <ShowcaseSubItemsBanner
      key={key}
      id="banner-after-finale"
      ariaLabel="Titanium Architecture Showcase"
      preset="titanium"
    />
  ),
  'brands': (key) => <OurBrands key={key} />,
};

export default function Home() {
  const [sections, setSections] = useState(DEFAULT_HOMEPAGE_SECTIONS);

  useEffect(() => {
    let isMounted = true;
    getPublicHomepageSections()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setSections(data);
        }
      })
      .catch((err) => {
        console.warn('Using default homepage layout:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-editorial-page">
      <SEO
        title="Premium Eyewear"
        description="Shop luxury sunglasses, optical frames, and blue light glasses at Drishti Atelier. Curated collection with nationwide delivery in Bangladesh."
      />
      {sections
        .filter((sec) => sec.enabled !== false && SECTION_COMPONENTS[sec.id])
        .map((sec) => SECTION_COMPONENTS[sec.id](sec.id))}
    </div>
  );
}
