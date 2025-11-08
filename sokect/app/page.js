"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const route=useRouter();
  return (
   <>
   <div className="flex flex-col items-center justify-center min-h-screen py-2">
   <button
   className="p-2 bg-blue-500 text-white rounded"
   onClick={()=>{route.push("/componet/sokectroom")}}
   >Go to chat</button>
   </div>
   </>
  );
}
