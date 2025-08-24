import CreateEventForm from "@/components/CreateEventForm";

export default function CreateEventPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Evento</h1>
          <p className="text-gray-500">
            Completa los detalles para lanzar tu colección de boletos NFT.
          </p>
        </div>
        <CreateEventForm />
      </div>
    </main>
  );
}