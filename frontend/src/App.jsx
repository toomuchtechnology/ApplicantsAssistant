// App.jsx
import { Header } from "./components/ui/header"
import { InfoSection } from './components/ui/info'
import { Chat } from './components/ui/chat/chat'
import { useState } from "react"

function App() {
  const [activeTab, setActiveTab] = useState("chat");

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return <InfoSection />;
      case "chat":
        return <Chat />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  )
}

export default App