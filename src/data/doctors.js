import doctorVathsala from '../images/doctor-vathsala.webp';
import doctorNoel from '../images/doctor-noel.webp';
import doctorJishnu from '../images/doctor-jishnu.webp';
import doctorAkhil from '../images/doctor-akhil.webp';
import doctorSarah from '../images/doctor-sarah.webp';
import doctorSonika from '../images/doctor-sonika.webp';

/** Shared V Dental specialist panel — used on home & Smile Plus pages */
export const V_DENTAL_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Vathsala Naik',
    title: 'Senior Implant Consultant',
    specialization: 'Oral Medicine & Radiology Specialist | Internationally Trained',
    experience: '43+ Years',
    credentials: ['BDS, MDS – Oral Medicine & Radiology', '43+ Years Experience'],
    specialties: [
      'Implant Case Planning',
      'Oral Diagnosis & Radiology',
      'TMJ Disorders',
      'Precancerous Lesion Screening',
    ],
    description:
      'With over 43 years of clinical excellence, Dr. Vathsala Naik is a pioneering figure in implant dentistry and oral medicine. Her specialized expertise in implant case planning and oral radiology has enabled hundreds of patients to regain their confident smiles.',
    image: doctorVathsala,
    photoPosition: '50% 0%',
  },
  {
    id: 2,
    name: 'Dr. Noel Francis',
    title: 'Senior Clinical Dentist',
    specialization: 'Restorative & Endodontics',
    experience: '10+ Years',
    credentials: ['BDS', '10+ Years Experience'],
    specialties: [
      'Root Canal Treatment (RCT)',
      'Restorative Dentistry',
      'Preventive Dentistry',
      'Emergency Dental Care',
    ],
    description:
      'Dr. Noel Francis brings a decade of dedicated clinical experience in restorative and endodontic dentistry. His gentle approach and advanced techniques have made him a trusted specialist for root canal and restorative care.',
    image: doctorNoel,
    photoSize: 'auto 145%',
    photoPosition: '50% 48%',
  },
  {
    id: 3,
    name: 'Dr. Jishnu Premnath',
    title: 'Senior Smile Correction & Implant Specialist',
    specialization: 'International Patient Director | Internationally Trained',
    experience: '8+ Years',
    credentials: [
      'Senior Smile Correction & Implant Specialist',
      '8+ Years Clinical Experience',
      'Internationally Trained · Bengaluru, India',
    ],
    specialties: [
      'Smile Makeovers & Smile Correction',
      'Clear Aligners & Veneers',
      'Dental Implants',
      'International Patient Care',
      'Digital Dentistry',
    ],
    description:
      'Dr. Jishnu Premnath leads Smile Plus Dental Care in Marathahalli and serves as International Patient Director at V Dental & Implant Center. He specializes in smile makeovers, aligners, veneers, and dental implants with advanced digital dentistry protocols.',
    image: doctorJishnu,
    photoPosition: '50% 45%',
    marathahalliLead: true,
  },
  {
    id: 4,
    name: 'Dr. Sarah Shaik',
    title: 'Orthodontist',
    specialization: 'MDS – Orthodontics | Aligner & Braces Specialist',
    experience: '5+ Years',
    credentials: [
      'BDS – Bapuji Dental College',
      'MDS – Orthodontics, VS Dental College, Bangalore',
      '300+ Completed Braces Cases',
      '350+ Aligner Treatments',
    ],
    specialties: [
      'Invisalign & Clear Aligners',
      'Braces (Ceramic, Metal & Self-Ligating)',
      'Growth Modulation',
      'Smile Arc Correction',
    ],
    description:
      'Dynamic orthodontist with 5 years of hands-on experience, Dr. Sarah Shaik has transformed smiles through 300+ completed braces cases and 350+ aligner treatments. A graduate of Bapuji Dental College (BDS) and VS Dental College Bangalore (MDS – Orthodontics), she is an expert in precise diagnosis, strategic treatment planning, and innovative management of dentofacial anomalies using state-of-the-art techniques for superior, timely results.',
    image: doctorSarah,
    photoPosition: '50% 15%',
  },
  {
    id: 6,
    name: 'Dr. Sonika',
    title: 'Orthodontist',
    specialization: 'Invisalign & Clear Aligners Specialist',
    experience: '12+ Years',
    credentials: ['MDS – Orthodontics', '12+ Years Experience'],
    specialties: [
      'Invisalign / Clear Aligners',
      'Braces (Ceramic & Self-Ligating)',
      'Smile Alignment & Bite Correction',
    ],
    description:
      'Dr. Sonika is a certified orthodontics specialist with extensive training in modern aligner systems and advanced braces technology, helping patients achieve perfectly aligned smiles.',
    image: doctorSonika,
    photoPosition: '50% 10%',
  },
  {
    id: 7,
    name: 'Dr. N. Reddy Akhil',
    title: 'Prosthodontist',
    specialization: 'Maxillofacial Prosthetics | Certified Implantologist',
    experience: '15+ Years',
    credentials: ['MDS – Prosthodontics & Maxillofacial Prosthetics', '15+ Years Experience'],
    specialties: [
      'Full Mouth Rehabilitation',
      'Dental Implants & Prosthesis',
      'Veneers, Crowns & Bridges',
      'Smile Reconstruction',
    ],
    description:
      'Dr. N. Reddy Akhil specializes in complex full-mouth rehabilitations, combining prosthetic excellence with implant dentistry for comprehensive smile reconstruction.',
    image: doctorAkhil,
    photoPosition: '50% 8%',
  },
];

export const MARATHAHALLI_LEAD_DOCTOR_ID = 3;

export const isPlaceholderDoctorImage = (src) =>
  typeof src === 'string' && src.includes('placeholder');

