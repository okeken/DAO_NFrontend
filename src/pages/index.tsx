import { PageLayout } from '@/layout'

const TOOLSET = [
  {
    title: "Become a Certified Smart Contract Developer",
    text: "Unlock your potential and gain valuable skills in smart contract development through our comprehensive training program.",
    subtext: "Join our program and unleash the power of smart contracts!"
  },
  {
    title: "Earn Rewards for Your Achievements",
    text: "Receive rewards and recognition for your dedication and achievements in our training program.",
    subtext: "Your hard work deserves to be rewarded!"
  },
  {
    title: "Get Certified as a Proof of Attendance",
    text: "Mint a unique certificate as proof of your participation and successful completion of our training program.",
    subtext: "Take pride in your accomplishments!"
  },
  {
    title: "Become a Governance Token Holder",
    text: "Have a say in decision-making processes, contribute your ideas, and be part of a vibrant community that drives innovation and growth.",
    subtext: "Empower yourself with voting rights!"
  },
  {
    title: "Connect and Network with Industry Leaders",
    text: "Expand your professional network, engage in discussions, and build relationships that can open doors to future opportunities and collaborations.",
    subtext: "Forge valuable connections within our community!"
  },
  {
    title: "Access Exclusive Investment Opportunities",
    text: "Discover early-stage blockchain projects, token sales, and strategic partnerships that offer potential growth and financial rewards",
    subtext: "Unlock exclusive investment opportunities within our DAO!"
  }
]

export default function Home() {
  return (
    <PageLayout>
      <div className="mt-8 max-w-[95%] mx-auto">
        <div className="!bg-[#FCE7F3] grid grid-cols-2 gap- items-center p-[30px] rounded-[5px]">
          <div className="col-span-2 lg:col-span-1 text-[#0F1D40] text-center lg:text-left">
            <h1 className="mb-[14px] font-bold text-[28px] leading-[36px] md:text-[36px] md:leading-[40px] xl:text-[44px] xl:leading-[60px]">Web3Bridge DAO: Decentralized governance</h1>
            <p className="font-normal text-sm text-center lg:text-left">
              Web3Bridge DAO is building a Decentralized Autonomous Organization, a systematic plan for financial sustainability and organizational growth as a web3 based institution!
            </p>
          </div>

          <div className="col-span-2 lg:col-span-1 flex justify-center lg:justify-start mt-7 lg:mt-0">
            <img src="/hero-img.svg" className="" alt="hero" />
          </div>
        </div>

        <div className="my-[60px] text-[#18181B]">
          <div className="max-w-[900px]">
            <h2 className="font-bold text-[22px] leading-[28px] md:text-[26px] md:leading-[32px] tracking-[-0.02em]">
              Embrace the Future of Decentralization
            </h2>
            <p className="mt-5 text-[16px] leading-[24px] tracking-[-0.02em]">
              Explore the potential of decentralized technologies and join the forefront of the blockchain revolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px] mt-7">
            {
              TOOLSET.map((tool, _i) => {
                return (
                  <div key={_i} className="col-span-1 bg-white px-[22px] py-6 rounded-[10px]">
                    <h3 className="mt-[80px] lg:mt-[100px] font-semibold text-sm">{tool.title}</h3>
                    <p className="mt-1.5 text-xs">{tool.text}</p>
                    <p className="mt-2 italic text-xs text-[#70707B]">{tool.subtext}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
