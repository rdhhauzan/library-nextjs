This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Tech Stack
Next.Js, Prisma, Typescript, NodeJS, Tailwind, PostgreSQL

## Installations

1. Clone the Repo 
```git
git clone https://github.com/rdhhauzan/library-nextjs.git
```

2. Install dependencies
```cmd
cd library-nextjs
```
```npm
npm install
```

3. rename .env.example 
```cmd
cp .env.example .env
```

3. Update .env
```cmd
DATABASE_URL="your postgresql url"
```

4. Run Migrations
```cmd
npx prisma migrate dev
```

4. Run NextJS
```cmd
npm run dev
```

## API Routes

|  URI                               | Additional Notes                                                  |
|----------------------------------- |---------------------------------------------------------|
| `GET`     `/categories`            | Retrieve all categories
| `POST`    `/categories`            | Create a new category
| `PATCH`   `/category/:id`          | Update an existing category based on its ID.
| `DELETE`  `/category/:id`          | Delete a category based on its ID.
| `GET`     `/category/:id`          | Retrieve a category based on its ID
| `GET`     `/categories/:id/books`  | Retrieve all books based on the category ID, you can filter data, see below
| `GET`     `/books`                 | Retrieve a list of all books, you can filter data, see below
| `POST`    `/books`                 | Create a new book.
| `PATCH`   `/book/:id`              | Update an existing book based on its ID.
| `DELETE`  `/book/:id`              | Delete a book based on its ID.
| `GET`     `/book/:id`              | Retrieve details of a specific book.
| `POST`    `/login`                 | Authenticate and login a user.
| `POST`    `/register`              | Register a new user.

## Search and Filter Books
You can apply the following filters when retrieving books using below routes :
|  URI                               | Additional Notes                                                  |
|----------------------------------- |---------------------------------------------------------|
| `GET`     `/categories/:id/books`  | Retrieve all books based on the category ID, you can filter data, see below
| `GET`     `/books`                 | Retrieve a list of all books, you can filter data, see below

### Filter :
- `title` (case-insensitive search by title)
- `minYear` (filter by minimum publication year)
- `maxYear` (filter by maximum publication year)
- `minPage` (filter by minimum number of pages)
- `maxPage` (filter by maximum number of pages)
- `sortByTitle` (sort books in ascending or descending order by title)

### Example :
```url
GET /categories/:id/books?title=example&minYear=2000&maxPage=300&sortByTitle=asc
```
```url
GET /books?title=example&minYear=2000&maxPage=300&sortByTitle=asc
```
