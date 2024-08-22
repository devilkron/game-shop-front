import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";


export default function OrderAdmin() {
  const navigate = useNavigate();
  const [payment, setPayment] = useState([]);
  const [type, setType] = useState([]);
  const [input, setInput] = useState({ status: '' });
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/admin/getOrder', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayment(response.data);
      } catch (error) {
        console.error('Error fetching payment:', error);
      }
    };

    const fetchType = async () => {
      try {
        const response = await axios.get('http://localhost:8889/admin/getGameByPoint');
        setType(response.data.get);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };

    fetchPayment();
    fetchType();
  }, []);

  const getPriceByPointId = (pointId) => {
    const game = type.find((game) => game.id === pointId);
    return game ? game.price : '';
  };

  const getPointById = (pointId) => {
    const game = type.find((game) => game.id === pointId);
    return game ? game.point : '';
  };

  const getGameNameById = (gameId) => {
    const game = type.find((game) => game.gameId === gameId);
    return game ? game.game.game_name : '';
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8889/admin/updateStatus/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPayment((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === id ? { ...payment, status: newStatus } : payment
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangeStatus = (id, e) => {
    const newStatus = e.target.value;
    setInput((prevOrderItem) => ({
      ...prevOrderItem,
      status: newStatus,
    }));
    updateStatus(id, newStatus);
  };

  const deleteOrder = async (paymentId) => {
    const confirmDelete = window.confirm('ต้องการที่จะลบคำสั่งซื้อ?');
    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8889/admin/deleteOrder/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayment((prevPayments) => prevPayments.filter((payment) => payment.id !== paymentId));
      alert('ลบคำสั่งซื้อเรียบร้อย');
    } catch (error) {
      console.error('Error deleting order:', error.response?.data || error.message);
      alert(`Failed to delete order: ${error.response?.data?.msg || error.message}`);
    }
  };

  const generateReceipt = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8889/admin/generateReceipt/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPdfUrl(response.data.filePath); // ตั้งค่า URL ของ PDF
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt');
    }
  };

  return (
    <div className="overflow-x-auto p-4 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h1 className="text-xl font-semibold mb-4">จัดการคำสั่งซื้อ</h1>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border-b">No.</th>
              <th className="px-4 py-2 border-b">ไอดีเกมส์</th>
              <th className="px-4 py-2 border-b">จำนวนพอยท์</th>
              <th className="px-4 py-2 border-b">ราคา</th>
              <th className="px-4 py-2 border-b">ชื่อเกม</th>
              <th className="px-4 py-2 border-b">สลิป</th>
              <th className="px-4 py-2 border-b">เวลาชำระเงิน</th>
              <th className="px-4 py-2 border-b">สถานะคำสั่งซื้อ</th>
              <th className="px-4 py-2 border-b">ใบเสร็จ</th>
              <th className="px-4 py-2 border-b">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {payment.map((item) => (
              <tr key={item.id} className="bg-white border-b">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.user_gameId}</td>
                <td className="px-4 py-2">{getPointById(item.pointId)}</td>
                <td className="px-4 py-2">{getPriceByPointId(item.pointId)}</td>
                <td className="px-4 py-2">{getGameNameById(item.games_id)}</td>
                <td className="px-4 py-2">
                  {item.Payment.length > 0
                    ? item.Payment.map((payment) => (
                        <img
                          key={payment.id}
                          src={payment.pay_img}
                          alt="Slip"
                          className="w-24 h-16 object-cover rounded shadow"
                        />
                      ))
                    : 'No slip'}
                </td>
                <td className="px-4 py-2">
                  {item.Payment.length > 0
                    ? item.Payment.map((payment) => (
                        <div key={payment.id}>
                          {new Date(payment.pay_time).toLocaleString()}
                        </div>
                      ))
                    : 'No payment time'}
                </td>
                <td className="px-4 py-2">
                  <select
                    value={item.status}
                    onChange={(e) => handleChangeStatus(item.id, e)}
                    className="p-1 border border-gray-300 rounded"
                  >
                    <option value="รอดำเนินการ">รอดำเนินการ</option>
                    <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                    <option value="ยกเลิก">ยกเลิก</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button onClick={() => generateReceipt(item.id)} className="bg-blue-500 text-white px-3 py-1 rounded">
                    สร้างใบเสร็จ
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button onClick={() => deleteOrder(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
