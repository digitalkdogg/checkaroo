import Menu from '@/app/components/Menu'
import Balance from '@/app/components/Balance'
import Image from 'next/image';


interface Props {
  enable : boolean,
  session: string
}

export default function Page(props: Props) {
  return (
    <div className = "flex-1 bg-gradient-to-b from-green to-green-light text-white py-8 px-4 z-20 h-lvh">
      <div className = "logotext flex justify-start items-center-safe -ml-0">
        <Image 
                src="/checkaroo_logo2.png"
                width={170}
                height={170}
                alt="Checkaroo logo - Lets hop into your bills"
                priority={true}
              />
        <span className="text-3xl font-bold">Checkaroo</span>
      </div>
      <Balance enable = {props.enable} session={props.session} />
      <ul role = "menu" className="text-lg font-semibold py-4 menu">
        <Menu enable = {props.enable} link = '/trans' text = 'Transacation' />
        <Menu enable = {props.enable} link = '/clients' text = 'Clients' />
        <Menu enable = {props.enable} link = '/categories' text = 'Categories' />
      </ul>
    </div>
  )
}