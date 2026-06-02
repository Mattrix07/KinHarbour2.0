import { ResourceLibrary } from "@/components/resources/resource-library";
import { getPublishedResourcesWithFallback } from "@/lib/admin/resource-admin-actions";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const { articles, isFallback } = await getPublishedResourcesWithFallback();

  return <ResourceLibrary articles={articles} isFallback={isFallback} />;
}
