
export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  LOG_ANALYSIS = 'LOG_ANALYSIS',
  PID_MASTER_CONSOLE = 'PID_MASTER_CONSOLE',
  FILTER_SETUP = 'FILTER_SETUP',
  CLI_COMMANDS = 'CLI_COMMANDS'
}

export interface HardwareSpecs {
  sizeInch: number;
  motorKV: number;
  batteryS: number;
}

export interface PIDAxis {
  p: number;
  i: number;
  d: number;
  dMax: number;
  ff: number;
}

export interface TraditionalPID {
  roll: PIDAxis;
  pitch: PIDAxis;
  yaw: PIDAxis;
}

export interface ModernPID {
  dDamping: number;
  piTracking: number;
  stickResponseFF: number;
  dynamicDampingDMax: number;
  driftWobbleIGain: number;
  pitchRollDRatio: number;
  pitchRollPIFFRatio: number;
  masterMultiplier: number;
}

export interface FilterSettings {
  gyroMultiplier: number;
  dTermMultiplier: number;
}

export interface Diagnostic {
  module: string;
  status: '正常' | '警告' | '危险';
  issue: string;
  advice: string;
}

export interface AnalysisResult {
  suggestion: string;
  logFidelity: '标准解析' | '高精解析' | '极限解析'; // 新增解析深度
  pids?: TraditionalPID;
  modernPids?: ModernPID;
  filters?: FilterSettings;
  cliCommands: string[];
  vibrationScore: number;
  responsivenessScore: number;
  flightStats: {
    duration: string;
    loopRate: string;
    noiseLevel: '低' | '中' | '高';
    avgThrottle: number;
    latencyMs: number;
  };
  motorStatus: {
    m1: number;
    m2: number;
    m3: number;
    m4: number;
    predictedTemp: number;
  };
  fftData: { freq: number; raw: number; filtered: number }[];
  stepResponse: { time: number; setpoint: number; actual: number }[];
  diagnostics: Diagnostic[];
}
