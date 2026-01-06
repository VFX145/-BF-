
import React from 'react';
import { LayoutDashboard, FileSearch, Zap, Filter, Terminal, Cat } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  isLogLoaded: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isLogLoaded }) => {
  const menuItems = [
    { id: ViewType.LOG_ANALYSIS, label: '黑匣子探险', icon: FileSearch },
    { id: ViewType.DASHBOARD, label: '机体健康报告', icon: LayoutDashboard },
    { id: ViewType.PID_MASTER_CONSOLE, label: 'PID 魔法祭坛', icon: Zap },
    { id: ViewType.FILTER_SETUP, label: '噪声除灵阵', icon: Filter },
    { id: ViewType.CLI_COMMANDS, label: '终端代码传送门', icon: Terminal },
  ];

  return (
    <aside className="w-64 bg-[#1a1a21] border-r border-[#2d2d3a] flex flex-col">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/20">
          <Cat className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-none tracking-tighter">NekoTune</h1>
          <span className="text-[10px] text-pink-400 font-black uppercase italic">AI 魔法调参喵~</span>
        </div>
      </div>

      <nav className="flex-1 mt-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20 shadow-sm'
                  : 'text-gray-400 hover:bg-[#252530] hover:text-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={18} />
                <span className="font-bold text-sm">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 m-4 bg-[#252530] rounded-xl border border-[#353545]">
        <p className="text-xs text-gray-400 leading-relaxed text-center italic">
          {isLogLoaded 
            ? "喵呜~ 数据已经嗅探完毕，开始大显身手吧！" 
            : "正在等待指挥官投喂黑匣子日志喵~"}
        </p>
      </div>
    </aside>
  );
};
