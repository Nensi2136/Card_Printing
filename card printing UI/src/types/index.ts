export interface User {
  id: string;
  email: string;
  username: string;
  isPremium: boolean;
}

export interface CardData {
  businessName: string;
  email: string;
  website: string;
  userName: string;
  phone: string;
  address: string;
  title: string;
  backgroundColor: string;
  backgroundImage?: string;
  textColor: string;
}

export interface CardTheme {
  id: string;
  name: string;
  backgroundColor: string;
  backgroundImage?: string;
  textColor: string;
  isPremium: boolean;
}