import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "./Button";
import { WalletIcon } from "@/icons";

const ConnectionButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    className="bg-[#EF4444] px-[14px] py-[6px] text-[#FFFFFF] font-normal !rounded-[12px] border text-sm"
                    onClick={openConnectModal}
                    type="button"
                  >
                    <WalletIcon /> <span className="ml-1">Connect Wallet</span>
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    className="border border-[#EF4444] bg-[#F5FFFC] px-[12px] py-[6px] rounded-[12px]"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <Button
                    onClick={openAccountModal}
                    type="button"
                    className="border border-[#EF4444] flex items-center !rounded-[12px] py-[6px] px-[14px] bg-[#F9F9F9]"
                  >
                    <div className="hidden md:block text-[#70707B] text-xs bg-[#F9F9FA] rounded-[40px] mr-1">
                      {account.displayBalance ? account.displayBalance : ""}{" "} | {" "}
                    </div>

                    <div className="">{account.displayName}</div>
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export { ConnectionButton as default };