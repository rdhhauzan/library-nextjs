import { useState, useRef, FormEvent, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

interface FormValues {
  title: string;
  description: string;
  image: string;
  release_year: number;
  price: string;
  total_page: number;
  category: string;
}

interface ApiResponse {
  message: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AddBook() {
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [releaseYear, setReleaseYear] = useState<number>(0);
  const [price, setPrice] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const addBook = async (e: FormEvent) => {
    Swal.fire({
      title: "Adding Book...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setLoading(true);
    e.preventDefault();

    const formValues: FormValues = {
      title,
      description,
      image,
      release_year: releaseYear,
      price,
      total_page: totalPage,
      category,
    };

    axios.post<ApiResponse>("/api/books", formValues)
      .then(response => {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success"
        });
        router.push('/books');
      })
      .catch(error => {
        console.log(error);
        
        Swal.fire({
          title: "Adding Book failed",
          text: error.response.data.error,
          icon: "error"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    axios.get('/api/categories')
    .then((res) => {
      setCategories(res.data)
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    })
  }, [])

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Add a new book</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" ref={formRef}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Title</label>
            <div className="mt-2">
              <input
                id="title"
                name="title"
                type="text"
                autoComplete="off"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">Image URL</label>
            <div className="mt-2">
              <input
                id="image"
                name="image"
                type="text"
                autoComplete="off"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="releaseYear" className="block text-sm font-medium leading-6 text-gray-900">Release Year</label>
            <div className="mt-2">
              <input
                id="releaseYear"
                name="releaseYear"
                type="number"
                autoComplete="off"
                required
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price</label>
            <div className="mt-2">
              <input
                id="price"
                name="price"
                type="text"
                autoComplete="off"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="totalPage" className="block text-sm font-medium leading-6 text-gray-900">Total Page</label>
            <div className="mt-2">
              <input
                id="totalPage"
                name="totalPage"
                type="number"
                autoComplete="off"
                required
                value={totalPage}
                onChange={(e) => setTotalPage(Number(e.target.value))}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">Category</label>
            <div className="mt-2">
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="" selected disabled>Select Category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={addBook}
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
