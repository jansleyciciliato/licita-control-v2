import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { NovaLicitacao } from "@/pages/NovaLicitacao";
import { DetalheLicitacao } from "@/pages/DetalheLicitacao";
import { useLicitacoes } from "@/hooks/useLicitacoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const {
    licitacoes,
    createLicitacao,
    updateLicitacao,
    deleteLicitacao,
  } = useLicitacoes();

  // Função auxiliar para manter compatibilidade se Dashboard precisar
  const addLicitacao = async (licitacao: any) => {
    await createLicitacao(licitacao);
  };

  // Função auxiliar para atualizar status
  const updateStatus = async (id: string, status: string) => {
    await updateLicitacao(id, { status });
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard licitacoes={licitacoes} />} />
        <Route path="/nova" element={<NovaLicitacao onAdd={addLicitacao} />} />
        <Route
          path="/licitacao/:id"
          element={<DetalheLicitacao />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
