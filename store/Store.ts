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

class BookStore {
  books: Book[] = [];
  loading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchBooks() {
    try {
      const response = await axios.get('/api/books');
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
