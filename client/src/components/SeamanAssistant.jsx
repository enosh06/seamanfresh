import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageCircle, X, Send, Fish, ShoppingBag, User, ChefHat, Info, Sparkles, Loader, ShoppingCart, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import API_URL from '../config';
import { motion, AnimatePresence } from 'framer-motion';

const SeamanAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Ahoy! 🌊 I'm Seaman, your smart seafood expert. Ready for the freshest catch?",
            sender: 'bot',
            type: 'text'
        },
        {
            id: 2,
            type: 'options',
            sender: 'bot',
            options: ['Suggest a Recipe 👨‍🍳', 'Check Stock 📦', 'Track Order 🚚', 'Browse Fish 🐟']
        }
    ]);
    const [input, setInput] = useState('');
    const [products, setProducts] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [context, setContext] = useState({ lastProduct: null });

    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { getFinalPrice, formatTotal, isWholesale } = usePrice();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to fetch products for Seaman", err);
            }
        };
        fetchProducts();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isTyping, isOpen]);

    // Enhanced Knowledge Base
    const knowledgeBase = {
        recipes: {
            salmon: "🌟 **Pan-Seared Salmon with Lemon Butter:**\n1. Pat fillets dry, season with salt/pepper.\n2. Sear skin-side down in hot oil (4-5 mins).\n3. Flip, add butter, garlic, lemon slices.\n4. Baste and cook 2 mins. Serve immediately!",
            tuna: "🌟 **Sesame Crusted Tuna Steaks:**\n1. Press tuna into sesame seeds.\n2. Sear in refined oil for 45-60 secs/side for rare.\n3. Slice against grain. Serve with soy ginger glaze.",
            shrimp: "🌟 **Classic Garlic Butter Shrimp:**\n1. Melt butter, sauté minced garlic.\n2. Add shrimp, cook until pink (2-3 mins).\n3. Finish with parsley and lemon juice. Great with pasta!",
            tilapia: "🌟 **Baked Parmesan Tilapia:**\n1. Mix parmesan, paprika, parsley.\n2. Coat fillets in butter, then cheese mix.\n3. Bake at 400°F (200°C) for 10-12 mins.",
            cod: "🌟 **Crispy Fried Cod:**\n1. Dip in batter (flour, beer, salt).\n2. Deep fry at 375°F until golden brown.\n3. Serve with tartar sauce and chips!",
            mackerel: "🌟 **Grilled Mackerel:**\n1. Slash skin, rub with oil and sea salt.\n2. Grill skin-side down until charred and crisp.\n3. Flip carefully. Serve with lemon wedges.",
            crab: "🌟 **Steamed Crab Legs:**\n1. Bring a pot of water/beer/seasoning to boil.\n2. Steam crab legs for 5-7 minutes.\n3. Serve with melted butter and lemon.",
            lobster: "🌟 **Butter Poached Lobster:**\n1. Gently poach lobster meat in melted butter (do not boil!) for 5-6 mins.\n2. Serve on a toasted roll or with steak."
        },
        funFacts: [
            "Salmon can live in both fresh and salt water! 🌊",
            "Shrimp hearts are located in their heads! 🦐",
            "Tuna can swim up to 43 miles per hour! 🏎️",
            "Lobsters taste with their legs! 🦞",
            "Crabs communicate by drumming their claws. 🦀"
        ]
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        const text = input.trim();
        if (!text) return;

        // User Message
        const userMsg = { id: Date.now(), text, sender: 'user', type: 'text' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Local fallback for quick greetings
            const lowerText = text.toLowerCase();
            if (lowerText.match(/hello|hi|hey|ahoy|start/)) {
                setTimeout(() => {
                    setIsTyping(false);
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        text: `Ahoy there! ${isWholesale ? 'Welcome back, Partner! ⚓' : 'Ready to find some fresh catches?'}`,
                        sender: 'bot',
                        type: 'text'
                    }, {
                        id: Date.now() + 1,
                        type: 'options',
                        sender: 'bot',
                        options: ['Browse Products', 'Todays Deals', 'Help']
                    }]);
                    playNotification();
                }, 600);
                return;
            }

            // Call Backend AI
            const res = await api.post('/ai-chat', { query: text });
            const { response, extras } = res.data;

            setIsTyping(false);
            const botMsgs = [{
                id: Date.now(),
                text: response,
                sender: 'bot',
                type: 'text'
            }];

            if (extras?.product) {
                botMsgs.push({
                    id: Date.now() + 1,
                    type: 'product-card',
                    sender: 'bot',
                    data: extras.product
                });
            }

            setMessages(prev => [...prev, ...botMsgs]);
            playNotification();

        } catch (err) {
            console.error("AI Assistant Error:", err);
            // Fallback to local processing if backend fails
            processMessage(text);
        }
    };

    const playNotification = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
        audio.volume = 0.2;
        audio.play().catch(() => { });
    };

    const processMessage = (text) => {
        const lowerText = text.toLowerCase();
        let responses = [];
        let newContext = { ...context };

        const matchedProduct = products.find(p => lowerText.includes(p.name.toLowerCase()));
        const product = matchedProduct || (['it', 'that', 'this', 'fish'].some(w => lowerText.includes(w)) ? newContext.lastProduct : null);

        if (matchedProduct) newContext.lastProduct = matchedProduct;

        if (lowerText.match(/buy|cart|add|purchase|get/)) {
            if (product) {
                responses.push({ text: `Great choice! Fresh ${product.name} is a top pick.`, sender: 'bot', type: 'text' });
                responses.push({ type: 'product-card', sender: 'bot', data: product });
            } else {
                responses.push({ text: "What's on the menu? We have Salmon, Tuna, Shrimp, and more!", sender: 'bot', type: 'text' });
            }
        }
        else if (lowerText.match(/recipe|cook|make|prepare|eat/)) {
            let found = false;
            if (product) {
                for (const [key, val] of Object.entries(knowledgeBase.recipes)) {
                    if (product.name.toLowerCase().includes(key)) {
                        responses.push({ text: val, sender: 'bot', type: 'text' });
                        responses.push({ text: `Want to buy some ${product.name}?`, sender: 'bot', type: 'options', options: [`Buy ${product.name}`, 'Not now'] });
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                responses.push({ text: "Try asking for 'Salmon recipe' or 'How to cook shrimp'!", sender: 'bot', type: 'text' });
            }
        }
        else if (lowerText.match(/price|cost|how much|stock|available/)) {
            if (product) {
                const price = getFinalPrice(product);
                responses.push({
                    text: `${product.name} is ${price}/kg. ${product.stock_quantity > 0 ? `We have ${product.stock_quantity}kg fresh in stock!` : 'Currently out of stock.'}`,
                    sender: 'bot', type: 'text'
                });
                responses.push({ type: 'product-card', sender: 'bot', data: product });
            } else {
                responses.push({ text: "Our prices vary by catch. Check the catalog!", sender: 'bot', type: 'text', action: { label: 'View Collection', path: '/products' } });
            }
        }
        else {
            responses.push({ text: "Ahoy! I can help with recipes, prices, or finding the best fish. What's on your mind?", sender: 'bot', type: 'text' });
            responses.push({ type: 'options', sender: 'bot', options: ['See Recipes 🍳', 'View Products 🐟', 'My Cart 🛒'] });
        }

        setIsTyping(false);
        setMessages(prev => [...prev, ...responses.map(r => ({ ...r, id: Date.now() + Math.random() }))]);
        setContext(newContext);
        playNotification();
    };

    const handleOptionClick = (option) => {
        if (option.includes('Buy') || option.includes('Add')) {
            const name = option.replace('Buy ', '').replace('Add ', '');
            setInput(`I want to buy ${name}`);
            processMessage(`buy ${name}`);
        } else if (option.includes('Recipe')) {
            setInput('Suggest a recipe');
            processMessage('recipe');
        } else if (option.includes('Stock')) {
            processMessage('check stock');
        } else if (option.includes('Browse') || option.includes('View')) {
            navigate('/products');
            setIsOpen(false);
        } else if (option.includes('Cart')) {
            navigate('/cart');
            setIsOpen(false);
        } else {
            setInput(option);
            processMessage(option);
        }
    };

    return (
        <div className="fixed z-[99999] font-sans" style={{ bottom: '30px', right: '30px' }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="absolute bottom-24 right-0 w-[400px] h-[650px] bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="bg-slate-900 p-8 flex justify-between items-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-14 h-14 bg-sky-500 rounded-[22px] flex items-center justify-center shadow-lg shadow-sky-500/20">
                                    <Sparkles size={28} className="text-slate-900" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl tracking-tight leading-none">Seaman AI</h3>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Intelligence</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="relative z-10 bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col gap-6">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    {msg.type === 'text' && (
                                        <div className={`max-w-[85%] px-5 py-4 rounded-[28px] text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-slate-900 text-white rounded-br-none'
                                            : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                                            }`}>
                                            <div dangerouslySetInnerHTML={{
                                                __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-black">$1</strong>')
                                            }} />
                                            {msg.action && (
                                                <button
                                                    onClick={() => { navigate(msg.action.path); setIsOpen(false); }}
                                                    className="mt-4 bg-sky-500 text-slate-900 px-4 py-2.5 rounded-xl font-black text-xs transition-all w-full flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10"
                                                >
                                                    {msg.action.label} <ArrowRight size={14} />
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {msg.type === 'product-card' && (
                                        <div className="bg-white p-4 rounded-[32px] shadow-xl border border-slate-100 max-w-[85%] w-72 group">
                                            <div className="relative h-44 mb-4 rounded-2xl overflow-hidden bg-slate-100">
                                                <img
                                                    src={msg.data.image ? (msg.data.image.startsWith('http') ? msg.data.image : `${API_URL}${msg.data.image}`) : 'https://placehold.co/400x300?text=SeamanFresh'}
                                                    alt={msg.data.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black text-white shadow-xl">
                                                    {getFinalPrice(msg.data)}
                                                </div>
                                            </div>
                                            <h4 className="font-black text-slate-900 mb-1 text-lg uppercase tracking-tight">{msg.data.name}</h4>
                                            <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">{msg.data.category || 'Premium'} • {msg.data.stock_quantity > 0 ? 'Freshly Harvested' : 'Out of Stock'}</p>
                                            <button
                                                onClick={() => addToCart(msg.data, 1)}
                                                disabled={msg.data.stock_quantity <= 0}
                                                className="w-full bg-slate-900 hover:bg-sky-500 text-white hover:text-slate-900 font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-300 shadow-lg"
                                            >
                                                <ShoppingCart size={16} /> Add to Order
                                            </button>
                                        </div>
                                    )}

                                    {msg.type === 'options' && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {msg.options.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionClick(opt)}
                                                    className="text-[10px] bg-white border border-slate-200 text-slate-500 hover:border-sky-500 hover:text-sky-500 px-4 py-2 rounded-full font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-1.5 ml-4">
                                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-sky-500/60 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-sky-500/30 rounded-full animate-bounce delay-150"></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-8 bg-white border-t border-slate-50 relative">
                            <form onSubmit={handleSend} className="flex gap-4">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Message Seaman AI..."
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-sky-500 hover:text-slate-900 disabled:opacity-20 transition-all group"
                                >
                                    <Send size={24} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-90 ${isOpen ? 'bg-slate-900 border border-white/10' : 'bg-sky-500 shadow-sky-500/30 ring-4 ring-sky-500/10'
                    }`}
            >
                {isOpen ? (
                    <X size={32} className="text-white" />
                ) : (
                    <div className="relative">
                        <Sparkles size={32} className="text-slate-900 group-hover:rotate-12 transition-transform" />
                    </div>
                )}
            </button>
        </div>
    );
};

export default SeamanAssistant;
