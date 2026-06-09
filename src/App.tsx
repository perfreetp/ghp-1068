import { useGameStore } from './store/useGameStore';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { EventModal } from './components/EventModal';
import { ReportModal } from './components/ReportModal';
import HallMap from './pages/HallMap';
import Warehouse from './pages/Warehouse';
import Visitors from './pages/Visitors';
import Research from './pages/Research';
import Auction from './pages/Auction';
import Planning from './pages/Planning';
import Settlement from './pages/Settlement';

export default function App() {
  const currentModule = useGameStore(s => s.currentModule);

  const renderModule = () => {
    switch (currentModule) {
      case 'hall':
        return <HallMap />;
      case 'warehouse':
        return <Warehouse />;
      case 'visitors':
        return <Visitors />;
      case 'research':
        return <Research />;
      case 'auction':
        return <Auction />;
      case 'planning':
        return <Planning />;
      case 'settlement':
        return <Settlement />;
      default:
        return <HallMap />;
    }
  };

  return (
    <div className="min-h-screen museum-bg">
      <Header />
      <main className="relative z-0 pt-20 pb-8 px-6">
        <div className="animate-fade-in-up">
          {renderModule()}
        </div>
      </main>
      <Notification />
      <EventModal />
      <ReportModal />
    </div>
  );
}
