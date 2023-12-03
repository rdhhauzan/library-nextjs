import axios from "axios";
import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  description: string;
  image_url : string;
  release_year: number;
  price : string;
  total_page : number;
  thickness : string;
  createdAt : string;
  updatedAt : string;
  category_id : string;
  category: {
    name: string;
  };
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]); // Specify the type as Book[]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/books")
      .then(response => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <p>Show Books</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
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
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td><img src={book.image_url}/></td>
                <td>{book.description}</td>
                <td>{book.release_year}</td>
                <td>{book.total_page}</td>
                <td>{book.thickness}</td>
                <td>{book.category.name}</td>
                <td>
                    <button>Edit</button>
                    <button>Add</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}