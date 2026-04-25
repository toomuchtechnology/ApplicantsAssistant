// App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/ui/header";
import { InfoSection } from "./components/ui/info";
import { Chat } from "./components/ui/chat/chat";
import RAGChat from "./components/ui/rag-chat/RAGChat";
import { ChatsPage } from "./components/ui/rag-chat/ChatsPage";
import { ProfilePage } from "./components/ui/profile/profile";
import { NotFound } from "./components/ui/NotFound";
import { ErrorPage } from "./components/ui/ErrorPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/chats" replace />} />
          <Route path="/info" element={<InfoSection />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/rag-chat/:sessionId" element={<RAGChat />} />
          <Route path="/rag-chat" element={<RAGChat />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
