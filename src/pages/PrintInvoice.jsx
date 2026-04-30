import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';

export default function PrintInvoice() {
  const [type, setType] = useState('Invoice');
  const printRef = useRef();

  const [data, setData] = useState({
    toName: '',
    toAddress: '',
    date1: '',
    date2: '',
    items: [{ description: '', quantity: '', rate: '' }],
  });

  const updateItem = (index, field, value) => {
    const newItems = [...data.items];
    newItems[index][field] = value;
    setData({ ...data, items: newItems });
  };

  const addItem = () => setData({ ...data, items: [...data.items, { description: '', quantity: '', rate: '' }] });

  const total = data.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.rate)), 0);

  const handleDownload = async (format) => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    
    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `${type}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${type}-${Date.now()}.pdf`);
    }
  };

  return (
    <div>
      <div className="flex-header no-print">
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select className="input-field" style={{ margin: 0, width: '150px', appearance: 'auto', paddingRight: '30px' }} value={type} onChange={e => setType(e.target.value)}>
            <option value="Invoice">Invoice</option>
            <option value="Quotation">Quotation</option>
          </select>
          <button className="btn-primary" onClick={() => handleDownload('pdf')}>
            Download PDF
          </button>
          <button className="btn-primary" onClick={() => handleDownload('png')}>
            Download PNG
          </button>
        </div>
      </div>

      <div className="glass no-print" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Edit Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input placeholder="Customer Name" className="input-field" value={data.toName} onChange={e => setData({...data, toName: e.target.value})} />
          <input placeholder="Customer Address" className="input-field" value={data.toAddress} onChange={e => setData({...data, toAddress: e.target.value})} />
          <input type="date" placeholder={type === 'Invoice' ? 'Date' : 'Order Date'} className="input-field" value={data.date1} onChange={e => setData({...data, date1: e.target.value})} />
          <input type="date" placeholder={type === 'Invoice' ? 'Invoice Due' : 'Return Date'} className="input-field" value={data.date2} onChange={e => setData({...data, date2: e.target.value})} />
        </div>
        <div style={{ marginTop: '1rem' }}>
          {data.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
              <input placeholder="Description" className="input-field" style={{ flex: 2, margin: 0 }} value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} />
              <input type="number" placeholder="Qty" className="input-field" style={{ flex: 1, margin: 0 }} value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} />
              <input type="number" placeholder="Rate" className="input-field" style={{ flex: 1, margin: 0 }} value={item.rate} onChange={e => updateItem(idx, 'rate', e.target.value)} />
            </div>
          ))}
          <button className="btn-outline" onClick={addItem} style={{ marginTop: '0.5rem' }}>Add Item</button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', overflow: 'auto', paddingBottom: '2rem' }}>
        <div 
          ref={printRef}
          style={{ 
            width: '210mm', minHeight: '297mm', background: 'white', color: 'black', 
            padding: '40mm 20mm', fontFamily: 'sans-serif', position: 'relative',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
            <div style={{ flex: 1 }}>
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" style={{ height: '140px', objectFit: 'contain' }} />
            </div>
            <h1 style={{ fontSize: '48px', margin: 0, fontWeight: 'normal', letterSpacing: '2px', textTransform: 'uppercase' }}>{type}</h1>
          </div>

          {/* Info Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px' }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>From</h3>
              <p style={{ margin: 0, lineHeight: '1.5', fontSize: '14px' }}>
                J&J Rentals<br/>
                Block 1 Lot 11 Agan Homes,<br/>
                Poblacion, Polomolok,<br/>
                South Cotabato 9504
              </p>

              <h3 style={{ margin: '30px 0 10px 0', fontSize: '16px' }}>To</h3>
              <p style={{ margin: 0, lineHeight: '1.5', fontSize: '14px' }}>
                {data.toName || 'Customer Name'}<br/>
                {data.toAddress || 'Customer Address'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{type === 'Invoice' ? 'Date' : 'Order Date'}</h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '14px' }}>{data.date1 || 'YYYY-MM-DD'}</p>

              <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{type === 'Invoice' ? 'Invoice due' : 'Return Date'}</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>{data.date2 || 'YYYY-MM-DD'}</p>
            </div>
          </div>

          {/* Table */}
          <div style={{ borderTop: '2px solid black', borderBottom: '2px solid black', padding: '10px 0', marginBottom: '10px', display: 'flex', fontWeight: 'bold' }}>
            <div style={{ flex: 3 }}>Description</div>
            <div style={{ flex: 1, textAlign: 'center' }}>Quantity</div>
            {type === 'Invoice' && (
              <>
                <div style={{ flex: 1, textAlign: 'center' }}>Rate</div>
                <div style={{ flex: 1, textAlign: 'right' }}>Amount</div>
              </>
            )}
          </div>
          
          <div style={{ minHeight: '150px' }}>
            {data.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', padding: '8px 0', fontSize: '14px' }}>
                <div style={{ flex: 3 }}>{item.description || '-'}</div>
                <div style={{ flex: 1, textAlign: 'center' }}>{item.quantity}</div>
                {type === 'Invoice' && (
                  <>
                    <div style={{ flex: 1, textAlign: 'center' }}>{item.rate}</div>
                    <div style={{ flex: 1, textAlign: 'right' }}>{Number(item.quantity) * Number(item.rate)}</div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Total */}
          {type === 'Invoice' && (
            <div style={{ borderTop: '1px solid black', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end', fontWeight: 'bold', fontSize: '16px', marginBottom: '40px' }}>
              <div style={{ marginRight: '40px' }}>Total:</div>
              <div>{total}</div>
            </div>
          )}

          {/* Footer Line */}
          <div style={{ position: 'absolute', bottom: '40mm', left: '20mm', right: '20mm', borderBottom: '2px solid black' }}></div>
        </div>
      </div>
    </div>
  );
}
