export enum UserRole {
  USER = "ROLE_USER",
  ADMIN = "ROLE_ADMIN",
}

export type Profile = {
  id: string;
  email: string;
  roles: UserRole[];
};

export type Photo = {
  id: string;
  name: string;
};

export type Actress = {
  id: string;
  name: string;
  photo: Photo | null;
};

export type Video = {
  id: string;
  title: string;
  actress: Actress;
  photo: Photo | null;
  videoUrl: string;
  videoType: string;
  website: string;
  description: string | null;
};

export type Category = {
  id: string;
  name: string;
};

export type CollectionResponse<T = unknown> = {
  "@context": string;
  "@id": string;
  "@type": string;
  member: T[];
  totalItems: number;
};

export type ActressName = Pick<Actress, "id" | "name">;
