
import React from 'react';

const ContactForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('پیام شما با موفقیت ارسال شد!');
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">با ما در تماس باشید</h2>
            <p className="mt-4 text-gray-600">
              برای دریافت مشاوره رایگان یا کسب اطلاعات بیشتر، فرم زیر را تکمیل کنید. کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.
            </p>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">نام و نام خانوادگی</label>
                  <input type="text" name="full-name" id="full-name" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">ایمیل</label>
                  <input type="email" name="email" id="email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">شماره تماس (اختیاری)</label>
                <input type="tel" name="phone" id="phone" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">پیام شما</label>
                <textarea id="message" name="message" rows={4} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" required></textarea>
              </div>
              <div>
                <button type="submit" className="w-full md:w-auto inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                  ارسال پیام
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
