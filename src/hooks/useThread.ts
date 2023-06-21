// /*

// Get the thread by its id

// */

// import { useEffect } from "react";
// import { useState } from "react";
// import axios from 'axios';
// import instance from "../controllers/axios.controllers";
// import { config } from "dotenv";

// config();

// const endpoint = process.env.ENDPOINT as string;

// interface threadHook {
//     loading:boolean,
// }

// export interface useThreadProp {
//     id:string
// };
// const useThread = ({id}:useThreadProp):threadHook=>{
//     const [loading, setLoading] = useState<boolean>(false);

//     useEffect(()=>{
//         instance.ge
//     }, [id])

//     return {loading};
// }
