import { useState, useRef, FormEvent, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import "../../app/globals.css";

interface FormValues {
    name: string;
}

interface ApiResponse {
    message: string;
}

export default function EditCategory({ id }: { id: string }) {
    const formRef = useRef<HTMLFormElement>(null);
    const [name, setName] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const editCategory = async (e: FormEvent) => {
        Swal.fire({
            title: "Updating Category...",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setLoading(true);
        e.preventDefault();

        const formValues: FormValues = {
            name
        };

        axios.patch<ApiResponse>(`/api/category/${id}`, formValues)
        .then(response => {
            Swal.fire({
                title: "Success",
                text: response.data.message,
                icon: "success" 
            });
            router.push('/categories');
        })
        .catch(error => {
            console.log(error);
            
            Swal.fire({
                title: "Adding Category failed",
                text: error.response.data.error,
                icon: "error"
            });
        })
        .finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        if (!localStorage.getItem('access_token')) {
            router.push('/login')
        }
        
        setLoading(true);
        axios.get(`/api/category/${router.query.id}`)
        .then(response => {
            setName(response.data.name)
        })
        .catch(error => {
            console.error(error);
        })
        .finally(() => {
            setLoading(false);
        })

    }, []);

    if (loading) {
        return (
            <div>Loading</div>
        )
    }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Edit a category</h2>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={editCategory}
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context : any) {
    const { id } = context.params;
    return {
      props: {
        id,
      },
    };
  }
  
