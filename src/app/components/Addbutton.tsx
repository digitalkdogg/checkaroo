'use client'
import styles from '@/resources/addbutton.module.css'
import Svg from '@/app/components/Svg';
import { redirect } from 'next/navigation'

interface Props {
  url: string
}


export default function Page(props: Props) {


    const redirectTo = () => {
        if (props.url.length >0 ) {
            redirect(props.url)
        }
    }

    return (
        <div className = {'flex flex-col items-center ' + styles.button} role="button" onClick={redirectTo}>
            Add
            <Svg type = 'add' id = "add" />
        </div>
    )
}