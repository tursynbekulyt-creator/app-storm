export interface UserProfile {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  address: string;
  city: string;
  country: string;
  avatarBg: string;
  initials: string;
  memberSince: string;
}

export interface ContactPerson {
  id: string;
  name: string;
  username: string;
  cardNumber: string;
  avatarBg: string;
  initials: string;
}

export const initialProfile: UserProfile = {
  fullName: 'Tanya Myroniuk',
  role: 'Senior UI/UX Designer',
  email: 'tanya.myroniuk@gmail.com',
  phone: '+1 785 268 74 22',
  birthDay: '28',
  birthMonth: 'September',
  birthYear: '2000',
  address: '420 West Huron Street, Apt 12B',
  city: 'Chicago',
  country: 'United States',
  avatarBg: '#0066FF',
  initials: 'TM',
  memberSince: 'March 2023',
};

export const quickContacts: ContactPerson[] = [
  {
    id: 'c_1',
    name: 'Tanya Myroniuk',
    username: '@tanya_m',
    cardNumber: '4562 1122 4595 7852',
    avatarBg: '#0066FF',
    initials: 'TM',
  },
  {
    id: 'c_2',
    name: 'Alexey Kim',
    username: '@alex_kim',
    cardNumber: '5289 9012 3341 8810',
    avatarBg: '#8B5CF6',
    initials: 'AK',
  },
  {
    id: 'c_3',
    name: 'Aruzhan Bekova',
    username: '@aruzhan_b',
    cardNumber: '4916 4420 1198 7732',
    avatarBg: '#EC4899',
    initials: 'AB',
  },
  {
    id: 'c_4',
    name: 'Daniyar Kassymov',
    username: '@daniyar_k',
    cardNumber: '5412 7500 8821 1904',
    avatarBg: '#10B981',
    initials: 'DK',
  },
  {
    id: 'c_5',
    name: 'Elena Petrova',
    username: '@elena_p',
    cardNumber: '4024 0071 5532 9081',
    avatarBg: '#F59E0B',
    initials: 'EP',
  },
];
