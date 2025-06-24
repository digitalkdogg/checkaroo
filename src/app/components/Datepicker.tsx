import { useState, useEffect } from 'react';
import Svg from '@/app/components/Svg'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Datepicker(props:Props) {
  const [startDate, setStartDate] = useState(new Date());
  
    const changeDate = (date:any) => {
        showbtn();
        setStartDate(date)
    }

    const showbtn = () => {
      const btn = document.getElementById('calbtn')
      const svg = document.getElementById('svgcalbtn');

      if (btn.classList.contains('hide')) {
        btn.classList.remove('hide')
      }

      if (svg.classList.contains('hide')) {
        svg.classList.remove('hide')
      }

    }

    const triggerCal = (event) => {
      console.log(event.target)
      const id = document.getElementById(props.id);
      event.target.classList.add('hide');
      if (id) {
        id.focus();
      }
    }

    return (
      <div className = "flex flex-row">
        <DatePicker selected={startDate} onChange={changeDate} id = {props.id} name = {props.name} onClickOutside = {showbtn} /> 
        <div id = "calbtn" onClick={triggerCal}><Svg id = "svgcalbtn" type = "calendar" /></div>
      </div>         
   )

}