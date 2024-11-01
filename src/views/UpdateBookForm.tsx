import { FC, useEffect, useState } from "react";
import BookForm, { initialBookToUpdate } from "../components/BookForm";
import { useParams } from "react-router-dom";
import client from "../api/Client";
import { parseError } from "../utils/helper";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

interface Props {}

const UpdateBookForm: FC<Props> = () => {
  const [bookInfo, setBookInfo] = useState<initialBookToUpdate>();
  const [busy, setBusy] = useState(true);
  const { slug } = useParams();

  const handleSubmit = async(data: FormData) =>{
    const res = await client.patch('/book', data)
    toast("Book updated successfully", {duration: 5000})
  }

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const { data } = await client.get(`/book/details/${slug}`);
        setBookInfo(data.book);
      } catch (error) {
        parseError(error);
      } finally {
        setBusy(false);
      }
    };
    fetchBookDetails();
  }, [slug]);
  if (busy) return <LoadingSpinner />;
  return (
    <BookForm
    onSubmit={handleSubmit}
      initialState={bookInfo}
      title="Update book"
      submitBtnTitle="Update book"
    />
  );
};

export default UpdateBookForm;
