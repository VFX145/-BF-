
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Copy, Check, Terminal, MousePointerClick, Clipboard, Save, HardDriveDownload, ShieldCheck, Zap } from 'lucide-react';

interface CLICommandsProps {
  analysis: AnalysisResult | null;
}

export const CLICommands: React.FC<CLICommandsProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);

  const commands = analysis?.cliCommands || [
    '# 喵呜~ 暂时还没有生成指令，请先上传黑匣子日志投喂猫娘哦',
    '# No magic found in the box yet.'
  ];

  const handleCopy = () => {
    const text = commands.join('\n') + '\nsave';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Terminal className="mr-2 text-pink-500" size={24} />
            终端代码传送门喵
          </h2>
          <p className="text-gray-400 text-sm mt-1">喵！这些是猫娘为你精心调配的魔法药水，一键注入飞控就起效！</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl transition-all font-black shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
          <span>{copied ? '已经塞进猫爪剪贴板了喵！' : '复制代码并保存指令'}</span>
        </button>
      </header>

      <div className="bg-[#0f0f13] border border-[#2d2d3a] rounded-3xl p-8 font-mono text-sm overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Zap size={120} className="text-pink-500" />
        </div>
        <div className="flex items-center space-x-2 text-gray-600 mb-6 pb-4 border-b border-[#2d2d3a]">
          <span className="w-3 h-3 rounded-full bg-red-500/50"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/50"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/50"></span>
          <span className="ml-4 text-[10px] font-black uppercase tracking-widest opacity-50">NekoTune Magic Script v1.0</span>
        </div>
        <div className="overflow-y-auto max-h-[50vh] custom-scrollbar text-green-400/90 leading-relaxed scroll-smooth">
          {commands.map((cmd, i) => (
            <div key={i} className="py-0.5 hover:bg-white/5 px-2 rounded transition-colors">
              {cmd}
            </div>
          ))}
          <div className="mt-6 text-pink-400 font-black flex items-center">
            <span className="animate-pulse mr-2">#</span> 
            <span className="italic">--- AI 猫娘魔法加持完毕，记得输入 save 保存喵！ ---</span>
          </div>
          <div className="text-pink-500 font-black text-lg mt-2">save</div>
        </div>
      </div>

      <div className="pt-8 border-t border-[#2d2d3a]">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-pink-500/10 rounded-xl">
             <MousePointerClick className="text-pink-500" size={20} />
          </div>
          <h3 className="text-lg font-bold text-white italic uppercase tracking-tighter">
            三步学会魔法调参喵！
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard 
            icon={<Clipboard className="text-pink-400" />} 
            step="01" 
            title="爪爪一键复制" 
            desc="点击上方的粉色大按钮，猫娘会自动把所有参数和 save 命令都揣在兜里喵！" 
          />
          <StepCard 
            icon={<Terminal className="text-blue-400" />} 
            step="02" 
            title="钻进 BF 终端" 
            desc="打开 BF Configurator，连接飞控，找到左边那个长得像“CLI 命令行”的小房子。" 
          />
          <StepCard 
            icon={<Save className="text-green-400" />} 
            step="03" 
            title="粘贴并起飞喵" 
            desc="Ctrl+V 粘贴进去，回车！等飞控“滴滴”一声伸个懒腰，你就变强了喵！" 
          />
        </div>

        <div className="mt-8 bg-pink-500/5 p-4 rounded-2xl border border-pink-500/10 flex items-center justify-between">
           <div className="flex items-center space-x-4">
             <div className="bg-pink-500 text-white p-2 rounded-full shadow-lg shadow-pink-500/20">
                <ShieldCheck size={20} />
             </div>
             <div className="space-y-0.5">
               <p className="text-sm font-black text-pink-400 uppercase italic tracking-widest">猫娘的安全咒语</p>
               <p className="text-[11px] text-gray-500 italic">“螺旋桨先拆掉喵，电机凉透后再飞，参数稳步调，安全最重要！”</p>
             </div>
           </div>
           {/* 已移除右侧重复的猫猫头 */}
        </div>
      </div>
    </div>
  );
};

const StepCard = ({ icon, step, title, desc }: { icon: React.ReactNode, step: string, title: string, desc: string }) => (
  <div className="bg-[#1a1a21] p-6 rounded-3xl border border-[#2d2d3a] hover:border-pink-500/20 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 text-4xl font-black text-white/5 italic group-hover:text-pink-500/5 transition-colors">{step}</div>
    <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center mb-4 border border-white/5 shadow-inner">
      {icon}
    </div>
    <h4 className="text-white font-bold mb-2 flex items-center tracking-tight">
      {title}
    </h4>
    <p className="text-xs text-gray-500 leading-relaxed font-medium">
      {desc}
    </p>
  </div>
);
