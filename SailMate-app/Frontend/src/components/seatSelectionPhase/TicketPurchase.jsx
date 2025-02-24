import React from 'react';

const TicketPurchase = ({ notifyBySMS, setNotifyBySMS, notifyByEmail, setNotifyByEmail, wantETicket, setWantETicket }) => {
    return (
      <div className="p-4">
        <h3 className="text-blue-800 font-bold mb-4">Ticket Purchaser</h3>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input type="text" placeholder="Your Name" className="w-full p-2 border rounded" />
          </div>
          <div className="relative">
            <input type="text" placeholder="Your Surname" className="w-full p-2 border rounded" />
          </div>
          <div className="relative">
            <input type="text" placeholder="Phone" className="w-full p-2 border rounded" />
          </div>
          <div className="relative">
            <input type="email" placeholder="E-Mail Address" className="w-full p-2 border rounded" />
          </div>
        </div>
  
        <div className="mt-4 text-xs text-orange-500">
          <p>Personal Data Protection and Processing Policy, Privacy and Data Security Policy...</p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
            <span>Notify by SMS</span>
            <input type="checkbox" checked={notifyBySMS} onChange={() => setNotifyBySMS(!notifyBySMS)} />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
            <span>Notify by e-mail</span>
            <input type="checkbox" checked={notifyByEmail} onChange={() => setNotifyByEmail(!notifyByEmail)} />
          </div>
        </div>
  
        <div className="mt-4 flex items-center">
          <input type="checkbox" id="eticket" checked={wantETicket} onChange={() => setWantETicket(!wantETicket)} className="mr-2" />
          <label htmlFor="eticket">I want e-Ticket <span className="font-bold">Click on the 'I want e-Ticket' box to make your ticket an invoice.</span></label>
        </div>
      </div>
    );
  };
  
  export default TicketPurchase;
  