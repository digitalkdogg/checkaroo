import Svg from '@/app/components/Svg';

interface LoadingProps {
  size?: number
  className? : string
}

export default function Page(props: LoadingProps) {

  const getClassName = () => {
    let classList = ''
    if (props.size) {
      classList = 'size-' + props.size.toString()
    } else {
      classList = 'size-24'
    }

    if (props.className) {
      classList = classList + ' ' + props.className
    }
    return classList;
  }

  return (
    <div className= {getClassName()}>
        <Svg id = "loading" type = "loading" />
    </div>
  )
}