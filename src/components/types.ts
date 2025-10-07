export type DataProps = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: UserProps;
  replies?: DataProps[];
  replyingTo?: string;
};

export type Comments = {
  currentUser?: UserProps;
  comments?: DataProps[];
  comment?: DataProps
};

export type UserProps = {
  image?: {
    png: string;
    webp: string;
  };
  username: string;
};
