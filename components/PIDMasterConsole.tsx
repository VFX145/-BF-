
import React, { useState } from 'react';
import { TraditionalPID, ModernPID, PIDAxis } from '../types';
import { Sliders, Zap, AlertTriangle, Info, Sparkles } from 'lucide-react';

interface PIDMasterConsoleProps {
  traditionalPids: TraditionalPID;
  setTraditionalPids: (pids: TraditionalPID) => void;
  modernPids: ModernPID;
  setModernPids: (pids: ModernPID) => void;
}

export const PIDMasterConsole: React.FC<PIDMasterConsoleProps> = ({ 
  traditionalPids, setTraditionalPids, 
  modernPids, setModernPids 
}) => {
  const [activeTab, setActiveTab] = useState<'modern' | 'traditional'>('modern');

  const sliders = [
    { key: 'masterMultiplier', label: '主乘数 (Master)', desc: '猫娘的综合魔法权杖', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'dDamping', label: '阻尼 (D 增益)', desc: '改善过冲，让飞机不乱抖喵', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'piTracking', label: '跟踪 (P & I 增益)', desc: '提高飞机对你爪子的同步率', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'stickResponseFF', label: '摇杆响应 (FF)', desc: '提升打杆瞬间的爆发力喵！', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'dynamicDampingDMax', label: '动态阻尼 (D Max)', desc: '控制急停时的反向刹车喵', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'driftWobbleIGain', label: '漂移-晃动 (I 增益)', desc: '低速平移时也要稳如泰山喵', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'pitchRollDRatio', label: 'Pitch 阻尼 (P:R D)', desc: '俯仰和横滚的阻尼平衡喵', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'pitchRollPIFFRatio', label: 'Pitch 跟踪 (P:R P/I/FF)', desc: '两个轴向的同步比例喵', min: 0.1, max: 2.0, step: 0.05 },
  ] as const;

  const handleTraditionalChange = (axis: keyof TraditionalPID, field: keyof PIDAxis, value: number) => {
    setTraditionalPids({
      ...traditionalPids,
      [axis]: { ...traditionalPids[axis], [field]: value }
    });
  };

  const handleModernChange = (key: keyof ModernPID, val: string) => {
    setModernPids({ ...modernPids, [key]: parseFloat(val) });
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Sparkles className="mr-2 text-pink-500" size={24} />
            猫娘 PID 魔法祭坛喵
          </h2>
          <p className="text-gray-400 text-sm italic tracking-tight">咕噜咕噜~ 这里可以手动微调每一个魔法刻度哦！</p>
        </div>
        <div className="flex bg-[#1a1a21] p-1 rounded-xl border border-[#2d2d3a]">
          <button 
            onClick={() => setActiveTab('modern')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'modern' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            现代滑块模式喵
          </button>
          <button 
            onClick={() => setActiveTab('traditional')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'traditional' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            硬核数值模式喵
          </button>
        </div>
      </header>

      {activeTab === 'modern' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
          {sliders.map((s) => (
            <div key={s.key} className="bg-[#1a1a21] p-5 rounded-2xl border border-[#2d2d3a] hover:border-pink-500/20 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-0.5">
                   <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">{s.label}</label>
                   <p className="text-[10px] text-gray-600 italic">{s.desc}</p>
                </div>
                <span className="text-lg font-black text-pink-500 font-mono">{modernPids[s.key].toFixed(2)}</span>
              </div>
              <input 
                type="range" min={s.min} max={s.max} step={s.step} 
                value={modernPids[s.key]} 
                onChange={(e) => handleModernChange(s.key, e.target.value)}
                className="w-full h-1.5 bg-black/50 rounded-lg appearance-none cursor-pointer accent-pink-500" 
              />
              <div className="flex justify-between text-[9px] text-gray-600 font-black mt-2 uppercase tracking-tighter">
                <span>柔顺喵 (0.1)</span>
                <span>标准喵 (1.0)</span>
                <span>暴躁喵 (2.0)</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in duration-300">
          <div className="grid grid-cols-6 gap-3 px-4 text-[10px] font-black text-gray-600 uppercase tracking-widest italic">
            <div>轴向 (Axis)</div>
            <div>P 魔法</div>
            <div>I 魔法</div>
            <div>D 魔法</div>
            <div>FF 爆发</div>
            <div>D-Max</div>
          </div>
          {(['roll', 'pitch', 'yaw'] as const).map(axis => (
            <div key={axis} className="grid grid-cols-6 gap-3 items-center bg-[#1a1a21] p-4 rounded-2xl border border-[#2d2d3a] hover:border-pink-500/20 transition-all">
              <div className="text-lg font-black text-white uppercase italic tracking-tighter">{axis}</div>
              {(['p', 'i', 'd', 'ff', 'dMax'] as const).map(field => (
                <div key={field} className="relative group/field">
                  <input 
                    type="number" 
                    value={traditionalPids[axis][field]}
                    onChange={(e) => handleTraditionalChange(axis, field, parseFloat(e.target.value))}
                    className="w-full bg-black/30 border border-white/5 rounded-lg px-2 py-2.5 text-pink-500 font-mono text-sm focus:border-pink-500 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#1a1a21] p-4 rounded-2xl border border-[#2d2d3a] flex items-center space-x-3">
        <Info className="text-pink-500" size={18} />
        <p className="text-xs text-gray-500 leading-relaxed italic font-medium">
          注：祭坛指令已同步 BF 4.5+ 逻辑。改完记得看左边的分析报告喵，别把魔法阵画歪了！
        </p>
      </div>

      <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-2xl flex items-start space-x-3">
        <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
        <p className="text-xs text-yellow-500/80 leading-relaxed italic font-bold">
          🐾 猫娘安全警告：魔法虽然厉害但也很危险喵！参数太激进会让电机烫手甚至冒烟，一定要小心试飞喵！
        </p>
      </div>
    </div>
  );
};
