import { ThirdwebContract } from "thirdweb";

export interface Campaign {
  owner: string;
  title: string;
  description: string;
  target: bigint;
  deadline: bigint;
  amountCollected: bigint;
  image: string;
  donators: string[];
  donations: bigint[];
}

export type CrowdfundingContract = ThirdwebContract & {
  read: {
    getCampaigns: () => Promise<Campaign[]>;
  };
}; 
