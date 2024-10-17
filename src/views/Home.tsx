import {FC} from 'react';
import useAuth from '../hooks/UseAuth';

interface Props{}

const Home: FC<Props> = () =>{
   const authStatus = useAuth()
   console.log(authStatus)
return <div>Home</div>;
};

export default Home;