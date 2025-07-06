import logo from './logo.png';
import Profile_pic from './Profile_pic.png';
import icon from './icon.png';
import group_profiles from './group_profiles.png';
import header_pro from './header_pro.png';
import arrow_button from './arrow_button.png';
import appointment_img from './banner_img.jpg';
import General_physician from './doc1.png';
import Gynecologist from './doc2.png';
import Dermatologist from './doc3.png';
import Pediatricians from './doc4.png';
import Neurologist from './doc5.png';
import Gastroenterologist from './doc6.png';
import doctor1 from './doctor1.jpg';
import doctor2 from './doctor2.jpg';
import doctor3 from './doctor3.jpg';
import doctor4 from './doctor4.jpg';
import doctor5 from './doctor5.jpg';
import doctor6 from './doctor6.jpg';
import doctor7 from './doctor7.jpg';
import doctor8 from './doctor8.jpg';
import doctor9 from './doctor9.jpg';
import doctor10 from './doctor10.jpg';
import image from './image.jpg';
import verified_icon from './verified_icon.png';
import about_image from './about_image.jpg';
import menu_icon from './menu_icon.png';
import cross_icon from './cross_icon.png';


export const assets = {
  logo, Profile_pic, icon, group_profiles, header_pro, arrow_button,appointment_img,image,verified_icon,about_image,menu_icon,cross_icon
};

export const specialityData = [
  {
    speciality: 'General physician',
    image: General_physician
  },
  {
    speciality: 'Gynecologist',
    image: Gynecologist
  },
  {
    speciality: 'Dermatologist',
    image: Dermatologist
  },
  {
    speciality: 'Pediatricians',
    image: Pediatricians
  },
  {
    speciality: 'Neurologist',
    image: Neurologist
  },
  {
    speciality: 'Gastroenterologist',
    image: Gastroenterologist
  },
]

export const doctors = [
  {
    _id: 'doctor1',
    name: 'Dr. Richard James',
    image: doctor1,
    speciality: 'General Physician',
    degree: 'MBBS',
    experience: '4 Years',
    about: 'Dr. James is dedicated to providing comprehensive and compassionate general healthcare.',
    fees: 50,
    address: {
      line1: '17th Cross, Richmond',
      line2: 'Circle, Ring Road, London'
    }
  },
  {
    _id: 'doctor2',
    name: 'Dr. Anita Shrestha',
    image: doctor2,
    speciality: 'Gynecologist',
    degree: 'MD',
    experience: '6 Years',
    about: 'Dr. Shrestha specializes in women’s reproductive health with a patient-first approach.',
    fees: 60,
    address: {
      line1: 'Bagbazar',
      line2: 'Kathmandu, Nepal'
    }
  },
  {
    _id: 'doctor3',
    name: 'Dr. Sudha Agrawal',
    image: doctor3,
    speciality: 'Dermatologist',
    degree: 'MD Dermatology',
    experience: '5 Years',
    about: 'Dr. Agrawal offers advanced skin care and treatment with a personalized touch.',
    fees: 70,
    address: {
      line1: 'Vanu Chowk',
      line2: 'Dharan, Sunsari'
    }
  },
  {
    _id: 'doctor4',
    name: 'Dr. Deepak Rai',
    image: doctor4,
    speciality: 'Pediatrician',
    degree: 'MBBS, DCH',
    experience: '7 Years',
    about: 'Dr. Rai provides warm, specialized care for infants, children, and adolescents.',
    fees: 55,
    address: {
      line1: 'Sami Chowk',
      line2: 'Dharan, Sunsari'
    }
  },
  {
    _id: 'doctor5',
    name: 'Dr. Prajwal Limbu',
    image: doctor5,
    speciality: 'Neurologist',
    degree: 'DM Neurology',
    experience: '8 Years',
    about: 'Dr. Limbu is an expert in neurological disorders and offers cutting-edge treatment.',
    fees: 90,
    address: {
      line1: 'Ratna Chowk',
      line2: 'Ilam, Nepal'
    }
  },
  {
    _id: 'doctor6',
    name: 'Dr. Roshni Ghimire',
    image: doctor6,
    speciality: 'Gastroenterologist',
    degree: 'MD, DM',
    experience: '6 Years',
    about: 'Dr. Ghimire helps patients with digestive and liver-related issues with care and precision.',
    fees: 85,
    address: {
      line1: 'Sunaulo Marg',
      line2: 'Dharan, Sunsari'
    }
  },
  {
    _id: 'doctor7',
    name: 'Dr. Sudha Agrawal',
    image: doctor7,
    speciality: 'Dermatologist',
    degree: 'MD Dermatology',
    experience: '5 Years',
    about: 'Dr. Agrawal offers advanced skin care and treatment with a personalized touch.',
    fees: 70,
    address: {
      line1: 'Vanu Chowk',
      line2: 'Dharan, Sunsari'
    }
  },
  {
    _id: 'doctor8',
    name: 'Dr. Anita Shrestha',
    image: doctor8,
    speciality: 'Gynecologist',
    degree: 'MD',
    experience: '6 Years',
    about: 'Dr. Shrestha specializes in women’s reproductive health with a patient-first approach.',
    fees: 60,
    address: {
      line1: 'Bagbazar',
      line2: 'Kathmandu, Nepal'
    }
  },
  {
    _id: 'doctor9',
    name: 'Dr. Deepak Rai',
    image: doctor9,
    speciality: 'Pediatrician',
    degree: 'MBBS, DCH',
    experience: '7 Years',
    about: 'Dr. Rai provides warm, specialized care for infants, children, and adolescents.',
    fees: 55,
    address: {
      line1: 'Sami Chowk',
      line2: 'Dharan, Sunsari'
    }
  },
  {
    _id: 'doctor10',
    name: 'Dr. Prajwal Limbu',
    image: doctor10,
    speciality: 'Neurologist',
    degree: 'DM Neurology',
    experience: '8 Years',
    about: 'Dr. Limbu is an expert in neurological disorders and offers cutting-edge treatment.',
    fees: 90,
    address: {
      line1: 'Ratna Chowk',
      line2: 'Ilam, Nepal'
    }
  }
];
