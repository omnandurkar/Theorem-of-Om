import { CuratorPuzzleGate } from "@/components/CuratorPuzzleGate";
import { OmEditorShell } from "@/components/OmEditorShell";
import { useSanctumLock } from "@/lib/useSanctumLock";
import { useLocation } from "wouter";

export default function OmEditorPage() {
  const { unlocked, unlock, lock } = useSanctumLock();
  const [, setLocation] = useLocation();

  if (!unlocked) {
    return <CuratorPuzzleGate onUnlocked={unlock} />;
  }

  return <OmEditorShell onBack={() => setLocation("/om-dashboard")} onLock={lock} />;
}

