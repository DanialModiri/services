import { Person, Service, User, Contract } from '../types';
import { mockPeople, mockServices, mockUsers, mockContracts } from './mockData';
import { messages } from '../locales/fa';

// We create in-memory copies to simulate a mutable data source
let people: Person[] = JSON.parse(JSON.stringify(mockPeople));
let services: Service[] = JSON.parse(JSON.stringify(mockServices));
let mutableUsers: (User & { password?: string })[] = JSON.parse(JSON.stringify(mockUsers));
let contracts: Contract[] = JSON.parse(JSON.stringify(mockContracts));

let nextPersonId = people.length > 0 ? Math.max(...people.map(p => p.id)) + 1 : 1;
let nextServiceId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
let nextContractId = contracts.length > 0 ? Math.max(...contracts.map(c => c.id)) + 1 : 1;


const SIMULATED_DELAY = 700; // ms

const simulateRequest = <T>(data: T): Promise<T> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Uncomment the following lines to simulate a random network error
            // if (Math.random() > 0.8) {
            //     reject(new Error('A simulated network error occurred.'));
            //     return;
            // }
            resolve(JSON.parse(JSON.stringify(data))); // Return deep copies
        }, SIMULATED_DELAY);
    });
};


// --- Auth API ---

export const login = async (username: string, password_sent: string): Promise<{ token: string, user: User }> => {
    const userWithPassword = mutableUsers.find(u => u.username === username);
    
    if (!userWithPassword || userWithPassword.password !== password_sent) {
        throw new Error('Invalid credentials');
    }
    
    // In a real app, don't send the password back
    const { password, ...user } = userWithPassword;
    
    // Simulate a JWT
    const token = btoa(JSON.stringify({ userId: user.id, username: user.username, iat: Date.now() }));
    
    return simulateRequest({ token, user });
};

export const getCurrentUser = async (token: string): Promise<User> => {
    if (!token) throw new Error('No token provided');
    
    try {
        const payload = JSON.parse(atob(token));
        const user = mutableUsers.find(u => u.id === payload.userId);
        if (!user) throw new Error('User not found');
        
        const { password, ...userWithoutPassword } = user;
        return simulateRequest(userWithoutPassword);
    } catch (e) {
        throw new Error('Invalid token');
    }
};

export const changePassword = async (userId: number, currentPassword_sent: string, newPassword_sent: string): Promise<{ success: boolean }> => {
    const userIndex = mutableUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    const user = mutableUsers[userIndex];
    if (user.password !== currentPassword_sent) {
        throw new Error('Incorrect current password');
    }

    mutableUsers[userIndex] = { ...user, password: newPassword_sent };
    
    return simulateRequest({ success: true });
};


// --- People API ---

export const getPeople = async (searchTerm?: string): Promise<Person[]> => {
    let result = people;
    const term = searchTerm?.toLowerCase().trim();

    if (term) {
        result = people.filter(person => {
            const orgRoleKey = `enum.orgRole.${person.organizationRole}`;
            const orgRoleText = messages[orgRoleKey as keyof typeof messages] || person.organizationRole;

            const valuesToSearch = [
                person.nationalId, orgRoleText, person.email, person.mobile,
                person.landline, person.address,
            ];
            if (person.personType === 'REAL') {
                valuesToSearch.push(person.firstName, person.lastName, `${person.firstName} ${person.lastName}`);
            } else {
                valuesToSearch.push(person.name);
            }
            return valuesToSearch.some(value => value?.toLowerCase().includes(term));
        });
    }
    return simulateRequest(result);
};

export const getPersonById = async (id: number): Promise<Person> => {
    const person = people.find(p => p.id === id);
    if (!person) throw new Error('Person not found');
    return simulateRequest(person);
};

export const addPerson = async (personData: Omit<Person, 'id'>): Promise<Person> => {
    const newPerson: Person = {
        ...personData,
        id: nextPersonId++,
    } as Person;
    people = [...people, newPerson];
    return simulateRequest(newPerson);
};

export const updatePerson = async (personData: Person): Promise<Person> => {
    const index = people.findIndex(p => p.id === personData.id);
    if (index === -1) throw new Error('Person not found');
    people[index] = personData;
    return simulateRequest(personData);
};

export const deletePerson = async (id: number): Promise<{ id: number }> => {
    people = people.filter(p => p.id !== id);
    return simulateRequest({ id });
};

export const getCustomers = async (): Promise<Person[]> => {
    const customerList = people.filter(p => p.organizationRole === 'CUSTOMER');
    return simulateRequest(customerList);
};


// --- Services API ---

export const getServices = async (searchTerm?: string): Promise<Service[]> => {
    let result = services;
    const term = searchTerm?.toLowerCase().trim();

    if (term) {
        result = services.filter(service => {
            const areaKey = `enum.serviceArea.${service.area}`;
            const areaText = messages[areaKey as keyof typeof messages] || service.area;

            const statusKey = `enum.serviceStatus.${service.status}`;
            const statusText = messages[statusKey as keyof typeof messages] || service.status;

            return [
                service.code.toLowerCase(),
                service.title.toLowerCase(),
                areaText.toLowerCase(),
                statusText.toLowerCase()
            ].some(value => value.includes(term));
        });
    }
    return simulateRequest(result);
};

export const getServiceById = async (id: number): Promise<Service> => {
    const service = services.find(s => s.id === id);
    if (!service) throw new Error('Service not found');
    return simulateRequest(service);
};

export const addService = async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
    const newService: Service = {
        ...serviceData,
        id: nextServiceId++,
    } as Service;
    services = [...services, newService];
    return simulateRequest(newService);
};

export const updateService = async (serviceData: Service): Promise<Service> => {
    const index = services.findIndex(s => s.id === serviceData.id);
    if (index === -1) throw new Error('Service not found');
    services[index] = serviceData;
    return simulateRequest(serviceData);
};

export const deleteService = async (id: number): Promise<{ id: number }> => {
    services = services.filter(s => s.id !== id);
    return simulateRequest({ id });
};

// --- Contracts API ---

export const getContracts = async (searchTerm?: string): Promise<Contract[]> => {
    let result = contracts;
    const term = searchTerm?.toLowerCase().trim();
    if (term) {
        result = contracts.filter(contract => {
            const customer = people.find(p => p.id === contract.customerId);
            const customerName = customer ? (customer.personType === 'REAL' ? `${customer.firstName} ${customer.lastName}` : customer.name) : '';
            
            const areaKey = `enum.serviceArea.${contract.serviceArea}`;
            const areaText = messages[areaKey as keyof typeof messages] || contract.serviceArea;

            const statusKey = `enum.contractStatus.${contract.status}`;
            const statusText = messages[statusKey as keyof typeof messages] || contract.status;

            return [
                contract.contractCode,
                contract.title,
                customerName,
                areaText,
                statusText
            ].some(value => value?.toLowerCase().includes(term));
        });
    }
    return simulateRequest(result);
};

export const getContractById = async (id: number): Promise<Contract> => {
    const contract = contracts.find(c => c.id === id);
    if (!contract) throw new Error('Contract not found');
    return simulateRequest(contract);
};

export const addContract = async (contractData: Omit<Contract, 'id'>): Promise<Contract> => {
    const newContract: Contract = {
        ...contractData,
        id: nextContractId++,
    };
    contracts = [...contracts, newContract];
    return simulateRequest(newContract);
};

export const updateContract = async (contractData: Contract): Promise<Contract> => {
    const index = contracts.findIndex(c => c.id === contractData.id);
    if (index === -1) throw new Error('Contract not found');
    contracts[index] = contractData;
    return simulateRequest(contractData);
};

export const deleteContract = async (id: number): Promise<{ id: number }> => {
    contracts = contracts.filter(c => c.id !== id);
    return simulateRequest({ id });
};