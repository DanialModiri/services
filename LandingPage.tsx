import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import WhyChooseUs from './components/WhyChooseUs';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

const LandingPage: React.FC = () => {
    return (
        <div className="bg-gray-50">
            <Header />
            <main>
                <Hero />
                <ServicesSection />
                <WhyChooseUs />
                <ContactForm />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
