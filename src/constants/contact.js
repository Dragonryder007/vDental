/** Shared clinic contact for footer, home CTA, and map links (keep in sync). */
export const CLINIC_EMAIL = 'care@vdentalandimplantcenter.com';

export const WHATSAPP_NUMBER = '919037151894';
export const PHONE_TEL = '+919037151894';
export const PHONE_DISPLAY = '+91 90371 51894';

const MAP_DESTINATION =
  '531, 2nd Main Road, Indiranagar 2nd Stage, Bangalore, India';

export const GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_DESTINATION)}`;

/** Smile Plus Dental Care – Marathahalli (branch of V Dental) */
export const SMILE_PLUS_NAME = 'Smile Plus Dental Care – Marathahalli';
export const SMILE_PLUS_SLUG = '/smile-plus-dental-care-marathahalli';
export const SMILE_PLUS_ADDRESS_LINE =
  'Varthur Main Road, opposite A2B Hotel, near Marathahalli Bridge, Aswath Nagar, Marathahalli, Bengaluru, Karnataka 560037';
export const SMILE_PLUS_MAPS_URL = 'https://maps.app.goo.gl/oHNY1bW24TtMCYCv9';
export const SMILE_PLUS_MAPS_EMBED =
  'https://www.google.com/maps?q=12.9570197,77.7020807&hl=en&z=16&output=embed';
export const SMILE_PLUS_GEO = { latitude: 12.9570197, longitude: 77.7020807 };

export const SMILE_PLUS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SMILE_PLUS_ADDRESS_LINE)}`;

export const smilePlusWhatsAppUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

