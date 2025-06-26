import Svg from '@/app/components/Svg';

interface LoadingProps {
  size?: number;
}

export default function Page(props: LoadingProps) {

  return (
    <div className= {props.size ? `size-${props.size}` : 'size-24'}>
        <Svg id = "loading" type = "loading" />
    </div>
  )
}