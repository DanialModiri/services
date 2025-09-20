
import React from 'react';
import ServiceCard from './ServiceCard';
import { AccountingIcon, TaxIcon, AuditIcon, ConsultingIcon } from './icons/ServiceIcons';

const services = [
  {
    icon: <AccountingIcon />,
    title: 'حسابداری و دفترداری',
    description: 'مدیریت دقیق امور مالی روزانه، تهیه گزارشات و صورت‌های مالی استاندارد برای شفافیت کامل.',
  },
  {
    icon: <TaxIcon />,
    title: 'مشاوره مالیاتی',
    description: 'بهینه‌سازی مالیات، تنظیم و ارسال اظهارنامه‌های مالیاتی و ارائه راهکارهای قانونی برای کاهش بار مالیاتی.',
  },
  {
    icon: <AuditIcon />,
    title: 'حسابرسی داخلی و خارجی',
    description: 'بررسی و ارزیابی سلامت مالی، کنترل‌های داخلی و انطباق با استانداردها و مقررات جهت افزایش اعتبار.',
  },
  {
    icon: <ConsultingIcon />,
    title: 'خدمات مالی و مشاوره‌ای',
    description: 'برنامه‌ریزی مالی، بودجه‌بندی و تحلیل‌های استراتژیک برای کمک به تصمیم‌گیری‌های کلان مدیریتی.',
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">خدمات ما</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            ما طیف گسترده‌ای از خدمات تخصصی را برای پاسخگویی به تمام نیازهای مالی کسب و کار شما فراهم کرده‌ایم.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
