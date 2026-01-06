
import React from 'react';
import { AnalysisResult, Diagnostic } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, ReferenceArea, ReferenceLine } from 'recharts';
import { AlertTriangle, Clock, Activity, Zap, ShieldCheck, Gauge, TrendingUp, Thermometer, Info, Target, Stethoscope, AlertCircle, CheckCircle2, Cat, Hammer, Eye } from 'lucide-react';

interface DashboardProps {
  analysis: AnalysisResult | null;
  isLogLoaded: boolean;
}

const MOCK_ANALYSIS: AnalysisResult = {
  suggestion: "喵呜！指挥官投喂的是标准日志喵。虽然没有开启 Debug 模式，但猫娘通过陀螺仪相位差分析出你的 D 项确实有点“偷懒”，导致急停过冲。FFT 频谱显示 180Hz 附近有机架振动，建议先紧一紧螺丝喵！下次如果开启 set debug_mode = GYRO_SCALED，猫娘能给你更精准的噪声分布图喵！",
  logFidelity: '标准解析',
  vibrationScore: 82,
  responsivenessScore: 88,
  flightStats: { duration: "03:45", loopRate: "8.0 kHz", noiseLevel: "低", avgThrottle: 42, latencyMs: 4.2 },
  motorStatus: { m1: 45, m2: 42, m3: 48, m4: 44, predictedTemp: 52 },
  fftData: Array.from({ length: 41 }, (_, i) => ({ 
    freq: i * 15, 
    raw: Math.random() * 80 + (i < 8 ? 40 : (i > 15 && i < 22 ? 55 : 10)), 
    filtered: Math.random() * 8 + (i < 8 ? 4 : 1) 
  })),
  stepResponse: Array.from({ length: 30 }, (_, i) => {
    const target = i > 5 ? 100 : 0;
    let actual = 0;
    if (i > 5) {
      const t = i - 5;
      actual = 100 + Math.exp(-t * 0.3) * 30 * Math.sin(t * 0.8);
    }
    return { time: i, setpoint: target, actual };
  }),
  diagnostics: [
    { module: '解析深度', status: '正常', issue: '标准陀螺仪解析', advice: '开启 GYRO_SCALED debug 可解锁高精解析喵' },
    { module: '结构刚度', status: '警告', issue: '检测到 180Hz 机械共振', advice: '检查机臂螺丝喵' },
    { module: '电源纯净度', status: '正常', issue: '噪声电平控制良好', advice: '继续保持喵！' },
    { module: '螺旋桨平衡', status: '警告', issue: 'M2 电机噪声略高', advice: '可能桨叶有缺口喵' },
  ],
  cliCommands: []
};

export const Dashboard: React.FC<DashboardProps> = ({ analysis, isLogLoaded }) => {
  const data = analysis || MOCK_ANALYSIS;
  const { flightStats, motorStatus, fftData, vibrationScore, responsivenessScore, suggestion, stepResponse, diagnostics, logFidelity } = data;

  const getStatusIcon = (status: Diagnostic['status']) => {
    switch (status) {
      case '正常': return <CheckCircle2 className="text-green-500" size={20} />;
      case '警告': return <AlertCircle className="text-yellow-500" size={20} />;
      case '危险': return <AlertTriangle className="text-red-500" size={20} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-[#1a1a21]/90 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Cat size={180} className="text-pink-500" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                <Zap className="text-white" size={24} />
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic text-shadow-sm">NekoTune 调参报告</h3>
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                <Eye className="text-pink-400 mr-2" size={14} />
                <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">{logFidelity || '智能解析中'}</span>
              </div>
              <div className="flex items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
                <span className="text-xs text-gray-500 mr-4 font-bold uppercase">机体健康度</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  {((vibrationScore + responsivenessScore) / 2).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
          <div className="py-1 pr-24 max-w-4xl">
            <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed italic tracking-tight opacity-90">
              “{suggestion}”
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={<Clock className="text-blue-400" />} label="探险时长" value={flightStats.duration} />
        <StatCard icon={<Zap className="text-yellow-400" />} label="心跳频率" value={flightStats.loopRate} />
        <StatCard icon={<Activity className="text-purple-400" />} label="猫猫同步率" value={`${flightStats.latencyMs}ms`} subValue="响应延迟" />
        <StatCard icon={<Thermometer className={motorStatus.predictedTemp > 70 ? "text-red-500" : "text-green-500"} />} label="发热感知" value={`${motorStatus.predictedTemp}°C`} subValue="电机温度" />
        <StatCard icon={<TrendingUp className="text-pink-400" />} label="平均油门" value={`${flightStats.avgThrottle}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a21] p-6 rounded-3xl border border-[#2d2d3a] relative">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center">
                <ShieldCheck className="mr-2 text-green-400" size={18} />
                FFT 噪声指纹喵 (0-600Hz)
              </h3>
              <p className="text-[10px] text-gray-500 italic">
                {logFidelity === '极限解析' ? '正在分析原始陀螺仪噪声分量喵！' : '正在从滤波后信号反向推算噪声喵...'}
              </p>
            </div>
            <div className="flex space-x-3 text-[10px] font-bold">
              <div className="flex items-center"><span className="w-2 h-2 bg-gray-600 rounded-full mr-1"></span> 原始</div>
              <div className="flex items-center"><span className="w-2 h-2 bg-pink-500 rounded-full mr-1"></span> 净灵</div>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fftData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3a" vertical={false} />
                <XAxis dataKey="freq" stroke="#4b5563" fontSize={10} unit="Hz" tick={{fill: '#4b5563'}} domain={[0, 600]} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a21', border: '1px solid #2d2d3a', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="raw" stroke="#4b5563" fill="#4b5563" fillOpacity={0.05} strokeWidth={1} dot={false} />
                <Area type="monotone" dataKey="filtered" stroke="#ff79c6" fill="#ff79c6" fillOpacity={0.25} strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1a1a21] p-6 rounded-3xl border border-[#2d2d3a] flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Target className="mr-2 text-blue-400" size={18} />
              打杆跟随体操
            </h3>
            <p className="text-[10px] text-gray-500 mt-1 font-medium italic">
              猫娘秘技分析：基于 {logFidelity}。
            </p>
          </div>
          <div className="flex-1 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stepResponse}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3a" vertical={false} />
                <XAxis hide />
                <YAxis hide domain={[0, 150]} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a21', border: '1px solid #2d2d3a' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="stepAfter" dataKey="setpoint" stroke="#4b5563" strokeDasharray="5 5" dot={false} name="期待值" strokeWidth={1} />
                <Line type="monotone" dataKey="actual" stroke="#ff79c6" strokeWidth={3} dot={false} name="实际响应" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></div>
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">物理响应总结喵</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed italic">
              {logFidelity === '标准解析' 
                ? "喵！当前是标准解析模式，虽然不能穿透滤波器，但猫娘能通过相位偏移计算出滤波器的实际延迟。目前延迟处于安全区间喵！"
                : "喵！高精解析已开启！猫娘直接观察到了 PID 环内部的每一个微调动作，你的飞机现在对指挥官来说是透明的喵！"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a21] p-6 rounded-3xl border border-[#2d2d3a]">
        <div className="flex items-center space-x-3 mb-6">
          <Hammer className="text-pink-500" size={24} />
          <h3 className="text-xl font-bold text-white italic uppercase tracking-tighter">猫娘的装机体检中心</h3>
          <span className="text-[10px] text-gray-500 font-bold uppercase bg-black/30 px-2 py-0.5 rounded italic">拒绝硬伤喵</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {diagnostics.map((d, i) => (
            <div key={i} className={`bg-[#0f0f13] p-4 rounded-2xl border transition-all ${d.status === '危险' ? 'border-red-500/30' : 'border-[#2d2d3a]'} hover:border-pink-500/20`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{d.module}</span>
                {getStatusIcon(d.status)}
              </div>
              <p className="text-sm font-bold text-white mb-1">{d.issue}</p>
              <p className="text-[11px] text-gray-500 leading-snug">{d.advice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string | number, subValue?: string }) => (
  <div className="bg-[#1a1a21] p-4 rounded-2xl border border-[#2d2d3a] hover:border-pink-500/30 transition-all group">
    <div className="flex items-center space-x-3 mb-2">
      <div className="p-2 bg-black/30 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-baseline space-x-2">
      <span className="text-xl font-bold text-white tracking-tight">{value}</span>
      {subValue && <span className="text-[9px] text-gray-600 font-bold uppercase">{subValue}</span>}
    </div>
  </div>
);
