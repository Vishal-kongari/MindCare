import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, AlertTriangle, Phone, Mail, CheckCircle } from "lucide-react";
import { getAuthInstance, getDb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface PopupChatProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserProfile {
    name: string;
    phoneNumber?: string;
    guardianName: string;
    guardianPhone: string;
    guardianEmail?: string;
}

interface AlertNotificationProps {
    isVisible: boolean;
    onClose: () => void;
    studentName: string;
    guardianName: string;
    guardianPhone: string;
    message: string;
}

// Emergency Call function
const makeEmergencyCall = async (phoneNumber: string, contactType: string, studentName: string) => {
    try {
        console.log(`📞 EMERGENCY CALL SIMULATION:`);
        console.log(`   To: ${phoneNumber}`);
        console.log(`   Contact Type: ${contactType}`);
        console.log(`   Student: ${studentName}`);
        console.log(`   Message: "URGENT: ${studentName} may be in distress and needs immediate attention."`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            success: true,
            callSid: `CA${Math.random().toString(36).substr(2, 32)}`,
            status: 'initiated',
            message: `Emergency call initiated to ${contactType}`
        };
    } catch (error) {
        console.error('Emergency call failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

// Emergency Email function
const sendEmergencyEmail = async (profile: UserProfile) => {
    try {
        console.log(`📧 EMERGENCY EMAIL SIMULATION:`);
        console.log(`   To: emergency@mentalhealthplatform.com`);
        console.log(`   Subject: URGENT: Mental Health Alert - ${profile.name}`);
        console.log(`   Student: ${profile.name}`);
        console.log(`   Student Phone: ${profile.phoneNumber || 'Not available'}`);
        console.log(`   Guardian Phone: ${profile.guardianPhone || 'Not available'}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            success: true,
            messageId: `msg_${Math.random().toString(36).substr(2, 32)}`,
            status: 'sent',
            message: 'Emergency email sent to support team'
        };
    } catch (error) {
        console.error('Emergency email failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
};

// Alert Notification Component
const AlertNotification = ({
    isVisible,
    onClose,
    studentName,
    guardianName,
    guardianPhone,
    message
}: AlertNotificationProps) => {
    const [callStatus, setCallStatus] = useState<'pending' | 'success' | 'error'>('pending');
    const [emailStatus, setEmailStatus] = useState<'pending' | 'success' | 'error'>('pending');

    useEffect(() => {
        if (isVisible) {
            // Reset statuses when alert becomes visible
            setCallStatus('pending');
            setEmailStatus('pending');

            // Simulate making emergency call
            const callTimer = setTimeout(() => {
                makeEmergencyCall(guardianPhone, 'Guardian', studentName)
                    .then(result => {
                        setCallStatus(result.success ? 'success' : 'error');
                    });
            }, 1500);

            // Simulate sending emergency email
            const emailTimer = setTimeout(() => {
                sendEmergencyEmail({
                    name: studentName,
                    guardianName,
                    guardianPhone,
                    phoneNumber: '123-456-7890'
                }).then(result => {
                    setEmailStatus(result.success ? 'success' : 'error');
                });
            }, 2500);

            return () => {
                clearTimeout(callTimer);
                clearTimeout(emailTimer);
            };
        }
    }, [isVisible, guardianPhone, studentName, guardianName]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 p-6 bg-white rounded-xl shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">Emergency Alert Sent</h3>
                            <p className="text-sm text-gray-600">We detected concerning content in the chat</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0 rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-red-800 mb-1">Concerning message:</p>
                    <p className="text-sm text-red-700 italic">"{message}"</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm font-medium">Calling {guardianName}</p>
                                <p className="text-xs text-gray-500">{guardianPhone}</p>
                            </div>
                        </div>
                        <div>
                            {callStatus === 'pending' && (
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            )}
                            {callStatus === 'success' && (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            )}
                            {callStatus === 'error' && (
                                <span className="text-xs text-red-500">Failed</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm font-medium">Emailing Support Team</p>
                                <p className="text-xs text-gray-500">Emergency alert initiated</p>
                            </div>
                        </div>
                        <div>
                            {emailStatus === 'pending' && (
                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            )}
                            {emailStatus === 'success' && (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            )}
                            {emailStatus === 'error' && (
                                <span className="text-xs text-red-500">Failed</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        This alert was triggered by our system detecting potentially concerning content.
                        If this was a false positive, please ignore this notification.
                    </p>
                </div>
            </Card>
        </div>
    );
};

const PopupChat = ({ isOpen, onClose }: PopupChatProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [lastAlertTime, setLastAlertTime] = useState<number>(0);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load conversation and profile on mount
    useEffect(() => {
        const saved = localStorage.getItem('gemini-chat-conversation');
        if (saved) {
            try {
                const parsedMessages = JSON.parse(saved).map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
                setMessages(parsedMessages);
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        }

        let unsubscribe = () => {};
        getAuthInstance().then((auth) => {
            unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const db = await getDb();
                    const snap = await getDoc(doc(db, 'users', user.uid));
                    if (snap.exists()) {
                        const data = snap.data();
                        setUserProfile({
                            name: data.name || '',
                            phoneNumber: data.phoneNumber || '',
                            guardianName: data.guardian || '',
                            guardianPhone: data.guardianPhone || '',
                            guardianEmail: data.guardianEmail || undefined
                        });
                    }
                } else {
                    setUserProfile(null);
                }
            });
        });
        return () => unsubscribe();
    }, []);

    // Save conversation to localStorage whenever messages change
    useEffect(() => {
        localStorage.setItem('gemini-chat-conversation', JSON.stringify(messages));
    }, [messages]);

    // Depression detection function
    const detectDepressionSignals = (text: string): boolean => {
        const concerningPhrases = [
            'i want to die', 'kill myself', 'end it all', 'no reason to live',
            'suicide', 'want to disappear', 'better off without me', 'hate myself',
            'can\'t go on', 'tired of living', 'give up', 'self harm', 'hurt myself',
            'never be happy', 'nothing matters', 'hopeless', 'helpless', 'worthless'
        ];

        const lowercaseText = text.toLowerCase();
        return concerningPhrases.some(phrase => lowercaseText.includes(phrase));
    };

    // Trigger emergency alert
    const triggerEmergencyAlert = async (message: string) => {
        // Prevent too frequent alerts (at least 30 minutes between alerts)
        const now = Date.now();
        if (now - lastAlertTime < 30 * 60 * 1000) {
            console.log('Alert skipped: too soon since last alert');
            return;
        }

        if (!userProfile) {
            console.error('Cannot trigger alert: no user profile');
            return;
        }

        setLastAlertTime(now);
        setAlertMessage(message);
        setShowAlert(true);

        console.log('🚨 DEPRESSION ALERT TRIGGERED');
        console.log(`Message: ${message}`);
        console.log(`User: ${userProfile.name}`);

        // Call guardian
        if (userProfile.guardianPhone) {
            await makeEmergencyCall(
                userProfile.guardianPhone,
                'Guardian',
                userProfile.name
            );
        }

        // Send email alert
        await sendEmergencyEmail(userProfile);
    };

    const sendToGemini = async (prompt: string): Promise<string> => {
        const apiKey = "AIzaSyDLQPM-0CH_RdjgQAtf_4v7-e-ddz7LcoU";

        // Enhanced system prompt for mental health support
        const systemPrompt = `You are a compassionate mental wellness assistant designed to help students with their mental health and emotional wellbeing. You should:

1. **Be empathetic and supportive** - Show genuine care and understanding
2. **Provide practical advice** - Offer actionable coping strategies and techniques
3. **Maintain professional boundaries** - While being warm, stay within appropriate limits
4. **Encourage professional help** - Suggest seeking professional counseling when appropriate
5. **Be conversational** - Respond naturally and build on the conversation
6. **Focus on mental health** - Specialize in stress, anxiety, depression, academic pressure, and student life challenges
7. **Be encouraging** - Help build confidence and hope
8. **Ask thoughtful questions** - Show interest in their wellbeing and progress

Remember: You're having a real-time conversation. Reference previous messages naturally and build rapport. Keep responses helpful but not overly long (2-3 sentences typically).`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `${systemPrompt}\n\nConversation history:\n${messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n')}\n\nUser: ${prompt}`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 300,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse();
            return reply.trim();
        } catch (error) {
            console.error('Gemini API error:', error);
            return getFallbackResponse();
        }
    };

    const getFallbackResponse = (): string => {
        const fallbackResponses = [
            "I'm here to listen and support you. Can you tell me more about what's on your mind?",
            "It sounds like you're going through a tough time. Your feelings are valid and important.",
            "I'm really glad you reached out. Sometimes just talking about what we're experiencing can help.",
            "I can hear that you're struggling right now. You're not alone in this, and I'm here to help.",
            "Thank you for trusting me with what you're going through. Let's work through this together.",
            "I'm here to support you through this. What would be most helpful for you right now?",
            "Your wellbeing matters to me. Can you share more about what's been challenging lately?",
            "I appreciate you opening up. How can I best support you today?"
        ];
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const content = input.trim();
        setLoading(true);

        // Check for concerning content
        if (detectDepressionSignals(content) && userProfile) {
            triggerEmergencyAlert(content);
        }

        // Add user message immediately
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        try {
            const reply = await sendToGemini(content);
            const assistantMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: reply,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: "I'm having trouble responding right now. Can you try again?",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearConversation = () => {
        setMessages([]);
        localStorage.removeItem('gemini-chat-conversation');
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50">
                <Card className={`border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
                    }`}>
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">AI Wellness Assistant</p>
                                <p className="text-xs opacity-90">Powered by Gemini</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {messages.length > 0 && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={clearConversation}
                                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                                    title="Clear conversation"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                                title={isMinimized ? "Maximize" : "Minimize"}
                            >
                                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onClose}
                                className="h-8 w-8 p-0 text-white hover:bg-white/20"
                                title="Close chat"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-auto p-4 space-y-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                <p className="text-sm font-medium">Start a conversation</p>
                                                <p className="text-xs">I'm here to listen and support you</p>
                                            </div>
                                        ) : (
                                            <>
                                                {messages.map((message) => (
                                                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[80%] flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600'
                                                                }`}>
                                                                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                                            </div>
                                                            <div className={`px-4 py-2 rounded-2xl ${message.role === 'user'
                                                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                                                : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                                                                <div className={`text-xs mt-1 opacity-70 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                                                    }`}>
                                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {loading && (
                                                    <div className="flex justify-start">
                                                        <div className="flex gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                                                                <Bot className="w-4 h-4" />
                                                            </div>
                                                            <div className="px-4 py-2 rounded-2xl bg-gray-100 text-gray-800">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex space-x-1">
                                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                                    </div>
                                                                    <span className="text-xs text-gray-500">AI is thinking...</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                            {/* Input */}
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex items-center gap-3">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 h-11 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                                        onKeyDown={handleKeyPress}
                                        disabled={loading}
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={loading || !input.trim()}
                                        className="h-11 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Card>
            </div>

            <AlertNotification
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
                studentName={userProfile?.name || "Student"}
                guardianName={userProfile?.guardianName || "Guardian"}
                guardianPhone={userProfile?.guardianPhone || ""}
                message={alertMessage}
            />
        </>
    );
};

export default PopupChat;