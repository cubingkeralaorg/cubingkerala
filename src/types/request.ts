export interface Request {
  wcaid: string;
  name: string;
  avatarUrl: string;
  country: string | null;
  gender: string | null;
  role: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type RoleType = "member" | "organiser" | "co-founder";
