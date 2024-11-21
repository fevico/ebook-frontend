import {FC} from 'react';
import BookForm from '../components/BookForm';
import client from '../api/Client';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Props{}

const NewBookForm: FC<Props> = () =>{
  const navigate = useNavigate();

    const handleSubmit = async(data: FormData) =>{
      const res = await client.post('/book/create', data)
      if (res.data) {
        toast(
          "Congratulations, Your book has been published. It may take some time to reflect the changes.",
          {
            duration: 5000,
          }
        );
      }
      navigate("/update-book/" + res.data.slug);
    };
  
    
return <BookForm onSubmit={handleSubmit} title='Publish a new book' submitBtnTitle='Publish a new book'/>;
};

export default NewBookForm;