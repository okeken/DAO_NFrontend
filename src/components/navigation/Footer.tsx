import { DiscordIcon, TwitterIcon } from '@/icons'
import React from 'react'

const Footer = () => {
  return (
    <div className='flex justify-between items-center border-t border-[#FCE7F3] px-[14px] sm:px-[40px] md:px-[60px] lg:px-[80px] py-3'>
        <div className="italic font-semibold text-[#70707B]">WEB3BRIDGE</div>
        <div className="flex items-center">
            <a href="https://twitter.com/Web3Bridge" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
              <TwitterIcon />
            </a>
            <div className="ml-2 cursor-pointer">
                <DiscordIcon />
            </div>
        </div>
    </div>
  )
}

export { Footer as default }
