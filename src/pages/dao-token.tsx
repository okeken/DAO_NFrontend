import { Button } from '@/components/core';
import { PageLayout } from '@/layout';
import DAOtoken_Abi from '@/utils/abi/DAOtoken.json'
import { DAOTOKEN_ADDRESS } from '@/config';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { toast } from 'react-toastify';
import { ScaleLoader } from 'react-spinners';

export default function MintTokens() {
  const { address } = useAccount();

  const { data: whitelisted } = useContractRead({
    address: DAOTOKEN_ADDRESS,
    abi: DAOtoken_Abi,
    functionName: "isWhitelisted",
    args: [address],
  });

  const {
    data: mintTokenData,
    isLoading: mintTokenLoading,
    write: mintToken,
  } = useContractWrite({
    address: DAOTOKEN_ADDRESS,
    abi: DAOtoken_Abi,
    functionName: "mint",
    onError(error: any) {
      toast.error(`Failed! ${error.reason}`);
    },
  });

  const { isLoading: mintTokenWaitLoading } = useWaitForTransaction({
    hash: mintTokenData?.hash,
    onSuccess(data) {
      toast.success(`Certificate minted successfully!`);
    },
    onError(error: any) {
      toast.error(`Failed! ${error.reason}`);
    },
  });

  const handleMintToken = () => {
    if (!whitelisted) {
      toast.info("You are not eligible!");
      return;
    }
    mintToken?.();
  }

  return (
    <PageLayout>
      <div className="flex justify-center items-center h-[calc(100vh-6.6rem)]">
        <div className="border border-[#EF4444] text-[#3F3F46] w-[90%] md:max-w-[500px] mx-auto px-6 py-9 rounded-[8px]">
          <h1 className="text-center text-xl font-semibold">Mint DAO Token</h1>

          <div className="my-7 px-10 text-center text-sm">
            <p className="mb-2">The DAO Token is very limited
              and is only used for on-chain voting.
            </p>
            <p className="">
              The DAO Token can only be
              minted once per season.
            </p>

          </div>

          <Button
            onClick={handleMintToken}
            className={"bg-[#EF4444] text-white text-sm font-medium w-full h-11 rounded-[8px]"}
            type="button">
              {mintTokenLoading || mintTokenWaitLoading
              ? <ScaleLoader color='white' />
              : "Mint Token"}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}