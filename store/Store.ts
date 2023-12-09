import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from "next/router";

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

  async deleteBook(id: number) {
    try {
      await axios.delete(`/api/book/${id}`);
      runInAction(() => {
        this.books = this.books.filter(book => book.id !== id);
      });
      Swal.fire({
        title: "Success",
        text: "Book successfully deleted",
        icon: "success"
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response.data.error,
        icon: "error"
      });
    }
  }

  async addBook(bookData: any, onSuccess: () => void) {
    try {
      const response = await axios.post('/api/books', bookData);
      runInAction(() => {
        this.fetchBooks();
        onSuccess()
      });
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success"
      });
    } catch (error) {
        Swal.fire({
            title: "Adding Book failed",
            text: error.response.data.error,
            icon: "error"
        });
    }
  }
}

const store = new BookStore();
export default store;
