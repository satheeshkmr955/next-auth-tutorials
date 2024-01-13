import { getServerSession } from "next-auth";

import { authConfigOptions } from "@/lib/auth";
import { AuthProvider } from "@/components/providers/auth-provider";

type RootLayoutProps = {
  children: React.ReactNode;
};

const getSession = async () => {
  return await getServerSession(authConfigOptions);
};

const RootLayout = async (props: RootLayoutProps) => {
  const { children } = props;

  const session = await getSession();

  return <AuthProvider session={session}>{children}</AuthProvider>;
};

export default RootLayout;
