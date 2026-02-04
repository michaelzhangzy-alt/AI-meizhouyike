
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Users, 
  Building2, 
  Factory, 
  Database, 
  Cpu 
} from 'lucide-react';

const milestones = [
  {
    year: '2005',
    title: '正式成立',
    description: '吉林UNIX计算机培训中心正式成立，专注于在校大学生计算机软件开发实习实训。',
    icon: Users,
    color: 'blue'
  },
  {
    year: '2009',
    title: '合作办学',
    description: '与长春工业大学合作办学，联合开设“计算机软件”专业四年制本科学历教育。',
    icon: Rocket,
    color: 'blue'
  },
  {
    year: '2014',
    title: '数智转型',
    description: '成立“吉林省永洪数智科技有限公司”，与吉大正元正式合作，开展软件服务外包业务。',
    icon: Building2,
    color: 'blue'
  },
  {
    year: '2019',
    title: '数字工厂',
    description: '与长发集团旗下东北亚数科合作建设数字长春总部基地“DTWorks数字工厂”。',
    icon: Factory,
    color: 'blue'
  },
  {
    year: '2021',
    title: '创新中心',
    description: '发起成立吉林省软件协大数据创新中心，为政府、医疗、教育等提供AI大数据解决方案。',
    icon: Database,
    color: 'blue'
  },
  {
    year: '2025',
    title: 'AI 周课',
    description: '联合阿里、腾讯、火山等大厂工程师，开设“每周一课”AI课堂，连接校园与职场最后一公里。',
    icon: Cpu,
    color: 'blue'
  }
];

export const HistoryTimeline = () => {
  return (
    <section className="py-24 bg-white text-slate-900 overflow-hidden relative">
      <div className="container relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-4 text-slate-900 tracking-tight"
          >
            发展历程
          </motion.h2>
          <div className="h-1.5 w-12 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="relative">
          {/* Vertical Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-slate-200" />

          <div className="space-y-12 md:space-y-24">
            {milestones.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content Card */}
                <div className="w-full md:w-1/2 p-4 md:px-16">
                  <div className="p-10 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-3xl md:text-4xl font-black text-blue-600/20 group-hover:text-blue-600 transition-colors duration-500">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg font-light">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Center Circle */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl border-4 border-white bg-blue-600 flex items-center justify-center z-10 shadow-xl shadow-blue-200">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Spacer for other side */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
