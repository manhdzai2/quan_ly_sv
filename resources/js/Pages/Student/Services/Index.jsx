import React, { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ tuitions, payments, myRequests, services, student }) {
    const [selectedService, setSelectedService] = useState(null);
    const [showPaymentHistory, setShowPaymentHistory] = useState(false);
    const [showRequestHistory, setShowRequestHistory] = useState(false);
    
    const { data, setData, post, processing, reset, errors } = useForm({
        service_id: '',
        service_name: '',
        note: '',
        // Dynamic fields will be added on the fly
    });

    const openService = (service) => {
        const initialData = {
            service_id: service.id,
            service_name: service.name,
            note: ''
        };
        // Initialize dynamic fields
        (service.fields || []).forEach(f => {
            initialData[f.name] = f.type === 'select' && f.options ? f.options[0] : (f.type === 'number' ? f.min || 1 : '');
        });

        setSelectedService(service);
        setData(initialData);
    };

    const closeService = () => setSelectedService(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.services.request'), {
            preserveScroll: true,
            onSuccess: () => closeService()
        });
    };

    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const iv = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    const totalDebt = (tuitions || []).reduce((sum, t) => sum + (t.total_amount - t.paid_amount), 0);
    const totalPayments = (payments || []).filter(p => p.status === 'success').reduce((sum, p) => sum + parseFloat(p.amount), 0);

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Dịch Vụ Hành Chính" />

            <motion.div variants={iv} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Tuition Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-teal-500 via-emerald-600 to-green-700 rounded-3xl p-8 text-white relative flex flex-col justify-between overflow-hidden shadow-lg shadow-emerald-500/20">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-10 -mt-20"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black font-headline tracking-tight">Học Phí & Tài Chính</h2>
                            <p className="text-emerald-100 mt-2 font-medium">Quản lý công nợ và biên lai thanh toán trực tuyến.</p>
                        </div>
                        <span className="material-symbols-outlined text-5xl opacity-80">account_balance_wallet</span>
                    </div>

                    <div className="relative z-10 mt-8 flex flex-col sm:flex-row gap-6 items-end justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-1">Tổng công nợ</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black font-mono">{totalDebt.toLocaleString()}</span>
                                <span className="text-emerald-200 font-bold tracking-widest">VNĐ</span>
                            </div>
                            <p className="text-xs text-emerald-100 mt-1 opacity-80">Tổng lịch sử nộp: {totalPayments.toLocaleString()} VNĐ</p>
                        </div>
                        
                        <div className="flex gap-3">
                            <button onClick={() => setShowPaymentHistory(true)} className="px-5 py-2.5 bg-black/20 hover:bg-black/30 text-white rounded-xl font-bold backdrop-blur-sm transition-colors flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-[18px]">history</span>
                                Lịch Sử Thanh Toán
                            </button>
                            <button className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 text-sm ${totalDebt > 0 ? 'bg-white text-emerald-700 hover:bg-gray-50' : 'bg-white/30 text-white cursor-not-allowed opacity-50'}`}>
                                <span className="material-symbols-outlined text-[18px]">payments</span>
                                Thanh Toán
                            </button>
                        </div>
                    </div>
                </div>

                {/* QR Code M-Code Payment */}
                <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm flex flex-col items-center justify-center relative overflow-hidden text-center group">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1 uppercase tracking-wider">Mã QR Thanh Toán</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">Sử dụng Mobile Banking để quét.</p>
                    
                    <div className="bg-white border text-center border-indigo-100 rounded-2xl p-3 shadow-sm mx-auto">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FBU_PAY_DEBT_${student.student_code}`} alt="QR M-Code" className="w-32 h-32 opacity-90 transition-opacity duration-300 mx-auto" />
                    </div>
                    
                    <p className="mt-4 text-[11px] font-bold text-slate-500 uppercase">Cú pháp chuyển khoản:</p>
                    <p className="text-sm font-bold font-mono text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-lg mt-1">{student.student_code} HOC PHI</p>
                </div>
            </motion.div>

            {/* Danh sách học phí chi tiết */}
            <motion.div variants={iv} className="bg-white dark:bg-slate-800/60 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-900/30">
                    <h3 className="text-lg font-black font-headline text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-500 text-xl">receipt_long</span> Bảng Kê Học Phí
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                                <th className="p-4 pl-6">Học Kỳ</th>
                                <th className="p-4 text-right">Tổng Mức Đóng</th>
                                <th className="p-4 text-right">Đã Nộp</th>
                                <th className="p-4 text-right">Công Nợ</th>
                                <th className="p-4 text-center">Hạn Nộp</th>
                                <th className="p-4 pr-6 text-right">Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                            {(tuitions || []).map(t => {
                                const remaining = t.total_amount - t.paid_amount;
                                const isPaid = remaining <= 0;
                                return (
                                    <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="p-4 pl-6 font-bold text-sm text-gray-900 dark:text-white">{t.semester}</td>
                                        <td className="p-4 text-right font-mono text-gray-600 dark:text-slate-300">{parseFloat(t.total_amount).toLocaleString()} ₫</td>
                                        <td className="p-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-medium">{parseFloat(t.paid_amount).toLocaleString()} ₫</td>
                                        <td className="p-4 text-right font-mono text-rose-500 font-bold">{remaining > 0 ? `${remaining.toLocaleString()} ₫` : '-'}</td>
                                        <td className="p-4 text-center text-xs text-gray-500">{new Date(t.deadline).toLocaleDateString('vi-VN')}</td>
                                        <td className="p-4 pr-6 text-right">
                                            <span className={`inline-flex px-2 py-1 text-[10px] font-black uppercase rounded-lg ${isPaid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                                                {isPaid ? 'ĐÃ HOÀN TẤT' : 'CHƯA HOÀN TẤT'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* E-Services (Một cửa) */}
            <motion.div variants={cv} className="bg-white dark:bg-slate-800/60 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-blue-50/50 dark:bg-blue-900/10">
                    <h3 className="text-lg font-black font-headline text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500 text-xl">assured_workload</span> Dịch Vụ Sinh Viên Điện Tử
                    </h3>
                    <button onClick={() => setShowRequestHistory(true)} className="px-4 py-2 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span> Lịch Sử Yêu Cầu
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(services || []).map((cat, idx) => (
                            <div key={idx}>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">{cat.category}</h4>
                                <div className="space-y-3">
                                    {cat.items.map(s => (
                                        <button key={s.id} onClick={() => openService(s)} className="w-full flex justify-between items-center p-4 rounded-2xl bg-gray-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md border border-gray-100 dark:border-slate-700 text-left transition-all group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 transition-colors">{s.name}</p>
                                                    <p className="text-[10px] text-gray-500 mt-0.5">Xử lý: 1-2 ngày</p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">chevron_right</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* MODAL: LỊCH SỬ THANH TOÁN */}
            <AnimatePresence>
                {showPaymentHistory && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-emerald-500">receipt</span> Lịch Sử Giao Dịch
                                </h3>
                                <button onClick={() => setShowPaymentHistory(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-500">
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>
                            <div className="p-5 overflow-y-auto">
                                <div className="space-y-4">
                                    {(payments || []).length === 0 ? (
                                        <p className="text-center text-gray-500 py-10">Chưa có giao dịch nào.</p>
                                    ) : (
                                        (payments || []).map(p => (
                                            <div key={p.id} className="flex justify-between items-center bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 p-4 rounded-2xl">
                                                <div className="flex gap-4 items-center">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${p.status === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                                        <span className="material-symbols-outlined">{p.status === 'success' ? 'check' : 'close'}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">{p.semester}</p>
                                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{p.method} • Mã: {p.transaction_id || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`font-mono font-black text-lg ${p.status === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                        {p.status === 'success' ? '+' : ''}{parseFloat(p.amount).toLocaleString()} ₫
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 mt-1">{p.date}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL: LỊCH SỬ YÊU CẦU DỊCH VỤ */}
            <AnimatePresence>
                {showRequestHistory && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-500">list_alt</span> Lịch Sử Yêu Cầu Dịch Vụ
                                </h3>
                                <button onClick={() => setShowRequestHistory(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-500">
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>
                            <div className="p-0 overflow-y-auto w-full">
                                <table className="w-full text-left">
                                    <thead className="sticky top-0 bg-white dark:bg-slate-900 shadow-sm z-10">
                                        <tr className="border-b border-gray-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-gray-500">
                                            <th className="p-4 pl-6">Mã / Dịch Vụ</th>
                                            <th className="p-4">Ngày Yêu Cầu</th>
                                            <th className="p-4">Trạng Thái</th>
                                            <th className="p-4 pr-6">Chi Tiết Cán bộ xử lý</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                                        {(myRequests || []).length === 0 ? (
                                            <tr><td colSpan="4" className="p-10 text-center text-gray-500">Chưa có yêu cầu nào.</td></tr>
                                        ) : (
                                            (myRequests || []).map(r => (
                                                <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 align-top">
                                                    <td className="p-4 pl-6">
                                                        <div className="font-bold text-sm text-gray-900 dark:text-white">{r.service_name}</div>
                                                        <div className="text-[10px] text-gray-500 font-mono mt-1">REQ-{r.id.toString().padStart(5, '0')}</div>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-600 dark:text-slate-400">{r.date}</td>
                                                    <td className="p-4">
                                                        {r.status === 'pending' && <span className="bg-amber-100 text-amber-700 font-bold uppercase text-[10px] px-2 py-1 rounded-lg">Đang chờ</span>}
                                                        {r.status === 'processing' && <span className="bg-blue-100 text-blue-700 font-bold uppercase text-[10px] px-2 py-1 rounded-lg">Đang xử lý</span>}
                                                        {r.status === 'completed' && <span className="bg-emerald-100 text-emerald-700 font-bold uppercase text-[10px] px-2 py-1 rounded-lg">Đã hoàn thành</span>}
                                                        {r.status === 'rejected' && <span className="bg-rose-100 text-rose-700 font-bold uppercase text-[10px] px-2 py-1 rounded-lg">Bị từ chối</span>}
                                                    </td>
                                                    <td className="p-4 pr-6">
                                                        {r.response_note ? (
                                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30 text-xs text-blue-900 dark:text-blue-300">
                                                                <div className="font-bold flex items-center gap-1 mb-1"><span className="material-symbols-outlined text-[14px]">comment</span> Phản hồi:</div>
                                                                {r.response_note}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">Chưa có phản hồi</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL: ĐĂNG KÝ DỊCH VỤ MỚI */}
            <AnimatePresence>
                {selectedService && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="bg-blue-600 dark:bg-blue-700 p-6 flex items-center gap-4 text-white shrink-0">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-3xl">{selectedService.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black font-headline">{selectedService.name}</h3>
                                    <p className="text-blue-100 text-sm opacity-90">Phiếu yêu cầu điện tử</p>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <form id="serviceForm" onSubmit={handleSubmit}>
                                    
                                    {/* DYNAMIC FIELDS */}
                                    {(selectedService.fields || []).map((f, i) => (
                                        <div key={i} className="mb-5">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">{f.label}</label>
                                            
                                            {f.type === 'select' && (
                                                <select
                                                    value={data[f.name]}
                                                    onChange={e => setData(f.name, e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                    required
                                                >
                                                    {(f.options || []).map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            )}

                                            {f.type === 'number' && (
                                                <input
                                                    type="number"
                                                    min={f.min} max={f.max}
                                                    value={data[f.name]}
                                                    onChange={e => setData(f.name, e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                                                    required
                                                />
                                            )}
                                        </div>
                                    ))}

                                    <div className="mb-5">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Ghi chú thêm (Tuỳ chọn)</label>
                                        <textarea 
                                            rows="3" 
                                            value={data.note}
                                            onChange={e => setData('note', e.target.value)}
                                            placeholder="..."
                                            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-white"
                                        ></textarea>
                                    </div>
                                    
                                    <div className="bg-amber-50 dark:bg-amber-500/10 rounded-xl p-4 flex items-start gap-3 mt-4">
                                        <span className="material-symbols-outlined text-amber-500 text-lg sm:mt-0.5">warning</span>
                                        <div className="text-xs text-amber-800 dark:text-amber-500 leading-relaxed font-medium">
                                            Vui lòng kiểm tra kỹ thông tin. Các yêu cầu "Xin cấp lại thẻ" hoặc "Xác nhận bảng điểm" sẽ bị tính thêm 1 khoản phí hành chính trong kỳ tiếp theo.
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={closeService} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">Đóng lại</button>
                                <button type="submit" form="serviceForm" disabled={processing} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 transition-colors flex items-center gap-2">
                                    {processing ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

Index.layout = page => <StudentLayout>{page}</StudentLayout>;
