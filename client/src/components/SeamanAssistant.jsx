import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Fish, ShoppingBag, User, ChefHat, Info, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SeamanAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Ahoy there! 🌊 I'm Seaman. Ask me for recipes, swimmingly good deals, or help with your order!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [products, setProducts] = useState([]);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
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
    }, [messages]);

    const fishKnowledgeBase = {
        recipes: {
            salmon: "Pan-Seared Salmon: 1. Season fillets with salt & pepper. 2. Heat oil in pan over med-high heat. 3. Cook skin-side down for 4-5 mins until crispy. 4. Flip and cook 2-4 mins. Serve with lemon!",
            tuna: "Sesame Crusted Tuna: 1. Pat tuna dry and coat in sesame seeds. 2. Sear in hot oil for 1 min per side (keep it rare!). 3. Slice thinly and serve with soy sauce.",
            shrimp: "Garlic Butter Shrimp: 1. Melt butter in pan. 2. Add garlic and cook 1 min. 3. Add shrimp, cook until pink (2-3 mins). 4. Toss with parsley and lemon juice.",
            tilapia: "Baked Tilapia: 1. Preheat oven to 400°F (200°C). 2. Place fillets on baking sheet. 3. Top with butter, lemon slices, and garlic. 4. Bake for 10-12 mins until flaky."
        },
        facts: {
            salmon: "Salmon is rich in Omega-3 fatty acids, great for heart health!",
            tuna: "Tuna is a high-protein fish. Fun fact: They can swim up to 43 mph!",
            shrimp: "Shrimp are low in calories but high in nutrients like iodine.",
            tilapia: "Tilapia is a mild, freshwater fish that's great for people who don't like 'fishy' tastes."
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // Simulate thinking time
        setTimeout(() => {
            const botResponse = generateResponse(userMessage.text);
            setMessages(prev => [...prev, botResponse]);

            // Play subtle bubble/pop sound for message
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio blocked:", e));
        }, 600);
    };

    const generateResponse = (text) => {
        const lowerText = text.toLowerCase();
        let responseText = "";
        let action = null;

        // 1. Check for specific fish matches in products
        const matchedProduct = products.find(p => lowerText.includes(p.name.toLowerCase()));

        // 2. Logic Router
        if (lowerText.match(/recipe|cook|make|prepare/)) {
            // Recipe Logic
            const fishType = Object.keys(fishKnowledgeBase.recipes).find(f => lowerText.includes(f));
            if (fishType) {
                responseText = `🍽️ **${fishType.charAt(0).toUpperCase() + fishType.slice(1)} Recipe**:\n${fishKnowledgeBase.recipes[fishType]}`;
                if (products.some(p => p.name.toLowerCase().includes(fishType))) {
                    action = { label: `Buy ${fishType}`, path: "/products", icon: <ShoppingBag size={14} /> };
                }
            } else {
                responseText = "I love cooking! Tell me which fish you want a recipe for (e.g., 'Salmon recipe', 'How to cook shrimp').";
            }
        } else if (lowerText.match(/fact|healthy|nutrition|about/)) {
            // Fact Logic
            const fishType = Object.keys(fishKnowledgeBase.facts).find(f => lowerText.includes(f));
            if (fishType) {
                responseText = `🎓 **Did you know?** ${fishKnowledgeBase.facts[fishType]}`;
            } else {
                responseText = "I know lots of fishy facts! Ask me about Salmon, Tuna, Shrimp, or Tilapia.";
            }
        } else if (lowerText.match(/price|cost|buy|shop|store/)) {
            // Shopping Logic
            if (matchedProduct) {
                responseText = `We have fresh ${matchedProduct.name} in stock for $${matchedProduct.price}/kg!`;
                action = { label: "Add to Cart", path: `/product/${matchedProduct.id}`, icon: <ShoppingBag size={14} /> };
            } else {
                responseText = "We have the freshest catch in town! You can see everything in our shop.";
                action = { label: "Go to Shop", path: "/products", icon: <ShoppingBag size={14} /> };
            }
        } else if (lowerText.match(/order|track|status|dashboard/)) {
            responseText = "You can track your deliveries and see past orders in your dashboard.";
            action = { label: "My Dashboard", path: "/dashboard", icon: <User size={14} /> };
        } else if (lowerText.match(/help|support|can you do/)) {
            responseText = "I'm Seaman! 🧜‍♂️ I can:\n• Suggest delicious recipes\n• Tell you cool fish facts\n• Check if items are in stock\n• Help you navigate the store";
        } else if (lowerText.match(/hello|hi|hey|ahoy/)) {
            responseText = "Ahoy matey! ⚓ Ready to find some delicious seafood?";
        } else {
            // Default / Fallback
            responseText = "I'm just a simple fish wizard 🧙‍♂️🐟. I didn't quite catch that. Try asking for a 'recipe' or 'check stock'.";
        }

        return { text: responseText, sender: 'bot', action };
    };

    const handleActionClick = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '100px',
            zIndex: 10000,
            fontFamily: 'var(--font-sans, sans-serif)'
        }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    right: '0',
                    width: '350px',
                    height: '500px', // Slightly taller for recipes
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.05)',
                    animation: 'fadeInUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)',
                        padding: '16px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '32px', height: '32px', background: 'white', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9'
                            }}>
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Seaman</h3>
                                <p style={{ fontSize: '11px', margin: 0, opacity: 0.8 }}>AI Chef & Guide</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', color: 'white', opacity: 0.8 }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: '20px',
                        overflowY: 'auto',
                        background: '#f9fafb',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                            }}>
                                <div style={{
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    background: msg.sender === 'user' ? '#1e293b' : 'white',
                                    color: msg.sender === 'user' ? 'white' : '#1a1a1a',
                                    boxShadow: msg.sender === 'bot' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                                    borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                                    borderBottomLeftRadius: msg.sender === 'bot' ? '2px' : '12px',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    whiteSpace: 'pre-wrap' // To handle newlines in recipes
                                }}>
                                    {msg.text}
                                </div>
                                {msg.action && (
                                    <button
                                        onClick={() => handleActionClick(msg.action.path)}
                                        style={{
                                            marginTop: '8px',
                                            background: 'white',
                                            border: '1px solid #1e293b',
                                            color: '#1e293b',
                                            padding: '8px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {msg.action.icon}
                                        {msg.action.label}
                                    </button>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} style={{
                        padding: '15px',
                        background: 'white',
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        gap: '10px'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for recipes, stock, or help..."
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: '24px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                        <button type="submit" style={{
                            width: '40px', height: '40px',
                            background: '#0ea5e9',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)'
                        }}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)',
                    color: 'white',
                    boxShadow: '0 8px 30px rgba(14, 165, 233, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '4px solid white',
                    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? <X size={28} /> : <Sparkles size={28} />}
            </button>
        </div>
    );
};

export default SeamanAssistant;
