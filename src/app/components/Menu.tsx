interface Props {
    enable: boolean,
    link: string,
    text:string
}

export default function Page(props:Props) {
    if (props.enable) {
    return (
        <a href = {props.link}>
            <li className = "cursor-pointer my-10 ">
                {props.text}
            </li>
       </a>
    )
    } else {
        return (
            <li className = "cursor-pointer my-10 ">
                {props.text}
            </li>
        )
    }
}