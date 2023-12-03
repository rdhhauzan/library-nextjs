import { useState, useRef, FormEvent, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

interface FormValues {
  username: string;
  password: string;
}

interface ApiResponse {
  message: String;
}

export default function Register() {
  const formRef = useRef<HTMLFormElement>(null);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const register = async (e: FormEvent) => {
    Swal.fire({
      title: "Creating users...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setLoading(true);
    e.preventDefault();

    const formValues: FormValues = {
      username,
      password,
    };

    console.log(formValues);

    axios.post<ApiResponse>("/api/register", formValues)
      .then(response => {
        Swal.fire({
          title: "Success",
          text: "User created successfully, Please login",
          icon: "success"
        });
      })
      .catch(error => {
        Swal.fire({
          title: "Register failed",
          text: error.response.data.message,
          icon: "error"
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      router.push('/books')
    }
  }, [])

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" ref={formRef}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={register}
            >
              Sign up
            </button>
            <a onClick={() => router.push('/login')} className="cursor-pointer">Already have an account? Login here</a>
          </div>
        </form>
      </div>
    </div>
  );
}
