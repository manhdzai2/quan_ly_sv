import React, { useState, useRef, useEffect } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Support({ studentInfo }) {
    const studentName = studentInfo?.user?.name || 'Sinh viên';
    
    // Khởi tạo Chatbot
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            sender: 'ai', 
            text: `Chào ${studentName}! Tôi là trợ lý AI ảo của Trung Tâm Hỗ Trợ Sinh Viên. Tôi có thể giải đáp nhanh các thắc mắc về điểm số, học phí, lịch thi, và thủ tục hành chính. Xin hỏi bạn cần hỗ trợ về chủ đề gì?`,
            time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Bộ não AI nâng cấp (Knowledge Base Engine)
    const generateAiResponse = (userText) => {
        const text = userText.toLowerCase().trim();
        
        const knowledgeBase = [
            {
                keywords: ['điểm', 'kết quả', 'thành tích'],
                response: "Bạn có thể xem điểm chi tiết trong phần 'Hồ sơ cá nhân'. Nếu điểm có sai sót, bạn cần liên hệ ngay với Giảng viên bộ môn hoặc làm Đơn phúc khảo nộp tại phòng Giáo vụ trong vòng 7 ngày kể từ khi công bố điểm."
            },
            {
                keywords: ['học phí', 'đóng tiền', 'tiền học'],
                response: "Học phí học kỳ này phải được hoàn thành trước ngày 30/11. Bạn có thể thanh toán trực tiếp tại Phòng Tài vụ hoặc chuyển khoản qua hệ thống Thanh toán Đại Học Lumina. Nếu gặp khó khăn, bạn có thể làm đơn xin gia hạn học phí nhé."
            },
            {
                keywords: ['lịch thi', 'khi nào thi', 'ngày thi'],
                response: "Lịch thi dự kiến sẽ được sắp xếp trước kỳ thi 2 tuần. Hệ thống sẽ tự động hiển thị vào mục 'Thời khóa biểu'. Đừng quên mang theo Thẻ sinh viên khi vào phòng thi!"
            },
            {
                keywords: ['bảo lưu', 'thôi học', 'tạm nghỉ'],
                response: "Để làm thủ tục bảo lưu, bạn cần mang Thẻ sinh viên lên trực tiếp Phòng Công Tác Sinh Viên (Phòng 101-A) để điền mẫu đơn. Thời gian duyệt thường mất 3-5 ngày làm việc, không hỗ trợ làm thủ tục này trực tuyến."
            },
            {
                keywords: ['thi lại', 'học lại', 'cải thiện', 'rớt môn', 'rớt'],
                response: "Nếu điểm tổng kết hệ 10 của bạn dưới 4.0, bạn không đạt học phần đó. Bạn sẽ phải đăng ký 'Học lại' môn này ở các học kỳ tiếp theo (không có thi lại đối với tín chỉ). Đăng ký học lại sẽ mở cùng khung thời gian Đăng ký tín chỉ."
            },
            {
                keywords: ['tín chỉ', 'đăng ký môn', 'rút môn', 'đktc'],
                response: "Cổng đăng ký tín chỉ mở vào tuần thứ 15 của học kỳ trước đó. Bạn có thể đăng ký tối đa 24 TC và tối thiểu 12 TC. Nếu muốn rút bớt học phần, bạn phải thao tác trước khi 20% thời lượng môn học trôi qua."
            },
            {
                keywords: ['điểm danh', 'vắng', 'nghỉ học', 'chuyên cần'],
                response: "Mức điểm Chuyên Cần chiếm 10% tổng điểm môn học. Chú ý: Theo quy chế, nếu bạn vắng mặt ngang qua 20% số tiết (bất kể có phép hay không), bạn sẽ bị CẤM THI môn đó gốc."
            },
            {
                keywords: ['thực tập', 'đồ án', 'khóa luận', 'tốt nghiệp'],
                response: "Sinh viên năm cuối (tích lũy đủ từ 100 tín chỉ trở lên) sẽ đủ điều kiện làm Đồ án hoặc Thực tập tốt nghiệp. Khoa sẽ có thông báo chi tiết và tổ chức seminar định hướng vào đầu kỳ 8."
            },
            {
                keywords: ['học bổng', 'khuyến khích', 'rèn luyện'],
                response: "Học bổng KKHT được xét mỗi học kỳ dựa trên 2 tiêu chí là Điểm trung bình học tập (GPA >= 2.5) và Điểm rèn luyện. Tùy theo xếp loại Khá, Giỏi, Xuất sắc của ngân sách khoa mà bạn sẽ được cấp 50% hoặc 100% học phí cấp tương đương."
            },
            {
                keywords: ['mật khẩu', 'quên pass', 'tài khoản', 'đăng nhập'],
                response: "Nếu bạn quên mật khẩu đăng nhập Cổng Học Vụ Đại Học Lumina, hãy dùng nút 'Quên mật khẩu' trên màn hình Login để nhận mã qua Email. Nếu tài khoản bị khóa, vui lòng mang thẻ sinh viên xuống phòng IT hỗ trợ (404-C)."
            },
            {
                keywords: ['giờ học', 'thời gian', 'ca học'],
                response: "Trường quy định ca sáng từ 07:00 đến 11:45. Ca chiều từ 13:00 đến 17:45. Khi nào có tiết và phòng cụ thể, phòng Đào tạo sẽ update trực tiếp vào mục 'Thời Khóa Biểu' của bạn."
            },
            {
                keywords: ['cách học tốt', 'điểm cao', 'không hiểu bài', 'tư vấn'],
                response: "Ở môi trường đại học, tự tìm tòi là quan trọng nhất! Bạn nên đọc trước giáo trình ở nhà, tự giác làm bài tập và đừng ngần ngại hỏi giảng viên nếu khúc mắc. Hãy rủ nhóm bạn thân lên thư viện tự học hàng tuần nhé! 💪"
            },
            {
                keywords: ['xin chào', 'hi ', 'chào', 'hello', 'chao'],
                response: `Xin chào ${studentName}! Hôm nay bạn có một ngày tuyệt vời chứ? Cần mình giúp tìm hiểu thông tin học vụ, thời khóa biểu, hay quy chế thi cử nào không?`
            },
            {
                keywords: ['cảm ơn', 'thanks', 'cám ơn', 'tuyệt vời', 'ok'],
                response: "Không có chi cả! Bất cứ lúc nào cần giải đáp quy chế môn học, cứ vào đây hỏi mình nhé. Chúc bạn một ngày năng suất!"
            }
        ];

        // Tìm đáp án trong Knowledge Base
        for (const item of knowledgeBase) {
            if (item.keywords.some(kw => text.includes(kw))) {
                return item.response;
            }
        }

        // Trường hợp không hiểu (Fallback)
        return "Xin lỗi, thắc mắc của bạn có thể hơi tinh tế và nằm ngoài dữ liệu tự động của mình. Mình đã tự ghi nhận và chuyển câu hỏi này cho Bộ phận Hỗ trợ Học vụ. Thầy/Cô cố vấn sẽ gửi phản hồi chi tiết tới Email sinh viên của bạn trong 1 ngày làm việc.";
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: inputValue,
            time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Giả lập AI đang gõ chữ (delay 1s-2s)
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                sender: 'ai',
                text: generateAiResponse(userMsg.text),
                time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    // Chuẩn bị giao diện gợi ý nhanh
    const quickQuestions = [
        "Xem điểm tổng kết ở đâu?",
        "Khi nào hết hạn nộp học phí?",
        "Rớt môn thì phải học lại thế nào?",
        "Hỏi về thủ tục đăng ký tín chỉ",
        "Nghỉ học mấy buổi bị cấm thi?",
        "Điều kiện nhận học bổng"
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] pb-4">
            <Head title="Hỗ Trợ Sinh Viên (AI)" />

            {/* Header */}
            <div className="shrink-0 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/20">
                        <span className="material-symbols-outlined text-2xl">support_agent</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface leading-none">Trung Tâm Hỗ Trợ 24/7</h2>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-secondary flex items-center gap-1 mt-1">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            AI Đang Trực Tuyến
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col relative">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--tw-gradient-stops))', '--tw-gradient-from': '#000', '--tw-gradient-to': 'transparent', '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)', backgroundSize: '10px 10px' }}></div>
                
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    {msg.sender === 'ai' && (
                                        <div className="w-8 h-8 rounded-full bg-surface-container flex shrink-0 items-center justify-center border border-outline-variant/10 shadow-sm">
                                            <span className="material-symbols-outlined text-[16px] text-primary">robot_2</span>
                                        </div>
                                    )}
                                    
                                    {/* Message Bubble */}
                                    <div className="flex flex-col gap-1">
                                        <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                                            msg.sender === 'user' 
                                            ? 'bg-primary text-on-primary rounded-br-sm' 
                                            : 'bg-surface text-on-surface border border-outline-variant/10 rounded-bl-sm'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        <span className={`text-[10px] text-on-surface-variant font-medium ${msg.sender === 'user' ? 'text-right pr-2' : 'text-left pl-2'}`}>
                                            {msg.time} {msg.sender === 'ai' && '• Trợ lý AI'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-surface-container flex shrink-0 items-center justify-center border border-outline-variant/10 shadow-sm">
                                    <span className="material-symbols-outlined text-[16px] text-primary">robot_2</span>
                                </div>
                                <div className="p-4 rounded-2xl rounded-bl-sm bg-surface text-on-surface border border-outline-variant/10 flex gap-1">
                                    <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions (Tags) */}
                <div className="px-4 pb-2 pt-2 md:px-6 overflow-x-auto whitespace-nowrap hide-scrollbar border-t border-outline-variant/5 bg-surface-container-lowest relative z-10">
                    <div className="flex gap-2">
                        {quickQuestions.map((q, idx) => (
                            <button 
                                key={idx}
                                onClick={() => {
                                    setInputValue(q);
                                }}
                                className="inline-flex items-center pb-1 text-xs font-medium text-on-surface-variant bg-surface px-3 py-1.5 rounded-full border border-outline-variant/10 hover:border-primary/30 hover:text-primary transition-colors shrink-0"
                            >
                                <span className="material-symbols-outlined text-[14px] mr-1">lightbulb</span>
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 bg-surface-container-lowest border-t border-outline-variant/10 relative z-10">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input 
                            type="text" 
                            className="flex-1 bg-surface border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-on-surface-variant/50"
                            placeholder="Nhập câu hỏi của bạn (VD: học phí, lịch thi...)"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            disabled={!inputValue.trim() || isTyping}
                            className="w-12 md:w-auto md:px-6 h-[46px] rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <span className="material-symbols-outlined md:mr-2">send</span>
                            <span className="hidden md:inline">Gửi Ngay</span>
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

Support.layout = page => <StudentLayout children={page} />;
