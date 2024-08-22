import React, { useState, useEffect } from "react";
import axios from "axios";
import GamePointsAdmin from "./PointGame";
import { toast } from "react-toastify";

export default function ProductForm() {
  const [input, setInput] = useState({
    price: "",
    point: "",
    gameId: "",
  });

  const [game, setGame] = useState([]);
const [reload, setReload] = useState(false)
  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8889/admin/cratepoint", input, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("เพิ่มแต้มเรียบร้อย");
      setReload(!reload)
      setInput({ price: "", point: "", gameId: "" }); // Clear input fields
    } catch (err) {
      toast.warning("เกิดข้อผิดพลาดในการเพิ่มแต้ม");
    }
  };

  useEffect(() => {
    const getProList = async () => {
      const rs1 = await axios.get("http://localhost:8889/admin/getGame");
      setGame(rs1.data.getGame);
    };
    getProList();
  }, []);

  return (
    <div>
      <form
        className="flex flex-col min-w-[600px] border rounded w-5/6 mx-auto p-4 gap-6"
        onSubmit={hdlSubmit}
      >
        <div className="text-3xl mb-5 ml-20 font-bold">เพิ่มแต้ม</div>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">แต้ม</span>
          </div>
          <input
            type="text"
            placeholder="เพิ่มแต้ม"
            className="input input-bordered w-full"
            name="point"
            value={input.point}
            onChange={hdlChange}
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">ราคา</span>
          </div>
          <input
            type="text"
            placeholder="เพิ่มราคา"
            className="input input-bordered w-full"
            name="price"
            value={input.price}
            onChange={hdlChange}
          />
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">ชื่อเกม</span>
          </div>
          <select name="gameId" value={input.gameId} onChange={hdlChange}>
            <option hidden>เลือกเกม</option>
            {game &&
              game.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.game_name}
                </option>
              ))}
          </select>
        </label>

        <button className="btn btn-primary">เพิ่มใหม่</button>
      </form>
      <GamePointsAdmin reload={reload} setReload={setReload}/>
    </div>
  );
}
