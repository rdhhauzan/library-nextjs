import { useState, useRef, FormEvent, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import "../../../app/globals.css";

interface ApiResponse {
  message: string;
}

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
  category_id: number;
}

interface CategoryWithBooks {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  books: Book[];
}

export default function ShowBooksBasedOnCategory({ id }: { id: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [category, setCategory] = useState<CategoryWithBooks | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    minYear: "",
    maxYear: "",
    minPage: "",
    maxPage: "",
    sortByTitle: "",
  });
  const router = useRouter();

  function editBook(id : number) {
    router.push(`/book/${id}`);
  }

  function deleteBook (id : number) {
    axios.delete(`/api/book/${id}`)
    .then((res) => {
      console.log(res);
      
      Swal.fire({
        title: "Success",
        text: "Book successfully deleted",
        icon: "success"
      });

      axios.get(`/api/categories/${id}/books`)
        .then(response => {
            setCategory(response.data);
        })
        .catch(error => {
            console.error(error);
        })
        .finally(() => {
            setLoading(false);
        });

    })
    .catch((err) => {
      Swal.fire({
        title: "Error",
        text: err.response.data.error,
        icon: "error"
      });
    })
  }

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const applyFilters = () => {
    setLoading(true);

    axios
      .get(`/api/categories/${id}/books`, {
        params: filters,
      })
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/categories/${id}/books`)
      .then(response => {
        setCategory(response.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading || !category) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <p>Show Books with category {category.name}</p>
      <div>
        <button onClick={() => router.push('/category')}>Add Category</button>
        <br />
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Min Year"
          name="minYear"
          value={filters.minYear}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Max Year"
          name="maxYear"
          value={filters.maxYear}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Min Page"
          name="minPage"
          value={filters.minPage}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Max Page"
          name="maxPage"
          value={filters.maxPage}
          onChange={handleFilterChange}
        />
        <select
          name="sortByTitle"
          value={filters.sortByTitle}
          onChange={handleFilterChange}
        >
          <option value="" selected disabled>Sort By Title</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button onClick={applyFilters}>Apply Filters</button>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Title</th>
              <th>Image</th>
              <th>Description</th>
              <th>Release Year</th>
              <th>Total Page</th>
              <th>Thickness</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {category.books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td><img src={book.image_url} alt={book.title} /></td>
                <td>{book.description}</td>
                <td>{book.release_year}</td>
                <td>{book.total_page}</td>
                <td>{book.thickness}</td>
                <td>{category.name}</td>
                <td>
                    <button onClick={() => editBook(book.id)}>Edit</button>
                    <button onClick={() => deleteBook(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  return {
    props: {
      id,
    },
  };
}
