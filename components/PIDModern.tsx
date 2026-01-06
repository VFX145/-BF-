
import React from 'react';
import { ModernPID } from '../types';

interface PIDModernProps {
  pids: ModernPID;
  setPids: (pids: ModernPID) => void;
}

export const PIDModern: React.FC<PIDModernProps> = ({ pids, setPids }) => {
  const sliders = [
    { key: 'masterMultiplier', label: '主乘数', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'dDamping', label: '阻尼 (D 增益)', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'piTracking', label: '跟踪 (P & I 增益)', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'stickResponseFF', label: '摇杆响应 (FF 增益)', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'dynamicDampingDMax', label: '动态阻尼 (D Max)', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'driftWobbleIGain', label: '漂移-晃动 (I 增益)', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'pitchRollDRatio', label: 'Pitch 阻尼 (P:R D)', min: 0.1, max: 2.0, step: 0.05 },
    { key: 'pitchRollPIFFRatio', label: 'Pitch 跟踪 (P:R P&I&FF)', min: 0.1, max: 2.0, step: 0.05 },
  ] as const;

  const handleSliderChange = (key: keyof ModernPID, val: string) => {
    setPids({ ...pids, [key]: parseFloat(val) });
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-white">现代滑块调节</h2>
        <p className="text-gray-400 text-sm">BetaFlight 4.3+ 推荐的调节方式。猫娘 AI 已根据日志预设了滑块位置。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sliders.map((s) => (
          <div key={s.key} className="bg-[#1a1a21] p-6 rounded-2xl border border-[#2d2d3a] space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-white font-medium">{s.label}</label>
              <span className="text-pink-400 font-bold bg-[#0f0f13] px-3 py-1 rounded-lg border border-[#2d2d3a]">
                {pids[s.key].toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={pids[s.key]}
              onChange={(e) => handleSliderChange(s.key, e.target.value)}
              className="w-full h-2 bg-[#0f0f13] rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase">
              <span>Low</span>
              <span>Default (1.0)</span>
              <span>High</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
