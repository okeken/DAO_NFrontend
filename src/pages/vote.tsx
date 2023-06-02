import { VoteTable } from '@/components/tables'
import { PageLayout } from '@/layout'
import React, { SyntheticEvent } from 'react'

import DAOToken from "../utils/abi/DAOtoken.json"
import Governance from "../utils/abi/Governance.json"

import { useState } from "react";
import { DAOTOKEN_ADDRESS, GOVERNANCE_ADDRESS } from "../config";
import {
    useAccount,
    useContractRead,
    useContractWrite,
    useWaitForTransaction,
} from "wagmi";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useRouter } from 'next/router';
import { ScaleLoader } from 'react-spinners'
import { Button } from '@/components/core'

const Vote = () => {
    const router = useRouter();
    const { address } = useAccount();
    const [value, setValue] = useState<string>("");
    const [voteType, setVoteType] = useState(null);
    const [voteId, setVoteId] = useState(null);

    const { data: balanceOf } = useContractRead({
        address: DAOTOKEN_ADDRESS,
        abi: DAOToken,
        functionName: "balanceOf",
        args: [address],
    });

    const { data: symbol } = useContractRead({
        address: DAOTOKEN_ADDRESS,
        abi: DAOToken,
        functionName: "symbol",
    });

    const balance = balanceOf && ethers.utils.formatUnits(balanceOf, 'ether');

    const { data: proposals } = useContractRead({
        address: GOVERNANCE_ADDRESS,
        abi: Governance,
        functionName: "getProposals",
        onSuccess(data) { },
    });

    const { data: getMaxVoteWeight } = useContractRead({
        address: GOVERNANCE_ADDRESS,
        abi: Governance,
        functionName: "getMaxVoteWeight",
        onSuccess(data) { },
    });

    const { data: owner } = useContractRead({
        address: GOVERNANCE_ADDRESS,
        abi: Governance,
        functionName: "owner",
    });

    // APPROVE GOVERNANCE CONTRACT TO BURN TOKEN
    const {
        data: approveData,
        isLoading: approveLoading,
        write: approve,
    } = useContractWrite({
        mode: "recklesslyUnprepared",
        address: DAOTOKEN_ADDRESS,
        abi: DAOToken,
        functionName: "approve",
        args: [
            GOVERNANCE_ADDRESS,
            ethers.utils.parseEther(getMaxVoteWeight?.toString() || "0"),
        ],

        onError(error: any) {
            toast.error(`Failed! ${error.reason}`);
        },
    });

    const { isLoading: approveWaitLoading } = useWaitForTransaction({
        hash: approveData?.hash,
        onSuccess(data) {
            vote?.();
        },
        onError(error: any) {
            toast.error(`Failed! ${error.reason}`);
        },
    });

    // ------- VOTE -------- //
    const {
        data: voteData,
        isLoading: voteLoading,
        write: vote,
    } = useContractWrite({
        mode: "recklesslyUnprepared",
        address: GOVERNANCE_ADDRESS,
        abi: Governance,
        functionName: "voteProposal",
        args: [Number(voteId), Number(voteType), Number(getMaxVoteWeight)],

        onError(error: any) {
            toast.error(`Failed! ${error.reason}`);
        },
    });

    const { isLoading: voteWaitLoading } = useWaitForTransaction({
        hash: voteData?.hash,
        onSuccess(data) {
            toast.success("Voted Successfully!");
            router.push("/proposals");
        },
        onError(error: any) {
            toast.error(`Failed! ${error.reason}`);
        },
    });

    const handleClick = (id: any, type: any) => {
        setVoteId(id);
        setVoteType(type);

        approve?.();
    };

    // ---------- SET VOTE WEIGHT ----------- //
    const {
        data: setMaxVoteWeightData,
        isLoading: setMaxVoteWeightLoading,
        write: setMaxVoteWeight,
    } = useContractWrite({
        mode: "recklesslyUnprepared",
        address: GOVERNANCE_ADDRESS,
        abi: Governance,
        functionName: "setMaxVoteWeight",
        args: [Number(value)],

        onError(error: any) {
            toast.error(`Failed! ${error.reason}`);
        },
    });

    const { isLoading: setMaxVoteWeightWaitLoading } = useWaitForTransaction({
        hash: setMaxVoteWeightData?.hash,
        onSuccess(data) {
            toast.success("Maximum vote weight set successfully!");
            setValue("");
        },
        onError(error: any) {
            toast.error(`Failed! ${error.reason}`);
        },
    });

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        setMaxVoteWeight?.();
    };

    const CancelledOrOutdatedProposal = () => {
        let array: Array<any> = [];
        Array.isArray(proposals) &&
            proposals.length > 0 &&
            proposals?.forEach((proposal, i) => {
                const endDateEpoch = Number(String(proposal?.endTime)) * 1000;
                if (!proposal?.cancelled && Date.now() < endDateEpoch)
                    array.push(proposal);
            });
        return array;
    };


    return (
        <PageLayout>
            <div className="mt-14 md:mt-24 h-[calc(100vh-10rem)] max-w-[95%] lg:max-w-[65%] mx-auto">
                <div className="mx-5">
                    <h1 className="text-xl font-semibold text-[#3F3F46]">VOTE FOR PROPOSAL</h1>
                    {(approveLoading ||
                        approveWaitLoading ||
                        voteLoading ||
                        voteWaitLoading) && (
                            <div className="flex items-center text-lg">
                                Voting in progress... <ScaleLoader color="#EF4444" />
                            </div>
                        )}
                </div>

                <div className="mx-3 mt-3">
                    {CancelledOrOutdatedProposal().length > 0 ? (
                        <VoteTable
                            proposals={proposals}
                            balance={balance}
                            symbol={symbol}
                            owner={owner}
                            handleClick={handleClick}
                        />
                    ) : (
                        <div className="text-lg">
                            No active proposal that you can vote. <br /> Check back later.
                        </div>
                    )}
                </div>

                {address === owner && (
                    <form
                        onSubmit={handleSubmit}
                        className="px-6 py-7 bg-[#FFFFFF] rounded-[12px] border border-[#EF4444] max-w-[90%] md:max-w-[450px] mx-auto mt-24 mb-4"
                    >
                        <div className=" font-medium">
                            <div className="text-lg">Set Vote Weight</div>
                            <div className="">
                                <input
                                    type="text"
                                    placeholder='0.00'
                                    className="text-[#70707B] bg-white w-full border border-[#B0BEC5] rounded-[12px] py-3 px-4 focus:outline-none focus:border-[#EF4444] text-base"
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Button
                                disabled={setMaxVoteWeightLoading || setMaxVoteWeightWaitLoading}
                                type="submit"
                                className="bg-[#EF4444] w-full text-white mt-12 h-10 rounded-[12px]"
                            >
                                {setMaxVoteWeightLoading || setMaxVoteWeightWaitLoading
                                    ? <ScaleLoader color="#fff" />
                                    : "Set Vote Weight"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </PageLayout>
    )
}

export default Vote