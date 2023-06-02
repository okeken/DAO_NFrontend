import { Footer, Navbar } from '@/components/navigation'
import React from 'react'

const PageLayout = ({ children }: any) => {
    return (
        <div className="bg-[#FAFAFF]">
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}

export { PageLayout as default }
