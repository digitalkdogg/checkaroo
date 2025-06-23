import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Datepicker() {
   const [startDate, setStartDate] = useState(new Date());
  
    const changeDate = (date:any) => {
        setStartDate(date)
    }

   return (
     <DatePicker selected={startDate} onChange={changeDate} />           
   )

}