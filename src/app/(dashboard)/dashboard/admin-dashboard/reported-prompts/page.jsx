"use client";
import React, { useEffect, useState } from "react";
import { Trash2, AlertTriangle, CheckCircle, Loader2, X } from "lucide-react";

const ReportedPrompts = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionType, setActionType] = useState(""); // 'remove', 'warn', 'dismiss'
  
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ;

  useEffect(() => {
    fetch(`${SERVER_URL}/api/admin/reports`)
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      });
  }, [SERVER_URL]);

  const handleAction = async () => {
    if (!selectedReport) return;

    await fetch(`${SERVER_URL}/api/admin/reports/${selectedReport._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionType, promptId: selectedReport.promptId })
    });
    
    setReports(reports.filter(r => r._id !== selectedReport._id));
    setSelectedReport(null);
    setActionType("");
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-500 h-10 w-10" /></div>;

  return (
    <div className="relative bg-[#090514]/80 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
      <h3 className="text-2xl font-bold text-white mb-6">Reported Prompts</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <tbody className="text-white">
            {reports.map((report) => (
              <tr key={report._id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-4 font-medium">{report.userName}</td>
                <td className="py-4">
                  <p className="text-sm font-bold text-red-400">{report.reason}</p>
                  <p className="text-xs text-gray-400">{report.description}</p>
                </td>
                <td className="py-4 flex items-center gap-2">
                  <button onClick={() => { setSelectedReport(report); setActionType('remove'); }} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg"><Trash2 size={18}/></button>
                  <button onClick={() => { setSelectedReport(report); setActionType('warn'); }} className="text-yellow-400 hover:bg-yellow-400/10 p-2 rounded-lg"><AlertTriangle size={18}/></button>
                  <button onClick={() => { setSelectedReport(report); setActionType('dismiss'); }} className="text-green-400 hover:bg-green-400/10 p-2 rounded-lg"><CheckCircle size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Section */}
      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1625] border border-white/10 p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 capitalize">Confirm {actionType}</h3>
            <p className="text-gray-400 mb-6 text-sm">Are you sure you want to {actionType} this report?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setSelectedReport(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleAction} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedPrompts;