import React from 'react';
import { Anchor, Users, Globe, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
    useLanguage();

    return (
        <div className="bg-surface min-h-screen">
            {/* Hero */}
            <section className="bg-ocean text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">Our Blue Story</h1>
                    <p className="text-xl text-ocean-light max-w-2xl mx-auto leading-relaxed">
                        Born from a passion for the sea, dedicated to bringing the world's finest catch to your table with integrity and speed.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1520182205149-1e5e2e79fa5b?auto=format&fit=crop&q=80&w=1000"
                            alt="Fisherman at sea"
                            className="rounded-2xl shadow-xl shadow-ocean/20"
                        />
                    </div>
                    <div>
                        <span className="text-ocean font-bold tracking-widest text-sm uppercase mb-2 block">Our Mission</span>
                        <h2 className="text-3xl font-bold font-display text-midnight mb-6">Sustainable Fishing for a Better Future</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            At SeamanFresh, we don't just sell seafood; we curate experiences. We work directly with artisanal fishermen and certified fisheries to ensure that every product is not only fresh but ethically sourced.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex gap-3">
                                <Users className="text-ocean shrink-0" />
                                <div>
                                    <h4 className="font-bold text-midnight">Community First</h4>
                                    <p className="text-sm text-gray-500">Supporting local fishing villages.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Globe className="text-ocean shrink-0" />
                                <div>
                                    <h4 className="font-bold text-midnight">Global Standard</h4>
                                    <p className="text-sm text-gray-500">Exceeding international export quality.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <StatBox number="10+" label="Years Active" />
                    <StatBox number="50+" label="Global Partners" />
                    <StatBox number="120+" label="Cities Served" />
                    <StatBox number="100%" label="Fresh Guaranteed" />
                </div>
            </section>
        </div>
    );
};

const StatBox = ({ number, label }) => (
    <div className="p-6">
        <div className="text-4xl font-bold text-ocean mb-2">{number}</div>
        <div className="text-gray-500 font-medium">{label}</div>
    </div>
);

export default About;
