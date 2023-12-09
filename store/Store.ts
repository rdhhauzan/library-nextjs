import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  description: string;
  image_url: string;
  release_year: number;
  price: string;
  total_page: number;
  thickness: string;
  createdAt: string;
  updatedAt: string;
  category_id: string;
  category: {
    name: string;
  };
}

interface Filters {
  title?: string;
  minYear?: string;
  maxYear?: string;
  minPage?: string;
  maxPage?: string;
  sortByTitle?: string;
}

class BookStore {
  books: Book[] = [];
  loading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchBooks(filters?: Filters) {
    try {
      let url = '/api/books';
      if (filters) {
        url += '?' + new URLSearchParams(filters).toString();
      }

      const response = await axios.get(url);
      runInAction(() => {
        this.books = response.data;
        this.loading = false;
      });
    } catch (error) {
      console.error(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

const store = new BookStore();
export default store;
