import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import Swal from 'sweetalert2';

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

interface Category {
  id: number;
  name: string;
  createdAt : string;
  updatedAt : string;
}

interface ApiResponse {
    message: string;
}

interface LoginApiResponse {
  message: String;
  access_token: any;
  user_id: any;
}

interface BookFormValues {
    title: string;
    description: string;
    image: string;
    release_year: number;
    price: string;
    total_page: number;
    category: string;
}

interface CategoryFormValues {
  name: string;
}

interface AuthFormValues {
  username: string;
  password: string;
}

interface Filters {
  title?: string;
  minYear?: string;
  maxYear?: string;
  minPage?: string;
  maxPage?: string;
  sortByTitle?: string;
}

class Store {
  books: Book[] = [];
  loading: boolean = true;
  selectedBook: Book | null = null;

  categories: Book[] = [];
  selectedCategory: Category | null = null;

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

  async fetchBookById(id: number, onSuccess: () => void) {
    this.selectedBook = null;
    try {
      const response = await axios.get(`/api/book/${id}`);
      runInAction(() => {
        this.selectedBook = response.data;
        onSuccess()
      });
    } catch (error) {
      console.error(error);
    }
  }

  async editBook(id: number, formValues: BookFormValues, onSuccess: () => void) {
    try {
      const response = await axios.patch<ApiResponse>(`/api/book/${id}`, formValues);
      runInAction(() => {
        Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success" 
        });
        
        onSuccess();
      });
    } catch (error) {
        Swal.fire({
            title: "Adding Book failed",
            text: error.response.data.error,
            icon: "error"
        });
    }
  }

  async fetchCategories() {
    try {
      const response = await axios.get("/api/categories");
      runInAction(() => {
        this.categories = response.data;
        this.loading = false;
      });
    } catch (error) {
      console.error(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async deleteCategory(id: number) {
    this.loading = true;
    try {
      await axios.delete(`/api/category/${id}`)
      runInAction(() => {
        this.categories = this.categories.filter(category => category.id !== id);
        this.loading = false;
      });
      Swal.fire({
        title: "Success",
        text: "Category successfully deleted",
        icon: "success"
      });
    } catch (err) {
      this.loading = false;
      Swal.fire({
        title: "Error",
        text: err.response.data.error,
        icon: "error"
      });
    }
  }

  async addCategory(categoryData: any, onSuccess: () => void) {
    try {
      const response = await axios.post('/api/categories', categoryData);
      runInAction(() => {
        this.fetchCategories();
        onSuccess()
      });
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success"
      });
    } catch (error) {
      Swal.fire({
        title: "Adding Category failed",
        text: error.response.data.error,
        icon: "error"
      });
    }
  }

  async fetchCategoryById(id: number, onSuccess: () => void) {
    this.selectedCategory = null;
    try {
      const response = await axios.get(`/api/category/${id}`);
      runInAction(() => {
        this.selectedCategory = response.data;
        onSuccess()
      });
    } catch (error) {
      console.error(error);
    }
  }

  async editCategory(id: number, formValues: CategoryFormValues, onSuccess: () => void) {
    try {
      const response = await axios.patch<ApiResponse>(`/api/category/${id}`, formValues);
      runInAction(() => {
        Swal.fire({
            title: "Success",
            text: response.data.message,
            icon: "success" 
        });
        
        onSuccess();
      });
    } catch (error) {
      Swal.fire({
        title: "Adding Category failed",
        text: error.response.data.error,
        icon: "error"
    });
    }
  }

  async registerUser(formValues: AuthFormValues, onSuccess: () => void) {
    try {
      const response = await axios.post<ApiResponse>('/api/register', formValues);
      runInAction(() => {
        Swal.fire({
            title: "Success",
            text: "User created successfully, Please login",
            icon: "success" 
        });
        
        onSuccess();
      });
    } catch (error) {
      Swal.fire({
        title: "Register failed",
        text: error.response.data.message,
        icon: "error"
      });
    }
  }

  async loginUser(formValues: AuthFormValues, onSuccess: () => void) {
    try {
      const response = await axios.post<LoginApiResponse>('/api/login', formValues);
      runInAction(() => {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user_id', response.data.user_id);
        onSuccess();
      });
    } catch (error) {
      console.log(error);
      
      Swal.fire({
        title: "Login failed",
        text: error.response.data.message,
        icon: "error"
      });
    }
  }
}

const store = new Store();
export default store;
