import { ProviderDirectory } from "@/components/providers/provider-directory";
import { getPublishedProvidersWithFallback } from "@/lib/admin/provider-admin-actions";
import { getShortlistContext } from "@/lib/providers/provider-actions";

export const dynamic = "force-dynamic";

export default async function ProvidersPage() {
  const [shortlistContext, providerContent] = await Promise.all([
    getShortlistContext(),
    getPublishedProvidersWithFallback(),
  ]);

  return (
    <ProviderDirectory
      providerList={providerContent.providers}
      isFallback={providerContent.isFallback}
      shortlistMode={shortlistContext.mode}
      shortlistedProviderIds={shortlistContext.shortlistedProviders.map((item) => item.provider_id)}
      shortlistMessage={shortlistContext.message}
    />
  );
}
