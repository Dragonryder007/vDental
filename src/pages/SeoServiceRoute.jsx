import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import SeoServicePage from '../components/SeoServicePage';
import { seoServiceContent } from '../data/seoServiceContent';

const slugToKey = {
  'invisalign-bangalore': 'invisalignBangalore',
  'veneers-bangalore': 'veneersBangalore',
  'smile-makeover-bangalore': 'smileMakeoverBangalore',
  'dental-implants-bangalore': 'dentalImplantsBangalore',
  'full-mouth-rehabilitation-bangalore': 'fullMouthRehabBangalore',
  'all-on-4-implants-bangalore': 'allOn4ImplantsBangalore',
  'dental-tourism-india': 'dentalTourismIndia',
  'general-dentistry-bangalore': 'generalDentistry',
  'laser-dentistry-bangalore': 'laserDentistry',
  'invisalign-for-kids-bangalore': 'invisalignKids',
  'family-dentistry-bangalore': 'familyDentistry',
  'pediatric-dentistry-bangalore': 'pediatricDentistry',
};

const SeoServiceRoute = ({ serviceKey: propKey }) => {
  const { slug } = useParams();
  const serviceKey = propKey || slugToKey[slug];

  if (!serviceKey || !seoServiceContent[serviceKey]) {
    return <Navigate to="/" replace />;
  }

  const content = seoServiceContent[serviceKey];
  const canonicalPath = `/${content.slug}`;

  return (
    <>
      <SEO
        title={content.seo.title}
        description={content.seo.description}
        keywords={content.seo.keywords}
        canonicalPath={canonicalPath}
        faqs={content.faqs}
        serviceName={content.title}
      />
      <SeoServicePage content={content} bookingService={content.bookingService} />
    </>
  );
};

export default SeoServiceRoute;

