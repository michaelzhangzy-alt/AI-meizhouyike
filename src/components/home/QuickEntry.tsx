
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Calendar, Newspaper, ArrowRight } from 'lucide-react';

export function QuickEntry() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Class Card */}
          <Link to="/weekly-class" className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-all border border-gray-100">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">本周直播课</h3>
                <p className="text-gray-600 mb-6">每周一节实战课，紧跟 AI 技术前沿</p>
                <span className="inline-flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                  查看课程安排 <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
              <div className="hidden md:block absolute right-0 bottom-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 translate-y-1/2"></div>
            </div>
          </Link>

          {/* AI News Card */}
          <Link to="/news" className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm hover:shadow-md transition-all border border-gray-100">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                  <Newspaper className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI 行业资讯</h3>
                <p className="text-gray-600 mb-6">精选行业动态与干货，洞察未来趋势</p>
                <span className="inline-flex items-center text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                  阅读最新资讯 <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
              <div className="hidden md:block absolute right-0 bottom-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -z-10 translate-x-1/2 translate-y-1/2"></div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
