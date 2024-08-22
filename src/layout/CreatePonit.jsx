import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GamePointsAdmin from './PointGame';

export default function ProductForm() {
    const [input, setInput] = useState({
        price: '',
        point: '',
        gameId: ''
    });
    
    const [game, setGame] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const hdlChange = (e) => {
        setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8889/admin/cratepoint', input, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotification({ message: 'เพิ่มข้อมูลเรียบร้อย', type: 'success' });
            setInput({ price: '', point: '', gameId: '' }); // Clear input fields
        } catch (err) {
            setNotification({ message: `Error: ${err.message}`, type: 'error' });
        }
    };

    useEffect(() => {
        const getProList = async () => {
            const rs1 = await axios.get('http://localhost:8889/admin/getGame');
            setGame(rs1.data.getGame);
        };
        getProList();
    }, []);

    return (
        <div>
            <Notification message={notification.message} type={notification.type} />
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
                        {game && game.map((el) => (
                            <option key={el.id} value={el.id}>
                                {el.game_name}
                            </option>
                        ))}
                    </select>
                </label>

                <button className="btn btn-primary">เพิ่มใหม่</button>
            </form>
            <GamePointsAdmin />
        </div>
    );
}

// Notification Component
const Notification = ({ message, type }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                // Reload the page after notification is shown
                window.location.reload();
            }, 3000); // Adjust the duration as needed

            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message) return null;

    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    const textColor = 'text-white';

    return (
        <div className={`fixed top-5 right-5 p-4 rounded shadow-lg ${bgColor} ${textColor}`}>
            {message}
        </div>
    );
};
