import { Button } from '@/components/core';
import { PageLayout } from '@/layout';
import Certificate_Abi from '@/utils/abi/Certificate.json'
import { CERTIFICATE_ADDRESS } from '@/config';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { toast } from 'react-toastify';
import { ScaleLoader } from 'react-spinners';

export default function Certificate() {
  const { address } = useAccount();

  const { data: whitelisted } = useContractRead({
    address: CERTIFICATE_ADDRESS,
    abi: Certificate_Abi,
    functionName: "isWhitelisted",
    args: [address],
  });

  const {
    data: mintCertificateData,
    isLoading: mintCertificateLoading,
    write: mintCertificate,
  } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: CERTIFICATE_ADDRESS,
    abi: Certificate_Abi,
    functionName: "mintCertificate",
    onError(error: any) {
      toast.error(`Failed! ${error.reason}`);
    },
  });
  const { isLoading: mintCertificateWaitLoading } = useWaitForTransaction({
    hash: mintCertificateData?.hash,
    onSuccess(data) {
      toast.success(`Certificate minted successfully!`);
    },
    onError(error: any) {
      toast.error(`Failed! ${error.reason}`);
    },
  });

  const handleMintCertificate = () => {
    if (!whitelisted) {
      toast.info("You are not eligible!");
      return;
    }

    mintCertificate?.();
  }

  return (
    <PageLayout>
      <div className="flex justify-center items-center h-[calc(100vh-6.6rem)]">

        <div className="border border-[#EF4444] text-[#3F3F46] max-w-[95%] md:max-w-[500px] mx-auto px-6 py-9 rounded-[8px]">
          <h1 className="text-center text-xl font-semibold">Mint Certificate</h1>

          <div className="my-7 px-10 text-center text-sm">
            <p className="mb-2">
              Mint your NFT certificate, which is a prove of attendance.
            </p>
            <p className="">
              Eligibility of minting NFT certificate is complete payment of your fee.
            </p>
          </div>

          <Button
            onClick={handleMintCertificate}
            className={"bg-[#EF4444] text-white text-sm font-medium w-full h-11 rounded-[8px]"}
            type="button">
            {mintCertificateLoading || mintCertificateWaitLoading
              ? <ScaleLoader color='white' />
              : "Mint Certificate"}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}