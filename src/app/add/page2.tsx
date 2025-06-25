"use client";

import { useCallback } from "react";
import Input from "@/app/components/Input";
import { createItem } from "@/app/add/actions2";

export default function Page() {
  const onClick = useCallback(async () => {
    const { title } = await createItem({ name: "John Doe"}) ; 
    console.log(title);
  }, []);

   return (
    <div>
        <form id = "form">
        <Input id = "amount" name = "amount" val = '' disabled = {false} />
        </form>
        <button onClick={onClick}>Create John Doe</button>
    </div>
   )

 // return  <button onClick={onClick}>Create John Doe</button> 

};