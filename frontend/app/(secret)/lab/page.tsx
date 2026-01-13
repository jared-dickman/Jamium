'use client';

import { useEffect, useState } from 'react';
import { apiRoutes } from '@/app/config/apiRoutes';
import { env } from '@/app/config/env';
import {
  // Original
  PulseLoader,
  SineLoader,
  FrequencyLoader,
  ResonanceLoader,
  HarmonicLoader,
  OscillateLoader,
  OrbitLoader,
  RippleLoader,
  HelixLoader,
  HelixDoubleLoader,
  MorphLoader,
  VinylLoader,
  PendulumLoader,
  AtomLoader,
  PrismLoader,
  CircuitLoader,
  FractalLoader,
  PlasmaLoader,
  // Celestial
  GalaxyLoader,
  CometLoader,
  EclipseLoader,
  NebulaLoader,
  SupernovaLoader,
  BlackHoleLoader,
  AuroraLoader,
  // Nature
  LeafLoader,
  WaveLoader,
  FlameLoader,
  TornadoLoader,
  LightningLoader,
  RainLoader,
  BloomLoader,
  // Geometric
  HexagonLoader,
  TesseractLoader,
  SpiralLoader,
  MandalaLoader,
  LatticeLoader,
  VortexLoader,
  KaleidoscopeLoader,
  // Mechanical
  GearLoader,
  PistonLoader,
  ClockworkLoader,
  TurbineLoader,
  PulleyLoader,
  CrankLoader,
  FlywheelLoader,
  // Digital
  BinaryLoader,
  GlitchLoader,
  PixelLoader,
  MatrixLoader,
  SignalLoader,
  PacketLoader,
  BitstreamLoader,
  // Chemistry
  MoleculeLoader,
  ReactionLoader,
  CatalystLoader,
  BondLoader,
  CrystalLoader,
  ElectronLoader,
  IonLoader,
  // Physics
  GravityLoader,
  QuantumLoader,
  PhotonLoader,
  MagnetLoader,
  TeslaLoader,
  DopplerLoader,
  EntropyLoader,
  // Audio
  WaveformLoader,
  EqualizerLoader,
  DecibelLoader,
  TempoLoader,
  ReverbLoader,
  ChorusLoader,
  StereoLoader,
  // Biological
  CellLoader,
  DNALoader,
  VirusLoader,
  NeuronLoader,
  HeartbeatLoader,
  MitosisLoader,
  SynapseLoader,
  // Abstract
  FlowLoader,
  DriftLoader,
  ScatterLoader,
  ConvergeLoader,
  BreatheLoader,
  ShimmerLoader,
  WarpLoader,
  // Retro
  CassetteLoader,
  DialLoader,
  RadarLoader,
  OscilloscopeLoader,
  NixieLoader,
  TerminalLoader,
  ScanlineLoader,
  // Gaming
  PacmanLoader,
  TetrisLoader,
  PongLoader,
  CoinLoader,
  HealthBarLoader,
  // Arcade
  GalagaLoader,
  BreakoutLoader,
  // Nostalgia
  HourglassLoader,
  DialupLoader,
  FloppyLoader,
  ScreensaverLoader,
  // Cosmos
  RocketLoader,
  SatelliteLoader,
  UFOLoader,
  AstronautLoader,
  // Sky
  RainbowLoader,
  SunriseLoader,
  MoonriseLoader,
  TwilightLoader,
  CloudDriftLoader,
  HorizonLoader,
  StarfieldLoader,
} from '@/components/ui/loaders';
// eslint-disable-next-line no-restricted-imports -- package.json read for version display
import packageJson from '../../../package.json';

interface LabStatus {
  message: string;
  status: string;
  environment: string;
  backend: string;
  secret: string;
}

function formatBuildTime(iso?: string): string {
  if (!iso) return 'dev';
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function LabPage() {
  const [labStatus, setLabStatus] = useState<LabStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(apiRoutes.lab)
      .then(res => res.json())
      .then(setLabStatus)
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="mb-2 text-center text-3xl font-bold text-white">Loader Thunderdome</h1>
      <p className="mb-4 text-center text-sapphire-400">126 Champions • Pick your fighter</p>

      {/* Original */}
      <CategorySection title="Original" emoji="🎵" defaultOpen>
        <LoaderCard name="PULSE">
          <PulseLoader size="md" />
        </LoaderCard>
        <LoaderCard name="SINE">
          <SineLoader size="md" />
        </LoaderCard>
        <LoaderCard name="FREQUENCY">
          <FrequencyLoader size="md" />
        </LoaderCard>
        <LoaderCard name="RESONANCE">
          <ResonanceLoader size="md" />
        </LoaderCard>
        <LoaderCard name="HARMONIC">
          <HarmonicLoader size="md" />
        </LoaderCard>
        <LoaderCard name="OSCILLATE">
          <OscillateLoader size="md" />
        </LoaderCard>
        <LoaderCard name="HELIX DOUBLE">
          <HelixDoubleLoader size="md" />
        </LoaderCard>
        <LoaderCard name="ORBIT">
          <OrbitLoader size="md" />
        </LoaderCard>
        <LoaderCard name="RIPPLE">
          <RippleLoader size="md" />
        </LoaderCard>
        <LoaderCard name="HELIX">
          <HelixLoader size="md" />
        </LoaderCard>
        <LoaderCard name="MORPH">
          <MorphLoader size="md" />
        </LoaderCard>
        <LoaderCard name="VINYL">
          <VinylLoader size="md" />
        </LoaderCard>
        <LoaderCard name="PENDULUM">
          <PendulumLoader size="md" />
        </LoaderCard>
        <LoaderCard name="ATOM">
          <AtomLoader size="md" />
        </LoaderCard>
        <LoaderCard name="PRISM">
          <PrismLoader size="md" />
        </LoaderCard>
        <LoaderCard name="CIRCUIT">
          <CircuitLoader size="md" />
        </LoaderCard>
        <LoaderCard name="FRACTAL">
          <FractalLoader size="md" />
        </LoaderCard>
        <LoaderCard name="PLASMA">
          <PlasmaLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Celestial */}
      <CategorySection title="Celestial" emoji="🌌">
        <LoaderCard name="GALAXY">
          <GalaxyLoader size="md" />
        </LoaderCard>
        <LoaderCard name="COMET">
          <CometLoader size="md" />
        </LoaderCard>
        <LoaderCard name="ECLIPSE">
          <EclipseLoader size="md" />
        </LoaderCard>
        <LoaderCard name="NEBULA">
          <NebulaLoader size="md" />
        </LoaderCard>
        <LoaderCard name="SUPERNOVA">
          <SupernovaLoader size="md" />
        </LoaderCard>
        <LoaderCard name="BLACKHOLE">
          <BlackHoleLoader size="md" />
        </LoaderCard>
        <LoaderCard name="AURORA">
          <AuroraLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Nature */}
      <CategorySection title="Nature" emoji="🌿">
        <LoaderCard name="LEAF">
          <LeafLoader size="md" />
        </LoaderCard>
        <LoaderCard name="WAVE">
          <WaveLoader size="md" />
        </LoaderCard>
        <LoaderCard name="FLAME">
          <FlameLoader size="md" />
        </LoaderCard>
        <LoaderCard name="TORNADO">
          <TornadoLoader size="md" />
        </LoaderCard>
        <LoaderCard name="LIGHTNING">
          <LightningLoader size="md" />
        </LoaderCard>
        <LoaderCard name="RAIN">
          <RainLoader size="md" />
        </LoaderCard>
        <LoaderCard name="BLOOM">
          <BloomLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Geometric */}
      <CategorySection title="Geometric" emoji="⬡">
        <LoaderCard name="HEXAGON">
          <HexagonLoader size="md" />
        </LoaderCard>
        <LoaderCard name="TESSERACT">
          <TesseractLoader size="md" />
        </LoaderCard>
        <LoaderCard name="SPIRAL">
          <SpiralLoader size="md" />
        </LoaderCard>
        <LoaderCard name="MANDALA">
          <MandalaLoader size="md" />
        </LoaderCard>
        <LoaderCard name="LATTICE">
          <LatticeLoader size="md" />
        </LoaderCard>
        <LoaderCard name="VORTEX">
          <VortexLoader size="md" />
        </LoaderCard>
        <LoaderCard name="KALEIDOSCOPE">
          <KaleidoscopeLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Mechanical */}
      <CategorySection title="Mechanical" emoji="⚙️">
        <LoaderCard name="GEAR">
          <GearLoader size="md" />
        </LoaderCard>
        <LoaderCard name="PISTON">
          <PistonLoader size="md" />
        </LoaderCard>
        <LoaderCard name="CLOCKWORK">
          <ClockworkLoader size="md" />
        </LoaderCard>
        <LoaderCard name="TURBINE">
          <TurbineLoader size="md" />
        </LoaderCard>
        <LoaderCard name="PULLEY">
          <PulleyLoader size="md" />
        </LoaderCard>
        <LoaderCard name="CRANK">
          <CrankLoader size="md" />
        </LoaderCard>
        <LoaderCard name="FLYWHEEL">
          <FlywheelLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Digital */}
      <CategorySection title="Digital" emoji="💾">
        <LoaderCard name="BINARY">
          <BinaryLoader size="md" />
        </LoaderCard>
        <LoaderCard name="GLITCH">
          <GlitchLoader size="md" />
        </LoaderCard>
        <LoaderCard name="PIXEL">
          <PixelLoader size="md" />
        </LoaderCard>
        <LoaderCard name="MATRIX">
          <MatrixLoader size="md" />
        </LoaderCard>
        <LoaderCard name="SIGNAL">
          <SignalLoader size="md" />
        </LoaderCard>
        <LoaderCard name="PACKET">
          <PacketLoader size="md" />
        </LoaderCard>
        <LoaderCard name="BITSTREAM">
          <BitstreamLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Chemistry */}
      <CategorySection title="Chemistry" emoji="⚗️">
        <LoaderCard name="MOLECULE">
          <MoleculeLoader size="md" />
        </LoaderCard>
        <LoaderCard name="REACTION">
          <ReactionLoader size="md" />
        </LoaderCard>
        <LoaderCard name="CATALYST">
          <CatalystLoader size="md" />
        </LoaderCard>
        <LoaderCard name="BOND">
          <BondLoader size="md" />
        </LoaderCard>
        <LoaderCard name="CRYSTAL">
          <CrystalLoader size="md" />
        </LoaderCard>
        <LoaderCard name="ELECTRON">
          <ElectronLoader size="md" />
        </LoaderCard>
        <LoaderCard name="ION">
          <IonLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Physics */}
      <CategorySection title="Physics" emoji="⚛️">
        <LoaderCard name="GRAVITY">
          <GravityLoader size="md" />
        </LoaderCard>
        <LoaderCard name="QUANTUM">
          <QuantumLoader size="md" />
        </LoaderCard>
        <LoaderCard name="PHOTON">
          <PhotonLoader size="md" />
        </LoaderCard>
        <LoaderCard name="MAGNET">
          <MagnetLoader size="md" />
        </LoaderCard>
        <LoaderCard name="TESLA">
          <TeslaLoader size="md" />
        </LoaderCard>
        <LoaderCard name="DOPPLER">
          <DopplerLoader size="md" />
        </LoaderCard>
        <LoaderCard name="ENTROPY">
          <EntropyLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Audio */}
      <CategorySection title="Audio" emoji="🎧">
        <LoaderCard name="WAVEFORM">
          <WaveformLoader size="md" />
        </LoaderCard>
        <LoaderCard name="EQUALIZER">
          <EqualizerLoader size="md" />
        </LoaderCard>
        <LoaderCard name="DECIBEL">
          <DecibelLoader size="md" />
        </LoaderCard>
        <LoaderCard name="TEMPO">
          <TempoLoader size="md" />
        </LoaderCard>
        <LoaderCard name="REVERB">
          <ReverbLoader size="md" />
        </LoaderCard>
        <LoaderCard name="CHORUS">
          <ChorusLoader size="md" />
        </LoaderCard>
        <LoaderCard name="STEREO">
          <StereoLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Biological */}
      <CategorySection title="Biological" emoji="🧬">
        <LoaderCard name="CELL">
          <CellLoader size="md" />
        </LoaderCard>
        <LoaderCard name="DNA">
          <DNALoader size="md" />
        </LoaderCard>
        <LoaderCard name="VIRUS">
          <VirusLoader size="md" />
        </LoaderCard>
        <LoaderCard name="NEURON">
          <NeuronLoader size="md" />
        </LoaderCard>
        <LoaderCard name="HEARTBEAT">
          <HeartbeatLoader size="md" />
        </LoaderCard>
        <LoaderCard name="MITOSIS">
          <MitosisLoader size="md" />
        </LoaderCard>
        <LoaderCard name="SYNAPSE">
          <SynapseLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Abstract */}
      <CategorySection title="Abstract" emoji="✨">
        <LoaderCard name="FLOW">
          <FlowLoader size="md" />
        </LoaderCard>
        <LoaderCard name="DRIFT">
          <DriftLoader size="md" />
        </LoaderCard>
        <LoaderCard name="SCATTER">
          <ScatterLoader size="md" />
        </LoaderCard>
        <LoaderCard name="CONVERGE">
          <ConvergeLoader size="md" />
        </LoaderCard>
        <LoaderCard name="BREATHE">
          <BreatheLoader size="md" />
        </LoaderCard>
        <LoaderCard name="SHIMMER">
          <ShimmerLoader size="md" />
        </LoaderCard>
        <LoaderCard name="WARP">
          <WarpLoader size="sm" />
        </LoaderCard>
      </CategorySection>

      {/* Retro */}
      <CategorySection title="Retro" emoji="📼">
        <LoaderCard name="CASSETTE">
          <CassetteLoader size="md" />
        </LoaderCard>
        <LoaderCard name="DIAL">
          <DialLoader size="md" />
        </LoaderCard>
        <LoaderCard name="RADAR">
          <RadarLoader size="md" />
        </LoaderCard>
        <LoaderCard name="OSCILLOSCOPE">
          <OscilloscopeLoader size="sm" />
        </LoaderCard>
        <LoaderCard name="NIXIE">
          <NixieLoader size="md" />
        </LoaderCard>
        <LoaderCard name="TERMINAL">
          <TerminalLoader size="sm" />
        </LoaderCard>
        <LoaderCard name="SCANLINE">
          <ScanlineLoader size="sm" />
        </LoaderCard>
      </CategorySection>

      {/* Gaming */}
      <CategorySection title="Gaming" emoji="🎮">
        <LoaderCard name="PACMAN">
          <PacmanLoader size="md" />
        </LoaderCard>
        <LoaderCard name="TETRIS">
          <TetrisLoader size="md" />
        </LoaderCard>
        <LoaderCard name="PONG">
          <PongLoader size="md" />
        </LoaderCard>
        <LoaderCard name="COIN">
          <CoinLoader size="md" />
        </LoaderCard>
        <LoaderCard name="HEALTH BAR">
          <HealthBarLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Arcade */}
      <CategorySection title="Arcade" emoji="👾">
        <LoaderCard name="GALAGA">
          <GalagaLoader size="md" />
        </LoaderCard>
        <LoaderCard name="BREAKOUT">
          <BreakoutLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Nostalgia */}
      <CategorySection title="Nostalgia" emoji="💾">
        <LoaderCard name="HOURGLASS">
          <HourglassLoader size="md" />
        </LoaderCard>
        <LoaderCard name="DIALUP">
          <DialupLoader size="md" />
        </LoaderCard>
        <LoaderCard name="FLOPPY">
          <FloppyLoader size="md" />
        </LoaderCard>
        <LoaderCard name="SCREENSAVER">
          <ScreensaverLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Cosmos */}
      <CategorySection title="Cosmos" emoji="🚀">
        <LoaderCard name="ROCKET">
          <RocketLoader size="md" />
        </LoaderCard>
        <LoaderCard name="SATELLITE">
          <SatelliteLoader size="md" />
        </LoaderCard>
        <LoaderCard name="UFO">
          <UFOLoader size="md" />
        </LoaderCard>
        <LoaderCard name="ASTRONAUT">
          <AstronautLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Sky */}
      <CategorySection title="Sky" emoji="🌅">
        <LoaderCard name="RAINBOW">
          <RainbowLoader size="md" />
        </LoaderCard>
        <LoaderCard name="SUNRISE">
          <SunriseLoader size="md" />
        </LoaderCard>
        <LoaderCard name="MOONRISE">
          <MoonriseLoader size="md" />
        </LoaderCard>
        <LoaderCard name="TWILIGHT">
          <TwilightLoader size="md" />
        </LoaderCard>
        <LoaderCard name="STARFIELD">
          <StarfieldLoader size="md" />
        </LoaderCard>
        <LoaderCard name="CLOUD DRIFT">
          <CloudDriftLoader size="md" />
        </LoaderCard>
        <LoaderCard name="HORIZON">
          <HorizonLoader size="md" />
        </LoaderCard>
      </CategorySection>

      {/* Status Section */}
      <div className="mx-auto mt-16 max-w-md font-mono text-green-500">
        {error ? (
          <pre className="text-red-500">ERROR: {error}</pre>
        ) : !labStatus ? (
          <pre>Connecting to the lab...</pre>
        ) : (
          <>
            <pre className="mb-8 text-xl">{labStatus.message}</pre>
            <div className="space-y-2 text-sm">
              <pre>┌─────────────────────────────────────┐</pre>
              <pre>│ STATUS: {labStatus.status.padEnd(25)} │</pre>
              <pre>│ ENV: {labStatus.environment.padEnd(28)} │</pre>
              <pre>├─────────────────────────────────────┤</pre>
              <pre>│ {labStatus.secret.padEnd(34)} │</pre>
              <pre>├─────────────────────────────────────┤</pre>
              <pre>│ VERSION: {`v${packageJson.version}`.padEnd(25)} │</pre>
              <pre>│ BUILD: {formatBuildTime(env.NEXT_PUBLIC_BUILD_TIME).padEnd(27)} │</pre>
              <pre>│ LOADERS: {'126'.padEnd(26)} │</pre>
              <pre>└─────────────────────────────────────┘</pre>
            </div>
          </>
        )}
        <div className="mt-12 text-xs text-gray-600">
          <pre>// This page is not linked anywhere.</pre>
          <pre>// If you found it, you know what to do.</pre>
        </div>
      </div>
    </div>
  );
}

function CategorySection({
  title,
  emoji,
  children,
  defaultOpen = false,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-4 flex w-full items-center gap-2 rounded-lg border border-sapphire-800/50 bg-sapphire-deep/30 px-4 py-3 text-left transition-colors hover:bg-sapphire-dark/50"
      >
        <span className="text-xl">{emoji}</span>
        <span className="flex-1 text-xl font-bold text-white">{title}</span>
        <span
          className="text-sapphire-400 transition-transform"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
          {children}
        </div>
      )}
    </div>
  );
}

function LoaderCard({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-sapphire-800/50 bg-sapphire-deep/50 p-4 backdrop-blur-sm transition-all hover:border-sapphire-500/50 hover:bg-sapphire-dark/50">
      <div className="mb-2 flex h-16 w-16 items-center justify-center overflow-hidden">
        {children}
      </div>
      <span className="text-xs font-medium text-sapphire-300">{name}</span>
    </div>
  );
}
