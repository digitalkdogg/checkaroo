import Menu from '@/app/components/Menu'
import Balance from '@/app/components/Balance'

interface Props {
  enable : boolean,
  session: string
}

export default function Page(props: Props) {
  return (
    <div className = "flex-1 bg-gradient-to-b from-green to-green-light text-white py-8 px-4 z-20 h-lvh">
      <div className = "logotext text-4xl font-bold">Checkaroo</div>
        <Balance enable = {props.enable} session={props.session} />
        <ul role = "menu" className="text-lg font-semibold py-4 menu">
          <Menu enable = {props.enable} link = '/trans' text = 'Transacation' />
          <Menu enable = {props.enable} link = '/clients' text = 'Clients' />
          <Menu enable = {props.enable} link = '/categories' text = 'Categories' />
        </ul>
    </div>
  )
}