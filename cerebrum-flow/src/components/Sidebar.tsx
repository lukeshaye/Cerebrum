// src/components/Sidebar.tsx

export const Sidebar = () => {
  return (
    <aside className="absolute top-0 right-0 z-10 m-4 w-72">
      <div className="bg-white border-2 border-zinc-900 shadow-lg rounded-md p-4">
        <h3 className="font-medium text-lg text-zinc-900">Configurações</h3>
        <p className="text-sm text-zinc-600">Selecione um nó para editar.</p>
      </div>
    </aside>
  );
};