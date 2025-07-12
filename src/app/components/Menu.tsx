import Link from "next/link"

interface Props {
    enable: boolean,
    link: string,
    text:string
}

export default function Page(props:Props) {
    if (props.enable) {
    return (
        <Link href = {props.link}>
            <li className = "cursor-pointer my-10 ">
                {props.text}
            </li>
       </Link>
    )
    } else {
        return (
            <li className = "cursor-pointer my-10 ">
                {props.text}
            </li>
        )
    }
}