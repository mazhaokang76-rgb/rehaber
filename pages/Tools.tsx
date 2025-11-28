import React, { useState } from 'react';
import { Activity, Heart, Flame, ArrowRight } from 'lucide-react';

export const Tools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'BMI' | 'HR' | 'Calories'>('BMI');

  return (
    <div className="pb-24 px-4 pt-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">健康工具</h1>
      <p className="text-sm text-gray-500 mb-6">科学监测你的康复进度</p>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
            { id: 'BMI', icon: Activity, label: 'BMI计算' },
            { id: 'HR', icon: Heart, label: '最佳心率' },
            { id: 'Calories', icon: Flame, label: '卡路里' }
        ].map((item) => (
            <button
                key={item.id}
                onClick={() => setActiveTool(item.id as any)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                    activeTool === item.id 
                    ? 'bg-brand-600 text-white shadow-md ring-2 ring-brand-200 ring-offset-1' 
                    : 'bg-white text-gray-500 shadow-sm hover:bg-gray-50'
                }`}
            >
                <item.icon size={24} className="mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
            </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        {activeTool === 'BMI' && <BMICalculator />}
        {activeTool === 'HR' && <HeartRateCalculator />}
        {activeTool === 'Calories' && <CalorieCalculator />}
      </div>
    </div>
  );
};

const BMICalculator = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState<number | null>(null);

    const calculate = () => {
        const h = parseFloat(height) / 100;
        const w = parseFloat(weight);
        if (h && w) {
            setBmi(parseFloat((w / (h * h)).toFixed(1)));
        }
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-800">BMI 身体质量指数</h2>
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">身高 (cm)</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full p-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="175" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">体重 (kg)</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="70" />
                </div>
            </div>
            <button onClick={calculate} className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-200 mt-4 flex items-center justify-center">
                开始计算 <ArrowRight size={16} className="ml-2" />
            </button>
            {bmi && (
                <div className="mt-6 text-center p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="text-sm text-gray-600">您的 BMI 指数</div>
                    <div className="text-3xl font-bold text-brand-700">{bmi}</div>
                    <div className="text-xs text-brand-600 font-medium mt-1">
                        {bmi < 18.5 ? '偏瘦' : bmi < 25 ? '正常' : '偏胖'}
                    </div>
                </div>
            )}
        </div>
    )
}

const HeartRateCalculator = () => {
    const [age, setAge] = useState('');
    const [result, setResult] = useState<{max: number, targetMin: number, targetMax: number} | null>(null);

    const calculate = () => {
        const a = parseInt(age);
        if (a) {
            const max = 220 - a;
            setResult({
                max,
                targetMin: Math.round(max * 0.64),
                targetMax: Math.round(max * 0.76)
            });
        }
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">目标心率区间</h2>
            <p className="text-xs text-gray-500">燃脂和恢复的最佳心率范围。</p>
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">年龄</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full p-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="30" />
            </div>
             <button onClick={calculate} className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-brand-200 mt-4 flex items-center justify-center">
                计算区间 <ArrowRight size={16} className="ml-2" />
            </button>
            {result && (
                 <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-center">
                        <div className="text-xs text-red-400">最大心率</div>
                        <div className="text-xl font-bold text-red-600">{result.max} <span className="text-xs font-normal">次/分</span></div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
                        <div className="text-xs text-green-500">目标区间</div>
                        <div className="text-xl font-bold text-green-700">{result.targetMin}-{result.targetMax} <span className="text-xs font-normal">次/分</span></div>
                    </div>
                 </div>
            )}
        </div>
    )
}

const CalorieCalculator = () => {
    return (
        <div className="space-y-4 text-center py-8">
             <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-2">
                 <Flame size={32} />
             </div>
             <h2 className="text-lg font-bold text-gray-800">卡路里计算器</h2>
             <p className="text-sm text-gray-500">即将上线，敬请期待！</p>
             <button disabled className="w-full bg-gray-200 text-gray-400 py-3 rounded-xl font-bold mt-4 cursor-not-allowed">
                功能开发中
            </button>
        </div>
    )
}