import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SMILE_PLUS_ADDRESS_LINE,
  SMILE_PLUS_GEO,
  SMILE_PLUS_NAME,
} from '../constants/contact';

const BASE_URL = 'https://www.vdentalandimplantcenter.com';

const upsertMeta = (selector, createFn, content) => {
  let el = document.querySelector(selector);
  if (!el) {
    el = createFn();
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const SEO = ({
  title,
  description,
  keywords,
  canonicalPath,
  faqs,
  serviceName,
  article,
  ogType,
  fullTitle,
  branch,
}) => {
  const location = useLocation();

  useEffect(() => {
    const baseTitle = 'V Dental and Implant Center';
    document.title = fullTitle && title
      ? title
      : title
        ? `${title} — ${baseTitle}`
        : `${baseTitle} — World-Class Dentistry`;

    const metaDescription =
      description ||
      'V Dental and Implant Center offers world-class dentistry including Digital Smile Designing, Aligners, Braces, and Dental Implants.';

    upsertMeta('meta[name="description"]', () => {
      const el = document.createElement('meta');
      el.name = 'description';
      return el;
    }, metaDescription);

    upsertMeta('meta[name="keywords"]', () => {
      const el = document.createElement('meta');
      el.name = 'keywords';
      return el;
    }, keywords || 'dental clinic, smile designing, aligners, implants, dentist Bengaluru');

    const canonicalUrl = canonicalPath
      ? `${BASE_URL}${canonicalPath}`
      : `${BASE_URL}${location.pathname}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    const updateOG = (property, content) => {
      upsertMeta(`meta[property="${property}"]`, () => {
        const el = document.createElement('meta');
        el.setAttribute('property', property);
        return el;
      }, content);
    };

    updateOG('og:title', document.title);
    updateOG('og:description', metaDescription);
    updateOG('og:url', canonicalUrl);
    updateOG('og:type', ogType || 'website');
    if (article?.image) updateOG('og:image', article.image);

    // JSON-LD: LocalBusiness + FAQPage
    const existingScript = document.getElementById('seo-jsonld');
    if (existingScript) existingScript.remove();

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Dentist',
          '@id': `${BASE_URL}/#dentist`,
          name: 'V Dental and Implant Center',
          url: BASE_URL,
          telephone: '+91-90371-51894',
          email: 'care@vdentalandimplantcenter.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '531, 2nd Main Road, Indiranagar 2nd Stage',
            addressLocality: 'Bangalore',
            addressRegion: 'Karnataka',
            addressCountry: 'IN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 12.9716,
            longitude: 77.6412,
          },
          areaServed: 'Bangalore',
        },
      ],
    };

    if (branch) {
      jsonLd['@graph'].push({
        '@type': 'Dentist',
        '@id': `${branch.url}#branch`,
        name: branch.name || SMILE_PLUS_NAME,
        url: branch.url,
        telephone: '+91-90371-51894',
        email: 'care@vdentalandimplantcenter.com',
        description: branch.description,
        parentOrganization: {
          '@type': 'Dentist',
          '@id': `${BASE_URL}/#dentist`,
          name: 'V Dental and Implant Center',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: SMILE_PLUS_ADDRESS_LINE,
          addressLocality: 'Marathahalli, Bengaluru',
          addressRegion: 'Karnataka',
          postalCode: '560037',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: SMILE_PLUS_GEO.latitude,
          longitude: SMILE_PLUS_GEO.longitude,
        },
        areaServed: [
          'Marathahalli',
          'Whitefield',
          'Brookefield',
          'Varthur',
          'Bellandur',
          'Kundalahalli',
          'Munnekolal',
          'AECS Layout',
          'Mahadevapura',
          'Bangalore East',
        ],
      });
    }

    if (serviceName) {
      jsonLd['@graph'].push({
        '@type': 'MedicalProcedure',
        name: serviceName,
        description: metaDescription,
        url: canonicalUrl,
        provider: { '@id': `${BASE_URL}/#dentist` },
      });
    }

    if (faqs?.length) {
      jsonLd['@graph'].push({
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      });
    }

    if (article?.title) {
      jsonLd['@graph'].push({
        '@type': 'Article',
        headline: article.title,
        author: {
          '@type': 'Organization',
          name: article.author || 'V Dental and Implant Center',
        },
        publisher: {
          '@type': 'Organization',
          name: 'V Dental and Implant Center',
          url: BASE_URL,
        },
        datePublished: article.publishedAt,
        dateModified: article.modifiedAt || article.publishedAt,
        mainEntityOfPage: canonicalUrl,
        ...(article.image ? { image: article.image } : {}),
      });
    }

    const script = document.createElement('script');
    script.id = 'seo-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById('seo-jsonld');
      if (s) s.remove();
    };
  }, [
    title,
    description,
    keywords,
    canonicalPath,
    faqs,
    serviceName,
    article,
    ogType,
    fullTitle,
    branch,
    location.pathname,
  ]);

  return null;
};

export default SEO;

