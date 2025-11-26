
import { Category } from './types';

export const CATEGORIES: { [key: string]: Category[] } = {
  expense: [
    Category.FOOD,
    Category.TRAVEL,
    Category.SHOPPING,
    Category.RENT,
    Category.HEALTH,
    Category.OTHER,
  ],
  income: [Category.SALARY, Category.FREELANCE, Category.OTHER],
};
