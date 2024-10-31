import {FC} from 'react';
import BookForm from '../components/BookForm';

interface Props{}

const UpdateBookForm: FC<Props> = () =>{
return <BookForm title='Update book' submitBtnTitle='Update book'/>;
};

export default UpdateBookForm;