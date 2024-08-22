import axios from "axios";
import { useState } from "react";
import Typegame from './gameTypeAdmin';
import { useNavigate } from 'react-router-dom';

export default function Protype() {
  const [input, setInput] = useState({
    name: '',
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8889/admin/typegames', input, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotification({ message: 'เพิ่มประเภทเกมส์เรียบร้อย', type: 'success' });
      setInput({ name: '' }); // Reset input after successful submission

      // Delay before reloading
      setTimeout(() => {
        navigate(0);
      }, 2000); // Adjust the delay as needed (2000 ms = 2 seconds)
    } catch (err) {
      setNotification({ message: 'Error: ' + err.message, type: 'error' });
    }
  };

  const Notification = ({ message, type }) => {
    if (!message) return null;

    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

    return (
      <div className={`fixed top-5 right-5 p-4 rounded shadow-lg text-white ${bgColor}`}>
        {message}
      </div>
    );
  };

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <form className="flex flex-col min-w-[600px] border rounded w-5/6 mx-auto p-4 gap-6" onSubmit={hdlSubmit}>
        <div className="text-3xl mb-5 ml-20 font-bold">หมวดหมู่เกม</div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">หมวดหมู่เกม</span>
          </div>
          <input
            type="text"
            placeholder="เพิ่มหมวดหมู่เกม"
            className="input input-bordered w-full"
            name="name"
            value={input.name}
            onChange={hdlChange}
          />
        </label>
        <button className="btn btn-primary">เพิ่ม</button>
      </form>
      <Typegame />
    </div>
  );
}
