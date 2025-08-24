import EventDetail from "@/components/EventDetail";

type PageProps = {
  params: {
    contractAddress: string;
  };
};

export default async function EventDetailPage({ params }: PageProps) {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <EventDetail contractAddress={params.contractAddress} />
    </main>
  );
}