import React from 'react';
import { Users, Globe, Sparkles, ShieldCheck, Waves, Anchor, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="bg-white min-h-screen overflow-hidden">
            {/* Elite Hero */}
            <section className="relative h-[80vh] flex items-center justify-center bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=1600"
                        alt="Deep Ocean"
                        className="w-full h-full object-cover opacity-50 contrast-125 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900 to-white"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block bg-sky-500/10 text-sky-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-sky-500/20 backdrop-blur-md">
                            Established 2014
                        </span>
                        <h1 className="text-7xl md:text-9xl font-black font-display text-white mb-8 tracking-tighter leading-none">
                            PURE <br /><span className="text-sky-500">ORIGIN.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                            Crafting the world's most sophisticated seafood supply chain, direct from the source to your facility.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Philosophy */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1520182205149-1e5e2e79fa5b?auto=format&fit=crop&q=80&w=1200"
                                alt="Ethical Sourcing"
                                className="rounded-[60px] shadow-3xl grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute bottom-10 -right-10 bg-white p-8 rounded-[40px] shadow-2xl border border-slate-50 flex items-center gap-6 max-w-xs">
                                <div className="w-16 h-16 bg-sky-500 rounded-3xl flex items-center justify-center text-slate-900 shadow-lg shadow-sky-500/20">
                                    <ShieldCheck size={32} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm">Triple-Checked</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Safety Certified</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-10"
                        >
                            <span className="text-sky-500 font-black tracking-[0.3em] text-[10px] uppercase block">Our DNA</span>
                            <h2 className="text-5xl md:text-6xl font-black font-display text-slate-900 tracking-tighter leading-tight">
                                SUSTAINABILITY <br />WITHOUT <span className="text-sky-500">COMPROMISE.</span>
                            </h2>
                            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
                                We believe the finest flavors come from the healthiest oceans. Our logistics model reduces carbon footprint by 40% compared to traditional wholesale, using direct-flight cold chains that skip unnecessary middle-men.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                                <div className="space-y-4 p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                                    <Users className="text-sky-500" size={32} />
                                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Community</h4>
                                    <p className="text-sm font-medium text-slate-500">Direct profit sharing with over 200 artisanal fishing families.</p>
                                </div>
                                <div className="space-y-4 p-8 bg-slate-50 rounded-[40px] border border-slate-100">
                                    <Globe className="text-sky-500" size={32} />
                                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Eco-Chain</h4>
                                    <p className="text-sm font-medium text-slate-500">Blockchain-tracked origins for 100% supply transparency.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Performance Metrics */}
            <section className="py-32 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-sky-500/10 rounded-full blur-[120px] -z-0"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-24">
                    <div className="space-y-4">
                        <span className="text-sky-500 font-black tracking-[0.3em] text-[10px] uppercase">Live Network Status</span>
                        <h3 className="text-4xl md:text-5xl font-black font-display text-white tracking-tighter uppercase">Global Impact</h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
                        <StatBox icon={<Waves size={24} />} number="5k+" label="Tons Delivered" />
                        <StatBox icon={<Anchor size={24} />} number="24h" label="Average Fulfilment" />
                        <StatBox icon={<Compass size={24} />} number="50" label="Port Terminals" />
                        <StatBox icon={<Sparkles size={24} />} number="100%" label="Product Purity" />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 bg-white">
                <div className="max-w-5xl mx-auto px-4 text-center space-y-12">
                    <h2 className="text-5xl md:text-7xl font-black font-display text-slate-900 tracking-tighter uppercase leading-none">
                        READY TO <br /><span className="text-sky-500">TRANSFORM</span> YOUR KITCHEN?
                    </h2>
                    <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
                        Join the elite circle of chefs and retailers who never settle for second-best.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="px-12 py-6 bg-slate-900 text-white rounded-[32px] font-black uppercase text-sm tracking-widest hover:bg-sky-500 hover:text-slate-900 transition-all shadow-2xl transform hover:-translate-y-1">
                            Explore Marketplace
                        </button>
                        <button className="px-12 py-6 bg-slate-100 text-slate-900 rounded-[32px] font-black uppercase text-sm tracking-widest hover:bg-slate-200 transition-all transform hover:-translate-y-1">
                            Contact Partnership
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const StatBox = ({ icon, number, label }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center group"
    >
        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-sky-500 mb-6 group-hover:bg-sky-500 group-hover:text-slate-900 transition-all border border-white/10 group-hover:rotate-12">
            {icon}
        </div>
        <div className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter">{number}</div>
        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">{label}</div>
    </motion.div>
);

export default About;
