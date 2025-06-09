import Menu from '@/app/components/Menu'
interface Props {
  enable: boolean
}

export default function Page(props: Props) {
  return (
    <div className = "flex-1 bg-gradient-to-b from-green to-green-light text-white py-8 px-4 z-20">
      <div className = "logotext text-4xl font-bold">Checkaroo</div>
        <ul role = "menu" className="text-lg font-semibold py-4 menu">
          <Menu enable = {props.enable} link = '/trans' text = 'Transacation' />
          <Menu enable = {props.enable} link = '/clients' text = 'clients' />
          <Menu enable = {props.enable} link = '/categories' text = 'Categories' />
        </ul>
    </div>
  )
}