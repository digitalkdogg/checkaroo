'use client'

import { useState } from 'react'
import Menu from '@/app/components/Menu'
import Balance from '@/app/components/Balance'
import Image from 'next/image';
import Svg from '@/app/components/Svg';

interface Props {
  enable : boolean,
  session: string
}

export default function Leftside(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Bar - Visible only on mobile */}
      <div className="md:hidden flex items-center justify-between bg-green text-white p-4 sticky top-0 z-30 shadow-md w-full">
         <div className="flex items-center gap-2">
            <Image 
                src="/checkaroo_logo2.png"
                width={32}
                height={32}
                alt="Logo"
                priority={true}
              />
            <span className="text-xl font-bold">Checkaroo</span>
         </div>
         <button onClick={toggle} className="p-1 cursor-pointer hover:bg-green-light rounded transition-colors" aria-label="Toggle menu">
            <Svg type="hamburger" id="mobile-menu-trigger" />
         </button>
      </div>

      {/* Sidebar - Overlay on mobile, static on desktop */}
      <div className = {`
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:static inset-y-0 left-0 z-50 md:z-20
        w-100 md:w-auto md:flex-1 
        bg-gradient-to-b from-green to-green-light text-white 
        py-8 px-4 h-screen md:h-lvh
        transition-transform duration-300 ease-in-out
        shadow-2xl md:shadow-none
      `}>
        {/* Close Button - Visible only on mobile */}
        <button 
          onClick={toggle} 
          className="md:hidden absolute top-4 right-4 p-1 cursor-pointer hover:bg-white/20 rounded transition-colors"
          aria-label="Close menu"
        >
           <Svg type="x-circle" id="mobile-menu-close" />
        </button>

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

      {/* Backdrop - Visible only on mobile when menu is open */}
      {isOpen && (
        <div 
          onClick={toggle} 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
    </>
  )
}
