import React, { useState } from 'react'
import { ConnectionButton } from '../core'
import Link from 'next/link'
import { MenuIcon } from '@/icons'
import { useAccount, useContractRead } from 'wagmi'
import { GOVERNANCE_ADDRESS } from '@/config'
import Governance from '../../utils/abi/Governance.json'

const Navbar = () => {
    const { address } = useAccount();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { data: owner } = useContractRead({
        address: GOVERNANCE_ADDRESS,
        abi: Governance,
        functionName: "owner",
    });

    return (
        <div className="relative px-[14px] sm:px-[40px] md:px-[60px] lg:px-[80px] py-2 border-b border-[#FCE7F3]">
            <div className="flex items-center justify-between">
                <Link href={"/"} className=''>
                    <img src={"/logo-black.png"} width={100} alt="logo" />
                </Link>
                <div className="hidden lg:flex items-center gap-x-3 text-sm text-[#EF4444] font-medium">
                    <div className="">
                        <Link href='/payment'>Payment</Link>
                    </div>
                    <div className="">
                        <Link href='/dao-token'>DAO Token</Link>
                    </div>
                    <div className="">
                        <Link className='' href='/certificate'>Certificate</Link>
                    </div>
                    <div className="dropdown inline-block relative">
                        <div className="cursor-pointer flex items-center pb-1.5 mt-1.5">
                            Governance <span className='pt-1.5 ml-1 transfo'>^</span>
                        </div>

                        <ul className="dropdown-menu w-36 absolute -left-3.5 hidden border py-2 rounded border-[#EF4444] bg-[#FCE7F3] shadow-[0px,4px,2px, 3px,rgba(16,24,40,0.05)]">
                            {
                                address === owner && (
                                    <Link href={'/create-proposal'}>
                                        <div className="px-3 hover:bg-[#F9F9F9] py-1">
                                            Create Proposal
                                        </div>
                                    </Link>
                                )
                            }
                            <Link href={'/proposals'}>
                                <div className="px-3 hover:bg-[#F9F9F9] py-1">
                                    All Proposals
                                </div>
                            </Link>
                            <Link href={'/vote'}>
                                <div className="px-3 hover:bg-[#F9F9F9] py-1">
                                    Active Proposals
                                </div>
                            </Link>
                        </ul>
                    </div>

                    <div className="ml-2">
                        <ConnectionButton />
                    </div>
                </div>

                <div className="flex items-center lg:hidden">
                    <div className="mr-2">
                        <ConnectionButton />
                    </div>
                    <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                        <MenuIcon />
                    </div>
                </div>
            </div>

            {
                isOpen && (
                    <div className="fixed w-full z-50 top-0 left-0 border-b border-[#EF4444] bg-[#FCE7F3]">
                        <div className="flex justify-between mx-5 mt-7 mb-3">
                            <Link href={"/"} className=''>
                                <img src={"/logo-black.png"} width={100} alt="logo" />
                            </Link>
                            <div className="cursor-pointer" onClick={() => setIsOpen(false)}>X</div>
                        </div>
                        <div className="lg:hidden pb-5 pt- flex flex-col items-center gap-x-3 text-base text-[#EF4444] font-medium">
                            <div className="mb-3">
                                <Link href='/payment'>Payment</Link>
                            </div>
                            <div className="mb-3">
                                <Link href='/dao-token'>DAO Token</Link>
                            </div>
                            <div className="mb-3">
                                <Link className='' href='/certificate'>Certificate</Link>
                            </div>
                            <div className="mb-3">
                                <Link href={'/proposals'}>
                                    All Proposals
                                </Link>
                            </div>
                            <div className="mb-3">
                                <Link href={'/vote'}>
                                    Active Proposals
                                </Link>
                            </div>

                            {
                                address === owner && (
                                    <div className="mb-2">
                                        <Link href='/create-proposal'>Create Proposal</Link>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export { Navbar as default }