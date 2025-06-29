'use client';

import Image from 'next/image'

interface Props {
  value: string
}

export default function Page(props: Props) {

  return (
    <div className = "h-screen bg-white flex justify-center-safe items-center-safe px-20 flex-col -translate-y-70">
      <div className="my-20">
        <Image 
        src="/error-icon.webp"
        width={200}
        height={200}
        alt="a cicle icon idicating there was an error"
        priority={true}
      />
      </div>
      {props.value}
    </div>
  )
}