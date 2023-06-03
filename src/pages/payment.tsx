import { PageLayout } from '@/layout'
import { useRouter } from 'next/router';
import React, { SyntheticEvent, useState } from 'react'
import { useContractWrite, useWaitForTransaction } from 'wagmi';
import { toast } from "react-toastify";
import { MULTISIG, USDT_ADDRESS } from '@/config';
import Payment_Abi from "../utils/abi/Payment.json"
import { ethers } from 'ethers';
import { Button } from '@/components/core';
import { ScaleLoader } from 'react-spinners';
import usePayment from '../hooks/usePayment'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/material.css'


const Payment = () => {
    const router = useRouter();
    const [amount, setAmount] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>("Pay in Crypto");

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
            toast.error(`Failed! ${error.reason}`);
        },
    });

    const { isLoading: payInCryptoWaitLoading } =
        useWaitForTransaction({
            hash: payInCryptoData?.hash,
            onSuccess(data) {
                setAmount('')
                router.push("/");
                toast.success("Payment Successful!");
            },
            onError(error: any) {
                toast.error(`Failed! ${error.reason}`);
            },
        });

    const handleCryptoSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        payInCrypto?.();
    };

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [phone, setPhone] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false)
    // const [loading, setE] = useState<boolean>(false)


    const { card: handlePayment, cardClose: closePaymentModal } = usePayment({
        amount: Number(amount),
        customer: {
            email: email,
            phone_number: phone,
            name: name,
        },
    });

    const handleFiatSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        console.log({ name, phone, email, amount });
        // return;

        setLoading(true);

        try {
            handlePayment({
                callback: (resp) => {
                    setTimeout(() => {
                        closePaymentModal();
                        setEmail("")
                        setAmount("");
                        setName("");
                        setPhone("");
                        router.push("/")
                        // setMessage(response.data.message);
                        // window.scrollTo({ top: 0, behavior: "smooth" });
                    }, 2000);
                },
                onClose: () => { },
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };



    return (
        <PageLayout>
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
                            <div className="mb-[6px]">
                                <h1 className="text-[#3F3F46] text-[14px] leading-[20px] mb-[8px]">Enter Amount</h1>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter amount"
                                    className={`${amount ? "border-[#EF4444] bg-white" : "bg-[#FAFAFA]"} focus:outline-none rounded-[24px] border bg-[#F8F7FF] w-full px-[14px] py-[12px] text-[#70707B] text-[16px] leading-[24px]`}
                                    value={amount}
                                    onChange={(e: any) => setAmount(e.target.value)}
                                />
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

                                <div className="mb-[24px]">
                                    <h1 className="text-[#3F3F46] text-[14px] leading-[20px] mb-[6px]">Enter Amount</h1>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter amount"
                                        className={`${amount ? "border-[#EF4444] bg-white" : "bg-[#FAFAFA]"} focus:outline-none rounded-[24px] border bg-[#F8F7FF] w-full px-[14px] py-[12px] text-[#70707B] text-[16px] leading-[24px]`}
                                        value={amount}
                                        onChange={(e: any) => setAmount(e.target.value)}
                                    />
                                </div>


                                <div className="mb-[10px]">
                                    {/* <h1 className="text-[#3F3F46] text-[14px] leading-[20px] mb-[6px]">Enter Email</h1> */}
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
                                        : "Pay"}
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