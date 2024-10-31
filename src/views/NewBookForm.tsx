import {FC} from 'react';
import BookForm from '../components/BookForm';
import client from '../api/Client';

interface Props{}

const NewBookForm: FC<Props> = () =>{
    const handleSubmit = async(data: FormData) =>{
      const res = await client.post('/book/create', data)
        console.log(res.data)
    }
return <BookForm onSubmit={handleSubmit} title='Publish a new book' submitBtnTitle='Publish a new book'/>;
};

export default NewBookForm;