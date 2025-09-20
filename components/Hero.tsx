
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative bg-gray-800 text-white py-24 md:py-32">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30" 
        style={{ backgroundImage: `url('https://picsum.photos/1600/900?image=1074')` }}>
      </div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          راهکارهای هوشمند مالی برای رشد کسب و کار شما
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          با تکیه بر تخصص و تجربه، ما بهترین خدمات حسابداری و مالیاتی را برای اطمینان از سلامت مالی شما ارائه می‌دهیم.
        </p>
        <a 
          href="#contact" 
          className="bg-teal-500 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-teal-600 transition-transform transform hover:scale-105 duration-300"
        >
          درخواست مشاوره رایگان
        </a>
      </div>
    </section>
  );
};

export default Hero;
