import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Fish, ShoppingBag, User, ChefHat, Info, Sparkles, Loader, ShoppingCart, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import API_URL from '../config';

const SeamanAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Ahoy! 🌊 I'm Seaman, your smart seafood expert. How can I help you today?",
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
        scrollToBottom();
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
        pairing: {
            salmon: "Salmon pairs beautifully with asparagus, roasted potatoes, or a fresh quinoa salad.",
            shrimp: "Shrimp goes great with pasta, grits, or in a fresh taco with slaw.",
            tuna: "Serve seared tuna with asian slaw, steamed rice, or cucumber salad.",
            whitefish: "Flaky white fish (Cod, Tilapia) pairs well with rice pilaf, steamed veggies, or in tacos."
        },
        funFacts: [
            "Salmon are anadromous, meaning they live in both fresh and salt water! 🌊",
            "Shrimp hearts are located in their heads! 🦐",
            "Some tuna can swim up to 43 miles per hour! 🏎️",
            "Oysters can switch genders. Nature is wild! 🦪",
            "Lobsters taste with their legs! 🦞",
            "Crabs communicate by drumming their claws. 🦀"
        ]
    };

    const handleSend = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;

        // User Message
        const userMsg = { id: Date.now(), text, sender: 'user', type: 'text' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Artificial Intelligence Simulation
        setTimeout(() => {
            processMessage(text);
        }, 1200); // Realistic delay
    };

    const playNotification = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
        audio.volume = 0.4;
        audio.play().catch(() => { });
    };

    const processMessage = (text) => {
        const lowerText = text.toLowerCase();
        let responses = [];
        let newContext = { ...context };

        // Helper: Find Product
        const matchedProduct = products.find(p => lowerText.includes(p.name.toLowerCase()));

        // Context Resolution
        const product = matchedProduct || (['it', 'that', 'this', 'fish'].some(w => lowerText.includes(w)) ? newContext.lastProduct : null);

        if (matchedProduct) newContext.lastProduct = matchedProduct;

        // --- Intent: Buy / Add to Cart ---
        if (lowerText.match(/buy|cart|add|purchase|get/)) {
            if (product) {
                responses.push({
                    text: `Excellent choice! Fresh ${product.name} is available.`,
                    sender: 'bot', type: 'text'
                });
                responses.push({
                    type: 'product-card',
                    sender: 'bot',
                    data: product
                });
            } else {
                responses.push({
                    text: "What would you like to buy? We have amazing Salmon, Tuna, Shrimp, and more!",
                    sender: 'bot', type: 'text'
                });
            }
        }
        // --- Intent: Recipe / Cooking ---
        else if (lowerText.match(/recipe|cook|make|prepare|eat/)) {
            let found = false;
            if (product) {
                // Check exact recipe match
                for (const [key, val] of Object.entries(knowledgeBase.recipes)) {
                    if (product.name.toLowerCase().includes(key)) {
                        responses.push({ text: val, sender: 'bot', type: 'text' });
                        found = true;

                        // Upsell
                        responses.push({
                            text: "Would you like to add some to your cart to try this recipe?",
                            sender: 'bot', type: 'options',
                            options: [`Buy ${product.name}`, 'No thanks']
                        });
                        break;
                    }
                }
            }
            if (!found) {
                responses.push({
                    text: "I have great recipes! Try asking for 'Salmon recipe' or 'How to cook shrimp'.",
                    sender: 'bot', type: 'text'
                });
            }
        }
        // --- Intent: Price / Stock ---
        else if (lowerText.match(/price|cost|how much|stock|available/)) {
            if (product) {
                responses.push({
                    text: `${product.name} is currently $${(product.price * (1 - (product.discount_percent || 0) / 100)).toFixed(2)}/kg${product.discount_percent ? ` (including ${product.discount_percent}% discount!)` : ''}. We have ${product.stock_quantity}kg fresh in stock!`,
                    sender: 'bot', type: 'text'
                });
                responses.push({
                    type: 'product-card', sender: 'bot', data: product
                });
            } else if (lowerText.includes('price')) {
                responses.push({ text: "Our prices vary by catch. Check out our catalog!", sender: 'bot', type: 'text', action: { label: 'View Catalog', path: '/products' } });
            }
        }
        // --- Intent: Facts / Fun ---
        else if (lowerText.match(/fact|joke|fun|tell me/)) {
            const randomFact = knowledgeBase.funFacts[Math.floor(Math.random() * knowledgeBase.funFacts.length)];
            responses.push({ text: randomFact, sender: 'bot', type: 'text' });
        }
        // --- Intent: Greetings ---
        else if (lowerText.match(/hello|hi|hey|ahoy|start/)) {
            responses.push({ text: "Ahoy there! ⚓ Ready to find some fresh catches?", sender: 'bot', type: 'text' });
            responses.push({ type: 'options', sender: 'bot', options: ['Browse Products', 'Todays Deals', 'Help'] });
        }
        // --- Default / Fallback ---
        else {
            responses.push({
                text: "I'm still learning the waters! 🌊 Try asking about recipes, prices, or specific fish like Salmon or Tuna.",
                sender: 'bot', type: 'text'
            });
            responses.push({
                type: 'options', sender: 'bot', options: ['See Recipes 🍳', 'View Products 🐟', 'My Cart 🛒']
            });
        }

        setIsTyping(false);
        setMessages(prev => [...prev, ...responses.map(r => ({ ...r, id: Date.now() + Math.random() }))]);
        setContext(newContext);
        playNotification();
    };

    const handleOptionClick = (option) => {
        if (option.includes('Buy') || option.includes('Add')) {
            const name = option.replace('Buy ', '').replace('Add ', '');
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
            processMessage(option);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: `Added 1kg of ${product.name} to your cart! 🛒`,
            sender: 'bot',
            type: 'text'
        }]);
    };

    return (
        <div className="fixed z-[99999] font-sans" style={{ bottom: '30px', right: '30px' }}>
            {/* Chat Box */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-fade-in">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-ocean p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                <Sparkles size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-none">Seaman AI</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <p className="text-xs text-white/80 font-medium">Online</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>

                                {msg.type === 'text' && (
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-slate-800 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                        }`}>
                                        <div dangerouslySetInnerHTML={{
                                            __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        }} />
                                        {msg.action && (
                                            <button
                                                onClick={() => { navigate(msg.action.path); setIsOpen(false); }}
                                                className="mt-3 text-xs bg-ocean/10 text-ocean hover:bg-ocean hover:text-white px-3 py-2 rounded-lg font-bold transition-all w-full flex items-center justify-center gap-2"
                                            >
                                                {msg.action.label} <ArrowRight size={12} />
                                            </button>
                                        )}
                                    </div>
                                )}

                                {msg.type === 'product-card' && (
                                    <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100 max-w-[85%] w-64 animate-fade-in">
                                        <div className="relative h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={msg.data.image_url ? `${API_URL}${msg.data.image_url}` : 'https://placehold.co/300x200?text=Fish'}
                                                alt={msg.data.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-ocean shadow-sm">
                                                {msg.data.discount_percent > 0 ? (
                                                    <div className="flex flex-col items-end leading-tight">
                                                        <span className="text-[10px] line-through text-gray-400">${msg.data.price}</span>
                                                        <span>${(msg.data.price * (1 - msg.data.discount_percent / 100)).toFixed(2)}/kg</span>
                                                    </div>
                                                ) : (
                                                    `$${msg.data.price}/kg`
                                                )}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-1">{msg.data.name}</h4>
                                        <p className="text-xs text-gray-500 mb-3">{msg.data.category} • In Stock</p>
                                        <button
                                            onClick={() => handleAddToCart(msg.data)}
                                            className="w-full bg-ocean hover:bg-ocean-dark text-white text-xs font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Plus size={14} /> Add to Cart
                                        </button>
                                    </div>
                                )}

                                {msg.type === 'options' && (
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {msg.options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionClick(opt)}
                                                className="text-xs bg-white border border-ocean/20 text-ocean hover:bg-ocean hover:text-white px-3 py-2 rounded-full font-medium transition-all shadow-sm"
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-1.5 ml-2">
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3 shadow-lg">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about fish, recipes..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean/20 focus:border-ocean transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="w-10 h-10 bg-ocean text-white rounded-full flex items-center justify-center shadow-lg hover:bg-ocean-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                        >
                            <Send size={18} className="translate-x-0.5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-tr from-ocean to-cyan-400'
                    }`}
            >
                {isOpen ? (
                    <X size={32} className="text-white" />
                ) : (
                    <div className="relative">
                        <Sparkles size={32} className="text-white animate-pulse" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400 border-2 border-ocean"></span>
                        </span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default SeamanAssistant;
