import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Product() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8889/admin/getprolist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(response.data.getP);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const hdlDelete = async (e, id) => {
    try {
      e.stopPropagation();
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8889/admin/deletegame/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Delete Successful');
      location.reload();
      setProduct(prevProducts => prevProducts.filter(item => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>รูปภาพ</th>
            <th>ชื่อเกม</th>
            <th>หมวดหมู่เกม</th>
            <th>แก้ไข</th>
            <th>ลบ</th>
          </tr>
        </thead>
        <tbody>
          {product.map((item, index) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td><figure><img src={item.img} alt="game" className='px-10 pt-10 max-w-xs max-h-xs' /></figure></td>
              <td>{item.game_name}</td>
              <td>{item.gametype_name.gametype_name}</td>
              <td><button className="btn btn-warning" onClick={() => document.getElementById(`my_modal_${item.id}`).showModal()}>แก้ไข</button></td>
              <td><button className="btn btn-error" onClick={(e) => hdlDelete(e, item.id)}>ลบ</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {product.map((item, index) => (
        <Modal key={index} item={item} setProduct={setProduct} />
      ))}

    </div>
  );
}

const Modal = ({ item, setProduct }) => {
  const modalId = `my_modal_${item.id}`;
  const [editData, setEditData] = useState({
    game_name: item.game_name,
    img: item.img,
    gametype_id: item.gametype_name.id,
  });

  const handleSaveClick = async (e) => {
    e.stopPropagation();
    try {
      const id = item.id;
      const token = localStorage.getItem('token');
      const apiUrl = `http://localhost:8889/admin/updateproduct/${id}`;
      await axios.patch(apiUrl, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Update Successful');
      document.getElementById(modalId).close();
      setProduct(prevProducts =>
        prevProducts.map(product =>
          product.id === id ? { ...product, ...editData, gametype_name: { id: editData.gametype_id, gametype_name: typegames.find(type => type.id === editData.gametype_id)?.gametype_name } } : product
        )
      );
    } catch (error) {
      console.error("Error updating data", error);
    }
  };

  const handleChange = (e) => {
    setEditData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const [typegames, setType] = useState([]);
  useEffect(() => {
    const getProList = async () => {
      const rs1 = await axios.get("http://localhost:8889/admin/getType");
      setType(rs1.data.getG);
    };
    getProList();
  }, []);

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-5">แก้ไขข้อมูล</h3>
        <div className="mb-5">
          <label className="label">
            <span className="label-text">ชื่อเกม</span>
          </label>
          <input
            type="text"
            name="game_name"
            value={editData.game_name}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-5">
          <label className="label">
            <span className="label-text">รูปภาพ</span>
          </label>
          <input
            type="text"
            name="img"
            value={editData.img}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-5">
          <label className="label">
            <span className="label-text">หมวดหมู่เกม</span>
          </label>
          <select
            name="gametype_id"
            value={editData.gametype_id}
            onChange={handleChange}
            className="input input-bordered w-full"
          >
            <option hidden>หมวดหมู่เกม</option>
            {typegames &&
              typegames.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.gametype_name}
                </option>
              ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-success" onClick={handleSaveClick}>Save</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => document.getElementById(modalId).close()}>Close</button>
      </form>
    </dialog>
  );
};
