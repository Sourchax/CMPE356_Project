import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from "@clerk/clerk-react";

const TicketPurchase = ({ notifyBySMS, setNotifyBySMS, notifyByEmail, setNotifyByEmail, wantETicket, setWantETicket }) => {
    const { t } = useTranslation();
    const { user, isLoaded } = useUser();
    
    // Check if user has a phone number
    const hasPhoneNumber = isLoaded && user?.phoneNumbers?.length > 0;
    
    return (
      <div className="p-4">
        <div className="mt-4 text-xs text-orange-500">
          <p>{t('ferryTicketing.dataPolicyText')}</p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {hasPhoneNumber && (
            <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
              <span>{t('ferryTicketing.notifyBySMS')}</span>
              <input 
                type="checkbox" 
                checked={notifyBySMS} 
                onChange={() => setNotifyBySMS(!notifyBySMS)} 
              />
            </div>
          )}
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded">
            <span>{t('ferryTicketing.notifyByEmail')}</span>
            <input 
              type="checkbox" 
              checked={notifyByEmail} 
              onChange={() => setNotifyByEmail(!notifyByEmail)} 
            />
          </div>
        </div>
  
        <div className="mt-4 flex items-center">
          <input 
            type="checkbox" 
            id="eticket" 
            checked={wantETicket} 
            onChange={() => setWantETicket(!wantETicket)} 
            className="mr-2" 
          />
          <label htmlFor="eticket">
            {t('ferryTicketing.wantETicket')} <span className="font-bold">{t('ferryTicketing.eTicketInvoiceNote')}</span>
          </label>
        </div>
      </div>
    );
  };
  
  export default TicketPurchase;