import axios from "axios";
import { useEffect, useState } from "react";

export default function History() {
  const [user, setUser] = useState([]);
  const [payment, setPayment] = useState([]);
  const [type, setType] = useState([]);


  useEffect(() => {
    const getUser = async () => {
      try {
        const rs = await axios.get("http://localhost:8889/admin/user");
        setUser(rs.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    // const fetchGames = async () => {
    //   try {
    //     const response = await axios.get("http://localhost:8889/admin/getnamegame");
    //     const gamesData = response.data.reduce((acc, game) => {
    //       acc[game.id] = game.game_name;
    //       return acc;
    //     }, {});
    //     setGames(gamesData);
    //   } catch (error) {
    //     console.error("Error fetching games:", error);
    //   }
    // };

    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8889/auth/getOrderbyUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayment(response.data);
      } catch (error) {
        console.error("Error fetching payment:", error);
      }
    };

    const fetchType = async () => {
      try {
        const response = await axios.get("http://localhost:8889/admin/getGameByPoint");
        setType(response.data.get);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    getUser();
    // fetchGames();
    fetchPayment();
    fetchType();
  }, []);

  const getPriceByPointId = (pointId) => {
    const game = type.find((game) => game.id === pointId);
    return game ? game.price : "";
  };

  const getPointById = (pointId) => {
    const game = type.find((game) => game.id === pointId);
    return game ? game.point : "";
  };

  const getGameNameById = (gameId) => {
    const game = type.find((game) => game.gameId === gameId);
    return game ? game.game.game_name : "";
  };

  return (
    <div className="min-h-screen bg-purple-100 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-8">ประวัติการสั่งซื้อ</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">ไอดีเกมส์</th>
                <th className="px-4 py-2">เกมส์</th>
                <th className="px-4 py-2">ราคาที่จ่าย</th>
                <th className="px-4 py-2">จำนวนพอยท์</th>
                <th className="px-4 py-2">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {payment.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{item.user_gameId}</td>
                  <td className="px-4 py-2">{getGameNameById(item.games_id)}</td>
                  <td className="px-4 py-2">{getPriceByPointId(item.pointId)}</td>
                  <td className="px-4 py-2">{getPointById(item.pointId)}</td>
                  <td className="px-4 py-2">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
