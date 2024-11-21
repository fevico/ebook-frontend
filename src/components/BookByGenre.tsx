import { FC, useEffect, useState } from "react";
import client from "../api/Client";
import { parseError } from "../utils/helper";
import Skeletons from "./skeletons";
import BookList from "./BookList";



interface Props {
  genre: string;
}

interface Book {
  id: string;
  title: string;
  genre: string;
  slug: string;
  cover?: string;
  rating?: string;
  price: {
    mrp: string;
    sale: string;
  };
}

const BookByGenre: FC<Props> = ({ genre }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    const fetchBooks = async (genre: string) => {
      try {
        const { data } = await client.get("/book/by-genre/" + genre);
        setBooks(data.books);
      } catch (error) {
        parseError(error);
      } finally {
        setBusy(false);
      }
    };
    fetchBooks(genre);
  }, [genre]);

  if (busy)
    return (
    <Skeletons.BookList />
     );
  return (
    <BookList title={genre} data={books}/>
  );
};

export default BookByGenre;
