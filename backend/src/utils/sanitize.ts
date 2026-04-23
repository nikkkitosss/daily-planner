export type SafeUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export const toSafeUser = (user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}): SafeUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});
