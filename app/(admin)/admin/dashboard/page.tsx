import { AdminShell } from "@/components/admin/lp/AdminShell";
import { getLandingContent } from "@/services/cms/landing";

export default async function AdminDashboardPage() {
  const content = await getLandingContent();

  return <AdminShell initialContent={content} />;
}

