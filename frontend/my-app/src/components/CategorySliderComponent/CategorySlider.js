import React from 'react';
import './CategorySlider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';  
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom'; 

const categories = [  
  {
    name: 'Full Sleeves Shirts',
    image: '/assets/images/Artboard_1.webp',
    path: '/category/Full Sleeves T-Shirts' 
  },
  {
    name: 'T-Shirts',
    image: '/assets/images/Artboard_2.webp',
    path: '/category/T-Shirts'
  },
  {
    name: 'Pants',
    image: '/assets/images/Artboard_5.webp',
    path: '/category/Pants'
  },
  {
    name: 'Vests',
    image: '/assets/images/Artboard_6.webp',
    path: '/category/Vests'
  }
];


function CategorySlider() {
  const navigate = useNavigate();

  return (
    
    <div className="category-slider">
      
      <Swiper spaceBetween={0} slidesPerView={'auto'}>
        {categories.map((cat, index) => (
          
          <SwiperSlide key={index} className="category-slide">
            <div className="category-card" onClick={() => navigate(cat.path)}>
              <img src={cat.image} alt={cat.name} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default CategorySlider;