
import { motion } from 'framer-motion';
import { skills } from '../../data';

export default function Arsenal() {
    return (
        <section className="h-full w-full overflow-y-auto pr-4 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(skills).map(([category, items], i) => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="border border-white/10 p-6 bg-void-light/30 backdrop-blur hover:border-warrior-crimson/50 transition-colors group relative overflow-hidden"
                    >
                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-4 h-4 bg-white/5 rounded-bl-xl" />

                        <h3 className="text-xl font-display text-warrior-silver mb-6 border-b border-white/5 pb-2 flex justify-between items-center group-hover:text-white transition-colors">
                            {category.toUpperCase()}
                            <span className="text-[10px] font-mono opacity-30 group-hover:text-warrior-crimson group-hover:opacity-100">MK-{i + 1}</span>
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {items.map((skill) => (
                                <div key={skill} className="relative group/skill cursor-default">
                                    <div className="px-3 py-1.5 bg-black border border-white/10 text-xs font-mono text-gray-400 group-hover/skill:border-warrior-crimson group-hover/skill:text-white transition-colors">
                                        {skill}
                                    </div>
                                    {/* Connecting Line Effect (Visual only) */}
                                    <div className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-warrior-crimson group-hover/skill:w-full -translate-x-1/2 transition-all duration-300" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
