import axios from "axios";
import { useRouter } from "next/router";
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
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  function editBook(id : number) {
    router.push(`/book/${id}`);
  }

  function deleteBook (id : number) {
    console.log(id);
  }

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
        <div>
          <button onClick={() => router.push('/book')}>Add Book</button>
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
                    <button onClick={() => editBook(book.id)}>Edit</button>
                    <button onClick={() => deleteBook(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
