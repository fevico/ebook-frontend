import {FC, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/Client';
import { parseError } from '../utils/helper';
import BookDetails, { Book } from '../components/BookDetails';
import Skeletons from '../components/skeletons';

interface Props{}

const SingleBook: FC<Props> = () =>{
    const [bookDetails, setBookDetails] = useState<Book>()
    const [busy, setBusy] = useState(true)
   const {slug} = useParams()

   useEffect(()=>{
       const fetchBookDetail = async () => {
        try {  
            const {data} = await client.get("/book/details/" + slug)
            setBookDetails(data.book)
        } catch (error) {
            parseError(error) 
        }finally{
            setBusy(false)
        }
       }
       fetchBookDetail()
   }, [slug]);

  if(busy) return <div className='p-5 lg:p-0'><Skeletons.BookDetails/></div>
return <div className='p-5 lg:p-0'>
    <BookDetails book={bookDetails}/>
</div>;
};

export default SingleBook;