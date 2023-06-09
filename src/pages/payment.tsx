import { PageLayout } from '@/layout'
import { useRouter } from 'next/router';
import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { toast } from "react-toastify";
import { MULTISIG, USDT_ADDRESS } from '@/config';
import Payment_Abi from "../utils/abi/Payment.json"
import { ethers } from 'ethers';
import { Button } from '@/components/core';
import { ScaleLoader } from 'react-spinners';
import usePayment from '../hooks/usePayment'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/plain.css'
import PaymentSuccessModal from '@/components/payment/PaymentSuccessModal';
import axios from 'axios';
import SuccessToastIcon from '@/icons/SuccessToastIcon';
import WarningIcon from '@/icons/WarningIcon';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';


const Payment = () => {
    const router = useRouter();
    const { address } = useAccount();
    const [amount, setAmount] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>("Pay in Crypto");


    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [phone, setPhone] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [activePercentage, setActivePercentage] = useState("100")


    const {
        data: payInCryptoData,
        isLoading: payInCryptoLoading,
        write: payInCrypto,
    } = useContractWrite({
        address: USDT_ADDRESS,
        abi: Payment_Abi,
        functionName: "transfer",
        args: [MULTISIG, ethers.utils.parseEther(amount.toString() || "0")],
        onError(error: any) {
            toast.error(`Failed! ${error.reason}`, {
                icon: <WarningIcon />,
            });
        },
    });

    const { isLoading: payInCryptoWaitLoading } =
        useWaitForTransaction({
            hash: payInCryptoData?.hash,
            async onSuccess(dt) {
                console.log("response.dttt: ", dt);

                const { data } = await axios.post('http://13.53.199.120/user', { fullName: name, email, phoneNumber: phone, walletAddress: address, amount: Number(amount), txnId: dt.transactionHash })

                if (data.success) {
                    setIsOpen(true);
                    setEmail("")
                    setAmount("");
                    setName("");
                    setPhone("");
                } else {
                    console.log("There is an error!: ", data.message);

                }
            },
            onError(error: any) {
                console.log(error.message);

                toast.error(`Failed! ${error.reason}`, {
                    icon: <WarningIcon />,
                });
            },
        });

    const handleCryptoSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        if (!address) {
            toast.error("Connect your wallet!", {
                icon: <WarningIcon />,
            });
            return;
        }
        payInCrypto?.();
    };

    const config = {
        public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY as string,
        tx_ref: String(Date.now()),
        amount: Number(amount),
        currency: 'USD',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: email,
            phone_number: phone,
            name: name,
        },
        customizations: {
            title: `Web3Bridge DAO`,
            description: `Web3Bridge DAO`,
            logo: "https://www.web3bridge.com/web3bridge-logo.png",
        },
    };

    const handleFlutterPayment = useFlutterwave(config);

    const handleFiatSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        if (!address) {
            toast.error("Connect your wallet!", {
                icon: <WarningIcon />,
            });
            return;
        }

        setLoading(true);
        try {
            let amt = Number(amount)
            handleFlutterPayment({
                callback: async (response) => {
                    console.log(response);
                    if (response.status == "successful") {

                        console.log("response.amount: ", response.amount);
                        console.log("response.amount.amount: ", amount);
                        const { data } = await axios.post('http://13.53.199.120/user', { fullName: name, email, phoneNumber: phone, walletAddress: address, amount: amt, txnId: response.flw_ref })
                        console.log("response: ", data);
                        if (data.success) {
                            setIsOpen(true);
                            setEmail("")
                            setAmount("");
                            setName("");
                            setPhone("");
                        }
                    }
                    closePaymentModal() // this will close the modal programmatically
                },
                onClose: () => { },
            });
            // }}
            // handlePayment({
            //     callback: async (resp) => {
            //         setTimeout(async () => {
            //             closePaymentModal();
            //             setEmail("")
            //             setAmount("");
            //             setName("");
            //             setPhone("");
            //             setIsOpen(true);
            //         }, 2000);
            //         const {data} = await axios.post('http://13.53.199.120/user', { fullName: name, email, phoneNumber: phone, walletAddress: address, amount: Number(amount) })
            //         console.log("response: ", data);
            //         if (data.success) {
            //             setIsOpen(true);
            //         }
            //     },
            //     onClose: async() => { },
            // });
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activePercentage == '25') {
            setAmount('250')
        } else if (activePercentage == '50') {
            setAmount('500')
        } else if (activePercentage == '75') {
            setAmount('750')
        } else if (activePercentage == '100') {
            setAmount('1000')
        } else {
            setAmount('')
        }
    }, [activePercentage])

    return (
        <PageLayout>
            <PaymentSuccessModal
                isOpen={isOpen}
                togglePaymentSuccessModal={() => setIsOpen(!isOpen)}
            />
            <div className="flex justify-center my-16 items-center h-[calc(100vh-6.6rem)]">
                <div className="border border-[#EF4444] text-[#3F3F46] w-[90%] md:max-w-[500px] mx-auto px-6 py-9 rounded-[8px]">

                    <div className="flex justify-center mb-6">
                        <div className="w-[250px] grid grid-cols-2 h-12 bg-[#fff] overflow-hidden mb-8 rounded-[24px]">
                            {["Pay in crypto", "Pay in fiat"].map((title, i) => (
                                <TabButton
                                    key={i}
                                    {...{ title, setActiveTab, activeTab }}
                                    last={i === 1}
                                />
                            ))}
                        </div>
                    </div>

                    {activeTab.toLocaleLowerCase().includes('crypto') ? (
                        <form
                            onSubmit={handleCryptoSubmit}
                            className="w-full"
                        >
                            <div className="mb-[16px]">
                                <h1 className="text-[#3F3F46] text-[14px] leading-[20px] mb-[6px]">Enter name</h1>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter name"
                                    className={`${name ? "border-[#EF4444] bg-white" : "bg-[#FAFAFA]"} focus:outline-none rounded-[24px] border bg-[#F8F7FF] w-full px-[14px] py-[12px] text-[#70707B] text-[16px] leading-[24px]`}
                                    value={name}
                                    onChange={(e: any) => setName(e.target.value)}
                                />
                            </div>

                            <div className="mb-[16px]">
                                <h1 className="text-[#3F3F46] text-[14px] leading-[20px] mb-[6px]">Enter Email</h1>
                                <input
                                    required
                                    type="email"
                                    placeholder="Enter email"
                                    className={`${email ? "border-[#EF4444] bg-white" : "bg-[#FAFAFA]"} focus:outline-none rounded-[24px] border bg-[#F8F7FF] w-full px-[14px] py-[12px] text-[#70707B] text-[16px] leading-[24px]`}
                                    value={email}
                                    onChange={(e: any) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-[12px]">
                                <h1 className="text-[#3F3F46] text-[14px] leading-[20px] mb-[6px]">Enter Amount</h1>
                                <div className="relative">

                                    <div className="absolute bg-[#EFEFEF] border border-[#EF4444] py-2.5 text-lg text-[#70707B] px-5 rounded-tl-[24px]  rounded-bl-[24px]">
                                        $
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter amount"
                                        className={`${amount ? "border-[#EF4444] bg-white" : "bg-[#FAFAFA]"} pl-16 focus:outline-none rounded-[24px] border bg-[#F8F7FF] w-full px-[14px] py-[12px] text-[#70707B] text-[16px] leading-[24px]`}
                                        value={amount}
                                        onChange={(e: any) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="rounded-md flex h-[46px] bg-[#FAFAFA] gap-x-4 p-1 mb-6">
                                {
                                    ['25', '50', '75', '100'].map((am, _i) => (
                                        <PercentageTabButton
                                            title={am}
                                            key={_i}
                                            activePercentage={activePercentage}
                                            setActivePercentage={setActivePercentage}
                                        />
                                    ))
                                }
                            </div>


                            <div className="mb-[10px]">
                                <h1 className="text-[#3F3F46] text-[14px] leading-[20px] mb-[6px]">Enter Phone Number</h1>
                                <div className="w-full">
                                    <PhoneInput
                                        country={'ng'}
                                        value={phone}
                                        // className=""
                                        onChange={phone => setPhone(phone)}
                                    />
                                </div>
                            </div>

                            <Button
                                className={"bg-[#EF4444] text-white text-sm font-medium w-full h-11 mt-10 rounded-[8px]"}
                                type="submit">
                                {/* <ClipLoader size={28} color="#fff" /> */}
                                {payInCryptoLoading || payInCryptoWaitLoading
                                    ? <ScaleLoader color='white' />
                                    : "Pay"}
                            </Button>
                        </form>
                    ) : (
                        <div className="flex justify-center">
                            <form
                                onSubmit={handleFiatSubmit}
                                className="w-full"
                            >
                                <div className="mb-[16px]">
                                    <h1 className="text-[#3F3F46] text-[14px] leading-[20px] mb-[6px]">Enter name</h1>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter name"
                                        className={`${name ? "border-[#EF4444] bg-white" : "bg-[#FAFAFA]"} focus:outline-none rounded-[24px] border bg-[#F8F7FF] w-full px-[14px] py-[12px] text-[#70707B] text-[16px] leading-[24px]`}
                                        value={name}
                                        onChange={(e: any) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-[16px]">
                                    <h1 className="text-[#3F3F46] text-[14px] leading-[20px] mb-[6px]">Enter Email</h1>
                                    <input
                                        required
                                        type="email"
                                        placeholder="Enter email"
                                        className={`${email ? "border-[#EF4444] bg-white" : "bg-[#FAFAFA]"} focus:outline-none rounded-[24px] border bg-[#F8F7FF] w-full px-[14px] py-[12px] text-[#70707B] text-[16px] leading-[24px]`}
                                        value={email}
                                        onChange={(e: any) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-[12px]">
                                    <h1 className="text-[#3F3F46] text-[14px] leading-[20px] mb-[6px]">Enter Amount</h1>
                                    <div className="relative">

                                        <div className="absolute bg-[#EFEFEF] border border-[#EF4444] py-2.5 text-lg text-[#70707B] px-5 rounded-tl-[24px]  rounded-bl-[24px]">
                                            $
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter amount"
                                            className={`${amount ? "border-[#EF4444] bg-white" : "bg-[#FAFAFA]"} pl-16 focus:outline-none rounded-[24px] border bg-[#F8F7FF] w-full px-[14px] py-[12px] text-[#70707B] text-[16px] leading-[24px]`}
                                            value={amount}
                                            onChange={(e: any) => setAmount(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="rounded-md flex h-[46px] bg-[#FAFAFA] gap-x-4 p-1 mb-6">
                                    {
                                        ['25', '50', '75', '100'].map((am, _i) => (
                                            <PercentageTabButton
                                                title={am}
                                                key={_i}
                                                activePercentage={activePercentage}
                                                setActivePercentage={setActivePercentage}
                                            />
                                        ))
                                    }
                                </div>


                                <div className="mb-[10px]">
                                    <h1 className="text-[#3F3F46] text-[14px] leading-[20px] mb-[6px]">Enter Phobe Number</h1>
                                    <div className="w-full">
                                        <PhoneInput
                                            country={'ng'}
                                            value={phone}
                                            // className=""
                                            onChange={phone => setPhone(phone)}
                                        />
                                    </div>
                                </div>

                                <Button
                                    className={"bg-[#EF4444] text-white text-sm font-medium w-full h-11 mt-10 rounded-[8px]"}
                                    type="submit"
                                    disabled={loading}
                                >
                                    {/* <ClipLoader size={28} color="#fff" /> */}

                                    {loading
                                        ? <ScaleLoader color='white' />
                                        : "Proceed"}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    )
}

export { Payment as default }

interface TabButtonProps {
    title: string;
    activeTab: string;
    last?: boolean;
    setActiveTab: (val: string) => void;
}

const TabButton = ({
    title,
    setActiveTab,
    activeTab,
    last = false,
}: TabButtonProps) => {
    const isActive = title.toLowerCase() === activeTab.toLowerCase();

    return (
        <button
            onClick={() => setActiveTab(title)}
            className={`cursor-pointer h-full px-4 lg:px-6 ${isActive ? " bg-[#FCE7F3] rounded-[24px]" : "bg-transparent"
                }`}
        >
            <h1
                className="font-medium text-sm whitespace-nowrap"
                style={{
                    color: isActive ? "#EF4444" : "#70707B",
                }}
            >
                {title}
            </h1>
        </button>
    );
};


const PercentageTabButton = (props: any) => {
    console.log(props);



    const isActive = props.title?.toLowerCase() === props.activePercentage.toLowerCase();

    // 
    return (
        <div
            // style={isActiveDiv(props?.title)}
            onClick={() => props?.setActivePercentage(props?.title)}
            className={`cursor-pointer px-6 h-full flex justify-center items-center w-full transition-all delay-75 ease-in-out rounded-[12px] border ${isActive ? " bg-[#EF4444]" : "bg-[#F0F0F0] border-[#FCE7F3]"}`}

        >
            <h1
                //   style={isActiveH1(props?.title)}
                className={`font-medium m-0 text-sm whitespace-nowrap transition-colors delay-75 ease-in-out`}
                style={{
                    color: isActive ? "#FFFFFF" : "#70707B",
                }}
            >
                {props?.title}%
            </h1>
        </div>
    );
};