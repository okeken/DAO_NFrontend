import React, { SyntheticEvent, useState } from "react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { toast } from "react-toastify";
import { GOVERNANCE_ADDRESS } from "../config";
import { useRouter } from "next/router";

import { CircularProgress, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Governance from "../utils/abi/Governance.json"
import { PageLayout } from "@/layout";
import { Button } from "@/components/core";
import { ClipLoader } from "react-spinners";

const CreateProposal = () => {
  const router = useRouter();

  const [proposalName, setProposalName] = useState("");
  const [proposalEndTime, setProposalEndTime] = useState("");

  const {
    data: createProposalData,
    isLoading: createProposalLoading,
    write: createNewProposal,
  } = useContractWrite({
    address: GOVERNANCE_ADDRESS,
    abi: Governance,
    functionName: "createProposal",
    args: [proposalName, proposalEndTime],

    onError(error: any) {
      toast.error(`Failed! ${error.reason}`);
    },
  });

  const { isLoading: createProposalWaitLoading } = useWaitForTransaction({
    hash: createProposalData?.hash,
    onSuccess(data) {
      toast.success("New Proposal created Successfully!");
      setProposalName("");
      setProposalEndTime("");
      router.push("/proposals");
    },
    onError(error: any) {
      toast.error(`Failed! ${error.reason}`);
    },
  });

  const handleSubmitProposal = (e: SyntheticEvent) => {
    e.preventDefault();

    createNewProposal?.();
  };

  return (
    <PageLayout>
      <div className="my-16 md:my-24 min-h-[calc(100vh-12.6rem)] w-[90%] md:max-w-[500px] text-[#3F3F46] mx-auto">
        <div className="border border-[#EF4444] px-6 py-12 rounded-[8px] bg-white">
          <h2 className="uppercase text-xl font-semibold mb-4 text-[#18181B]">Create Proposal</h2>

          <form onSubmit={handleSubmitProposal} className="">

            <div className="">
              <div className="text-[#3F3F46] mb-0.5">Title</div>
              <input
                className="text-[#70707B] bg-white w-full border border-[#B0BEC5] rounded-[12px] py-3 px-4 focus:outline-none focus:border-[#EF4444] text-base"
                placeholder="Title"
                type="text"
                name="title"
                onChange={(e) => setProposalName(e.target.value)}
              />
            </div>

            <div className="mt-4">
              <div className="text-[#3F3F46] mb-0.5">Deadline</div>
              <div className="flex">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  {/* <DateTimePicker
                    className="w-full flex-1 bg-transparent font-outfit text-sm text-[#8C93A3]"
                    value={proposalEndTime}
                    onChange={(e: any) => setProposalEndTime(e)}
                    disablePast
                    renderInput={(params: any) => <TextField {...params} />}
                  /> */}
                  {/* <TextField
                    className="w-[full] flex-1 bg-transparent font-outfit text-sm text-[#8C93A3]"
                    value={proposalEndTime}
                    onChange={(e: any) => setProposalEndTime(e)}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <DateTimePicker
                          value={proposalEndTime}
                          className="min-w-[450px] bg-transparent font-outfit text-sm text-[#8C93A3]"
                          onChange={(e: any) => setProposalEndTime(e)}
                          disablePast
                        />
                      ),
                    }}
                  /> */}

                  <DateTimePicker
                    value={proposalEndTime}
                    className="w-full bg-transparent font-outfit text-sm text-[#70707B] bg-white border border-[#B0BEC5] rounded-[12px] py-3 px-4 focus:outline-none focus:border-[#EF4444] "
                    onChange={(e: any) => setProposalEndTime(e)}
                    disablePast
                  />
                </LocalizationProvider>
              </div>
            </div>
            <Button
              type="submit"
              disabled={
                createProposalWaitLoading || createProposalLoading || !proposalName || !proposalEndTime
              }
              className="bg-[#EF4444] text-white text-sm font-medium w-full h-11 rounded-[8px] mt-8"
            >
              {createProposalWaitLoading || createProposalLoading
                ? <ClipLoader size={28} color="#fff" />
                : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}

export default CreateProposal