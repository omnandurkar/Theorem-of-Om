/**
 * Style reminder — Field Notes of the Necropolis: route changes should feel like a folio being placed on an evidence table.
 * Maintain a quiet universal masthead, a restrained dust texture, and one composed animated page transition at a time.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SiteHeader } from "@/components/SiteChrome";
import About from "@/pages/About";
import Archive from "@/pages/Archive";
import ArchiveRoom from "@/pages/ArchiveRoom";
import Article from "@/pages/Article";
import Home from "@/pages/Home";
import Investigations from "@/pages/Investigations";
import Journal from "@/pages/Journal";
import JournalEntry from "@/pages/JournalEntry";
import CaseIndex from "@/pages/CaseIndex";
import CaseFileTemplate from "@/pages/CaseFileTemplate";
import AdminDashboard from "@/pages/AdminDashboard";
import SubmitTheory from "@/pages/SubmitTheory";
import InvestigationMapPage from "@/pages/InvestigationMapPage";
import EditorReaderPreview from "@/pages/EditorReaderPreview";
import OmGuide from "@/pages/OmGuide";
import FieldFolio from "@/pages/FieldFolio";
import { InkCursor } from "@/components/InkCursor";
import { ArchiveLoader } from "@/components/ArchiveLoader";
import NotFound from "@/pages/NotFound";
function Router() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location} className="route-stage" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/archive" component={Archive} />
          <Route path="/investigations" component={Investigations} />
          <Route path="/journal" component={Journal} />
          <Route path="/index" component={CaseIndex} />
          <Route path="/case-file-template" component={CaseFileTemplate} />
          <Route path="/journal/:slug" component={JournalEntry} />
          <Route path="/om-dashboard" component={AdminDashboard} />
          <Route path="/submit-theory" component={SubmitTheory} />
          <Route path="/map" component={InvestigationMapPage} />
          <Route path="/om-preview" component={EditorReaderPreview} />
          <Route path="/om-guide" component={OmGuide} />
          <Route path="/field-folio" component={FieldFolio} />
          <Route path="/article/:slug" component={Article} />
          <Route path="/about" component={About} />
          <Route path="/archive-room" component={ArchiveRoom} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <div className="app-shell"><div className="paper-noise" /><SiteHeader /><Router /></div>
          <Toaster />
          <InkCursor />
          <ArchiveLoader />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
