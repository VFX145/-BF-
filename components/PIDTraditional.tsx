
import React from 'react';
import { TraditionalPID, PIDAxis } from '../types';

interface PIDTraditionalProps {
  pids: TraditionalPID;
  setPids: (pids: TraditionalPID) => void;
}

export const PIDTraditional: React.FC<PIDTraditionalProps> = ({ pids, setPids }) => {
  const handleChange = (axis: keyof TraditionalPID, field: keyof PIDAxis, value: number) => {
    setPids({
      ...pids,
      [axis]: {
        ...pids[axis],
        [field]: value
      }
    });
  };

  const AxisRow = ({ name, data, axis }: { name: string, data: PIDAxis, axis: keyof TraditionalPID }) => (
    <div className="grid grid-cols-6 gap-4 items-center bg-[#1a1a21] p-4 rounded-xl border border-[#2d2d3a] hover:border-pink-500/30 transition-colors">
      <div className="font-bold text-white uppercase tracking-wider">{name}</div>
      {(['p', 'i', 'd', 'dMax', 'ff'] as const).map(field => (
        <div key={field} className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase font-bold">{field === 'dMax' ? 'D Max' : field}</label>
          <input
            type="number"
            value={data[field]}
            onChange={(e) => handleChange(axis, field, parseFloat(e.target.value))}
            className="w-full bg-[#0f0f13] border border-[#2d2d3a] rounded px-2 py-1 text-pink-400 focus:border-pink-500 outline-none"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-white">传统 PID 调节</h2>
        <p className="text-gray-400 text-sm">手动微调每个轴向的增益。注意：过高的 P 或 D 会引起高频震动。</p>
      </header>

      <div className="space-y-4">
        <div className="grid grid-cols-6 gap-4 px-4 text-xs font-bold text-gray-600 uppercase">
          <div>轴向</div>
          <div>Proportional</div>
          <div>Integral</div>
          <div>Derivative</div>
          <div>D Max</div>
          <div>Feedforward</div>
        </div>
        <AxisRow name="Roll" data={pids.roll} axis="roll" />
        <AxisRow name="Pitch" data={pids.pitch} axis="pitch" />
        <AxisRow name="Yaw" data={pids.yaw} axis="yaw" />
      </div>

      <div className="p-4 bg-pink-500/5 rounded-xl border border-pink-500/10">
        <p className="text-sm text-pink-400/80 leading-relaxed">
          🐾 猫娘提示：偏航轴 (Yaw) 通常不需要 D 项和 D-Max。如果机架震动大，可以尝试适当降低 D Max 保护电机。
        </p>
      </div>
    </div>
  );
};
