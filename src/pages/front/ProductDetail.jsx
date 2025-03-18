import { useLocation } from "react-router-dom"
import axios from "axios";
import { useState } from "react"


const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;


export default function ProductDetail() {

    const location = useLocation();
    const product = location.state?.productData.product;
    const [buyNum, setBuyNum] = useState(1);

    const handleAddToCart = async (id) => {
        try {
            const response = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/cart`, {
                data: {
                    product_id: id,
                    qty: buyNum
                }
            });
            // console.log(response);
            alert('加入成功');
            setBuyNum(1);
        } catch (error) {
            alert('更新購物車失敗')
        }
    }

    return (
        <>
            {product ? (
                <div className="container my-3">
                    <div className="card">
                        <div className="row g-0">
                            <div className="col-md-5">
                                <img src={product.imageUrl} className="img-fluid rounded-start" alt="..." />
                            </div>
                            <div className="col-md-7">
                                <div className="card-body">
                                    <h5 className="card-title">{product.title}</h5>
                                    <p className="card-text">{product.description}</p>
                                    <p className="card-text"><span className="fw-bold">內容：</span>{product.content}</p>
                                    <p className="card-text"><span className="fw-bold">價格：</span>{product.price}</p>
                                    <p className="card-text"><span className="fw-bold">單位：</span>{product.unit}</p>
                                    <div className="d-flex justify-content-start align-items-center my-3">
                                        <label htmlFor="num" className="fw-bold">購買數量：</label>
                                        <div className="input-group w-75">
                                            <button className="btn btn-danger p-2" type="button" onClick={() => setBuyNum((pre) => pre + 1)}>+</button>
                                            <input type="number" id="num" className="form-control" value={buyNum} onChange={(e) => setBuyNum(Number(e.target.value))} min='1' />
                                            <button className="btn btn-primary p-2" type="button" onClick={() => setBuyNum((pre) => pre === 1 ? pre : pre - 1)}>-</button>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => handleAddToCart(product.id)}>加入購物車</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : <p>好像出錯了，沒有這個產品唷</p>}
        </>

    )
}