
import React from 'react';

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-500 text-white">
                {icon}
            </div>
        </div>
        <div className="ms-4">
            <dt className="text-lg leading-6 font-bold text-gray-900">{title}</dt>
            <dd className="mt-2 text-base text-gray-500">{description}</dd>
        </div>
    </div>
);

const WhyChooseUs: React.FC = () => {
    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            چرا ما را انتخاب کنید؟
                        </h2>
                        <p className="mt-3 max-w-3xl text-lg text-gray-500">
                            ما متعهد به ارائه خدمات مالی دقیق، قابل اعتماد و متناسب با نیازهای منحصر به فرد کسب و کار شما هستیم.
                        </p>
                        <dl className="mt-10 space-y-10">
                            <Feature
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                title="تخصص و تجربه"
                                description="تیم ما متشکل از حسابداران و مشاوران مالی خبره با سال‌ها تجربه در صنایع مختلف است."
                            />
                            <Feature
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
                                title="راهکارهای سفارشی"
                                description="ما خدمات خود را متناسب با اندازه، صنعت و اهداف مشخص کسب و کار شما طراحی می‌کنیم."
                            />
                            <Feature
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                title="فناوری مدرن"
                                description="با بهره‌گیری از نرم‌افزارهای پیشرفته، دقت، سرعت و امنیت اطلاعات مالی شما را تضمین می‌کنیم."
                            />
                        </dl>
                    </div>
                    <div className="mt-10 lg:mt-0">
                        <img className="rounded-lg shadow-xl" src="https://picsum.photos/600/400?image=1011" alt="تیم متخصص" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
