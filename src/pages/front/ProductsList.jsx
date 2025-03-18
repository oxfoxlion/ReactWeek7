import axios from "axios";
import { useEffect, useState } from "react";
import { Link,useNavigate} from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function ProductsList() {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        getProducts()
    }, [])

    const getProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/products`);
            // console.log(response.data.products)
            setProducts(response.data.products);
        } catch (error) {
           alert('取得產品失敗')
            // console.log(error);
        }
    }

    const handleViewMore =async(id)=>{
        try{
            const response = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/product/${id}`);
            navigate(`/products/${id}`,{state:{productData:response.data}});
            // console.log(response.data);
        }catch(error){
            // console.log(error);
            alert('載入產品失敗')
        }
       
    }

    return (
        <div className="container py-5">
            <div className="row">
                {products.map((item) => (
                    <div className="col-4 d-flex" key={item.id}>
                        <div className="card mb-3 flex-fill">
                            <img src={item.imageUrl} className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title fw-bold">{item.title}</h5>
                                <p className="card-text">{item.description}</p>
                                <p className="card-text">內容：{item.content}</p>
                                <p className="card-text"><span className="fw-bold">價格：</span>{item.price}</p>
                                <p className="card-text">單位：{item.unit}</p>
                                <button className="btn btn-primary" onClick={()=>handleViewMore(item.id)}>查看更多</button>
                            </div>
                        </div>

                    </div>

                ))}

            </div>

        </div>
    )
}