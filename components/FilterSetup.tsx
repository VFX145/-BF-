
import React from 'react';
import { FilterSettings } from '../types';
// Added missing Activity and Target imports
import { ShieldAlert, Info, ShieldCheck, Sparkles, Cat, Activity, Target } from 'lucide-react';

interface FilterSetupProps {
  filters: FilterSettings;
  setFilters: (filters: FilterSettings) => void;
}

export const FilterSetup: React.FC<FilterSetupProps> = ({ filters, setFilters }) => {
  const handleSliderChange = (key: keyof FilterSettings, val: string) => {
    setFilters({ ...filters, [key]: parseFloat(val) });
  };

  // 根据当前滑块值生成动态猫娘评价
  const getFinalJudgment = () => {
    if (filters.gyroMultiplier > 1.4 || filters.dTermMultiplier > 1.4) {
      return {
        title: "极速响应模式喵！",
        text: "当前的滤波设置非常激进，控制延迟极低，非常适合硬核赛道或极限花飞。但请务必确认你的机架螺丝全部点过螺纹胶，否则高频噪声会分分钟让电机‘火冒三丈’。试飞时请务必摸一下电机温度喵！",
        color: "text-red-400",
        icon: <ShieldAlert size={32} />
      };
    } else if (filters.gyroMultiplier < 0.8 || filters.dTermMultiplier < 0.8) {
      return {
        title: "保守稳健模式喵。",
        text: "你的滤波器开得比较足，这会让飞机在嘈杂的机架上表现得更稳，但可能会感觉到打杆有一点点‘粘手’。如果飞行日志显示噪声水平不高，建议尝试慢慢调高乘数，释放飞机的潜力喵！",
        color: "text-blue-400",
        icon: <Info size={32} />
      };
    }
    return {
      title: "完美平衡模式喵~",
      text: "这是猫娘最推荐的状态！在延迟和噪声抑制之间达到了黄金平衡。这种设置下，飞机的操控感既清晰又不会给电机带来额外负担。继续保持这个节奏去飞吧喵！",
      color: "text-green-400",
      icon: <ShieldCheck size={32} />
    };
  };

  const judgment = getFinalJudgment();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Sparkles className="mr-2 text-pink-500" size={24} />
            滤波器深度配置
          </h2>
          <p className="text-gray-400 text-sm mt-1 italic tracking-tight">喵~ 滤波器的每一个刻度都关乎电机的生命，请根据 FFT 分析结果进行调优。</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 陀螺仪滤波器 */}
        <div className="bg-[#1a1a21] p-6 rounded-3xl border border-[#2d2d3a] space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity size={80} className="text-pink-500" />
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <label className="text-white font-bold block uppercase tracking-wide">陀螺仪滤波器乘数</label>
              <p className="text-[10px] text-gray-500 italic">影响原始信号的清晰度</p>
            </div>
            <span className="text-2xl font-black text-pink-500 font-mono bg-black/40 px-4 py-1.5 rounded-xl border border-white/5 shadow-inner">
              {filters.gyroMultiplier.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={filters.gyroMultiplier}
            onChange={(e) => handleSliderChange('gyroMultiplier', e.target.value)}
            className="w-full h-1.5 bg-[#0f0f13] rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
          <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-2">
             <h4 className="text-xs font-bold text-gray-300 flex items-center uppercase italic">
               <Cat size={14} className="mr-1.5 text-pink-500" /> 猫娘的陀螺仪建议：
             </h4>
             <ul className="text-[11px] text-gray-500 space-y-1 leading-relaxed">
               <li>• 乘数 &gt; 1.2: 建议开启 RPM 滤波并正确设置电机磁极数。</li>
               <li>• 乘数 &lt; 0.9: 检查是否有外部干扰，或是你的电容器坏了喵。</li>
               <li>• <span className="text-pink-400">重点：</span> 保证陀螺仪低延迟是飞行精准的前提。</li>
             </ul>
          </div>
        </div>

        {/* DTerm 滤波器 */}
        <div className="bg-[#1a1a21] p-6 rounded-3xl border border-[#2d2d3a] space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target size={80} className="text-blue-500" />
          </div>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <label className="text-white font-bold block uppercase tracking-wide">DTerm 滤波器乘数</label>
              <p className="text-[10px] text-gray-500 italic">决定 D 项带来的高频噪声抑制</p>
            </div>
            <span className="text-2xl font-black text-blue-400 font-mono bg-black/40 px-4 py-1.5 rounded-xl border border-white/5 shadow-inner">
              {filters.dTermMultiplier.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={filters.dTermMultiplier}
            onChange={(e) => handleSliderChange('dTermMultiplier', e.target.value)}
            className="w-full h-1.5 bg-[#0f0f13] rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-2">
             <h4 className="text-xs font-bold text-gray-300 flex items-center uppercase italic">
               <ShieldAlert size={14} className="mr-1.5 text-blue-500" /> DTerm 滤波指南：
             </h4>
             <ul className="text-[11px] text-gray-500 space-y-1 leading-relaxed">
               <li>• 如果日志显示噪声很多，请先降低 D 项增益，而不是一味压低乘数。</li>
               <li>• D 项噪声是电机过热的头号杀手，要时刻关注。</li>
               <li>• 设置为 1.0 是大多数机架的甜点位喵。</li>
             </ul>
          </div>
        </div>
      </div>

      {/* 猫猫的最终判断模块 */}
      <div className="relative group mt-12">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-[#1a1a21] p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex items-start space-x-6">
            <div className={`p-4 bg-black/40 rounded-3xl shadow-lg border border-white/5 ${judgment.color}`}>
              {judgment.icon}
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${judgment.color}`}>
                  猫娘的最终判断：{judgment.title}
                </h3>
                <span className="text-[9px] font-bold text-gray-600 border border-gray-700 px-2 py-0.5 rounded uppercase">AI Synthesis</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                {judgment.text}
              </p>
              <div className="pt-4 flex items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-black/20 px-4 py-2 rounded-xl border border-white/5 w-fit">
                机体状态预测：{filters.gyroMultiplier > 1.3 ? '极度灵敏' : '温和可控'} | 危险系数：{filters.dTermMultiplier > 1.5 ? '高' : '低'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
