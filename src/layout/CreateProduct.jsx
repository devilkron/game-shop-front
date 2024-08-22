import React, { useState, useEffect } from "react";
import axios from "axios";
import Gameadmin from "../layout/gameAdmin";

export default function ProductForm() {
  const [input, setInput] = useState({
    name: "",
    img: "",
    gametypeId: "",
  });
  const [typegames, setType] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' }); // Notification state

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8889/admin/createproduct",
        input,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotification({ message: 'เพิ่มข้อมูลเรียบร้อย', type: 'success' });
      setInput({ name: "", img: "", gametypeId: "" }); // Reset input fields

      // Reload the page after a short delay to allow notification display
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Delay in milliseconds
    } catch (err) {
      setNotification({ message: 'กรอกข้อมูลให้ครบ', type: 'error' });
    }
  };

  useEffect(() => {
    const getProList = async () => {
      try {
        const rs1 = await axios.get("http://localhost:8889/admin/getType");
        setType(rs1.data.getG);
      } catch (err) {
        console.error('Error fetching product types:', err);
      }
    };
    getProList();
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-100 py-10">
      <Notification message={notification.message} type={notification.type} />
      <form
        className="flex flex-col min-w-[600px] border rounded w-5/6 mx-auto p-4 gap-6 bg-white"
        onSubmit={hdlSubmit}
      >
        <div className="text-3xl mb-5 ml-20 font-bold">เพิ่มเกม</div>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">ชื่อเกม</span>
          </div>
          <input
            type="text"
            placeholder="เพิ่มเกม"
            className="input input-bordered w-full "
            name="name"
            value={input.name}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">เพิ่มรูปภาพ(URL)</span>
          </div>
          <input
            type="text"
            placeholder="เพิ่มรูป"
            className="input input-bordered w-full "
            name="img"
            value={input.img}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full ">
          <div className="label">
            <span className="label-text">หมวดหมู่เกม</span>
          </div>
          <select
            name="gametypeId"
            value={input.gametypeId}
            onChange={hdlChange}
            className="select select-bordered w-full"
          >
            <option hidden>เลือกหมวดหมู่เกม</option>
            {typegames &&
              typegames.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.gametype_name}
                </option>
              ))}
          </select>
        </label>
        <button className="btn btn-primary">เพิ่มใหม่</button>
      </form>
      <Gameadmin />
    </div>
  );
}

const Notification = ({ message, type }) => {
  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className={`fixed top-5 right-5 p-4 rounded shadow-lg text-white ${bgColor}`}>
      {message}
    </div>
  );
};
