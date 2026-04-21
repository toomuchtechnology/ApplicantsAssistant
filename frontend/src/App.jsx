import { Header } from "./components/ui/header";
import { InfoSection } from "./components/ui/info";
import { Chat } from "./components/ui/chat/chat";
import RAGChat from "./components/ui/rag-chat/RAGChat";
import { ProfilePage } from "./components/ui/profile/profile";
import { useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("chat");

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return <InfoSection />;
      case "chat":
        return <RAGChat />;
      case "profile":
        return <ProfilePage />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default App;
