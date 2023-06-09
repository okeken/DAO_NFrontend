import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { PageLayout } from '@/layout';
import { ProposalTable } from '@/components/tables';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { DAOTOKEN_ADDRESS, GOVERNANCE_ADDRESS } from '@/config';

import Governance from "../utils/abi/Governance.json"
import DAOToken from "../utils/abi/DAOtoken.json"

import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import { ConnectionButton } from '@/components/core';
import axios from 'axios';

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

  console.log("proposals: ", proposals);


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

  const [userAmount, setUserAmount] = useState()


  const fetchUserAmount = async() => {
    try {
      const {data} = await axios.get(`http://13.53.199.120/user/${address}`);
      setUserAmount(data.amount);
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    fetchUserAmount()
  }, [])
  

  return (
    <PageLayout>
      <div className="my-14 md:mt-24 h-[calc(100vh-10rem)] max-w-[95%] lg:max-w-[75%] xl:max-w-[65%] mx-auto">

        <div className="bg-[#FCE7F3] rounded-[12px] p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center sm:place-items-start gap-12 mb-12">

          <div className="col-span-1">
            <h1 className="text-[#18181B] font-medium text-xl">Your target</h1>
            <div className="text-[#70707B] font-semibold text-4xl mt-2">$1000</div>
          </div>
          <div className="col-span-1">
            <h1 className="text-[#18181B] font-medium text-xl">Tracked</h1>
            <div className="text-[#70707B] font-semibold text-4xl mt-2">{!address ? <ConnectionButton /> : userAmount && `$${userAmount}`}</div>
          </div>
          <div className="col-span-1">
            <h1 className="text-[#18181B] font-medium text-xl">Remaining</h1>
            <div className="text-[#70707B] font-semibold text-4xl mt-2">{!address ? <ConnectionButton /> : userAmount && `$${1000 - userAmount}`}</div>
          </div>
        </div>

        <h1 className="mx-3 text-xl font-semibold mb-3 text-[#3F3F46]">PROPOSAL{proposals && Object.keys(proposals).length > 1 ? "S" : ""}</h1>
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