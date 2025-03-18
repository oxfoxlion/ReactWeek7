import { useEffect, useState } from "react"
import axios from "axios";
import { useForm } from "react-hook-form";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;



export default function Cart() {
  const [cartProducts, setCartProducts] = useState([]);//購物車列表
  const [totalPrice, setTotalPrice] = useState(0);//原價總金額
  const [finalTotalPrice, setFinalTotalPrice] = useState(0);//折扣後總金額

  //初始化
  useEffect(() => {
    getCartProducts();
  }, [])

  //執行計算總價
  useEffect(() => {

    getTotal();

  }, [cartProducts])


  // 取得useForm功能
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // 取得購物車列表API
  const getCartProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCartProducts(response.data.data.carts);

    } catch (error) {
      alert(`取得購物車失敗`)
    }
  }

  // 清空購物車API
  const clearCart = async () => {
    try {

      const response = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      // console.log(response);
      getCartProducts();

    }
    catch (error) {

      alert(`清空購物車列表失敗`)
    }
  }

  // 計算總價與折扣價
  const getTotal = () => {
    // 總價
    let total = 0;
    cartProducts.forEach((item) => {
      total = total + item.total;
    })

    setTotalPrice(total);

    // 折扣後總價
    let finalTotal = 0;
    cartProducts.forEach((item) => {
      finalTotal = finalTotal + item.final_total
    })

    setFinalTotalPrice(finalTotal);

  }

  // 刪除單一產品API
  const deleteProduct = async (id) => {
    try {

      const response = await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${id}`);
      getCartProducts();

    } catch (error) {
      alert(`執行刪除失敗`)
    }
  }

  //編輯購物車產品數量
  const editProduct = async (id, num) => {
    try {
      const response = await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${id}`, {
        data: {
          product_id: id,
          qty: num
        }
      })

      getCartProducts();

    } catch (error) {

      alert(`數量修改失敗`)

    }
  }

  // 提交表單
  const onSubmit = handleSubmit((data) => {


    const checkoutData = {
      user: {
        name: data.name,
        email: data.email,
        tel: data.tel,
        address: data.address
      },
      message: data.message
    }

    // console.log(checkoutData);
    checkout(checkoutData);
    reset();

  });

  // 結帳付款API
  const checkout = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, {
        data: data
      })

      // console.log(response);
      getCartProducts(); //重新整理購物車列表
      alert('結帳成功')
    } catch (error) {
      alert('結帳失敗')
    }
  }


  return (
    <div id="app">

      <div className="container">

        <div className="mt-4">
          {/* 清空購物車 */}
          <div className="text-end">
            <button className="btn btn-outline-danger" type="button" onClick={() => clearCart()}>清空購物車</button>
          </div>
          {/* 購物車列表 */}
          <table className="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style={{ width: '150px' }}>數量/單位</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>

              {cartProducts.length > 0 ? cartProducts.map((item) => (
                <tr key={item.id}>
                  <th>
                    <button className="btn btn-outline-danger" onClick={() => deleteProduct(item.id)}>刪除</button>
                  </th>
                  <th>{item.product.title}</th>
                  <th>
                    <div className="input-group mb-3">
                      <input
                        type="number"
                        className="form-control"
                        min='1'
                        value={item.qty}
                        onChange={(e) => editProduct(item.id, Number(e.target.value))} />
                      <span className="input-group-text" id="basic-addon1">/{item.product.unit}</span>
                    </div>
                  </th>
                  <th>
                    {item.total}
                  </th>
                </tr>
              )) : <tr><th>這裡還沒有東西，去逛逛吧</th></tr>}


            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end">總計</td>
                <td className="text-end">{totalPrice}</td>
              </tr>

              <tr>
                <td colSpan="3" className="text-end text-success">折扣價</td>
                <td className="text-end text-success">{finalTotalPrice}</td>
              </tr>
            </tfoot>
          </table>

        </div>
        {/* 訂購表單 */}
        <div className="my-5 row justify-content-center">
          <form className="col-md-6" onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" name="email" type="email" className={`form-control ${errors.email && 'is-invalid'}`}
                placeholder="請輸入 Email"
                {...register('email', {
                  required: 'email欄位必填',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'email格式錯誤'
                  }

                })} />
              {errors.email && <p className="text-danger my-3">{errors.email.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">收件人姓名</label>
              <input id="name" name="姓名" type="text" className={`form-control ${errors.name && 'is-invalid'}`} placeholder="請輸入姓名"
                {...register('name', {
                  required: '姓名欄位必填'
                })} />
              {errors.name && <p className="text-danger my-3">{errors.name.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">收件人電話</label>
              <input id="tel" name="電話" type="text" className={`form-control ${errors.tel && 'is-invalid'}`} placeholder="請輸入電話"
                {...register('tel', {
                  required: '電話欄位必填',
                  pattern: {
                    value: /^(0[2-8]\d{7}|09\d{8})$/,
                    message: '電話格式錯誤'
                  }
                })} />
              {errors.tel && <p className="text-danger my-3">{errors.tel.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">收件人地址</label>
              <input id="address" name="地址" type="text" className={`form-control ${errors.address && 'is-invalid'}`} placeholder="請輸入地址"
                {...register('address', {
                  required: '地址欄位必填'
                })} />
              {errors.address && <p className="text-danger my-3">{errors.address.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">留言</label>
              <textarea id="message" className="form-control" cols="30" rows="10" {...register('message')}></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className={`btn btn-danger ${totalPrice ? '' : 'disabled'}`} >送出訂單</button>
            </div>
          </form>
        </div>
      </div>





    </div>
  )
}
