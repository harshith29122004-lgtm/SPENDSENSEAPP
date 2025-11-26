
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum Category {
  FOOD = 'Food',
  TRAVEL = 'Travel',
  SHOPPING = 'Shopping',
  RENT = 'Rent',
  HEALTH = 'Health',
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  OTHER = 'Other',
}

export enum PaymentMethod {
  CASH = 'Cash',
  CARD = 'Card',
  ONLINE = 'Online',
}

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  date: string;
  type: TransactionType;
  paymentMethod?: PaymentMethod;
  note?: string;
}

export interface Budget {
    amount: number;
    period: 'monthly' | 'weekly';
}

export interface FilterState {
  type: 'all' | TransactionType;
  category: 'all' | Category;
  dateFrom: string;
  dateTo: string;
}

export interface User {
  email: string;
  name: string;
  password?: string;
}
