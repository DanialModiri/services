import { Person, Service, StandardAction, User, Contract, Personnel, ServiceArea } from '../types';

export const mockUsers: (User & { password?: string })[] = [
    {
        id: 1,
        username: 'abbas',
        password: '123456',
        name: 'عباس حسنوند',
        role: 'مدیر سیستم',
        avatarUrl: 'https://www.themoviedb.org/t/p/w500/d3A03s02xt5w8E8z4V44aWto2u.jpg'
    },
    {
        id: 2,
        username: 'user',
        password: 'password',
        name: 'کاربر تست',
        role: 'کارشناس',
        avatarUrl: 'https://i.pravatar.cc/150?u=user2'
    }
];

export const sampleActions: StandardAction[] = [
    { id: 'act1', title: 'ارسال لیست بیمه ماهانه', actor: 'ORGANIZATION', frequency: 'CALENDAR_MONTH', issuanceDay: 25, prerequisiteActionId: null },
    { id: 'act2', title: 'ارسال لیست مالیات حقوق', actor: 'ORGANIZATION', frequency: 'CALENDAR_MONTH', issuanceDay: 25, prerequisiteActionId: 'act1' },
    { id: 'act3', title: 'پرداخت بیمه', actor: 'CUSTOMER', frequency: 'CALENDAR_MONTH', issuanceDay: 30, prerequisiteActionId: 'act1' }
];

export const mockPeople: Person[] = [
  { 
    id: 1, 
    personType: 'LEGAL',
    name: 'شرکت فناوری نوین', 
    nationalId: '10101234567', 
    organizationRole: 'CUSTOMER',
    email: 'info@novin.tech',
    mobile: '09123456789',
    landline: '02122334455',
    address: 'تهران، پارک علم و فناوری پردیس',
    postalCode: '1234567890',
    registrationDate: '2010-05-20',
    legalEntityType: 'PUBLIC_JOINT_STOCK',
    financialYearStart: '2024-03-20',
    documents: [
      { id: 'doc1', type: 'registrationDocs', description: 'اساسنامه شرکت فناوری نوین با آخرین تغییرات ثبت شده در روزنامه رسمی کشور.', fileName: 'statute.pdf', fileFormat: 'pdf' },
      { id: 'doc2', type: 'other', description: 'لوگوی رسمی شرکت با فرمت PNG', fileName: 'logo.png', fileFormat: 'image' },
    ]
  },
  { 
    id: 2, 
    personType: 'REAL', 
    firstName: 'علی',
    lastName: 'رضایی',
    nationalId: '0012345678', 
    organizationRole: 'CONSULTANT',
    email: 'ali.rezaei@email.com',
    mobile: '09129876543',
    landline: '02188776655',
    birthDate: '1985-01-10',
    gender: 'MALE',
    address: 'اصفهان، خیابان چهارباغ بالا',
    documents: [
      { id: 'doc3', type: 'personalPhoto', description: 'عکس 3x4 جدید برای پرونده', fileName: 'ali_rezaei.jpg', fileFormat: 'image' }
    ]
  },
    { 
    id: 3, 
    personType: 'REAL', 
    firstName: 'سارا',
    lastName: 'محمدی',
    nationalId: '1270099887', 
    organizationRole: 'CUSTOMER',
    email: 'sara.mohammadi@email.com',
    mobile: '09151112233',
    landline: '05138887766',
    birthDate: '1992-11-25',
    gender: 'FEMALE',
    address: 'مشهد، بلوار سجاد',
    documents: []
  },
   { 
    id: 4, 
    personType: 'LEGAL',
    name: 'بانک آینده', 
    nationalId: '10320857978', 
    organizationRole: 'BANK',
    email: 'info@ba24.ir',
    mobile: '09104445566',
    landline: '02177665544',
    address: 'تهران، سعادت آباد',
    postalCode: '1112223334',
    registrationDate: '2012-08-15',
    legalEntityType: 'PUBLIC_JOINT_STOCK',
    financialYearStart: '2024-01-01',
    documents: []
  },
  {
    id: 5,
    personType: 'REAL',
    firstName: 'مریم',
    lastName: 'حسینی',
    nationalId: '0087654321',
    organizationRole: 'CUSTOMER',
    email: 'maryam.h@email.com',
    mobile: '09355554433',
    birthDate: '1990-07-18',
    gender: 'FEMALE',
    documents: []
  },
  {
    id: 6,
    personType: 'LEGAL',
    name: 'فروشگاه‌های زنجیره‌ای رفاه',
    nationalId: '10101231234',
    organizationRole: 'CUSTOMER',
    email: 'info@refah.ir',
    landline: '02196666',
    registrationDate: '1995-01-01',
    legalEntityType: 'PUBLIC_JOINT_STOCK',
    documents: []
  },
  {
    id: 7,
    personType: 'REAL',
    firstName: 'محمد',
    lastName: 'احمدی',
    nationalId: '0451122334',
    organizationRole: 'CONSULTANT',
    mobile: '09112345678',
    email: 'm.ahmadi@consultant.com',
    documents: []
  },
  {
    id: 8,
    personType: 'LEGAL',
    name: 'سازمان تامین اجتماعی',
    nationalId: '14000000000',
    organizationRole: 'SOCIAL_SECURITY_OFFICE',
    landline: '02164501',
    documents: []
  },
  {
    id: 9,
    personType: 'REAL',
    firstName: 'زهرا',
    lastName: 'کریمی',
    nationalId: '2298877665',
    organizationRole: 'CUSTOMER',
    mobile: '09187654321',
    birthDate: '1988-02-02',
    gender: 'FEMALE',
    documents: []
  },
  {
    id: 10,
    personType: 'LEGAL',
    name: 'صندوق سرمایه‌گذاری امید',
    nationalId: '10320112233',
    organizationRole: 'INVESTMENT_FUND',
    email: 'info@omidfund.com',
    registrationDate: '2018-10-10',
    documents: []
  }
];

export const mockServices: Service[] = [
  { id: 1, code: 'ACC-001', title: 'خدمات کامل حسابداری ماهانه', area: 'ACCOUNTING', defaultPrice: 50000000, defaultDuration: 1, status: 'ACTIVE', standardActions: sampleActions },
  { id: 2, code: 'TAX-001', title: 'تنظیم اظهارنامه مالیاتی ارزش افزوده', area: 'TAX', defaultPrice: 10000000, defaultDuration: 3, status: 'ACTIVE', standardActions: [] },
  { id: 3, code: 'REG-001', title: 'ثبت شرکت سهامی خاص', area: 'REGISTRATION', defaultPrice: 25000000, defaultDuration: 0, status: 'ACTIVE', standardActions: [] },
  { id: 4, code: 'TRN-001', title: 'دوره آموزش نرم‌افزار سپیدار', area: 'TRAINING', defaultPrice: 15000000, defaultDuration: 2, status: 'INACTIVE', standardActions: [] },
  { id: 5, code: 'ACC-002', title: 'مشاوره و بهینه‌سازی فرآیندهای مالی', area: 'ACCOUNTING', defaultPrice: 30000000, defaultDuration: 6, status: 'ACTIVE', standardActions: [] },
  { id: 6, code: 'TAX-002', title: 'دفاعیه مالیاتی و پیگیری پرونده‌ها', area: 'TAX', defaultPrice: 40000000, defaultDuration: 0, status: 'ACTIVE', standardActions: [] },
  { id: 7, code: 'ACC-003', title: 'تهیه صورت های مالی سالانه', area: 'ACCOUNTING', defaultPrice: 75000000, defaultDuration: 12, status: 'ACTIVE', standardActions: [] },
  { id: 8, code: 'REG-002', title: 'ثبت تغییرات شرکت', area: 'REGISTRATION', defaultPrice: 8000000, defaultDuration: 0, status: 'ACTIVE', standardActions: [] },
];

export const mockPersonnel: Personnel[] = [
    {
        id: 1,
        userId: 1, // Abbas Hasanvand
        name: 'عباس حسنوند',
        nationalId: '1234567890',
        position: 'مدیر ارشد فنی',
        specialization: ['ACCOUNTING', 'TAX'],
        mobile: '09121112233',
        email: 'abbas.h@example.com'
    },
    {
        id: 2,
        userId: 2, // User Test
        name: 'کاربر تست',
        nationalId: '0987654321',
        position: 'کارشناس ثبت',
        specialization: ['REGISTRATION'],
        mobile: '09124445566',
        email: 'user.test@example.com'
    },
    {
        id: 3,
        userId: 3, // new user
        name: 'رضا احمدی',
        nationalId: '1122334455',
        position: 'مشاور مالیاتی',
        specialization: ['TAX'],
        mobile: '09127778899',
        email: 'reza.a@example.com'
    }
];

export const mockContracts: Contract[] = [
    {
        id: 1,
        contractCode: 'CTR-2024-001',
        title: 'قرارداد خدمات حسابداری سالانه',
        customerId: 1, // شرکت فناوری نوین
        serviceArea: 'ACCOUNTING',
        startDate: '2024-03-20',
        endDate: '2025-03-19',
        totalAmount: 120000000,
        status: 'IN_PROGRESS',
        contractServices: [
            { id: 'cs1-1', serviceId: 1, initialDurationDays: 365, price: 50000000, selectedStandardActionIds: ['act1', 'act2'] },
            { id: 'cs1-2', serviceId: 7, initialDurationDays: 365, price: 70000000, selectedStandardActionIds: [] }
        ],
        contractAccessSettings: [],
    },
    {
        id: 2,
        contractCode: 'CTR-2024-002',
        title: 'قرارداد مشاوره مالیاتی فصلی',
        customerId: 3, // سارا محمدی
        serviceArea: 'TAX',
        startDate: '2024-06-21',
        endDate: '2024-09-21',
        totalAmount: 45000000,
        status: 'CONFIRMED',
        contractServices: [
            { id: 'cs2-1', serviceId: 2, initialDurationDays: 92, price: 45000000, selectedStandardActionIds: [] }
        ],
        contractAccessSettings: [],
    },
    {
        id: 3,
        contractCode: 'CTR-2023-015',
        title: 'پروژه ثبت برند و لوگو',
        customerId: 6, // فروشگاه‌های زنجیره‌ای رفاه
        serviceArea: 'REGISTRATION',
        startDate: '2023-12-01',
        endDate: '2024-03-01',
        totalAmount: 30000000,
        status: 'CLOSED',
        contractServices: [
            { id: 'cs3-1', serviceId: 3, initialDurationDays: 90, price: 25000000, selectedStandardActionIds: [] },
            { id: 'cs3-2', serviceId: 8, initialDurationDays: 30, price: 5000000, selectedStandardActionIds: [] }
        ],
        contractAccessSettings: [],
    },
    {
        id: 4,
        contractCode: 'CTR-2024-003',
        title: 'قرارداد آموزش نرم‌افزار حسابداری',
        customerId: 5, // مریم حسینی
        serviceArea: 'TRAINING',
        startDate: '2024-08-01',
        endDate: '2024-08-15',
        totalAmount: 8000000,
        status: 'REGISTERED',
        contractServices: [
            { id: 'cs4-1', serviceId: 4, initialDurationDays: 14, price: 8000000, selectedStandardActionIds: [] }
        ],
        contractAccessSettings: [],
    },
     {
        id: 5,
        contractCode: 'CTR-2024-004',
        title: 'قرارداد حسابرسی داخلی',
        customerId: 1, // شرکت فناوری نوین
        serviceArea: 'ACCOUNTING',
        startDate: '2024-05-10',
        endDate: '2024-06-10',
        totalAmount: 60000000,
        status: 'FINISHED',
        contractServices: [
             { id: 'cs5-1', serviceId: 5, initialDurationDays: 31, price: 60000000, selectedStandardActionIds: [] }
        ],
        contractAccessSettings: [],
    },
    {
        id: 6,
        contractCode: 'CTR-2024-005',
        title: 'قرارداد پیگیری پرونده مالیاتی',
        customerId: 9, // زهرا کریمی
        serviceArea: 'TAX',
        startDate: '2024-07-20',
        endDate: '2025-01-20',
        totalAmount: 25000000,
        status: 'IN_PROGRESS',
        contractServices: [
            { id: 'cs6-1', serviceId: 6, initialDurationDays: 184, price: 25000000, selectedStandardActionIds: [] }
        ],
        contractAccessSettings: [],
    },
];