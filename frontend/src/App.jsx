// App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/header";
import { InfoSection } from "./components/info";
import RAGChat from "./components/rag-chat/RAGChat";
import { ChatsPage } from "./components/rag-chat/ChatsPage";
import { ProfilePage } from "./components/profile/profile";
import { NotFound } from "./components/NotFound";
import { ErrorPage } from "./components/ErrorPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/chats" replace />} />
          <Route path="/info" element={<InfoSection />} />
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
