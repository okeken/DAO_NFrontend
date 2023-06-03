import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

const config = {
  public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY as string,
  tx_ref: String(Date.now()),
  currency: "USD",
  payment_options: "card,mobilemoney,ussd",
  customizations: {
    title: `Web3Bridge DAO`,
    description: `Web3Bridge DAO`,
    logo: "https://www.web3bridge.com/web3bridge-logo.png",
    // logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
  },
};

const usePayment = (cardConfig: { amount: number; customer: { email: string; phone_number: string; name: string; }; }) => {
  const userCardConfig = { ...config, ...cardConfig };

  const handlePayment = useFlutterwave(userCardConfig);

  return { card: handlePayment, cardClose: closePaymentModal };
};

export default usePayment;