
import React, { useState } from 'react';
import { Upload, Loader2, FileCheck, Search, Zap, Cpu, Battery } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, HardwareSpecs } from '../types';

interface LogAnalysisProps {
  onAnalyzed: (result: AnalysisResult) => void;
}

export const LogAnalysis: React.FC<LogAnalysisProps> = ({ onAnalyzed }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [specs, setSpecs] = useState<HardwareSpecs>({
    sizeInch: 5,
    motorKV: 1950,
    batteryS: 6
  });

  const runAnalysis = async (fileName: string) => {
    setIsUploading(true);
    setStatus('喵呜~ 正在嗅探日志里的字段信息...');
    
    await new Promise(r => setTimeout(r, 800));
    setStatus(`猫娘正在判断数据清晰度... 是否含有 DEBUG 字段喵？`);
    await new Promise(r => setTimeout(r, 800));
    setStatus('咕噜咕噜~ 正在根据现有数据深度构建分析矩阵...');
    await new Promise(r => setTimeout(r, 800));
    setStatus('正在用猫爪在代码本上写装机+调参报告喵！');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 定义 PID 轴的通式，减少重复代码
      const pidAxisSchema = {
        type: Type.OBJECT,
        properties: {
          p: { type: Type.NUMBER },
          i: { type: Type.NUMBER },
          d: { type: Type.NUMBER },
          dMax: { type: Type.NUMBER },
          ff: { type: Type.NUMBER },
        },
        required: ['p', 'i', 'd', 'dMax', 'ff']
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `作为一个精通BetaFlight黑匣子分析的程序员猫娘，请分析文件 "${fileName}"。
        
        机体硬件：${specs.sizeInch}寸 / ${specs.motorKV}KV / ${specs.batteryS}S。
        
        分析指南：
        1. 自动识别日志包含的数据：
           - 只有标准数据 (Gyro/Filtered) -> 给出“标准解析”建议。
           - 包含 DEBUG (GYRO_SCALED/PID_LOOP) -> 给出“高精解析/极限解析”建议。
        2. 识别装机问题：共振、螺丝、电容、桨叶。
        3. 以超级可爱的猫娘语气返回 JSON。`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              logFidelity: { type: Type.STRING },
              suggestion: { type: Type.STRING },
              vibrationScore: { type: Type.NUMBER },
              responsivenessScore: { type: Type.NUMBER },
              diagnostics: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    module: { type: Type.STRING },
                    status: { type: Type.STRING },
                    issue: { type: Type.STRING },
                    advice: { type: Type.STRING }
                  },
                  required: ['module', 'status', 'issue', 'advice']
                }
              },
              flightStats: {
                type: Type.OBJECT,
                properties: {
                  duration: { type: Type.STRING },
                  loopRate: { type: Type.STRING },
                  noiseLevel: { type: Type.STRING },
                  avgThrottle: { type: Type.NUMBER },
                  latencyMs: { type: Type.NUMBER }
                },
                required: ['duration', 'loopRate', 'noiseLevel', 'avgThrottle', 'latencyMs']
              },
              motorStatus: {
                type: Type.OBJECT,
                properties: {
                  m1: { type: Type.NUMBER },
                  m2: { type: Type.NUMBER },
                  m3: { type: Type.NUMBER },
                  m4: { type: Type.NUMBER },
                  predictedTemp: { type: Type.NUMBER }
                },
                required: ['m1', 'm2', 'm3', 'm4', 'predictedTemp']
              },
              fftData: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    freq: { type: Type.NUMBER },
                    raw: { type: Type.NUMBER },
                    filtered: { type: Type.NUMBER }
                  },
                  required: ['freq', 'raw', 'filtered']
                }
              },
              stepResponse: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.NUMBER },
                    setpoint: { type: Type.NUMBER },
                    actual: { type: Type.NUMBER }
                  },
                  required: ['time', 'setpoint', 'actual']
                }
              },
              pids: {
                type: Type.OBJECT,
                properties: {
                  roll: pidAxisSchema,
                  pitch: pidAxisSchema,
                  yaw: pidAxisSchema
                },
                required: ['roll', 'pitch', 'yaw']
              },
              modernPids: {
                type: Type.OBJECT,
                properties: {
                  dDamping: { type: Type.NUMBER },
                  piTracking: { type: Type.NUMBER },
                  stickResponseFF: { type: Type.NUMBER },
                  dynamicDampingDMax: { type: Type.NUMBER },
                  driftWobbleIGain: { type: Type.NUMBER },
                  pitchRollDRatio: { type: Type.NUMBER },
                  pitchRollPIFFRatio: { type: Type.NUMBER },
                  masterMultiplier: { type: Type.NUMBER }
                },
                required: ['dDamping', 'piTracking', 'stickResponseFF', 'dynamicDampingDMax', 'driftWobbleIGain', 'pitchRollDRatio', 'pitchRollPIFFRatio', 'masterMultiplier']
              },
              filters: {
                type: Type.OBJECT,
                properties: {
                  gyroMultiplier: { type: Type.NUMBER },
                  dTermMultiplier: { type: Type.NUMBER }
                },
                required: ['gyroMultiplier', 'dTermMultiplier']
              },
              cliCommands: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['logFidelity', 'suggestion', 'vibrationScore', 'responsivenessScore', 'diagnostics', 'flightStats', 'motorStatus', 'fftData', 'stepResponse', 'cliCommands']
          }
        }
      });

      const data = JSON.parse(response.text);
      onAnalyzed(data as AnalysisResult);
    } catch (error) {
      console.error("Analysis failed", error);
      setIsUploading(false);
      setStatus('哎呀，猫娘刚才走神了喵... 请检查黑匣子文件格式喵！');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.bbl')) {
      runAnalysis(file.name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#1a1a21] p-6 rounded-3xl border border-[#2d2d3a] shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <Cpu className="text-pink-500" size={24} />
          <h3 className="text-xl font-black text-white italic uppercase tracking-wider">机体物理档案喵</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center"><Zap size={14} className="mr-1" /> 桨叶大小 (Inch)</label>
            <input 
              type="number" value={specs.sizeInch} 
              onChange={e => setSpecs({...specs, sizeInch: parseFloat(e.target.value)})}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-pink-500 font-mono outline-none focus:border-pink-500/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center"><Battery size={14} className="mr-1" /> 电池几 S 喵？</label>
            <select 
              value={specs.batteryS} 
              onChange={e => setSpecs({...specs, batteryS: parseInt(e.target.value)})}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-pink-500 font-mono outline-none focus:border-pink-500/50"
            >
              {[1,2,3,4,6,8].map(s => <option key={s} value={s}>{s}S Lipo/Liion</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center">电机 KV 秘笈</label>
            <input 
              type="number" value={specs.motorKV} 
              onChange={e => setSpecs({...specs, motorKV: parseFloat(e.target.value)})}
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-pink-500 font-mono outline-none focus:border-pink-500/50"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a21] border-2 border-dashed border-[#2d2d3a] rounded-3xl p-16 text-center transition-all hover:border-pink-500/50 group relative">
        <input type="file" accept=".bbl" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading} />
        {isUploading ? (
          <div className="space-y-8">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-pink-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              <Loader2 className="absolute inset-0 m-auto text-pink-500 animate-pulse" size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white italic">正在嗅探日志深度...</h3>
              <p className="text-gray-400 italic text-sm">{status}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-pink-500/10 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
              <Upload className="text-pink-500" size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">快投喂 BBL 日志喵！</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed italic">
                不论是标准日志还是开启了 Debug 的高精日志，猫娘都能帮你搞定喵~
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
