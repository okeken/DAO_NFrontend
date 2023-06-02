import { useState } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import { Button, ConnectionButton } from '@/components/core';
import { Footer, Navbar } from '@/components/navigation';
import { PageLayout } from '@/layout';
import { ProposalTable } from '@/components/tables';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { DAOTOKEN_ADDRESS, GOVERNANCE_ADDRESS } from '@/config';
// import { BigNumberish } from "ethers"
import { BigNumber } from "bignumber.js";

import Governance from "../utils/abi/Governance.json"
import DAOToken from "../utils/abi/DAOtoken.json"

import { toast } from "react-toastify";
import { useRouter } from 'next/router';

export default function Certificate() {
  const { address } = useAccount();
  const router = useRouter();
  const [proposalId, setProposalId] = useState(null);

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

  const balance = balanceOf && ethers.utils.formatUnits(balanceOf as any, 'ether');

  const { data: proposals } = useContractRead({
    address: GOVERNANCE_ADDRESS,
    abi: Governance,
    functionName: "getProposals",
    onSuccess(data) { },
  });
  const { data: owner } = useContractRead({
    address: GOVERNANCE_ADDRESS,
    abi: Governance,
    functionName: "owner",
  });

  const {
    data: cancelProposalData,
    isLoading: cancelProposalLoading,
    write: cancelProposal,
  } = useContractWrite({
    address: GOVERNANCE_ADDRESS,
    abi: Governance,
    functionName: "cancelProposal",
    args: [Number(proposalId)],

    onError(error: any) {
      toast.error(`Failed! ${error?.reason}`);
    },
  });

  const { isLoading: cancelProposalWaitLoading } = useWaitForTransaction({
    hash: cancelProposalData?.hash,
    onSuccess(data: any) {
      toast.success("Maximum vote weight set successfully!");
      setProposalId(null);
      router.push("/dashboard");
    },
    onError(error: any) {
      toast.error(`Failed! ${error?.reason}`);
    },
  });

  const handleCancel = (index: any) => {
    setProposalId(index);

    setTimeout(() => {
      cancelProposal?.();
    }, 1000);
  }

  return (
    <PageLayout>
      <div className="my-14 md:mt-24 h-[calc(100vh-10rem)] max-w-[95%] lg:max-w-[75%] xl:max-w-[65%] mx-auto">
        <h1 className="mx-3 text-xl font-semibold mb-3 text-[#3F3F46]">PROPOSAL{proposals &&  Object.keys(proposals).length > 1 ? "S" : ""}</h1>
        <ProposalTable
          proposals={proposals}
          balance={balance}
          symbol={symbol}
          owner={owner}
          handleCancel={handleCancel}
          cancelLoading={cancelProposalLoading || cancelProposalWaitLoading}
        />
      </div>
    </PageLayout>
  );
}